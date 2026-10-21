import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { resetDb } from './helpers/reset-db';

describe('Auth + Tenant isolation (e2e)', () => {
  let app: INestApplication;
  let db: DatabaseService;
  let tokenA: string;
  let tokenB: string;
  let memberIdA: string;
  let campaignIdA: string;
  let speciesIdA: string;
  let missionIdA: string;
  let taskIdA: string;

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
    db = mod.get(DatabaseService);
    await resetDb(db.base as any);

    const passwordHash = await bcrypt.hash('pw123456', 10);
    const orgA = await db.base.organization.create({
      data: { name: 'OrgA', slug: 'org-a', plan: 'FREE',
        users: { create: { email: 'a@a.cl', passwordHash, role: 'ADMIN' } } } });
    const orgB = await db.base.organization.create({
      data: { name: 'OrgB', slug: 'org-b', plan: 'FREE',
        users: { create: { email: 'b@b.cl', passwordHash, role: 'ADMIN' } } } });

    tokenA = (await request(app.getHttpServer()).post('/auth/login').send({ email: 'a@a.cl', password: 'pw123456', orgSlug: 'org-a' })).body.access_token;
    tokenB = (await request(app.getHttpServer()).post('/auth/login').send({ email: 'b@b.cl', password: 'pw123456', orgSlug: 'org-b' })).body.access_token;

    const mem = await request(app.getHttpServer()).post('/members').set('Authorization', `Bearer ${tokenA}`).send({ firstName: 'Juan', lastName: 'Perez', email: 'juan@a.cl', rut: '12.345.678-5', status: 'ACTIVE' });
    memberIdA = mem.body.id;

    const campaign = await request(app.getHttpServer()).post('/campaigns').set('Authorization', `Bearer ${tokenA}`).send({ name: 'Reforestación', goalAmount: 100000 });
    campaignIdA = campaign.body.id;

    const species = await request(app.getHttpServer()).post('/species').set('Authorization', `Bearer ${tokenA}`).send({ commonName: 'Araucaria', scientificName: 'Araucaria araucana', status: 'THREATENED' });
    speciesIdA = species.body.id;

    const mission = await request(app.getHttpServer()).post('/missions').set('Authorization', `Bearer ${tokenA}`).send({
      title: 'Jornada de plantación',
      startDate: '2026-10-20T09:00:00.000Z',
      tasks: [{ title: 'Preparar el terreno' }],
    });
    missionIdA = mission.body.id;
    taskIdA = mission.body.tasks[0].id;
  });
  afterAll(async () => await app.close());

  it('login rechaza password inválido', async () => {
    await request(app.getHttpServer()).post('/auth/login').send({ email: 'a@a.cl', password: 'wrongpassword', orgSlug: 'org-a' }).expect(401);
  });

  it('login OK devuelve shape completo', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({ email: 'a@a.cl', password: 'pw123456', orgSlug: 'org-a' }).expect(200);
    expect(res.body.access_token).toBeDefined();
    expect(res.body.refresh_token).toBeDefined();
    expect(res.body.user.organization.slug).toBe('org-a');
  });

  it('token de OrgB NO ve member de OrgA (404)', async () => {
    await request(app.getHttpServer()).get(`/members/${memberIdA}`).set('Authorization', `Bearer ${tokenB}`).expect(404);
  });

  it('token de OrgA ve su propio member', async () => {
    const res = await request(app.getHttpServer()).get(`/members/${memberIdA}`).set('Authorization', `Bearer ${tokenA}`).expect(200);
    expect(res.body.id).toBe(memberIdA);
  });

  it('GET /members devuelve la forma paginada que usa el frontend', async () => {
    const res = await request(app.getHttpServer()).get('/members?page=1&pageSize=20').set('Authorization', `Bearer ${tokenA}`).expect(200);
    expect(res.body.items.map((member: { id: string }) => member.id)).toContain(memberIdA);
    expect(res.body.meta).toMatchObject({ page: 1, pageSize: 20, total: 1 });
  });

  it('una organización solo lista sus propias campañas y especies', async () => {
    const [campaigns, species] = await Promise.all([
      request(app.getHttpServer()).get('/campaigns').set('Authorization', `Bearer ${tokenA}`).expect(200),
      request(app.getHttpServer()).get('/species').set('Authorization', `Bearer ${tokenA}`).expect(200),
    ]);
    expect(campaigns.body.map((campaign: { id: string }) => campaign.id)).toEqual([campaignIdA]);
    expect(species.body.map((speciesItem: { id: string }) => speciesItem.id)).toEqual([speciesIdA]);
  });

  it('las misiones y sus tareas se crean y se actualizan dentro de su organización', async () => {
    const list = await request(app.getHttpServer()).get('/missions').set('Authorization', `Bearer ${tokenA}`).expect(200);
    expect(list.body[0]).toMatchObject({ id: missionIdA, title: 'Jornada de plantación' });

    await request(app.getHttpServer()).patch(`/missions/${missionIdA}/tasks/${taskIdA}`).set('Authorization', `Bearer ${tokenA}`).send({ isCompleted: true }).expect(200);
    const updated = await request(app.getHttpServer()).get(`/missions/${missionIdA}`).set('Authorization', `Bearer ${tokenA}`).expect(200);
    expect(updated.body.tasks[0].isCompleted).toBe(true);
  });

  it('token de otra organización no puede leer campaña, especie ni misión', async () => {
    await request(app.getHttpServer()).get(`/campaigns/${campaignIdA}`).set('Authorization', `Bearer ${tokenB}`).expect(404);
    await request(app.getHttpServer()).get(`/species/${speciesIdA}`).set('Authorization', `Bearer ${tokenB}`).expect(404);
    await request(app.getHttpServer()).get(`/missions/${missionIdA}`).set('Authorization', `Bearer ${tokenB}`).expect(404);
  });

  it('GET /members sin token → 401', async () => {
    await request(app.getHttpServer()).get('/members').expect(401);
  });
});
