import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @Roles('ADMIN')
  create(
    @CurrentTenant() orgId: string,
    @Body() createCampaignDto: CreateCampaignDto,
  ) {
    return this.campaignsService.create(orgId, createCampaignDto);
  }

  @Get()
  findAll(
    @CurrentTenant() orgId: string,
    @Query('status') status?: string,
  ) {
    return this.campaignsService.findAll(orgId, status);
  }

  @Get(':id')
  findOne(@CurrentTenant() orgId: string, @Param('id') id: string) {
    return this.campaignsService.findOne(orgId, id);
  }
}
