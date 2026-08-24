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

  async createP2PPage(orgId: string, campaignId: string, dto: { title: string, memberId: string, personalGoal?: number }) {
    // Generate a simple unique slug
    const baseSlug = dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    return this.prisma.campaignP2PPage.create({
      data: {
        organizationId: orgId,
        campaignId,
        memberId: dto.memberId,
        title: dto.title,
        slug,
        personalGoal: dto.personalGoal,
      },
    });
  }

  async getP2PPageById(orgId: string, campaignId: string, pageId: string) {
    const page = await this.prisma.campaignP2PPage.findFirst({
      where: { id: pageId, campaignId, organizationId: orgId },
      include: {
        member: { select: { firstName: true, lastName: true } },
        campaign: { select: { name: true, goalAmount: true, currentAmount: true } },
      }
    });
    if (!page) throw new NotFoundException('P2P Page not found');
    return page;
  }

  async getPublicP2PPage(slug: string) {
    const page = await this.prisma.campaignP2PPage.findFirst({
      where: { slug, status: 'ACTIVE' },
      include: {
        organization: { select: { name: true, logo: true, slug: true } },
        member: { select: { firstName: true, lastName: true } },
        campaign: { select: { name: true, description: true, endDate: true } },
        donations: {
          where: { status: 'SUCCEEDED' },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            amount: true,
            createdAt: true,
            member: { select: { firstName: true, lastName: true } }
          }
        }
      }
    });

    if (!page) throw new NotFoundException('Public P2P Page not found');

    const raised = Number(page.currentAmount || 0);
    const goal = Number(page.personalGoal) || 1;
    const percentRaised = Math.min(100, Math.round((raised / goal) * 100));
    
    let daysLeft: number | null = null;
    if (page.campaign.endDate) {
      const ms = page.campaign.endDate.getTime() - new Date().getTime();
      daysLeft = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
    }

    return {
      ...page,
      percentRaised,
      daysLeft
    };
  }

}
