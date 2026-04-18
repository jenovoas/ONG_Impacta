import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateMissionDto } from './dto/create-mission.dto';

@Injectable()
export class MissionsService {
  constructor(private readonly prisma: DatabaseService) { }

  async create(dto: CreateMissionDto) {
    const { tasks, ...missionData } = dto;

    return this.prisma.tenant.mission.create({
      data: {
        ...missionData,
        tasks: tasks ? {
          create: tasks,
        } : undefined,
      },
      include: { tasks: true },
    });
  }

  async findAll() {
    return this.prisma.tenant.mission.findMany({
      include: { tasks: true },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const mission = await this.prisma.tenant.mission.findFirst({
      where: { id },
      include: { tasks: true },
    });

    if (!mission) {
      throw new NotFoundException(`Mission with ID ${id} not found`);
    }

    return mission;
  }

  async updateTaskStatus(missionId: string, taskId: string, isCompleted: boolean) {
    // Verificar que la misión pertenece a la organización (esto es automático via findOne)
    await this.findOne(missionId);

    // MissionTask no tiene organizationId, pero filtramos por missionId
    return this.prisma.tenant.missionTask.update({
      where: { id: taskId, missionId },
      data: { isCompleted },
    });
  }
}
