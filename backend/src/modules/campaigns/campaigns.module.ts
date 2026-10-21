import { Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { P2pController } from './p2p.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CampaignsController, P2pController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}
