import { Controller, Get, Post, Body, Param, Patch, Res } from '@nestjs/common';
import type { Response } from 'express';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateRecurringDonationDto } from './dto/update-recurring-donation.dto';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthUser } from '../../auth/decorators/current-user.decorator';
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

  @Get('me')
  findMy(@CurrentTenant() orgId: string, @CurrentUser() user: AuthUser) {
    return this.donationsService.findMyDonations(orgId, user);
  }

  @Get(':id/receipt')
  async receipt(
    @CurrentTenant() orgId: string,
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const pdf = await this.donationsService.generateReceiptPdf(orgId, user, id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="recibo-${id}.pdf"`,
    });
    res.send(pdf);
  }

  @Get(':id')
  findOne(@CurrentTenant() orgId: string, @Param('id') id: string) {
    return this.donationsService.findOne(orgId, id);
  }

  @Patch('recurring/:id')
  updateRecurring(
    @CurrentTenant() orgId: string,
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateRecurringDonationDto,
  ) {
    return this.donationsService.updateRecurringStatus(
      orgId,
      user,
      id,
      dto.status,
    );
  }

  @Public()
  @Post('callback')
  handleCallback(
    @Body() body: { gatewayRef: string; status: 'SUCCEEDED' | 'FAILED' },
  ) {
    return this.donationsService.handleCallback(body.gatewayRef, body.status);
  }
}
