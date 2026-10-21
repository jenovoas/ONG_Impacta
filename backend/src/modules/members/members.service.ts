import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { validateRut } from '../../common/utils/rut.validator';

@Injectable()
export class MembersService {
  constructor(private prisma: DatabaseService) {}

  async findAll(
    orgId: string,
    filters: { status?: string; page?: number; pageSize?: number },
  ) {
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
    const member = await this.prisma.member.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return member;
  }

  async create(orgId: string, data: any) {
    if (data.rut && !validateRut(data.rut)) {
      throw new BadRequestException('Invalid RUT');
    }

    const { firstName, lastName, email, phone, rut, status } = data;

    return this.prisma.member.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        rut: rut || null,
        status: status || 'ACTIVE',
        organizationId: orgId,
      },
    });
  }

  async update(orgId: string, id: string, data: any) {
    if (data.rut && !validateRut(data.rut)) {
      throw new BadRequestException('Invalid RUT');
    }

    const { firstName, lastName, email, phone, rut, status } = data;
    const updatePayload: Record<string, any> = {};
    if (firstName !== undefined) updatePayload.firstName = firstName;
    if (lastName !== undefined) updatePayload.lastName = lastName;
    if (email !== undefined) updatePayload.email = email;
    if (phone !== undefined) updatePayload.phone = phone || null;
    if (rut !== undefined) updatePayload.rut = rut || null;
    if (status !== undefined) updatePayload.status = status;

    return this.prisma.member.updateMany({
      where: { id, organizationId: orgId },
      data: updatePayload,
    });
  }
}
