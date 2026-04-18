import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(dto: CreateCampaignDto) {
    return this.prisma.tenant.campaign.create({
      data: dto,
    });
  }

  async findAll(status?: string) {
    return this.prisma.tenant.campaign.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const campaign = await this.prisma.tenant.campaign.findFirst({
      where: { id },
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
    const successfulDonations = await this.prisma.tenant.donation.aggregate({
      where: { campaignId, status: 'SUCCEEDED' },
      _sum: { amount: true },
    });

    const total = successfulDonations._sum.amount || 0;

    return this.prisma.tenant.campaign.update({
      where: { id: campaignId },
      data: { currentAmount: total },
    });
  }
}
