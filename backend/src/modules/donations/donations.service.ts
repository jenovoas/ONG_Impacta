import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { CampaignsService } from '../campaigns/campaigns.service';

@Injectable()
export class DonationsService {
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
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(orgId: string, id: string) {
    const donation = await this.prisma.donation.findFirst({
      where: { id, organizationId: orgId },
      include: { member: true },
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
}
