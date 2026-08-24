import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { CampaignsService } from '../campaigns/campaigns.service';
import { AuthUser } from '../../auth/decorators/current-user.decorator';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

function sanitizePdfText(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x00-\x7F]/g, '');
}

@Injectable()
export class DonationsService {
  private readonly logger = new Logger(DonationsService.name);

  constructor(
    private readonly prisma: DatabaseService,
    private readonly campaignsService: CampaignsService,
  ) {}

  async create(orgId: string, dto: CreateDonationDto) {
    // Si se provee memberId, verificar que exista y pertenezca a la organización
    if (dto.memberId) {
      const member = await this.prisma.member.findUnique({
        where: { id: dto.memberId },
      });
      if (!member || member.organizationId !== orgId) {
        throw new NotFoundException('Member not found in this organization');
      }
    }

    // Si se provee campaignId, verificar que exista
    if (dto.campaignId) {
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: dto.campaignId },
      });
      if (!campaign || campaign.organizationId !== orgId) {
        throw new NotFoundException('Campaign not found in this organization');
      }
    }

    const donation = await this.prisma.donation.create({
      data: {
        organizationId: orgId,
        memberId: dto.memberId,
        campaignId: dto.campaignId,
        amount: dto.amount,
        currency: dto.currency || 'CLP',
        status: 'PENDING',
      },
    });

    // Aquí se llamaría a la pasarela de pago para obtener un link/token
    const gatewayRef = `mock_ref_${Math.random().toString(36).substring(7)}`;

    const updatedDonation = await this.prisma.donation.update({
      where: { id: donation.id },
      data: { gatewayRef },
    });

    return {
      ...updatedDonation,
      paymentUrl: `https://impactapay.pinguinoseguro.cl/pay/${updatedDonation.gatewayRef}`,
    };
  }

  async findAll(orgId: string) {
    return this.prisma.donation.findMany({
      where: { organizationId: orgId },
      include: {
        member: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        campaign: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(orgId: string, id: string) {
    const donation = await this.prisma.donation.findFirst({
      where: { id, organizationId: orgId },
      include: { member: true, campaign: true },
    });

    if (!donation) {
      throw new NotFoundException(`Donation with ID ${id} not found`);
    }

    return donation;
  }

  async handleCallback(gatewayRef: string, status: 'SUCCEEDED' | 'FAILED') {
    const donation = await this.prisma.donation.findFirst({
      where: { gatewayRef },
    });

    if (!donation) {
      throw new NotFoundException('Donation not found for this reference');
    }

    const updatedDonation = await this.prisma.donation.update({
      where: { id: donation.id },
      data: { status },
    });

    // Si la donación fue exitosa y pertenece a una campaña, actualizar el balance de la campaña
    if (status === 'SUCCEEDED' && updatedDonation.campaignId) {
      await this.campaignsService.updateBalance(updatedDonation.campaignId);
    }

    return updatedDonation;
  }

  // --- Endpoints para Portal Donante ---

  private async findMemberForUser(orgId: string, user: AuthUser) {
    if (!user || (!user.email && !user.rut)) {
      return null;
    }

    const conditions: any[] = [];
    if (user.email) {
      conditions.push({ email: user.email });
    }
    if (user.rut) {
      conditions.push({ rut: user.rut });
    }

    return this.prisma.member.findFirst({
      where: {
        organizationId: orgId,
        OR: conditions,
      },
    });
  }

  async findMyDonations(orgId: string, user: AuthUser) {
    const member = await this.findMemberForUser(orgId, user);
    if (!member) {
      return [];
    }

    return this.prisma.donation.findMany({
      where: {
        organizationId: orgId,
        memberId: member.id,
      },
      include: {
        campaign: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateReceiptPdf(orgId: string, user: AuthUser, donationId: string): Promise<Buffer> {
    const member = await this.findMemberForUser(orgId, user);
    if (!member) {
      this.logger.warn(`denied_attempt: No member found for user ${user?.email} in org ${orgId}`);
      throw new NotFoundException('Donation not found');
    }

    const donation = await this.prisma.donation.findFirst({
      where: { id: donationId },
      include: {
        campaign: true,
        organization: true,
        member: true,
      },
    });

    if (!donation || donation.organizationId !== orgId || donation.memberId !== member.id) {
      this.logger.warn(
        `denied_attempt: donation ${donationId} ownership verification failed for member ${member.id} in org ${orgId}`,
      );
      throw new NotFoundException('Donation not found');
    }

    const org = donation.organization;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { width, height } = page.getSize();
    const margin = 50;

    const primaryColor = rgb(0.08, 0.45, 0.38);
    const darkText = rgb(0.1, 0.1, 0.1);
    const grayText = rgb(0.4, 0.4, 0.4);

    page.drawText(sanitizePdfText(org?.name || 'ONG Impacta+'), {
      x: margin,
      y: height - margin - 20,
      size: 20,
      font: boldFont,
      color: primaryColor,
    });

    page.drawText(sanitizePdfText(`Organizacion: ${org?.slug || orgId}`), {
      x: margin,
      y: height - margin - 40,
      size: 10,
      font,
      color: grayText,
    });

    page.drawText('COMPROBANTE DE DONACION', {
      x: margin,
      y: height - margin - 85,
      size: 16,
      font: boldFont,
      color: darkText,
    });

    page.drawLine({
      start: { x: margin, y: height - margin - 95 },
      end: { x: width - margin, y: height - margin - 95 },
      thickness: 1,
      color: primaryColor,
    });

    let y = height - margin - 130;
    const lineSpacing = 24;

    const drawRow = (label: string, value: string) => {
      page.drawText(sanitizePdfText(label), { x: margin, y, size: 11, font: boldFont, color: darkText });
      page.drawText(sanitizePdfText(value), { x: margin + 160, y, size: 11, font, color: darkText });
      y -= lineSpacing;
    };

    drawRow('No. Recibo:', donation.id);
    drawRow('Fecha:', new Date(donation.createdAt).toISOString().slice(0, 10));
    drawRow('Donante:', `${member.firstName} ${member.lastName}`);
    drawRow('RUT Donante:', member.rut || 'N/A');
    drawRow('Campana:', donation.campaign?.name || 'Aporte General');

    const amountClp = Math.round(Number(donation.amount));
    drawRow('Monto:', `$${amountClp.toLocaleString('es-CL')} CLP`);
    drawRow('Estado:', donation.status);
    if (donation.recurringStatus) {
      drawRow('Recurrencia:', donation.recurringStatus);
    }

    page.drawText(
      sanitizePdfText('Este documento es un comprobante de donacion emitido por Impacta+.'),
      {
        x: margin,
        y: margin + 20,
        size: 9,
        font,
        color: grayText,
      },
    );

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  async updateRecurringStatus(
    orgId: string,
    user: AuthUser,
    donationId: string,
    status: 'PAUSED' | 'CANCELLED' | 'ACTIVE',
  ) {
    const member = await this.findMemberForUser(orgId, user);
    if (!member) {
      this.logger.warn(`denied_attempt: No member found for user ${user?.email} in org ${orgId}`);
      throw new NotFoundException('Donation not found');
    }

    const donation = await this.prisma.donation.findFirst({
      where: { id: donationId, organizationId: orgId },
    });

    if (!donation || donation.memberId !== member.id) {
      this.logger.warn(
        `denied_attempt: recurring status change on donation ${donationId} denied for member ${member.id} in org ${orgId}`,
      );
      throw new NotFoundException('Donation not found');
    }

    return this.prisma.donation.update({
      where: { id: donation.id },
      data: { recurringStatus: status },
    });
  }
}
