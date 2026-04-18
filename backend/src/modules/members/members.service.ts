import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { validateRut } from '../../common/utils/rut.validator';

@Injectable()
export class MembersService {
  constructor(private prisma: DatabaseService) {}

  async findAll(filters: { status?: string; page?: number; pageSize?: number }) {
    const { status, page = 1, pageSize = 20 } = filters;
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      this.prisma.tenant.member.findMany({
        where: { status },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tenant.member.count({
        where: { status },
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

  async findOne(id: string) {
    return this.prisma.tenant.member.findFirst({
      where: { id },
    });
  }

  async create(data: any) {
    if (data.rut && !validateRut(data.rut)) {
      throw new BadRequestException('Invalid RUT');
    }

    return this.prisma.tenant.member.create({
      data,
    });
  }

  async update(id: string, data: any) {
    if (data.rut && !validateRut(data.rut)) {
      throw new BadRequestException('Invalid RUT');
    }

    // Using updateMany to filter by ID and automatically by tenant via extension
    return this.prisma.tenant.member.updateMany({
      where: { id },
      data,
    });
  }
}
