import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CreateP2PPageDto } from './dto/p2p-page.dto';
import { UpdateP2PPageDto } from './dto/update-p2p-page.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
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
  findAll(@CurrentTenant() orgId: string, @Query('status') status?: string) {
    return this.campaignsService.findAll(orgId, status);
  }

  @Get(':id')
  findOne(@CurrentTenant() orgId: string, @Param('id') id: string) {
    return this.campaignsService.findOne(orgId, id);
  }

  @Post(':id/p2p')
  @Roles('ADMIN', 'MEMBER') // Permite a socios o admins invocarlo
  createP2PPage(
    @CurrentTenant() orgId: string,
    @Param('id') campaignId: string,
    @Body() createP2PPageDto: CreateP2PPageDto,
  ) {
    return this.campaignsService.createP2PPage(
      orgId,
      campaignId,
      createP2PPageDto,
    );
  }

  @Get(':id/p2p/:pageId')
  getP2PPage(
    @CurrentTenant() orgId: string,
    @Param('id') campaignId: string,
    @Param('pageId') pageId: string,
  ) {
    return this.campaignsService.getP2PPageById(orgId, campaignId, pageId);
  }

  @Patch(':id/p2p/:pageId')
  updateP2PPage(
    @CurrentTenant() orgId: string,
    @Param('id') campaignId: string,
    @Param('pageId') pageId: string,
    @Body() dto: UpdateP2PPageDto,
  ) {
    return this.campaignsService.updateP2PPageStatus(
      orgId,
      campaignId,
      pageId,
      dto.status,
    );
  }

  @Patch(':id')
  @Roles('ADMIN')
  updateCampaign(
    @CurrentTenant() orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCampaignDto,
  ) {
    if (dto.status === 'COMPLETED') {
      return this.campaignsService.completeCampaign(orgId, id);
    }
    return this.campaignsService.updateCampaign(orgId, id, dto);
  }
}
