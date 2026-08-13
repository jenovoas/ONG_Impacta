import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class UsersService {
  constructor(private prisma: DatabaseService) {}

  async findAll(orgId: string) {
    return this.prisma.user.findMany({
      where: { organizationId: orgId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async findOne(orgId: string, id: string) {
    return this.prisma.user.findFirst({
      where: { id, organizationId: orgId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async create(orgId: string, data: any) {
    return this.prisma.user.create({
      data: {
        ...data,
        organizationId: orgId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }
}
