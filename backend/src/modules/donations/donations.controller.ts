import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  create(
    @CurrentTenant() orgId: string,
    @Body() createDonationDto: CreateDonationDto,
  ) {
    return this.donationsService.create(orgId, createDonationDto);
  }

  @Get()
  findAll(@CurrentTenant() orgId: string) {
    return this.donationsService.findAll(orgId);
  }

  @Get(':id')
  findOne(@CurrentTenant() orgId: string, @Param('id') id: string) {
    return this.donationsService.findOne(orgId, id);
  }

  @Public()
  @Post('callback')
  handleCallback(
    @Body() body: { gatewayRef: string; status: 'SUCCEEDED' | 'FAILED' },
  ) {
    return this.donationsService.handleCallback(body.gatewayRef, body.status);
  }
}
