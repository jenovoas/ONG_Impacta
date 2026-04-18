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
  findAll(@CurrentTenant() tenant: { id: string }) {
    return this.usersService.findAll(tenant.id);
  }

  @Get(':id')
  @Roles('SUPERADMIN', 'ADMIN')
  findOne(@CurrentTenant() tenant: { id: string }, @Param('id') id: string) {
    return this.usersService.findOne(tenant.id, id);
  }

  @Post()
  @Roles('SUPERADMIN', 'ADMIN')
  create(@CurrentTenant() tenant: { id: string }, @Body() createUserDto: any) {
    return this.usersService.create(tenant.id, createUserDto);
  }
}
