# Impacta+ — Plan de trabajo (hand-off a Antigravity)

Documento autosuficiente: cualquier agente puede recoger este plan sin depender del historial de Claude.

> **Extensión estratégica 25-ago-2026:** la planificación completa de identidad
> comunitaria, catálogo científico, red de profesionales, oportunidades,
> mensajería cifrada, periodismo ciudadano, runtime Sentinel y cerebro IA
> API→Qwen local está en
> [`docs/PLAN_MAESTRO_CEREBRO_OPERATIVO_REGIONAL.md`](docs/PLAN_MAESTRO_CEREBRO_OPERATIVO_REGIONAL.md).
> Sus fases y gates complementan este backlog; no autorizan despliegues o cambios
> de infraestructura sin confirmación.

---

## 0. Estado actual (2026-08-24)

**Infra:** servidor **`fenix`**, VM **Azure** con Ubuntu 24.04 LTS. Serving edge: nginx directo. **Stack 100% nativo — NADA corre en contenedores en producción.** Wildcard `*.pinguinoseguro.cl` (`/etc/letsencrypt/live/pinguinoseguro.cl/`). **NO TOCAR infra existente** de los otros proyectos del server (pinguinoseguro, laespiguita, lotaindomito, micelia, portfolio, transcript). Solo agregar servicios. Ver [AGENTS.md](AGENTS.md) sección Infraestructura para el patrón de serving.

> Historia: el stack vivió antes en un VM llamada `fan` (Rocky + podman rootless), **apagada el 23-ago-2026**. La migración a fenix cambió el runtime: postgres/redis nativos vía systemd, backend como proceso node bajo systemd. Todo lo que mencione podman/compose en producción está obsoleto.

**Stack:**
- `backend/` — NestJS 11 + Prisma 5 + class-validator. Global `ValidationPipe`. Expuesto en `https://impacta.pinguinoseguro.cl/api` (nginx `proxy_pass` al servicio systemd `impacta-backend.service` escuchando en `127.0.0.1:3001`).
- `landing/` — Next.js 16.2.4 (standalone) + Tailwind v4 + Manrope/Inter. **NO desplegado en producción desde `1380fb9`.** El código se conserva en el repo como referencia (incluye el wiring real: `DemoRequest` POST, `public-stats` fetch, `DemoModal` con focus trap + scroll lock). Path A (deploy Next.js en `impacta.pinguinoseguro.cl`) fue revocado por el usuario: degradaba visualmente el sitio (sin Three.js EarthBackground, sin `logo.png`, sin navbar completa).
- `frontend/` — Vite + React 19. **UN SOLO dominio usuario-facing: `https://impacta.pinguinoseguro.cl`:**
  - `/` — landing pública (`LandingPage.tsx`) con `EarthBackground` (Three.js), `logo.png`, navbar, module cards con "Ver módulo en acción", demo modal (POST a `/api/demo-requests`, dedup 5min/email), stats bar con datos REALES desde `/api/organizations/public-stats`. Sin sesión solo se ve esto.
  - `/login`, `/register` — acceso; tras autenticar se entra a la app.
  - `/dashboard/*` — Overview, Members, Donations, Campaigns, Species, Missions, Organization Profile.
  - `impacta.pinguinoseguro.cl` quedó como legado: el SPA (`LegacyDomainRedirect` en `App.tsx`) redirige todo su tráfico a `impacta.*`.
  - Mismo build estático (`npm run build` → `dist/`), copiado a `/var/www/impacta.pinguinoseguro.cl/` y servido por nginx.
- **PostgreSQL 16 NATIVO** (systemd `postgresql`, `127.0.0.1:5432`), DB `impacta`. Migraciones aplicadas (incluida `20260816190000_add_demo_requests`). **Redis NATIVO** (systemd `redis-server`, `127.0.0.1:6379`).
- [docker-compose.yml](docker-compose.yml) queda **solo para desarrollo local** fuera del server.
- **Prisma schema:** 8 modelos — `Organization`, `User`, `Member`, `Donation`, `Campaign`, `Species`, `Mission`, `MissionTask`.
- **MinIO storage service** integrado para upload de imágenes (species).

**Módulos backend existentes y su estado:**
- ✅ `organizations` — CRUD completo + `findBySlug` + `getSummary` + `publicStats`
- ✅ `users` — CRUD de usuarios con roles (`SUPERADMIN`, `ADMIN`, `OPERATOR`, `VIEWER`)
- ✅ `members` — CRUD de socios/voluntarios con validación RUT chileno
- ✅ `donations` — Gestión de donaciones (PENDING → SUCCEEDED por callback)
- ✅ `campaigns` — Campañas de recaudación con meta y progreso
- ✅ `species` — Biblioteca de especies con upload a MinIO
- ✅ `missions` — Misiones de campo con subtasks (`MissionTask`)
- ✅ `auth` — JWT + bcrypt, login por email + orgSlug, refresh token
- ✅ `storage` — Servicio MinIO con `getFileStream`
- ✅ `demo-requests` — Lead form público del landing (sin tenant, sin auth). Endpoint `POST /api/demo-requests` con dedup de 5 min por email. Endpoint `GET /demo-requests` protegido por `@Roles`. Schema dedicado: `DemoRequest { id, name, email, org, phone?, message?, status: NEW|CONTACTED|REJECTED, createdAt }` con índice en `(email, createdAt)`.

**Módulos backend NO implementados (si existen):** revisar `ls src/modules/`

---

## 0.5 Source of truth y reglas duras (anti-patrones)

> **Esta sección es load-bearing.** Documenta un desastre específico del 13-ago-2026 que destruyó meses de trabajo y la regla que se codificó tras él. **Leer antes de cualquier operación no trivial.**

### El desastre

En el commit `af06edb` (mensaje: *"revert: restore original 3D EarthBackground, Dashboard and repo state from 8ba8bec"*) un agente revirtió el repo al estado del commit `8ba8bec` (abril 2026), bajo el supuesto de que era "el estado bueno". **Pero `8ba8bec` no contenía la landing Next.js** — esa se agregó el mismo día, en commits posteriores a `8ba8bec`. El revert borró:

- La landing completa (`landing/src/app/*`, `landing/Dockerfile`, `landing/next.config.ts`, etc.).
- Decenas de archivos del backend a un estado pre-multi-tenant.
- Documentación que ya estaba corregida.

Después, varios agentes修复 parcialmente moviendo el LandingPage al frontend React y agregando `public-stats`. El estado vivo quedó en el servidor pero **nunca se mergeó de vuelta a `origin/main`** de forma coherente.

### La regla

**El estado de producción es el repo en este mismo server (`fenix`, `/home/jnovoas/proyectos/ONG_Impacta/`) sincronizado con `origin/main`**, más lo desplegado en `/var/www/impacta.pinguinoseguro.cl/`. Cualquier rama de recovery se basa en `origin/main`, nunca en un commit histórico "que parece bueno".

> Histórico: esta regla decía "`fan/main` ES el estado de producción" y mandaba a hacer `git fetch fan main`. **fan fue apagado el 23-ago-2026** — esas instrucciones ya no aplican; ahora trabajamos directamente en el server.

Workflow correcto:
```bash
# Antes de proponer CUALQUIER cambio destructivo / recovery / rebase:
git status                          # ¿repo limpio y sincronizado con origin?
git log origin/main..HEAD           # ¿hay commits locales sin pushear?
# Verificar producción: bundle de /var/www vs build actual, systemctl status impacta-backend

# Si vas a "restaurar" algo: el baseline es origin/main + lo desplegado, NUNCA un commit anterior.
# Si docs y código están desfasados: arreglar en commits quirúrgicos, no reescritura masiva.
```

### Por qué se preservan las menciones a "Fenix" en AGENTS.md/PLAN.md

Las dos referencias explícitas a "Fenix" en estos archivos son **advertencias intencionales** ("No confundir con el antiguo servidor Fenix — esa infra ya no existe" y "NO usar redes externas tipo proxy ni labels traefik — eso era del server Fenix"). Están preservadas verbatim para que un agente futuro que aterrice sin contexto no reintroduzca traefik o use rutas del server fenix viejo (`/home/jnovoas/Desarrollo/`). **No las "limpies" sin reemplazarlas con un test que verifique que el lector las va a entender igual.**

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

### Fase C — Frontend app (consolidada en dominio único — 24-ago-2026)

> **Nota:** esta fase fue planificada cuando el diseño era multi-dominio. Desde el
> 24-ago-2026 rige la regla #1: UN SOLO SISTEMA en `impacta.pinguinoseguro.cl`;
> Todo vive bajo `https://impacta.pinguinoseguro.cl`.

**Pre-requisitos cumplidos:**
- Backend expuesto en `/api` bajo `impacta.pinguinoseguro.cl` ✅
- Frontend desplegado en `impacta.pinguinoseguro.cl` (landing + auth + dashboard, un build) ✅
- CORS configurado ✅

**C1. Aplicar diseño al frontend (prioridad alta)**
- El frontend tiene páginas funcionales pero sin diseño visual. Portar el design system desde Stitch para cada pantalla:
  1. `Login` — buscar screen "Login" en Stitch
  2. `Overview` (Dashboard) — KPIs visuales con datos reales
  3. `Members list + detail`
  4. `Donations list + create`
  5. `Campaigns`
  6. `Species library`
  7. `Missions`
  8. `Settings / Organization profile`
- Para cada pantalla: `mcp__stitch__get_screen` → HTML → componente React que consume API del backend. Reutilizar tokens, no crear variantes de color.
- Portar tokens de diseño desde `landing/app/globals.css` a `frontend/src/index.css` (mismo `@theme`).

**C2. Mejorar landing page**
- ✅ Hero stats conectados al backend (`publicStats`)
- ⚠️ Revisar si hay secciones maquetadas/hardcoded restantes (features, modules cards están estáticas)
- Sección "Live Impact Feature Highlight" tiene mockup falso (ventana simulada) — podría reemplazarse por captura real del dashboard o componente interactivo real

### Fase D — Pulido (en curso)

- **D1.** Tests: E2E para auth y CRUDs principales (`@nestjs/testing` + supertest)
- **D2.** CI GitHub Actions: lint + build + test en cada PR
- **D3.** Observabilidad: logs estructurados con pino, integración Grafana/Loki
- **D4.** README operativo en raíz

### Bloqueantes futuros

- Integración real con pasarela de pago (ImpactaPay) — actualmente mock
- Sistema de notificaciones (emails, webhooks)
- Analytics/BI para dashboards de impacto
- Multi-language (i18n)

---

## 3. Convenciones de ejecución

- **Infra:** siempre `podman build --network=host` (workaround slirp4netns EIDLETIMEOUT). `podman-compose up -d <service>` para deploy incremental.
- **Volúmenes SELinux:** sufijo `:z` en los mounts (ya aplicado).
- **Sin traefik.** Para agregar un servicio nuevo: si es frontend estático, publicar el `dist/` al host y agregar server block nginx. Si es servicio con runtime, publicar puerto al host en compose y agregar `proxy_pass http://127.0.0.1:<puerto>` en nginx. NO usar labels traefik ni redes externas — eso es vestigio del server Fenix. **Elegir puerto host libre** (3000 está ocupado por `pinguinoseguro-web` en el server fan).
- **Nunca** modificar servicios de otros proyectos en el compose global del servidor.
- **Verificar tras cada deploy:** `curl -s -o /dev/null -w "%{http_code}\n" https://<host>` debe dar 200.
- **Convención de commits:** `feat(<módulo>): <descripción>` / `fix(...)` / `chore(...)`. Scope = módulo NestJS o `landing`, `frontend`, `infra`, `docs`.

---

## 4. Entrypoint para el agente

1. Leer este plan completo.
2. Leer [ARQUITECTURA_TECNICA.md](ARQUITECTURA_TECNICA.md), [DISENO_IDENTIDAD_VISUAL.md](DISENO_IDENTIDAD_VISUAL.md), [Impacta+PRD.md](Impacta+PRD.md) para contexto de producto.
3. El backend está completo — siguiente foco es **aplicar diseño al frontend** (Fase C1) siguiendo Stitch.
4. Antes de UI: traer maqueta de Stitch. Commit por tarea con mensaje `feat(<módulo>): <AC cumplido>`.
