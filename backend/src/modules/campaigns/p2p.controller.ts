import { Controller, Get, Param } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('p2p')
export class P2pController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Public()
  @Get(':slug')
  async getPublicPage(@Param('slug') slug: string) {
    return this.campaignsService.getPublicP2PPage(slug);
  }
}
