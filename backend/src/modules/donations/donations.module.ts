import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { ReceiptsController } from './receipts.controller';
import { DatabaseModule } from '../../database/database.module';
import { CampaignsModule } from '../campaigns/campaigns.module';

@Module({
  imports: [DatabaseModule, CampaignsModule],
  controllers: [DonationsController, ReceiptsController],
  providers: [DonationsService],
  exports: [DonationsService],
})
export class DonationsModule {}
