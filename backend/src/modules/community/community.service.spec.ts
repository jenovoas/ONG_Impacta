import { DatabaseService } from '../../database/database.service';
import { CommunityService } from './community.service';

describe('CommunityService', () => {
  let service: CommunityService;
  let queryRaw: jest.Mock;

  beforeEach(() => {
    queryRaw = jest.fn();
    service = new CommunityService({
      $queryRaw: queryRaw,
    } as unknown as DatabaseService);
  });

  it('returns the authenticated user profile without querying another user', async () => {
    const profile = { userId: 'user-a', visibility: 'PRIVATE' };
    queryRaw.mockResolvedValueOnce([profile]);

    await expect(service.getProfile('user-a')).resolves.toEqual(profile);
    expect(queryRaw).toHaveBeenCalledTimes(1);
  });

  it('preserves existing fields when partially updating a profile', async () => {
    queryRaw
      .mockResolvedValueOnce([
        {
          userId: 'user-a',
          firstName: 'Ana',
          lastName: 'Pérez',
          displayName: 'Ana P.',
          bio: 'Bióloga',
          region: 'Biobío',
          commune: 'Curanilahue',
          website: null,
          visibility: 'COMMUNITY',
        },
      ])
      .mockResolvedValueOnce([{ userId: 'user-a', visibility: 'PUBLIC' }]);

    await expect(
      service.upsertProfile('user-a', { visibility: 'PUBLIC' }),
    ).resolves.toEqual({ userId: 'user-a', visibility: 'PUBLIC' });
    expect(queryRaw).toHaveBeenCalledTimes(2);
  });

  it('rejects credentials that reference an unknown discipline', async () => {
    queryRaw.mockResolvedValueOnce([]);

    await expect(
      service.createCredential('user-a', { disciplineId: 'missing' }),
    ).rejects.toThrow('Disciplina no encontrada');
    expect(queryRaw).toHaveBeenCalledTimes(1);
  });
});
