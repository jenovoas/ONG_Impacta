import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { DemoRequestsService } from './demo-requests.service';
import { CreateDemoRequestDto } from './dto/create-demo-request.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('demo-requests')
export class DemoRequestsController {
  constructor(private readonly demoRequestsService: DemoRequestsService) {}

  // Public endpoint hit by the landing Demo Modal
  @Public()
  @Post()
  async create(@Body() dto: CreateDemoRequestDto) {
    return this.demoRequestsService.create(dto);
  }

  // Protected listing for admin/ops follow-up
  @UseGuards(RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN', 'OPERATOR')
  @Get()
  findAll() {
    return this.demoRequestsService.findAll();
  }
}
