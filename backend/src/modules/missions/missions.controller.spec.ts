import { Test, TestingModule } from '@nestjs/testing';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';

describe('MissionsController', () => {
  let controller: MissionsController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    updateTaskStatus: jest.Mock;
  };

  beforeEach(async () => {
    const mockMissionsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      updateTaskStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MissionsController],
      providers: [
        { provide: MissionsService, useValue: mockMissionsService },
      ],
    }).compile();

    controller = module.get<MissionsController>(MissionsController);
    service = mockMissionsService;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateTask', () => {
    it('delegates to service with client updatedAt from body', async () => {
      const mockResult = { id: 't1', isCompleted: true };
      service.updateTaskStatus.mockResolvedValue(mockResult);

      const res = await controller.updateTask(
        'org-1',
        'm1',
        't1',
        { isCompleted: true, updatedAt: '2026-08-24T12:00:00.000Z' },
      );

      expect(res).toBe(mockResult);
      expect(service.updateTaskStatus).toHaveBeenCalledWith(
        'org-1',
        'm1',
        't1',
        { isCompleted: true, updatedAt: '2026-08-24T12:00:00.000Z' },
        '2026-08-24T12:00:00.000Z',
      );
    });

    it('delegates to service with client updatedAt from If-Unmodified-Since header', async () => {
      const mockResult = { id: 't1', isCompleted: true };
      service.updateTaskStatus.mockResolvedValue(mockResult);

      const res = await controller.updateTask(
        'org-1',
        'm1',
        't1',
        { isCompleted: true },
        '2026-08-24T12:00:00.000Z',
      );

      expect(res).toBe(mockResult);
      expect(service.updateTaskStatus).toHaveBeenCalledWith(
        'org-1',
        'm1',
        't1',
        { isCompleted: true },
        '2026-08-24T12:00:00.000Z',
      );
    });
  });
});
