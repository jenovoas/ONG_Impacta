import { Test, TestingModule } from '@nestjs/testing';
import { DonationsService } from './donations.service';
import { DatabaseService } from '../../database/database.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { NotFoundException } from '@nestjs/common';
import { AuthUser } from '../../auth/decorators/current-user.decorator';

describe('DonationsService (portal donante)', () => {
  let service: DonationsService;
  let prisma: any;
  let logger: any;

  const orgId = 'org-1';
  const member = {
    id: 'member-1',
    organizationId: orgId,
    email: 'donante@example.com',
    rut: '11111111-1',
    firstName: 'Ana',
    lastName: 'Perez',
  };

  const user: AuthUser = {
    id: 'user-1',
    email: 'donante@example.com',
    orgId,
    role: 'VIEWER',
  };

  beforeEach(async () => {
    prisma = {
      member: {
        findFirst: jest.fn(),
      },
      donation: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
      },
      campaign: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonationsService,
        { provide: DatabaseService, useValue: prisma },
        { provide: CampaignsService, useValue: { updateBalance: jest.fn() } },
      ],
    }).compile();

    service = module.get<DonationsService>(DonationsService);
    logger = (service as any).logger;
    jest.spyOn(logger, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findMyDonations', () => {
    it('resuelve el member por email y devuelve solo sus donaciones ordenadas desc', async () => {
      prisma.member.findFirst.mockResolvedValue(member);
      prisma.donation.findMany.mockResolvedValue([
        { id: 'd-2', organizationId: orgId, memberId: 'member-1', amount: 100 },
        { id: 'd-1', organizationId: orgId, memberId: 'member-1', amount: 50 },
      ]);

      const result = await service.findMyDonations(orgId, user);

      expect(prisma.member.findFirst).toHaveBeenCalledWith({
        where: {
          organizationId: orgId,
          OR: [{ email: 'donante@example.com' }],
        },
      });
      expect(prisma.donation.findMany).toHaveBeenCalledWith({
        where: { organizationId: orgId, memberId: 'member-1' },
        include: { campaign: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(2);
    });

    it('resuelve el member por rut cuando el user lo trae', async () => {
      const userWithRut: AuthUser = { ...user, rut: '11111111-1' };
      prisma.member.findFirst.mockResolvedValue(member);
      prisma.donation.findMany.mockResolvedValue([]);

      await service.findMyDonations(orgId, userWithRut);

      expect(prisma.member.findFirst).toHaveBeenCalledWith({
        where: {
          organizationId: orgId,
          OR: [{ email: 'donante@example.com' }, { rut: '11111111-1' }],
        },
      });
    });

    it('devuelve [] (no error) si el member no existe', async () => {
      prisma.member.findFirst.mockResolvedValue(null);

      const result = await service.findMyDonations(orgId, user);

      expect(result).toEqual([]);
      expect(prisma.donation.findMany).not.toHaveBeenCalled();
    });
  });

  describe('generateReceiptPdf', () => {
    it('genera un buffer PDF para una donacion propia', async () => {
      prisma.member.findFirst.mockResolvedValue(member);
      prisma.donation.findFirst.mockResolvedValue({
        id: 'd-1',
        organizationId: orgId,
        memberId: 'member-1',
        amount: 25000,
        status: 'SUCCEEDED',
        createdAt: new Date('2026-01-15T00:00:00Z'),
        campaign: { name: 'Salvar Pinguinos' },
        organization: { name: 'ONG Impacta', slug: 'impacta' },
        member,
      });

      const pdf = await service.generateReceiptPdf(orgId, user, 'd-1');

      expect(Buffer.isBuffer(pdf)).toBe(true);
      // Un PDF válido parte con %PDF
      expect(pdf.subarray(0, 4).toString()).toBe('%PDF');
    });

    it('lanza 404 si el member del donante no existe (denied_attempt loggeado)', async () => {
      prisma.member.findFirst.mockResolvedValue(null);

      await expect(
        service.generateReceiptPdf(orgId, user, 'd-1'),
      ).rejects.toThrow(NotFoundException);
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('denied_attempt'),
      );
    });

    it('lanza 404 (no 403) si la donacion no es del donante o de otra org', async () => {
      prisma.member.findFirst.mockResolvedValue(member);
      prisma.donation.findFirst.mockResolvedValue({
        id: 'd-otra',
        organizationId: 'org-otra',
        memberId: 'member-otro',
        amount: 100,
      });

      await expect(
        service.generateReceiptPdf(orgId, user, 'd-otra'),
      ).rejects.toThrow(NotFoundException);
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('denied_attempt'),
      );
    });
  });

  describe('updateRecurringStatus', () => {
    it('actualiza recurringStatus si la donacion pertenece al donante', async () => {
      prisma.member.findFirst.mockResolvedValue(member);
      prisma.donation.findFirst.mockResolvedValue({
        id: 'd-1',
        organizationId: orgId,
        memberId: 'member-1',
      });
      prisma.donation.update.mockResolvedValue({
        id: 'd-1',
        recurringStatus: 'PAUSED',
      });

      const result = await service.updateRecurringStatus(
        orgId,
        user,
        'd-1',
        'PAUSED',
      );

      expect(prisma.donation.update).toHaveBeenCalledWith({
        where: { id: 'd-1' },
        data: { recurringStatus: 'PAUSED' },
      });
      expect(result.recurringStatus).toBe('PAUSED');
    });

    it('lanza 404 si la donacion no es del donante', async () => {
      prisma.member.findFirst.mockResolvedValue(member);
      prisma.donation.findFirst.mockResolvedValue({
        id: 'd-otra',
        organizationId: orgId,
        memberId: 'member-otro',
      });

      await expect(
        service.updateRecurringStatus(orgId, user, 'd-otra', 'CANCELLED'),
      ).rejects.toThrow(NotFoundException);
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('denied_attempt'),
      );
      expect(prisma.donation.update).not.toHaveBeenCalled();
    });

    it('lanza 404 si el member no existe', async () => {
      prisma.member.findFirst.mockResolvedValue(null);

      await expect(
        service.updateRecurringStatus(orgId, user, 'd-1', 'ACTIVE'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
