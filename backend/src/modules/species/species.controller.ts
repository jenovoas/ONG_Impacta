import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpeciesService } from './species.service';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('species')
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Post()
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @CurrentTenant() orgId: string,
    @Body() createSpeciesDto: CreateSpeciesDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.speciesService.create(orgId, createSpeciesDto, file);
  }

  @Get()
  findAll(@CurrentTenant() orgId: string) {
    return this.speciesService.findAll(orgId);
  }

  @Get(':id')
  findOne(@CurrentTenant() orgId: string, @Param('id') id: string) {
    return this.speciesService.findOne(orgId, id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @CurrentTenant() orgId: string,
    @Param('id') id: string,
    @Body() updateDto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.speciesService.update(orgId, id, updateDto, file);
  }
}
