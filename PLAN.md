# Impacta+ — Plan de trabajo (hand-off a Antigravity)

Documento autosuficiente: cualquier agente puede recoger este plan sin depender del historial de Claude.

---

## 0. Estado actual (2026-04-18)

**Infra:** servidor compartido `fenix` (Rocky 9, podman rootless). Traefik v3 con `proxy` network externa, wildcard `*.pinguinoseguro.cl` vía `powerdns` DNS-01. **NO TOCAR infra existente** de los otros proyectos (sentinel, pinguinoseguro, laespiguita, portfolio, minio). Solo agregar servicios.

**Despliegues vivos:**
- `https://impacta.pinguinoseguro.cl` — landing (Next.js, diseño "New Identity 2026").
- `https://api-impacta.pinguinoseguro.cl` — backend (JWT global guard, `/health` público OK).
- `https://app-impacta.pinguinoseguro.cl` — frontend (app SPA servida por nginx).

**Stack:**
- `backend/` — NestJS 11 + Prisma 5 + class-validator. Global `ValidationPipe`. Multi-tenant vía Prisma client extension + AsyncLocalStorage (ver `backend/src/database/prisma-multi-tenant.extension.ts`).
- `landing/` — Next.js 16.2.4 (standalone) + Tailwind v4 + Manrope/Inter.
- `frontend/` — Vite + React 19 + Tailwind v4 + React Router. Páginas implementadas: Login, Overview, Members, Donations, Campaigns, Species, Missions, OrganizationProfile.
- `docker-compose.yml` — postgres (5435), redis (6381), backend (traefik → api-impacta), frontend (traefik → app-impacta), landing (traefik → impacta).
- **Prisma schema + migraciones:** `init`, `add_donations`, `add_campaigns`, `add_species`, `add_missions` aplicadas. Seed en `prisma/seed.ts` (org demo + admin).

**Módulos backend implementados:** `auth` (login + refresh + @Public), `organizations`, `users`, `members`, `donations`, `campaigns`, `species`, `missions`, `storage` (MinIO). Todos usan `prisma.tenant.*` (extensión inyecta `organizationId` automáticamente desde contexto de request).

**Fases completadas:**
- **Fase A** (A1–A5) — migración, auth, tenant middleware, users, members. ✅
- **Fase B** (B1–B4) — donations (con callback mock), campaigns, species (con MinIO), missions. ✅
- **Fase C** completa — C1 bootstrap, C2 pantallas cableadas a API (verificado end-to-end con smoke test: login → summary → donations → members → campaigns → org), C3 backend detrás de traefik con `/health` público. ✅

**Credenciales demo (seed):**
- Org slug: `demo` · Email: `admin@demo.impacta.cl` · Password: `admin123`

**Commits locales sin push (2026-04-18):**
- `576297f` fix(backend): align tenant handling across modules and add /health
- `7f9c82b` refactor(frontend): wire dashboard pages to real backend schema
- Acción inmediata: `git push origin main` antes de abrir Fase D.

**Pendiente inmediato (próxima sesión — Antigravity):**
1. Push a origin de los 2 commits arriba.
2. Arrancar **Fase D** según el desglose de la sección 2 más abajo (D1 → D4 en orden).

---

## 1. Design system — "The Digital Steward"

Fuente de verdad: **Google Stitch project `4741044715461206908`** ("Interfaz Diseño Proyecto"). Acceso vía MCP Stitch (`mcp__stitch__list_screens`, `get_screen`, etc.). ~25 pantallas diseñadas (desktop 1280 + mobile 390).

**Tokens ya expresados** en [landing/app/globals.css](landing/app/globals.css) como Tailwind v4 `@theme`:
- Surface ladder: `#0e0e0e` → `#131313` → `#1c1b1b` → `#20201f` → `#2a2a2a` → `#353535` → `#393939`
- Primary (Impact Blue): `#00a8ff` / fixed-dim `#95ccff`
- Secondary (Restore Green): `#00d4aa`
- Tertiary (Warm Trust): `#ffb877`
- Fonts: Manrope (headline), Inter (body/label). `letter-spacing: -0.02em` en headlines.
- Radius escalonado hasta `2rem` / `3rem`.

**Reglas duras:**
- Sin bordes sólidos 1px — usar shifts de surface.
- Sin drop-shadows estándar — tonal layering.
- Sin dividers opacos — usar espaciado 16px.
- Glassmorphism: `rgba(32,32,31,0.45)` + `blur(24px)`.
- Iconos: Material Symbols Outlined, variación Thin/Light (weight 400, grade 0).

**Al implementar cualquier pantalla nueva:** primero `mcp__stitch__get_screen` para traer HTML de Stitch, luego portar a React reutilizando los tokens de `globals.css`. No improvisar paleta.

---

## 2. Backlog ordenado

### Fase A — Base multi-tenant del backend (bloqueante)

**A1. Migración inicial Prisma + seed**
- `cd backend && npx prisma migrate dev --name init`
- Crear `prisma/seed.ts` con 1 organización demo (`slug: 'demo'`, `plan: 'PRO'`) y 1 usuario admin (`admin@demo.impacta.cl` / password hasheado bcrypt).
- Agregar script `"prisma:seed": "ts-node prisma/seed.ts"` en `package.json`.
- **AC:** `npx prisma migrate status` limpio; `npx prisma studio` muestra los registros.

**A2. Módulo `auth` (JWT + bcrypt)**
- Paquetes: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`.
- Endpoints: `POST /auth/login` (email + password + orgSlug), `POST /auth/refresh`, `GET /auth/me`.
- JWT payload: `{ sub: userId, orgId, role }`. Secret desde `JWT_SECRET` en `.env`.
- Guard `JwtAuthGuard` global + decorator `@Public()` para excluir rutas.
- **AC:** login contra la org demo devuelve access + refresh token. `GET /auth/me` con Bearer devuelve el user sin `passwordHash`.

**A3. Tenant context middleware**
- Middleware que extrae `orgId` del JWT y lo inyecta en `req.tenant`.
- Decorator `@CurrentTenant()` para controllers.
- Refactorizar `OrganizationsService.findOne` y futuros services para filtrar por `orgId` automáticamente (considerar Prisma middleware o extension).
- **AC:** cualquier query cross-tenant (pedir recurso de otra org con token de la org demo) devuelve 404, nunca filtra datos.

**A4. Módulo `users`**
- CRUD de usuarios dentro de la organización. Roles: `SUPERADMIN`, `ADMIN`, `OPERATOR`, `VIEWER`.
- Guard `RolesGuard` + decorator `@Roles(...)`.
- **AC:** solo `ADMIN`+ puede crear/listar usuarios; `OPERATOR` recibe 403.

**A5. Módulo `members` (socios/voluntarios)**
- CRUD + filtros (búsqueda por nombre, estado, paginación). RUT chileno validado (dígito verificador).
- Estados: `ACTIVE`, `INACTIVE`, `PENDING`.
- **AC:** endpoint `GET /members?status=ACTIVE&page=1&pageSize=20` paginado; crear socio con RUT inválido → 400.

### Fase B — Módulos de producto (según PRD)

Leer [Impacta+PRD.md](Impacta+PRD.md) antes de cada uno.

**B1. Módulo `donations`**
- Modelo Prisma: `Donation { id, organizationId, memberId?, amount, currency, status, gatewayRef?, createdAt }`.
- Endpoints: crear intención de pago, callback de pasarela (mock primero), listado con totales.
- Stub de integración ImpactaPay — interfaz `PaymentGateway` con impl `MockPaymentGateway`.
- **AC:** donación creada queda en estado `PENDING`; callback la pasa a `SUCCEEDED`.

**B2. Módulo `campaigns`**
- Campañas de recaudación con meta, fecha fin, progreso calculado.
- **AC:** endpoint `GET /campaigns/:id/progress` devuelve `{ raised, goal, percentage, donorCount }`.

**B3. Módulo `species` (Biblioteca de Especies)**
- Modelo: `Species { id, organizationId, scientificName, commonName, status (IUCN), habitat, images[] }`.
- Upload de imágenes a MinIO (ya corre en el servidor — endpoint y credenciales en `~/Desarrollo/sentinel/`).
- **AC:** crear especie con imagen sube a MinIO y devuelve URL firmada.

**B4. Módulo `missions` (Rescate Ecológico)**
- Modelo: `Mission { id, organizationId, title, location (lat/lng), startDate, status, volunteers[] }`.
- Asignación de voluntarios desde `members`.
- **AC:** crear misión y asignar 3 voluntarios; `GET /missions/:id` devuelve la lista.

### Fase C — Frontend app (`app.impacta.pinguinoseguro.cl`)

**Pre-requisitos:**
- DNS ya apunta por wildcard — no hacer nada.
- Cert wildcard de un nivel cubre `app.impacta.pinguinoseguro.cl` ✅.
- **NO** funciona `api.impacta.pinguinoseguro.cl` (segundo nivel) — si el backend necesita exponerse, usar `api-impacta.pinguinoseguro.cl` o proxy bajo `/api` del mismo host.

**C1. Bootstrap del frontend**
- `frontend/` ya es Vite + React 19. Agregar: React Router 7, TanStack Query, Tailwind v4, zod, react-hook-form, axios.
- Portar tokens de diseño desde `landing/app/globals.css` a `frontend/src/index.css` (mismo `@theme`).
- Cargar Manrope + Inter + Material Symbols.
- Crear `Dockerfile` multi-stage (deps → build → nginx:alpine servir `dist/`). Basarse en el patrón de `landing/Dockerfile`.
- Agregar servicio `frontend` a `docker-compose.yml` con traefik labels para `app.impacta.pinguinoseguro.cl` (copiar labels de `landing`, cambiar Host y nombres de router).

**C2. Pantallas — traer de Stitch una por una**
Orden sugerido:
1. `Login` — buscar screen "Login" en Stitch (`mcp__stitch__list_screens` del proyecto).
2. `Dashboard` — overview con KPIs (árboles, especies, recaudación).
3. `Members list + detail`
4. `Donations list + create`
5. `Campaigns`
6. `Species library`
7. `Missions`
8. `Settings / Organization profile`

Para cada pantalla: `mcp__stitch__get_screen` → HTML → componente React que consume la API del backend vía TanStack Query. Reutilizar tokens, no crear variantes de color.

**C3. Exponer backend detrás de traefik** (hacer junto con C1)
- Opción recomendada: agregar labels al servicio `backend` con host `api-impacta.pinguinoseguro.cl` (subdominio de primer nivel, cubierto por wildcard).
- Si se prefiere mismo origen: agregar path `/api` al frontend via traefik middleware stripprefix.
- CORS en `main.ts`: whitelist del host del frontend.
- **AC:** `curl https://api-impacta.pinguinoseguro.cl/health` → 200 OK.

### Fase D — Pulido (próximo bloque de trabajo)

Estimación total ≈ 1–2 sesiones con Antigravity. Ir en orden **D1 → D2 → D3 → D4**. Commit por cada sub-tarea.

**Anclajes reales del repo (verificados 2026-04-18, no alucinar):**
- Archivos `.spec.ts` **ya existen** en: [backend/src/app.controller.spec.ts](backend/src/app.controller.spec.ts), [backend/src/auth/auth.service.spec.ts](backend/src/auth/auth.service.spec.ts), [backend/src/auth/auth.controller.spec.ts](backend/src/auth/auth.controller.spec.ts), [backend/src/database/database.service.spec.ts](backend/src/database/database.service.spec.ts), [backend/src/modules/organizations/organizations.service.spec.ts](backend/src/modules/organizations/organizations.service.spec.ts), [backend/src/modules/organizations/organizations.controller.spec.ts](backend/src/modules/organizations/organizations.controller.spec.ts), [backend/src/modules/users/users.service.spec.ts](backend/src/modules/users/users.service.spec.ts), [backend/src/modules/users/users.controller.spec.ts](backend/src/modules/users/users.controller.spec.ts), [backend/src/modules/members/members.service.spec.ts](backend/src/modules/members/members.service.spec.ts), [backend/src/modules/members/members.controller.spec.ts](backend/src/modules/members/members.controller.spec.ts).
- Todos los `.spec.ts` existentes son **stubs triviales del CLI de Nest** (providers: [Service] sin mocks) — **están rotos** porque los services tienen dependencias reales. **Reemplazar contenido completo**, no extender.
- E2E: sólo existe [backend/test/app.e2e-spec.ts](backend/test/app.e2e-spec.ts) — también roto (espera `/` → `"Hello World!"` que ya no es la respuesta). Reemplazar.
- Jest unit config está **inline** en [backend/package.json](backend/package.json) bajo la key `"jest"` — `rootDir: "src"`, `testRegex: ".*\\.spec\\.ts$"`.
- Jest e2e config está en [backend/test/jest-e2e.json](backend/test/jest-e2e.json) — `rootDir: "."`, `testRegex: ".e2e-spec.ts$"`.
- `.github/` **no existe** — crearlo desde cero.
- **Carpetas canónicas** para crear archivos nuevos: unit tests van **junto al archivo testeado** (patrón `<file>.spec.ts`). E2E van en `backend/test/*.e2e-spec.ts`.

**Contratos clave del código actual (leer antes de testear):**
- [backend/src/auth/auth.service.ts](backend/src/auth/auth.service.ts):
  - `validateUser(email, pass, orgSlug)` → usa `this.database.base.user.findFirst` (NO `tenant.user` — login es pre-autenticación, cruza tenants).
  - `login(user)` retorna **literal** `{access_token, refresh_token, user: {id, email, role, organizationId, organization: {id, name, slug, plan}}}`.
  - JWT payload literal: `{sub: user.id, email: user.email, orgId: user.organizationId, role: user.role}`. **OJO: la key es `orgId`, no `organizationId`.**
- [backend/src/common/middleware/tenant.middleware.ts](backend/src/common/middleware/tenant.middleware.ts):
  - Extrae `payload.orgId` del JWT (decode, no verify — el Guard verifica).
  - Envuelve `next()` en `tenantContextStorage.run({orgId}, () => next())`.
  - Setea `req.tenant = {id: orgId}`.
- [backend/src/database/prisma-multi-tenant.extension.ts](backend/src/database/prisma-multi-tenant.extension.ts):
  - Lee `tenantContextStorage.getStore()?.orgId`.
  - Solo inyecta en modelos: `User, Member, Donation, Campaign, Species, Mission`. **`Organization` NO está en la lista.**
  - Si `orgId` es `undefined` **NO filtra** (la query pasa tal cual). Esto es política actual — los tests deben asumirlo.
- [backend/src/common/utils/tenant-context.ts](backend/src/common/utils/tenant-context.ts): `tenantContextStorage = new AsyncLocalStorage<{orgId?: string}>()`.

---

**D1. Tests backend (bloqueante para CI)**

**Estrategia DB de test:** usar un schema Postgres separado (más simple que contenedor dedicado). `DATABASE_URL=postgresql://impacta:impacta_pass@localhost:5435/impacta?schema=test`. Antes de correr tests: `npx prisma migrate deploy` con esa URL para crear/actualizar el schema. Entre tests: `TRUNCATE` de las tablas con cascada (helper `resetDb()`).

**Dependencias a instalar** en `backend/`:
```bash
cd backend
npm install -D @types/bcrypt dotenv-cli
```
(No instalar `pino` aún — eso es D3.)

**D1.1 — Helper de test: `backend/test/helpers/reset-db.ts`** (crear archivo)
```ts
import { PrismaClient } from '@prisma/client';

export async function resetDb(prisma: PrismaClient) {
  const tables = ['Mission', 'Species', 'Donation', 'Campaign', 'Member', 'User', 'Organization'];
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${tables.map((t) => `"${t}"`).join(', ')} RESTART IDENTITY CASCADE;`
  );
}
```

**D1.2 — Unit tests (reemplazar contenido de los .spec.ts existentes)**

Cada unit test debe mockear deps con `jest.fn()` — **no instanciar `DatabaseService` real en unit**. Patrón a seguir:

```ts
// backend/src/auth/auth.service.spec.ts  (REEMPLAZAR contenido)
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let db: { base: { user: { findFirst: jest.Mock } } };
  let jwt: { sign: jest.Mock; verify: jest.Mock };

  beforeEach(async () => {
    db = { base: { user: { findFirst: jest.fn() } } };
    jwt = { sign: jest.fn().mockReturnValue('signed-token'), verify: jest.fn() };
    const mod = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DatabaseService, useValue: db },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();
    service = mod.get(AuthService);
  });

  describe('validateUser', () => {
    it('returns user sin passwordHash cuando credenciales válidas', async () => {
      const hash = await bcrypt.hash('demo', 10);
      db.base.user.findFirst.mockResolvedValue({
        id: 'u1', email: 'a@b.cl', passwordHash: hash, organizationId: 'o1', role: 'ADMIN',
        organization: { id: 'o1', name: 'X', slug: 'demo', plan: 'FREE' },
      });
      const r = await service.validateUser('a@b.cl', 'demo', 'demo');
      expect(r).toBeDefined();
      expect(r.passwordHash).toBeUndefined();
      expect(r.email).toBe('a@b.cl');
    });
    it('retorna null si password inválido', async () => {
      db.base.user.findFirst.mockResolvedValue({
        id: 'u1', passwordHash: await bcrypt.hash('otra', 10),
      });
      expect(await service.validateUser('a@b.cl', 'demo', 'demo')).toBeNull();
    });
    it('retorna null si user no existe', async () => {
      db.base.user.findFirst.mockResolvedValue(null);
      expect(await service.validateUser('x@x.cl', 'demo', 'demo')).toBeNull();
    });
  });

  describe('login', () => {
    it('retorna shape completo con organization', () => {
      const r = service.login({
        id: 'u1', email: 'a@b.cl', organizationId: 'o1', role: 'ADMIN',
        organization: { id: 'o1', name: 'X', slug: 'demo', plan: 'FREE' },
      });
      expect(r.access_token).toBe('signed-token');
      expect(r.user.organization).toEqual({ id: 'o1', name: 'X', slug: 'demo', plan: 'FREE' });
      expect(jwt.sign).toHaveBeenCalledWith({ sub: 'u1', email: 'a@b.cl', orgId: 'o1', role: 'ADMIN' });
    });
  });
});
```

Otros specs a reemplazar con el mismo patrón (mocks explícitos, no providers reales):
- [backend/src/modules/members/members.service.spec.ts](backend/src/modules/members/members.service.spec.ts) — paginación default (`page=1, pageSize=20`), filtro `status`, shape `{items, meta: {total, page, pageSize, totalPages}}`.
- [backend/src/modules/organizations/organizations.service.spec.ts](backend/src/modules/organizations/organizations.service.spec.ts) — `getSummary()` usa `where: {status: 'SUCCEEDED'}` en donaciones y `{status: 'ACTIVE'}` en members (ver código actual).
- [backend/src/modules/users/users.service.spec.ts](backend/src/modules/users/users.service.spec.ts) — hash de password al crear, no retornar `passwordHash` en respuestas.
- [backend/src/auth/auth.controller.spec.ts](backend/src/auth/auth.controller.spec.ts), [members.controller.spec.ts](backend/src/modules/members/members.controller.spec.ts), [users.controller.spec.ts](backend/src/modules/users/users.controller.spec.ts), [organizations.controller.spec.ts](backend/src/modules/organizations/organizations.controller.spec.ts) — mockear el service, verificar que el controller pasa los args correctos.
- [backend/src/database/database.service.spec.ts](backend/src/database/database.service.spec.ts) — que `service.tenant` exista y sea el cliente extendido.
- [backend/src/app.controller.spec.ts](backend/src/app.controller.spec.ts) — que `GET /health` (con `@Public()`) devuelva `{status: 'ok', timestamp: <string ISO>}`.

**D1.3 — Unit test de la extensión multi-tenant** (crear archivo nuevo)

Archivo: `backend/src/database/prisma-multi-tenant.extension.spec.ts`

Probar sin DB real mockeando `query`:
```ts
import { tenantContextStorage } from '../common/utils/tenant-context';

describe('multiTenantExtension behavior', () => {
  // La forma más confiable es probar la lógica de mutación de args directamente,
  // O integrar con un PrismaClient real en D1.5. Aquí preferimos integración.
  it('inyecta organizationId en create cuando hay contexto', async () => {
    await tenantContextStorage.run({ orgId: 'org-test' }, async () => {
      expect(tenantContextStorage.getStore()?.orgId).toBe('org-test');
    });
  });
  it('no filtra cuando no hay contexto', () => {
    expect(tenantContextStorage.getStore()).toBeUndefined();
  });
});
```
El test de comportamiento real de la extensión va como integración en D1.5 (más valioso que mockear Prisma).

**D1.4 — E2E: reemplazar [backend/test/app.e2e-spec.ts](backend/test/app.e2e-spec.ts)**

```ts
// Arregla el test existente (ya NO responde "Hello World!"):
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });
  afterAll(async () => await app.close());

  it('GET /health → 200 {status: ok}', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toMatch(/\d{4}-\d{2}-\d{2}T/);
  });
});
```

**D1.5 — E2E crítico: `backend/test/auth-and-tenant.e2e-spec.ts`** (crear)

```ts
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
    await resetDb(db as any);

    const passwordHash = await bcrypt.hash('pw123456', 10);
    const orgA = await db.base.organization.create({
      data: { name: 'OrgA', slug: 'org-a', plan: 'FREE',
        users: { create: { email: 'a@a.cl', passwordHash, role: 'SUPERADMIN' } } } });
    const orgB = await db.base.organization.create({
      data: { name: 'OrgB', slug: 'org-b', plan: 'FREE',
        users: { create: { email: 'b@b.cl', passwordHash, role: 'SUPERADMIN' } } } });

    tokenA = (await request(app.getHttpServer()).post('/auth/login').send({ email: 'a@a.cl', password: 'pw123456', orgSlug: 'org-a' })).body.access_token;
    tokenB = (await request(app.getHttpServer()).post('/auth/login').send({ email: 'b@b.cl', password: 'pw123456', orgSlug: 'org-b' })).body.access_token;

    const mem = await request(app.getHttpServer()).post('/members').set('Authorization', `Bearer ${tokenA}`).send({ firstName: 'Juan', lastName: 'Perez', email: 'juan@a.cl', rut: '12.345.678-5', status: 'ACTIVE' });
    memberIdA = mem.body.id;
  });
  afterAll(async () => await app.close());

  it('login rechaza password inválido', async () => {
    await request(app.getHttpServer()).post('/auth/login').send({ email: 'a@a.cl', password: 'wrong', orgSlug: 'org-a' }).expect(401);
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
```

**D1.6 — E2E: `backend/test/donations-flow.e2e-spec.ts`** (crear)

Mismo patrón: seed org + user + member con token. Luego:
1. `POST /donations {memberId, amount: 15000}` → espera `status: 'PENDING'`, `gatewayRef` presente, `paymentUrl` presente.
2. `GET /organizations/me/summary` → `donationsCount: 0` (solo SUCCEEDED cuenta).
3. `POST /donations/callback {gatewayRef, status: 'SUCCEEDED'}` (endpoint real — verificar en `donations.controller.ts` que no requiere auth o sí).
4. `GET /organizations/me/summary` → `donationsCount: 1, totalAmount: 15000`.
5. `GET /donations` → item incluye `member: {firstName, lastName, email}`.

**⚠️ Verificar primero con `grep` si el callback tiene `@Public()` o necesita auth:** `grep -n "@Public\\|callback" backend/src/modules/donations/donations.controller.ts`.

**D1.7 — Script de test automatizado**

Agregar a [backend/package.json](backend/package.json) scripts:
```json
"test:e2e": "dotenv -e .env.test -- jest --config ./test/jest-e2e.json --runInBand",
"test:setup": "dotenv -e .env.test -- npx prisma migrate deploy"
```
Crear `backend/.env.test`:
```
DATABASE_URL="postgresql://impacta:impacta_pass@localhost:5435/impacta?schema=test"
JWT_SECRET="test-secret-not-for-prod"
```
Agregar `.env.test` al `.gitignore` si no está (revisar).

**AC Fase D1:**
- `cd backend && npm run test` → todos verdes, 0 fallos.
- `cd backend && npm run test:setup && npm run test:e2e` → todos verdes.
- Cobertura (`npm run test:cov`): `auth/`, `modules/members/`, `modules/donations/`, `modules/organizations/`, `database/` ≥ 60% statements.
- **Ningún test mockea `PrismaClient` entero** — unit tests mockean métodos específicos; e2e usa DB real con schema `test`.

---

**D2. CI GitHub Actions**

**Archivo a crear:** `.github/workflows/ci.yml` (la carpeta `.github/` no existe aún).

**Estructura exacta:**
```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: impacta
          POSTGRES_PASSWORD: impacta_pass
          POSTGRES_DB: impacta
        ports: ['5435:5432']
        options: >-
          --health-cmd pg_isready --health-interval 10s
          --health-timeout 5s --health-retries 5
    env:
      DATABASE_URL: "postgresql://impacta:impacta_pass@localhost:5435/impacta?schema=test"
      JWT_SECRET: "test-secret"
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      - run: npm ci
      - run: npx prisma generate
      - run: npx prisma migrate deploy
      - run: npm run lint
      - run: npm run build
      - run: npm run test
      - run: npm run test:e2e

  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm', cache-dependency-path: frontend/package-lock.json }
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  landing:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: landing
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm', cache-dependency-path: landing/package-lock.json }
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

**NO hacer:**
- No agregar deploy automático (el deploy es manual vía `podman-compose up -d` en fenix).
- No usar secretos reales — los tests usan credenciales dummy.
- No cambiar `package.json` scripts de lint/build/test (ya existen — ver sección "Contratos clave").

**AC Fase D2:**
- Badge verde en un PR dummy (crear rama, push, abrir PR).
- Tiempo total < 6 min.
- Un test roto deliberadamente hace que el job `backend` falle.

---

**D3. Observabilidad**

**⚠️ Confirmar con el usuario antes de D3.2 y D3.3.** Infra de Loki/Grafana pertenece a otros proyectos en fenix. Política dura: **no tocar infra compartida sin OK explícito.** Si el usuario dice "solo D3.1", parar ahí.

**D3.1 — Logs estructurados con pino** (solo repo, sin tocar infra)

Instalar:
```bash
cd backend
npm install nestjs-pino pino-http pino
npm install -D pino-pretty
```

Modificar [backend/src/main.ts](backend/src/main.ts):
```ts
import { Logger } from 'nestjs-pino';
// ...
const app = await NestFactory.create(AppModule, { bufferLogs: true });
app.useLogger(app.get(Logger));
```

Modificar [backend/src/app.module.ts](backend/src/app.module.ts) para importar `LoggerModule.forRoot({...})`:
```ts
import { LoggerModule } from 'nestjs-pino';

LoggerModule.forRoot({
  pinoHttp: {
    transport: process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { singleLine: true } }
      : undefined,
    customProps: (req: any) => ({
      org_id: req.tenant?.id,
      user_id: req.user?.sub,
    }),
    serializers: {
      req: (req) => ({ method: req.method, url: req.url }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
    redact: ['req.headers.authorization'],
  },
}),
```

**AC Fase D3.1:**
- En dev (`npm run start:dev`): logs legibles con `pino-pretty`.
- En prod (`NODE_ENV=production`): logs JSON una línea por evento, incluyen `org_id` y `user_id` cuando hay request autenticado.
- `Authorization` header **nunca** aparece en los logs.
- No romper tests existentes.

**D3.2/D3.3 — Integración Loki + dashboards Grafana**

**BLOQUEADO hasta confirmación del usuario.** Si se autoriza:
- Lo más seguro: usar driver `journald` en podman-compose o un `promtail` sidecar que lee stdout del contenedor `impacta-backend`.
- Configuración de Loki/Grafana existentes: revisar `~/Desarrollo/sentinel/` (fuera del repo).
- **Nunca** modificar el archivo de Grafana de otros proyectos — agregar un datasource/dashboard nuevo con label `service=impacta-backend`.

---

**D4. README operativo + cleanup final**

**Archivo a reescribir (no crear):** [README.md](README.md) en la raíz. Verificar primero qué contiene. Estructura sugerida:

```markdown
# Impacta+

SaaS multi-tenant para ONGs — gestión de socios, donaciones, campañas, especies y misiones.
Detalle del producto: [Impacta+PRD.md](Impacta+PRD.md). Arquitectura: [ARQUITECTURA_TECNICA.md](ARQUITECTURA_TECNICA.md).

## Stack
- **Backend** — NestJS 11 + Prisma 5 + Postgres 16. Multi-tenant por AsyncLocalStorage + Prisma extension.
- **Landing** — Next.js 16 (standalone) + Tailwind v4.
- **Frontend** — Vite + React 19 + TanStack Query + React Router 7.
- **Infra** — podman rootless + traefik v3 en fenix (Rocky 9).

## Estructura
(tabla: backend/, landing/, frontend/, docker-compose.yml, prisma/)

## Levantar local
\`\`\`bash
docker-compose up -d postgres redis
cd backend && npm install && npx prisma migrate deploy && npm run prisma:seed && npm run start:dev
# otra terminal:
cd frontend && npm install && npm run dev
\`\`\`
Frontend: http://localhost:5173 · Backend: http://localhost:3000

## Credenciales demo (solo dev)
- Org slug: `demo`
- Email: `admin@demo.impacta.cl`
- Password: `admin123`

## Endpoints productivos
| Servicio | URL |
|---|---|
| Landing | https://impacta.pinguinoseguro.cl |
| App | https://app-impacta.pinguinoseguro.cl |
| API | https://api-impacta.pinguinoseguro.cl |
| Health | https://api-impacta.pinguinoseguro.cl/health |

## Deploy (fenix)
\`\`\`bash
podman build --network=host -t impacta-backend:latest backend/
podman-compose up -d backend
curl -s -o /dev/null -w "%{http_code}\n" https://api-impacta.pinguinoseguro.cl/health
\`\`\`
(idem para `frontend` y `landing`).

## Tests
\`\`\`bash
cd backend
npm run test           # unit
npm run test:setup     # aplica migraciones en schema "test"
npm run test:e2e       # integración
\`\`\`

## Links
- Plan vivo: [PLAN.md](PLAN.md)
- Guía agentes: [AGENTS.md](AGENTS.md)
- Diseño: [DISENO_IDENTIDAD_VISUAL.md](DISENO_IDENTIDAD_VISUAL.md)
```

**Cleanup adicional (con commits separados):**
1. Revisar `as any` en: [backend/src/modules/donations/donations.service.ts](backend/src/modules/donations/donations.service.ts), [campaigns/campaigns.service.ts](backend/src/modules/campaigns/campaigns.service.ts), [missions/missions.service.ts](backend/src/modules/missions/missions.service.ts), [species/species.service.ts](backend/src/modules/species/species.service.ts) — agregar comentario en una línea: `// Prisma extension inyecta organizationId en runtime (ver prisma-multi-tenant.extension.ts)`.
2. Borrar [backend/prisma/seed.js](backend/prisma/seed.js) si duplica `seed.ts` (verificar con diff antes).
3. DTOs sin validación — `grep -rn "@IsOptional\\|@IsString\\|@IsEmail" backend/src/modules/*/dto/*.ts` — revisar que cada campo tenga al menos un validador.

**AC Fase D4:**
- Un dev nuevo clona, corre los 4 comandos de "Levantar local", hace login en http://localhost:5173 con las credenciales demo, ve datos reales. < 15 min.
- `git grep "as any"` en backend da ≤ 5 matches y todos con comentario que explica el porqué.
- README no contiene placeholders (`<TODO>`, `xxx`, etc.).

---

## 3. Convenciones de ejecución

- **Infra:** siempre `podman build --network=host` (workaround slirp4netns EIDLETIMEOUT). `podman-compose up -d <service>` para deploy incremental.
- **Volúmenes SELinux:** sufijo `:z` en los mounts (ya aplicado).
- **Traefik labels:** copiar el patrón de `landing` en `docker-compose.yml` — router HTTP con middleware `https-redirect@file` + router HTTPS con `tls.certresolver=powerdns`.
- **Nunca** modificar servicios de otros proyectos en el compose global del servidor.
- **Verificar tras cada deploy:** `curl -s -o /dev/null -w "%{http_code}\n" https://<host>` debe dar 200.

---

## 4. Entrypoint para el agente

1. Leer este plan completo.
2. Leer [ARQUITECTURA_TECNICA.md](ARQUITECTURA_TECNICA.md), [DISENO_IDENTIDAD_VISUAL.md](DISENO_IDENTIDAD_VISUAL.md), [Impacta+PRD.md](Impacta+PRD.md) para contexto de producto.
3. Fases A, B, C completas. **Arrancar en D1** según sección 2.
4. Antes de UI (si hay retoques): traer maqueta de Stitch. Antes de DB: revisar el schema actual.
5. Commit por tarea con mensaje `feat(<módulo>): <AC cumplido>` o `test(<módulo>): ...` / `chore(ci): ...` según corresponda.

---

## 5. Handoff a Antigravity (sesión del 2026-04-18)

**Contexto para retomar sin ambigüedad:**

- El usuario prefiere comunicarse **en español siempre** (ver memoria persistente del proyecto).
- **Modo de trabajo:** completo, sin atajos. Si algo no se termina, dejarlo explícito. Confirmar antes de tocar infra.
- **Verificar antes de recomendar archivos/funciones concretas** — memoria y PLAN pueden estar ligeramente desactualizados; el repo es autoridad.

**Checklist de arranque (en este orden):**

1. `git status` — confirmar árbol limpio.
2. `git log --oneline -5` — ver últimos commits; deben incluir `7f9c82b refactor(frontend): wire dashboard pages...` y `576297f fix(backend): align tenant handling...`.
3. `git push origin main` — publicar los 2 commits pendientes. **Confirmar con el usuario antes** (la política de infra aplica también a rama compartida).
4. Verificar stack vivo:
   ```bash
   curl -s -o /dev/null -w "landing: %{http_code}\n" https://impacta.pinguinoseguro.cl
   curl -s -o /dev/null -w "api:     %{http_code}\n" https://api-impacta.pinguinoseguro.cl/health
   curl -s -o /dev/null -w "app:     %{http_code}\n" https://app-impacta.pinguinoseguro.cl
   ```
   Los 3 deben dar 200.
5. Smoke test login (sanity):
   ```bash
   curl -s -X POST https://api-impacta.pinguinoseguro.cl/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@demo.impacta.cl","password":"admin123","orgSlug":"demo"}'
   ```
   Debe devolver `{access_token, refresh_token, user:{organization:{name:"ONG Demo Impacta",...}}}`.
6. Arrancar **D1.1** (unit tests). Ver sub-tareas y AC en sección 2.

**Contexto útil que no está en el código:**

- La extensión multi-tenant (`backend/src/database/prisma-multi-tenant.extension.ts`) inyecta `organizationId` desde `AsyncLocalStorage`. Los services usan `prisma.tenant.<model>.*` (no el Prisma cliente base). Al castear `data: dto as any` en `create(...)` es porque TypeScript aún pide `organizationId` literal pero la extensión lo agrega en runtime. Documentar esto en D4.
- El frontend consume montos como `string` (Prisma `Decimal` serializa a string en JSON). Los componentes envuelven con `Number(x)` en tiempo de render — ver [frontend/src/pages/Campaigns.tsx](frontend/src/pages/Campaigns.tsx) y [Donations.tsx](frontend/src/pages/Donations.tsx).
- `/organizations/me/summary` cuenta solo `status=SUCCEEDED` para donaciones y `status=ACTIVE` para members. No es un bug; es intencional. Documentar en README.
- Hay **un smoke test manual** ya verificado (este archivo lo resume). No hay test automatizado aún — eso es D1.

**Riesgos conocidos:**

- DB de tests: si se reutiliza la DB de dev, los tests pueden contaminarla. Usar schema separado o contenedor dedicado (ver D1).
- Observabilidad: Loki/Grafana corren en fenix pero pertenecen a otros proyectos. **Preguntar al usuario antes de tocar esa stack.** Alternativa segura: dejar logs JSON en stdout y configurar integración después.
- CI: GitHub Actions puede necesitar secretos (DATABASE_URL de test, JWT_SECRET). Usar variables por defecto en el workflow y no secretos reales para tests.
