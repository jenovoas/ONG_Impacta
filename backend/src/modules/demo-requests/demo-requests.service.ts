import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateDemoRequestDto } from './dto/create-demo-request.dto';

@Injectable()
export class DemoRequestsService {
  constructor(private prisma: DatabaseService) {}

  async create(dto: CreateDemoRequestDto) {
    // Reject obviously-spammy submissions
    const dup = await this.prisma.demoRequest.findFirst({
      where: {
        email: dto.email,
        createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) }, // last 5 min
      },
    });
    if (dup) {
      throw new BadRequestException('Duplicate submission within 5 minutes');
    }

    const created = await this.prisma.demoRequest.create({
      data: {
        name: dto.name,
        email: dto.email,
        org: dto.org,
        phone: dto.phone ?? null,
        message: dto.message ?? null,
      },
    });

    return { id: created.id, status: created.status };
  }

  async findAll() {
    return this.prisma.demoRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
