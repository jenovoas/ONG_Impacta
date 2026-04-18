import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Prisma } from '@prisma/client';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: DatabaseService) {}

  async create(data: CreateOrganizationDto) {
    return this.prisma.base.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
        logo: data.logo,
        config: data.config as Prisma.InputJsonValue | undefined,
        plan: data.plan,
      },
    });
  }

  async findAll() {
    return this.prisma.base.organization.findMany();
  }

  async findOne(id: string) {
    return this.prisma.base.organization.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.base.organization.findUnique({
      where: { slug },
    });
  }

  async getSummary() {
    const [donationsCount, totalDonations, membersCount, campaignsCount] = await Promise.all([
      this.prisma.tenant.donation.count({ where: { status: 'SUCCEEDED' } }),
      this.prisma.tenant.donation.aggregate({
        where: { status: 'SUCCEEDED' },
        _sum: { amount: true },
      }),
      this.prisma.tenant.member.count({ where: { status: 'ACTIVE' } }),
      this.prisma.tenant.campaign.count({ where: { status: 'ACTIVE' } }),
    ]);

    return {
      donationsCount,
      totalAmount: totalDonations._sum.amount || 0,
      membersCount,
      campaignsCount,
    };
  }
}
