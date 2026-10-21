import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Controller('members')
@UseGuards(RolesGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @Roles('SUPERADMIN', 'ADMIN', 'OPERATOR')
  findAll(
    @CurrentTenant() orgId: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.membersService.findAll(orgId, {
      status,
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 20,
    });
  }

  @Get(':id')
  @Roles('SUPERADMIN', 'ADMIN', 'OPERATOR')
  findOne(@CurrentTenant() orgId: string, @Param('id') id: string) {
    return this.membersService.findOne(orgId, id);
  }

  @Post()
  @Roles('SUPERADMIN', 'ADMIN', 'OPERATOR')
  create(@CurrentTenant() orgId: string, @Body() createMemberDto: any) {
    return this.membersService.create(orgId, createMemberDto);
  }

  @Patch(':id')
  @Roles('SUPERADMIN', 'ADMIN', 'OPERATOR')
  update(
    @CurrentTenant() orgId: string,
    @Param('id') id: string,
    @Body() updateMemberDto: any,
  ) {
    return this.membersService.update(orgId, id, updateMemberDto);
  }
}
