import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthUser } from '../../auth/decorators/current-user.decorator';
import { DonationsService } from './donations.service';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Get(':captureId')
  async findByCaptureId(
    @CurrentTenant() orgId: string,
    @CurrentUser() user: AuthUser,
    @Param('captureId') captureId: string,
    @Res() res: Response,
  ) {
    const pdf = await this.donationsService.generateReceiptPdfByCaptureId(
      orgId,
      user,
      captureId,
    );
    const safeCaptureId = captureId.replace(/[^a-zA-Z0-9_-]/g, '_');
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="recibo-${safeCaptureId}.pdf"`,
    });
    res.send(pdf);
  }
}
