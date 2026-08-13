import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateMissionDto } from './dto/create-mission.dto';

@Injectable()
export class MissionsService {
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

  async updateTaskStatus(orgId: string, missionId: string, taskId: string, isCompleted: boolean) {
    // Verificar que la misión pertenece a la organización
    const mission = await this.findOne(orgId, missionId);

    return this.prisma.missionTask.update({
      where: { id: taskId, missionId },
      data: { isCompleted },
    });
  }
}
