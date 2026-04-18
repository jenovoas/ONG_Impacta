# Impacta+ — Plan de trabajo (hand-off a Antigravity)

Documento autosuficiente: cualquier agente puede recoger este plan sin depender del historial de Claude.

---

## 0. Estado actual (2026-04-17)

**Infra:** servidor compartido `fenix` (Rocky 9, podman rootless). Traefik v3 con `proxy` network externa, wildcard `*.pinguinoseguro.cl` vía `powerdns` DNS-01. **NO TOCAR infra existente** de los otros proyectos (sentinel, pinguinoseguro, laespiguita, portfolio, minio). Solo agregar servicios.

**Stack:**
- `backend/` — NestJS 11 + Prisma 5 + class-validator. Global `ValidationPipe`. Expuesto solo internamente en `impacta-backend:3001`.
- `landing/` — Next.js 16.2.4 (standalone) + Tailwind v4 + Manrope/Inter. **Desplegado** en `https://impacta.pinguinoseguro.cl` con diseño "Digital Steward / New Identity 2026" aplicado.
- `frontend/` — Vite + React 19 (scaffold default, sin diseño aplicado). Será la app `app.impacta.pinguinoseguro.cl`.
- `docker-compose.yml` — servicios `postgres` (puerto 5435), `redis` (6381), `backend` (solo red interna), `landing` (traefik labels + https-redirect + wildcard cert).
- **Prisma schema:** modelos `Organization`, `User`, `Member`. DB corriendo, migraciones pendientes de generar.

**Módulos backend existentes:** `organizations` (CRUD básico con DTO tipado). Nada más.

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

### Fase D — Pulido

- **D1.** Tests: `@nestjs/testing` unit + supertest e2e para auth y un CRUD completo.
- **D2.** CI GitHub Actions: lint + build + test en cada PR.
- **D3.** Observabilidad: integrar backend con el Grafana/Loki del servidor (ver sentinel docs). Logs estructurados con pino.
- **D4.** README operativo en la raíz con: cómo levantar local, cómo desplegar, endpoints disponibles.

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
3. Empezar por **A1** y avanzar en orden. No saltar fases.
4. Antes de UI: traer maqueta de Stitch. Antes de DB: revisar el schema actual.
5. Commit por tarea con mensaje `feat(<módulo>): <AC cumplido>`.
