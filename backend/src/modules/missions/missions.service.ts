import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class MissionsService {
  private readonly logger = new Logger(MissionsService.name);

  constructor(private readonly prisma: DatabaseService) { }

  async create(orgId: string, dto: CreateMissionDto) {
    const { tasks, ...missionData } = dto;

    return this.prisma.mission.create({
      data: {
        ...missionData,
        organizationId: orgId,
        tasks: tasks ? {
          create: tasks,
        } : undefined,
      },
      include: { tasks: true },
    });
  }

  async findAll(orgId: string) {
    return this.prisma.mission.findMany({
      where: { organizationId: orgId },
      include: { tasks: true },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(orgId: string, id: string) {
    const mission = await this.prisma.mission.findFirst({
      where: { id, organizationId: orgId },
      include: { tasks: true },
    });

    if (!mission) {
      throw new NotFoundException(`Mission with ID ${id} not found`);
    }

    return mission;
  }

  async updateTaskStatus(
    orgId: string,
    missionId: string,
    taskId: string,
    dtoOrIsCompleted: UpdateTaskDto | boolean,
    clientUpdatedAt?: string,
  ) {
    const task = await this.prisma.missionTask.findUnique({
      where: { id: taskId },
      include: { mission: true },
    });

    if (!task || task.missionId !== missionId || task.mission.organizationId !== orgId) {
      this.logger.warn(`Task update denied: task ${taskId} in mission ${missionId} not found for organization`);
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const { mission, ...serverTask } = task;

    if (clientUpdatedAt) {
      const clientTime = new Date(clientUpdatedAt).getTime();
      const serverTime = serverTask.updatedAt.getTime();

      if (!isNaN(clientTime) && clientTime < serverTime) {
        this.logger.warn(
          `Task conflict for task ${taskId}: client updatedAt (${new Date(clientTime).toISOString()}) < server updatedAt (${serverTask.updatedAt.toISOString()})`,
        );
        throw new ConflictException({
          message: 'Task update conflict: server version is newer',
          serverTask,
        });
      }
    }

    const dto: UpdateTaskDto =
      typeof dtoOrIsCompleted === 'boolean'
        ? { isCompleted: dtoOrIsCompleted }
        : dtoOrIsCompleted;

    const { isCompleted, title, description, assignedTo } = dto;

    const isCompletedUnchanged = isCompleted === undefined || isCompleted === serverTask.isCompleted;
    const titleUnchanged = title === undefined || title === serverTask.title;
    const descriptionUnchanged = description === undefined || description === serverTask.description;
    const assignedToUnchanged = assignedTo === undefined || assignedTo === serverTask.assignedTo;

    if (isCompletedUnchanged && titleUnchanged && descriptionUnchanged && assignedToUnchanged) {
      return serverTask;
    }

    const updateData: {
      isCompleted?: boolean;
      title?: string;
      description?: string;
      assignedTo?: string;
    } = {};

    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

    return this.prisma.missionTask.update({
      where: { id: taskId, missionId },
      data: updateData,
    });
  }
}
