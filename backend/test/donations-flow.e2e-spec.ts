import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { resetDb } from './helpers/reset-db';

describe('Donations Flow (e2e)', () => {
  let app: INestApplication;
  let db: DatabaseService;
  let token: string;
  let memberId: string;

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
    db = mod.get(DatabaseService);
    await resetDb(db);

    const passwordHash = await bcrypt.hash('pw123456', 10);
    const org = await db.organization.create({
      data: { name: 'Demo Org', slug: 'demo', plan: 'FREE',
        users: { create: { email: 'admin@demo.cl', passwordHash, role: 'ADMIN' } } } });

    token = (await request(app.getHttpServer()).post('/auth/login').send({ email: 'admin@demo.cl', password: 'pw123456', orgSlug: 'demo' })).body.access_token;

    const mem = await request(app.getHttpServer()).post('/members').set('Authorization', `Bearer ${token}`).send({ firstName: 'Juan', lastName: 'Perez', email: 'juan@demo.cl', rut: '1-9', status: 'ACTIVE' });
    memberId = mem.body.id;
  });
  afterAll(async () => await app.close());

  it('Flow: create pending donation → callback success → check summary', async () => {
    // 1. Create donation
    const resCreate = await request(app.getHttpServer())
      .post('/donations')
      .set('Authorization', `Bearer ${token}`)
      .send({ memberId, amount: 15000, currency: 'CLP' })
      .expect(201);

    expect(resCreate.body.status).toBe('PENDING');
    expect(resCreate.body.gatewayRef).toBeDefined();
    const gatewayRef = resCreate.body.gatewayRef;

    // 2. Summary should be 0 (only SUCCEEDED counts)
    const resSummary1 = await request(app.getHttpServer())
      .get('/organizations/me/summary')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(resSummary1.body.donationsCount).toBe(0);

    // 3. Callback
    await request(app.getHttpServer())
      .post('/donations/callback')
      .send({ gatewayRef, status: 'SUCCEEDED' })
      .expect(201);

    // 4. Summary should be updated
    const resSummary2 = await request(app.getHttpServer())
      .get('/organizations/me/summary')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(resSummary2.body.donationsCount).toBe(1);
    expect(Number(resSummary2.body.totalAmount)).toBe(15000);

    // 5. List donations includes member info
    const resList = await request(app.getHttpServer())
      .get('/donations')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(resList.body[0].member.firstName).toBe('Juan');
  });
});
