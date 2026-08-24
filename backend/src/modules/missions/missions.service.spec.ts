import { Test, TestingModule } from '@nestjs/testing';
import { MissionsService } from './missions.service';
import { DatabaseService } from '../../database/database.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('MissionsService', () => {
  let service: MissionsService;
  let dbService: {
    mission: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
    };
    missionTask: {
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };

  const mockMissionTask = {
    id: 'task-101',
    missionId: 'mission-1',
    title: 'Monitor puma habitat',
    description: 'Set up trail cameras',
    isCompleted: false,
    assignedTo: 'Researcher A',
    createdAt: new Date('2026-08-24T10:00:00.000Z'),
    updatedAt: new Date('2026-08-24T12:00:00.000Z'),
    mission: {
      id: 'mission-1',
      organizationId: 'org-tenant-1',
      title: 'Puma Conservation',
    },
  };

  beforeEach(async () => {
    const mockPrisma = {
      mission: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
      missionTask: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MissionsService,
        { provide: DatabaseService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MissionsService>(MissionsService);
    dbService = mockPrisma;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateTaskStatus - Multi-tenant isolation', () => {
    it('denies update when task belongs to another organization (multi-tenant check)', async () => {
      dbService.missionTask.findUnique.mockResolvedValue(mockMissionTask);

      // Tenant 2 attempting to access Tenant 1 task
      await expect(
        service.updateTaskStatus('org-tenant-2', 'mission-1', 'task-101', { isCompleted: true }),
      ).rejects.toThrow(NotFoundException);

      expect(dbService.missionTask.update).not.toHaveBeenCalled();
    });

    it('denies update when mission ID does not match task mission ID', async () => {
      dbService.missionTask.findUnique.mockResolvedValue(mockMissionTask);

      await expect(
        service.updateTaskStatus('org-tenant-1', 'wrong-mission-id', 'task-101', { isCompleted: true }),
      ).rejects.toThrow(NotFoundException);

      expect(dbService.missionTask.update).not.toHaveBeenCalled();
    });
  });

  describe('updateTaskStatus - Conflict detection (Last-Write-Wins)', () => {
    it('throws 409 Conflict when local client updatedAt is older than server updatedAt', async () => {
      dbService.missionTask.findUnique.mockResolvedValue(mockMissionTask);

      const olderClientUpdatedAt = '2026-08-24T11:00:00.000Z'; // older than 12:00:00

      try {
        await service.updateTaskStatus(
          'org-tenant-1',
          'mission-1',
          'task-101',
          { isCompleted: true },
          olderClientUpdatedAt,
        );
        throw new Error('Should have thrown ConflictException');
      } catch (err: unknown) {
        expect(err).toBeInstanceOf(ConflictException);
        const conflictErr = err as ConflictException;
        const response = conflictErr.getResponse() as Record<string, unknown>;
        expect(response.serverTask).toBeDefined();
        const serverTask = response.serverTask as { id: string; isCompleted: boolean };
        expect(serverTask.id).toBe('task-101');
        expect(serverTask.isCompleted).toBe(false);
      }

      expect(dbService.missionTask.update).not.toHaveBeenCalled();
    });

    it('allows update when client updatedAt is newer or equal to server updatedAt', async () => {
      dbService.missionTask.findUnique.mockResolvedValue(mockMissionTask);
      dbService.missionTask.update.mockResolvedValue({
        ...mockMissionTask,
        isCompleted: true,
        updatedAt: new Date('2026-08-24T12:05:00.000Z'),
      });

      const newerClientUpdatedAt = '2026-08-24T12:05:00.000Z';

      const result = await service.updateTaskStatus(
        'org-tenant-1',
        'mission-1',
        'task-101',
        { isCompleted: true },
        newerClientUpdatedAt,
      );

      expect(result.isCompleted).toBe(true);
      expect(dbService.missionTask.update).toHaveBeenCalledWith({
        where: { id: 'task-101', missionId: 'mission-1' },
        data: { isCompleted: true },
      });
    });
  });

  describe('updateTaskStatus - Idempotency & No-op', () => {
    it('returns existing task without DB update if task is already in requested state', async () => {
      const alreadyCompletedTask = {
        ...mockMissionTask,
        isCompleted: true,
      };
      dbService.missionTask.findUnique.mockResolvedValue(alreadyCompletedTask);

      const result = await service.updateTaskStatus(
        'org-tenant-1',
        'mission-1',
        'task-101',
        { isCompleted: true },
      );

      expect(result.isCompleted).toBe(true);
      expect(dbService.missionTask.update).not.toHaveBeenCalled();
    });

    it('allows repeating sync requests safely without creating duplicate tasks or errors', async () => {
      dbService.missionTask.findUnique.mockResolvedValue(mockMissionTask);
      dbService.missionTask.update.mockResolvedValue({
        ...mockMissionTask,
        isCompleted: true,
      });

      // First sync call
      const firstCall = await service.updateTaskStatus(
        'org-tenant-1',
        'mission-1',
        'task-101',
        { isCompleted: true },
      );
      expect(firstCall.isCompleted).toBe(true);
      expect(dbService.missionTask.update).toHaveBeenCalledTimes(1);

      // Subsequent sync call (task is now already completed)
      dbService.missionTask.findUnique.mockResolvedValue({
        ...mockMissionTask,
        isCompleted: true,
      });

      const secondCall = await service.updateTaskStatus(
        'org-tenant-1',
        'mission-1',
        'task-101',
        { isCompleted: true },
      );
      expect(secondCall.isCompleted).toBe(true);
      // Prisma update is not called a second time
      expect(dbService.missionTask.update).toHaveBeenCalledTimes(1);
    });
  });
});
