import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(orgId: string, dto: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: {
        ...dto,
        organizationId: orgId,
      },
    });
  }

  async findAll(orgId: string, status?: string) {
    return this.prisma.campaign.findMany({
      where: { 
        organizationId: orgId,
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(orgId: string, id: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, organizationId: orgId },
      include: {
        _count: {
          select: { donations: { where: { status: 'SUCCEEDED' } } },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async updateBalance(campaignId: string) {
    const successfulDonations = await this.prisma.donation.aggregate({
      where: { campaignId, status: 'SUCCEEDED' },
      _sum: { amount: true },
    });

    const total = successfulDonations._sum.amount || 0;

    return this.prisma.campaign.update({
      where: { id: campaignId },
      data: { currentAmount: total },
    });
  }
}
