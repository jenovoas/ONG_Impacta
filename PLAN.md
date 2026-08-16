# Impacta+ — Plan de trabajo (hand-off a Antigravity)

Documento autosuficiente: cualquier agente puede recoger este plan sin depender del historial de Claude.

---

## 0. Estado actual (2026-08-16)

**Infra:** servidor compartido `fan` (Rocky 10.2 (Red Quartz), podman rootless). Serving edge: nginx directo (sin traefik). Wildcard `*.pinguinoseguro.cl` vía certbot + DNS-01 PowerDNS. **NO TOCAR infra existente** de los otros proyectos (pinguinoseguro, laespiguita, lotaindomito, micelia). Solo agregar servicios. Ver [AGENTS.md](AGENTS.md) sección Infraestructura para el patrón de serving.

**Stack:**
- `backend/` — NestJS 11 + Prisma 5 + class-validator. Global `ValidationPipe`. Expuesto en `https://api-impacta.pinguinoseguro.cl` (nginx `proxy_pass` al contenedor `impacta-backend` en `127.0.0.1:3001`).
- `landing/` — Next.js 16.2.4 (standalone) + Tailwind v4 + Manrope/Inter. **Desplegado** en `https://impacta.pinguinoseguro.cl` con diseño "Digital Steward / New Identity 2026" aplicado. Stats hero bar conectadas al backend (`GET /organizations/public-stats`).
- `frontend/` — Vite + React 19. **Pantallas implementadas**: Login, Overview (Dashboard), Members, Donations, Campaigns, Species, Missions, Organization Profile. Consume API real (`app-impacta.pinguinoseguro.cl` servido por nginx como estáticos desde `/var/www/impacta.pinguinoseguro.cl/`). Sin diseño visual aplicado aún — solo scaffold funcional.
- `docker-compose.yml` — servicios `postgres` (puerto 5435), `redis` (6381), `backend` (puerto 3001 publicado al host), `landing` (puerto 3080 publicado al host → 3000 interno, nginx `proxy_pass`). **El frontend NO es un servicio del compose**: se construye estático con `npm run build` y el `dist/` se copia manualmente a `/var/www/impacta.pinguinoseguro.cl/` para que nginx lo sirva en `app-impacta.pinguinoseguro.cl`.
- **Prisma schema:** 8 modelos — `Organization`, `User`, `Member`, `Donation`, `Campaign`, `Species`, `Mission`, `MissionTask`. DB corriendo, migraciones aplicadas.
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

**Fases A y D completas.** Ver log de commits reciente.

**Módulos backend NO implementados (si existen):** revisar `ls src/modules/`

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

### Fase C — Frontend app (`app-impacta.pinguinoseguro.cl`)

**Pre-requisitos cumplidos:**
- Backend expuesto en `api-impacta.pinguinoseguro.cl` ✅
- Frontend desplegado en `app-impacta.pinguinoseguro.cl` ✅
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
