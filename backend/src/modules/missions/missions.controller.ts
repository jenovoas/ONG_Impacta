import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('missions')
@UseGuards(RolesGuard)
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Post()
  @Roles('SUPERADMIN', 'ADMIN', 'OPERATOR')
  create(@Body() createMissionDto: CreateMissionDto) {
    return this.missionsService.create(createMissionDto);
  }

  @Get()
  @Roles('SUPERADMIN', 'ADMIN', 'OPERATOR', 'VIEWER')
  findAll() {
    return this.missionsService.findAll();
  }

  @Get(':id')
  @Roles('SUPERADMIN', 'ADMIN', 'OPERATOR', 'VIEWER')
  findOne(@Param('id') id: string) {
    return this.missionsService.findOne(id);
  }

  @Patch(':id/tasks/:taskId')
  @Roles('SUPERADMIN', 'ADMIN', 'OPERATOR')
  updateTaskStatus(
    @Param('id') missionId: string,
    @Param('taskId') taskId: string,
    @Body('isCompleted') isCompleted: boolean,
  ) {
    return this.missionsService.updateTaskStatus(missionId, taskId, isCompleted);
  }
}
