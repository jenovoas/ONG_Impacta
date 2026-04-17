import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Prisma } from '@prisma/client';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: DatabaseService) {}

  async create(data: CreateOrganizationDto) {
    return this.prisma.organization.create({
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
    return this.prisma.organization.findMany();
  }

  async findOne(id: string) {
    return this.prisma.organization.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.organization.findUnique({
      where: { slug },
    });
  }
}
