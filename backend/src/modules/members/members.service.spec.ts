import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from './members.service';
import { DatabaseService } from '../../database/database.service';

describe('MembersService', () => {
  let service: MembersService;

  const mockDatabase = {
    member: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembersService, { provide: DatabaseService, useValue: mockDatabase }],
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
