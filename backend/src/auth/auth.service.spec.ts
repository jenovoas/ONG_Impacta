import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { OAuthService } from './oauth/oauth.service';
import { DatabaseService } from '../database/database.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockDatabase = {
    user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    organization: { findUnique: jest.fn() },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    oAuthAccount: { findUnique: jest.fn(), create: jest.fn() },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DatabaseService, useValue: mockDatabase },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn(), verifyAsync: jest.fn() },
        },
        { provide: OAuthService, useValue: { verify: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
