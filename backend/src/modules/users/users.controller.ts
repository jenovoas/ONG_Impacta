import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('SUPERADMIN', 'ADMIN')
  findAll(@CurrentTenant() orgId: string) {
    return this.usersService.findAll(orgId);
  }

  @Get(':id')
  @Roles('SUPERADMIN', 'ADMIN')
  findOne(@CurrentTenant() orgId: string, @Param('id') id: string) {
    return this.usersService.findOne(orgId, id);
  }

  @Post()
  @Roles('SUPERADMIN', 'ADMIN')
  create(@CurrentTenant() orgId: string, @Body() createUserDto: any) {
    return this.usersService.create(orgId, createUserDto);
  }
}
