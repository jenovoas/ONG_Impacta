import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { validateRut } from '../../common/utils/rut.validator';

@Injectable()
export class MembersService {
  constructor(private prisma: DatabaseService) {}

  async findAll(orgId: string, filters: { status?: string; page?: number; pageSize?: number }) {
    const { status, page = 1, pageSize = 20 } = filters;
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      this.prisma.member.findMany({
        where: { organizationId: orgId, status },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.member.count({
        where: { organizationId: orgId, status },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(orgId: string, id: string) {
    return this.prisma.member.findFirst({
      where: { id, organizationId: orgId },
    });
  }

  async create(orgId: string, data: any) {
    if (data.rut && !validateRut(data.rut)) {
      throw new BadRequestException('Invalid RUT');
    }

    return this.prisma.member.create({
      data: {
        ...data,
        organizationId: orgId,
      },
    });
  }

  async update(orgId: string, id: string, data: any) {
    if (data.rut && !validateRut(data.rut)) {
      throw new BadRequestException('Invalid RUT');
    }

    return this.prisma.member.updateMany({
      where: { id, organizationId: orgId },
      data,
    });
  }
}
