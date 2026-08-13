import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Public()
  @Get('public-stats')
  getPublicStats() {
    return this.organizationsService.getPublicStats();
  }

  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.organizationsService.findBySlug(slug);
  }

  @Get('me/summary')
  getSummary(@CurrentTenant() orgId: string) {
    return this.organizationsService.getSummary(orgId);
  }

  @Get('me')
  getMe(@CurrentTenant() orgId: string) {
    return this.organizationsService.findOne(orgId);
  }

  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }
}
