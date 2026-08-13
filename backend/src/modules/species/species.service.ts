import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { StorageService } from '../storage/storage.service';
import { CreateSpeciesDto } from './dto/create-species.dto';

@Injectable()
export class SpeciesService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly storage: StorageService,
  ) {}

  async create(orgId: string, dto: CreateSpeciesDto, file?: Express.Multer.File) {
    let imageUrl: string | null = null;
    if (file) {
      imageUrl = await this.storage.uploadFile(file, `organizations/${orgId}/species`);
    }

    return this.prisma.species.create({
      data: {
        ...dto,
        organizationId: orgId,
        imageUrl,
      },
    });
  }

  async findAll(orgId: string) {
    return this.prisma.species.findMany({
      where: { organizationId: orgId },
      orderBy: { commonName: 'asc' },
    });
  }

  async findOne(orgId: string, id: string) {
    const species = await this.prisma.species.findFirst({
      where: { id, organizationId: orgId },
    });

    if (!species) {
      throw new NotFoundException(`Species with ID ${id} not found`);
    }

    return species;
  }

  async update(orgId: string, id: string, dto: any, file?: Express.Multer.File) {
    const species = await this.findOne(orgId, id);
    
    let imageUrl = species.imageUrl;
    if (file) {
      imageUrl = await this.storage.uploadFile(file, `organizations/${orgId}/species`);
    }

    return this.prisma.species.update({
      where: { id },
      data: {
        ...dto,
        imageUrl,
      },
    });
  }
}
