# Impacta+ — guía raíz para agentes

Plataforma SaaS multi-tenant para ONGs, gestación temprana. Antes de cualquier trabajo no trivial **lee [PLAN.md](PLAN.md)** (fases A→D con criterios de aceptación) y [ARQUITECTURA_TECNICA.md](ARQUITECTURA_TECNICA.md) para el modelo de dominio.

## ⚠️ UN SOLO SISTEMA — UN SOLO DOMINIO (regla #1 — consolidado 2026-08-24)

> 🛑 **ANTI-ALUCINACIÓN (NUNCA INVENTES SUBDOMINIOS):** En sesiones pasadas, varias IAs arruinaron el despliegue al inventar e intentar usar subdominios falsos. **ESTO ESTÁ ESTRICTAMENTE PROHIBIDO**. Todo (frontend, API, webhooks de pagos) se rutea bajo **`https://impacta.pinguinoseguro.cl`**. Configurar o sugerir despliegues en otros subdominios romperá la aplicación.

**Impacta+ es UN SOLO SISTEMA con 3 capas en un mismo build:** Landing + Front (auth) + Panel de Control de Usuarios. Todo lo usuario-facing vive en **`https://impacta.pinguinoseguro.cl`**:

| Ruta | Qué es |
|---|---|
| `/` | 🌐 **Landing pública** (marketing) — EarthBackground 3D, logo.png, navbar, cards "Ver módulo en acción", demo modal, stats reales |
| `/login`, `/register` | 🔐 Acceso — requiere credenciales |
| `/portal` | 🎁 **Portal Donante** — historial, recibos PDF y recurrencia self-service |
| `/dashboard/*` | 📊 **Panel de Control de Usuarios** — Overview, Members, Donations, Campaigns, Species, Missions (offline-first con IndexedDB + sync), Profile |

Flujo: visitante llega a `/` → se registra o logea en `/login`·`/register` → entra a `/dashboard`. Sin sesión, solo landing. Donantes usan `/portal` con mismo dominio único.

- **Desambiguación obligatoria:** **LandingPage** = componente React en [`frontend/src/pages/LandingPage.tsx`](frontend/src/pages/LandingPage.tsx) (parte del build de `frontend/`). **`landing/`** = proyecto Next.js separado, NO desplegado, conservado como referencia. Nunca uses "landing" y "dashboard" como sinónimos ni mezcles sus responsabilidades — esa confusión causó el desastre del 13-ago.

## Estructura del monorepo

- [backend/](backend/) — NestJS 11 + Prisma 5 + Postgres. Ver [backend/AGENTS.md](backend/AGENTS.md).
- [landing/](landing/) — Next.js 16 + Tailwind v4. **NO desplegado en producción** (Path A revocado el 16-ago-2026). Conservado solo como referencia de diseño (tokens `@theme` en `app/globals.css`) y wiring real (`DemoRequest`, `public-stats`).
- [frontend/](frontend/) — Vite + React 19 + TanStack Query. **Sirve UN SOLO SISTEMA** (ver regla #1): Landing (`LandingPage.tsx` en `/`) + Front auth (`/login`, `/register`) + Panel de Control de Usuarios (`/dashboard/*`). Un build → `/var/www/impacta.pinguinoseguro.cl/`.
- [infra/nginx/](infra/nginx/) — copia versionada de la config nginx activa en el server.
- [Impacta+PRD.md](Impacta+PRD.md), [DISENO_IDENTIDAD_VISUAL.md](DISENO_IDENTIDAD_VISUAL.md) — producto y marca.
- [docker-compose.yml](docker-compose.yml) — **solo desarrollo local** (postgres 5435 + redis 6381 + backend). En producción NADA corre en contenedores.

## Design system

"The Digital Steward" — fuente de verdad = **proyecto Google Stitch `4741044715461206908`** (acceso MCP: `mcp__stitch__list_screens`, `get_screen`). ~25 pantallas. Los tokens ya están portados a Tailwind v4 `@theme` en [landing/app/globals.css](landing/app/globals.css) — reutilizarlos tal cual al levantar el frontend.

**Antes de crear/modificar UI:** traer la pantalla con `mcp__stitch__get_screen` y portar con los tokens existentes. No improvisar paleta.

## Infraestructura (servidor fenix — Azure)

**VM Azure `fenix`, Ubuntu 24.04 LTS. Serving edge: nginx directo. Este stack NO usa contenedores en producción.**

> 🛡️ **Requisito Sentinel (25-ago-2026):** toda instancia productiva de
> Impacta+ debe ejecutarse sobre un nodo administrado por Sentinel. `fenix` es
> el nodo de referencia y tiene activos Cortex, setup eBPF, Verifier y agentes
> Sentinel. Sentinel protege el host; Impacta+ conserva autorización tenant,
> privacidad y decisiones de negocio. Un deploy normal de Impacta+ **NO debe
> actualizar, reiniciar ni reconfigurar Sentinel**. Ver
> [`docs/ARQUITECTURA_DESPLIEGUE_SOBRE_SENTINEL.md`](docs/ARQUITECTURA_DESPLIEGUE_SOBRE_SENTINEL.md).

> ⚠️ **Nota de nombres:** hubo un server antiguo también llamado "Fenix" (pre-2026, ruta `/home/jnovoas/Desarrollo/`) y uno llamado **`fan`** (Rocky/podman, **apagado el 23-ago-2026**, ruta `/home/jnovoas/ONG_Impacta/`). El server ACTUAL es esta VM Azure llamada `fenix`, path `/home/jnovoas/proyectos/ONG_Impacta/`. Cualquier doc que hable de podman rootless, puertos host 5435/6381/3080 o volúmenes SELinux `:z` describe el server fan RETIRADO — ya no aplica.

- Host compartido con **múltiples proyectos en producción** (pinguinoseguro, laespiguita, lotaindomito, micelia, portfolio, transcript). **Regla dura: NO tocar infra existente de otros proyectos.** Solo agregar servicios.
- Wildcard cert `*.pinguinoseguro.cl` (`/etc/letsencrypt/live/pinguinoseguro.cl/`). Cubre un nivel de subdominio. **NO usar subdominios para Impacta+.**
- **Stack de Impacta en fenix (todo nativo):**
  - PostgreSQL 16 nativo — servicio systemd `postgresql`, escucha `127.0.0.1:5432`, DB `impacta`
  - Redis nativo — servicio systemd `redis-server`, escucha `127.0.0.1:6379`
  - Backend NestJS — servicio systemd **`impacta-backend.service`** (unit file en `/etc/systemd/system/`, user `jnovoas`, WorkingDirectory `~/proyectos/ONG_Impacta/backend`, `EnvironmentFile=~/proyectos/ONG_Impacta/.env`), puerto 3001
  - Frontend — **un solo sistema** servido por nginx desde `/var/www/impacta.pinguinoseguro.cl/` (landing + dashboard). Nginx hace `proxy_pass http://127.0.0.1:3001` para `/api/`.
- Configuración nginx activa: `/etc/nginx/conf.d/impacta.pinguinoseguro.cl.conf` (copia versionada en [infra/nginx/](infra/nginx/)).

## Comandos base

```bash
# Deploy de frontend (sirve landing Y dashboard — mismo build)
./deploy.sh frontend

# Deploy de backend (build + restart del servicio systemd)
./deploy.sh backend

# Verificación post-deploy
./deploy.sh verify
```

Verificación manual rápida:
```bash
systemctl status impacta-backend.service
curl -s -o /dev/null -w "impacta.pinguinoseguro.cl: %{http_code}\n" -m 5 https://impacta.pinguinoseguro.cl/
curl -s https://impacta.pinguinoseguro.cl/api/organizations/public-stats | jq .
```

## Estado actual (2026-08-25 — post-forense sabotaje)

- `https://impacta.pinguinoseguro.cl` — **UN SOLO SISTEMA**: landing pública (`LandingPage.tsx` con EarthBackground Three.js, stats reales vía `/api/organizations/public-stats`) + Front auth (`/login`, `/register`) + Panel de Control de Usuarios (`/dashboard/*`). Un build → `/var/www/impacta.pinguinoseguro.cl/`.
- `https://impacta.pinguinoseguro.cl/api` — backend NestJS 11 corriendo como `impacta-backend.service`.
- Producción sincronizada con `origin/main` (migración 23-ago, consolidación dominio único 24-ago, forense+fixes 25-ago).
- **DNS limpio (25-ago):** los registros fantasma `api-impacta` y `app-impacta` fueron eliminados de la zona BIND `db.pinguinoseguro.cl` en fenix. Ya no resuelven (NXDOMAIN) — no hay nada que redirigir.
- **Bug del RUT parchado (25-ago, commit `76277a5`):** `af06edb` borró la normalización `rut.replace(/\./g,'')` del validador; producción rechazaba con 400 todo member con RUT con puntos (formato chileno estándar) durante 11 días. Fix deployado.
- **Migración parchada (25-ago, commit `bf4356f`):** `20260824171000_add_p2p_and_subscriptions` contenía DDL destructivo contra tablas fantasma (`Event`, `Membership`) de la migración `20260824130000_add_events_tickets` — aplicada a prod pero descartada del repo. Parchada con `IF EXISTS` para que DBs frescas (CI/recovery) funcionen.
- **e2e suite restaurada (25-ago, commit `cbbabaa`):** `backend/test/` fue borrado en `9daacaa` (rama P2P). Los e2e son la única prueba automatizada del aislamiento multi-tenant — no borrarlos de nuevo.
- **Rama `recover/events-volunteer-shifts`** (25-ago): ancla los commits huérfanos `ccfa1ad`+`05510c8`+`2911371` descartados por un reset del 24-ago (~4000 líneas de Events/VolunteerShifts). Listos para fusionar cuando se quiera esa feature.

## Convenciones de commits

`feat(<módulo>): <descripción>` / `fix(...)` / `chore(...)`. Scope = módulo NestJS, o `landing`, `frontend`, `infra`, `docs`.

## Al operar como agente

- Verifica lo que dice la memoria contra el repo actual antes de recomendar archivos/funciones concretas — pueden haber cambiado.
- Ejecución de tareas: completas, no atajos. El usuario ha pedido explícitamente "no me simplifiques cosas".
- Cambios en infra/compose/servicios visibles: confirmar antes de aplicar.
- **Lección 16-ago-2026 (Path A revert):** nunca reemplaces un diseño más rico con uno más pobre. El frontend React tiene `EarthBackground` (Three.js), `logo.png`, navbar con Inicio/Módulos/Impacto Vivo, cards con "Ver módulo en acción", modal con logo, footer con imagen. El Next.js landing genérico NO tiene nada de eso. Si una decisión arquitectural ("Path A: deploy Next.js") requiere borrar elementos visuales visibles (animaciones, branding, secciones), **parar y consultar al usuario**.

## Source of truth y anti-patrones (leer antes de operar)

**El estado de producción es este mismo server (`fenix`)**: el repo en `/home/jnovoas/proyectos/ONG_Impacta/` sincronizado con `origin/main`, más lo que esté desplegado en `/var/www/impacta.pinguinoseguro.cl/` y corriendo como `impacta-backend.service`. Cualquier rama que propongas debe basarse en `origin/main`.

> El server anterior `fan` fue **apagado el 23-ago-2026** y con él desapareció su remote `fan`/`fan main`. Las instrucciones históricas `git fetch fan main` **ya no son ejecutables ni necesarias**: ahora se trabaja DESDE el propio server.

### El desastre del 13-ago-2026 (contexto, NO repetir)

En esa fecha un commit `af06edb` ("revert: restore original 3D EarthBackground, Dashboard and repo state from 8ba8bec") borró la landing completa y revirtió docenas de archivos del backend. Estuvo mal etiquetado porque `8ba8bec` no contenía la landing Next.js — esa se agregó el mismo día en `06f8e33`. El revert borró trabajo bueno de meses y nunca fue intencional. La causa raíz de fondo: **el agente confundió la landing pública con el dashboard** (ver regla #1 arriba).

### Reglas duras (codificadas tras ese desastre)

1. **NUNCA uses un commit pre-desastre como baseline de un recovery.** El baseline correcto SIEMPRE es `origin/main`, y antes de cualquier reset verifica qué hay desplegado en producción (bundle de `/var/www/` vs build de main, `systemctl status impacta-backend`).
2. **NUNCA reescribas docs correctos con info de un commit más viejo.** Las menciones históricas a "Fenix"/"fan"/"traefik"/podman en este archivo son advertencias preservadas a propósito para explicar DE DÓNDE venimos. No las borres sin actualizar el contexto.
3. **Antes de cualquier revert destructivo o rebase de historia:** exponer el plan completo y pedir confirmación. Un revert masivo califica como cambio de infra visible.
4. **El servidor actual es `fenix`** (Azure, Ubuntu 24.04, stack nativo + nginx), path `/home/jnovoas/proyectos/ONG_Impacta/`. NO confundir con el fenix histórico pre-2026 (`/home/jnovoas/Desarrollo/`) ni con `fan` (apagado 23-ago-2026).

### Lecciones 25-ago-2026 (forense post-sabotaje)

Tras auditar el historial completo de git + reflog + DNS + DB de producción, se confirmaron y repararon daños que las IAs anteriores dejaron silenciados. Reglas derivadas:

1. **Siempre revisa `git reflog`** ante trabajo que "debería existir y no está". Un `reset` del 24-ago descartó 3 commits (~4000 líneas: Events, VolunteerShifts, opencode skills) sin dejar rastro en `git log`. Los dangling commits sobreviven ~90 días antes del GC — rescátalos a una rama.
2. **Verifica que commits `feat(X)` no toquen archivos fuera de X.** El commit `40873de` ("feat(prisma): modelos P2P") eliminó silenciosamente el bloque nginx 301, `LegacyDomainRedirect` en App.tsx, líneas de AGENTS.md y checks de `deploy.sh verify` — todo fuera del scope anunciado. Este patrón de "commit camuflado" es el sabotaje más insidioso.
3. **`prisma migrate deploy` en una DB de scratch es test canario de drift.** La migración `20260824130000` se aplicó a prod pero fue descartada del repo; la siguiente migración diffó contra tablas fantasma y generó DDL que revienta cualquier DB fresca (CI, recovery, nuevo dev). Si una migración referencia tablas que no existen en migraciones previas del repo, **para y verifica**.
4. **Los e2e de aislamiento multi-tenant no se borran; se reparan.** `af06edb` borró la normalización del RUT; el validador rechazaba el formato chileno estándar con puntos. Ningún agente lo detectó en 11 días porque los e2e (única red de seguridad) estaban borrados. Restaurarlos destapó el bug en minutos.

### Workflow correcto para arrancar trabajo

```bash
# 1. Sincronizar (estamos EN el server de producción)
git pull origin main

# 2. Rama de feature DESDE main
git checkout -b feat/<scope>

# 3. Al terminar: PR contra main, merge, push a origin,
#    luego deploy con ./deploy.sh frontend|backend y verificar
```

Si encuentras docs desfasados, arréglalos en commits quirúrgicos — **no reescribas masivamente el archivo**.
