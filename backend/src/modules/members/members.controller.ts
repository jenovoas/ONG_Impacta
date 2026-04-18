import { Controller, Get, Post, Body, Param, Query, UseGuards, Patch } from '@nestjs/common';
import { MembersService } from './members.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('members')
@UseGuards(RolesGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @Roles('SUPERADMIN', 'ADMIN', 'OPERATOR')
  findAll(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.membersService.findAll({
      status,
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 20,
    });
  }

  @Get(':id')
  @Roles('SUPERADMIN', 'ADMIN', 'OPERATOR')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Post()
  @Roles('SUPERADMIN', 'ADMIN', 'OPERATOR')
  create(@Body() createMemberDto: any) {
    return this.membersService.create(createMemberDto);
  }

  @Patch(':id')
  @Roles('SUPERADMIN', 'ADMIN', 'OPERATOR')
  update(
    @Param('id') id: string,
    @Body() updateMemberDto: any,
  ) {
    return this.membersService.update(id, updateMemberDto);
  }
}
