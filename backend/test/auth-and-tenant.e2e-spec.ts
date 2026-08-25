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

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
    db = mod.get(DatabaseService);
    await resetDb(db);

    const passwordHash = await bcrypt.hash('pw123456', 10);
    const orgA = await db.organization.create({
      data: { name: 'OrgA', slug: 'org-a', plan: 'FREE',
        users: { create: { email: 'a@a.cl', passwordHash, role: 'SUPERADMIN' } } } });
    const orgB = await db.organization.create({
      data: { name: 'OrgB', slug: 'org-b', plan: 'FREE',
        users: { create: { email: 'b@b.cl', passwordHash, role: 'SUPERADMIN' } } } });

    tokenA = (await request(app.getHttpServer()).post('/auth/login').send({ email: 'a@a.cl', password: 'pw123456', orgSlug: 'org-a' })).body.access_token;
    tokenB = (await request(app.getHttpServer()).post('/auth/login').send({ email: 'b@b.cl', password: 'pw123456', orgSlug: 'org-b' })).body.access_token;

    const mem = await request(app.getHttpServer()).post('/members').set('Authorization', `Bearer ${tokenA}`).send({ firstName: 'Juan', lastName: 'Perez', email: 'juan@a.cl', rut: '12.345.678-5', status: 'ACTIVE' });
    memberIdA = mem.body.id;
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

  it('GET /members sin token → 401', async () => {
    await request(app.getHttpServer()).get('/members').expect(401);
  });
});
