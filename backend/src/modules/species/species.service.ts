import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { StorageService } from '../storage/storage.service';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { tenantContextStorage } from '../../common/utils/tenant-context';

@Injectable()
export class SpeciesService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly storage: StorageService,
  ) {}

  private getOrgId(): string {
    const context = tenantContextStorage.getStore();
    if (!context?.orgId) {
      throw new Error('Organization ID not found in context');
    }
    return context.orgId;
  }

  async create(dto: CreateSpeciesDto, file?: Express.Multer.File) {
    const orgId = this.getOrgId();
    let imageUrl: string | null = null;
    if (file) {
      imageUrl = await this.storage.uploadFile(file, `organizations/${orgId}/species`);
    }

    return this.prisma.tenant.species.create({
      data: {
        ...dto,
        imageUrl,
      },
    });
  }

  async findAll() {
    return this.prisma.tenant.species.findMany({
      orderBy: { commonName: 'asc' },
    });
  }

  async findOne(id: string) {
    const species = await this.prisma.tenant.species.findFirst({
      where: { id },
    });

    if (!species) {
      throw new NotFoundException(`Species with ID ${id} not found`);
    }

    return species;
  }

  async update(id: string, dto: any, file?: Express.Multer.File) {
    const orgId = this.getOrgId();
    const species = await this.findOne(id);
    
    let imageUrl = species.imageUrl;
    if (file) {
      imageUrl = await this.storage.uploadFile(file, `organizations/${orgId}/species`);
    }

    return this.prisma.tenant.species.update({
      where: { id },
      data: {
        ...dto,
        imageUrl,
      },
    });
  }
}
