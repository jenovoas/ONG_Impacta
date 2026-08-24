import { Controller, Get, Post, Body, Param, Patch, Headers } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Post()
  @Roles('ADMIN')
  create(
    @CurrentTenant() orgId: string,
    @Body() createMissionDto: CreateMissionDto,
  ) {
    return this.missionsService.create(orgId, createMissionDto);
  }

  @Get()
  findAll(@CurrentTenant() orgId: string) {
    return this.missionsService.findAll(orgId);
  }

  @Get(':id')
  findOne(@CurrentTenant() orgId: string, @Param('id') id: string) {
    return this.missionsService.findOne(orgId, id);
  }

  @Patch(':id/tasks/:taskId')
  updateTask(
    @CurrentTenant() orgId: string,
    @Param('id') id: string,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Headers('if-unmodified-since') headerIfUnmodifiedSince?: string,
  ) {
    const clientUpdatedAt = updateTaskDto?.updatedAt || headerIfUnmodifiedSince;
    return this.missionsService.updateTaskStatus(orgId, id, taskId, updateTaskDto, clientUpdatedAt);
  }
}
