# Impacta+ — guía raíz para agentes

Plataforma SaaS multi-tenant para ONGs, gestación temprana. Antes de cualquier trabajo no trivial **lee [PLAN.md](PLAN.md)** (fases A→D con criterios de aceptación) y [ARQUITECTURA_TECNICA.md](ARQUITECTURA_TECNICA.md) para el modelo de dominio.

## ⚠️ UN SOLO SISTEMA — UN SOLO DOMINIO (regla #1 — consolidado 2026-08-24)

> 🛑 **ANTI-ALUCINACIÓN (NUNCA INVENTES SUBDOMINIOS):** En sesiones pasadas, varias IAs arruinaron el despliegue al inventar e intentar usar subdominios falsos como , , , , etc. **ESTO ESTÁ ESTRICTAMENTE PROHIBIDO**. Todo (frontend, API, webhooks de pagos) se rutea bajo . Configurar o sugerir despliegues en otros subdominios romperá la aplicación.

**Impacta+ es UN SOLO SISTEMA con 3 capas en un mismo build:** Landing + Front (auth) + Panel de Control de Usuarios. Todo lo usuario-facing vive en **`https://impacta.pinguinoseguro.cl`**:

| Ruta | Qué es |
|---|---|
| `/` | 🌐 **Landing pública** (marketing) — EarthBackground 3D, logo.png, navbar, cards "Ver módulo en acción", demo modal, stats reales |
| `/login`, `/register` | 🔐 Acceso — requiere credenciales |
| `/portal` | 🎁 **Portal Donante** — historial, recibos PDF y recurrencia self-service (desde `integra-insights-competencia`) |
| `/dashboard/*` | 📊 **Panel de Control de Usuarios** — Overview, Members, Donations, Campaigns, Species, Missions (offline-first con IndexedDB + sync), Profile |

Flujo: visitante llega a `/` → se registra o logea en `/login`·`/register` → entra a `/dashboard`. Sin sesión, solo landing. Donantes usan `/portal` con mismo dominio único.

- **Desambiguación obligatoria:** **LandingPage** = componente React en [`frontend/src/pages/LandingPage.tsx`](frontend/src/pages/LandingPage.tsx) (parte del build de `frontend/`). **`landing/`** = proyecto Next.js separado, NO desplegado, conservado como referencia. Nunca uses "landing" y "dashboard" como sinónimos ni mezcles sus responsabilidades — esa confusión causó el desastre del 13-ago (ver más abajo).

## Estructura del monorepo

- [backend/](backend/) — NestJS 11 + Prisma 5 + Postgres. Ver [backend/AGENTS.md](backend/AGENTS.md).
- [landing/](landing/) — Next.js 16 + Tailwind v4. **NO desplegado en producción** (Path A revocado el 16-ago-2026). Conservado solo como referencia de diseño (tokens `@theme` en `app/globals.css`) y wiring real (`DemoRequest`, `public-stats`).
- [frontend/](frontend/) — Vite + React 19 + TanStack Query. **Sirve UN SOLO SISTEMA** (ver regla #1): Landing (`LandingPage.tsx` en `/`) + Front auth (`/login`, `/register`) + Panel de Control de Usuarios (`/dashboard/*`: Overview, Members, Donations, Campaigns, Species, Missions, Profile). Un build → `/var/www/impacta.pinguinoseguro.cl/`.
- [infra/nginx/](infra/nginx/) — copia versionada de la config nginx activa en el server.
- [Impacta+PRD.md](Impacta+PRD.md), [DISENO_IDENTIDAD_VISUAL.md](DISENO_IDENTIDAD_VISUAL.md) — producto y marca.
- [docker-compose.yml](docker-compose.yml) — **solo desarrollo local** (postgres 5435 + redis 6381 + backend). En producción NADA corre en contenedores.

## Design system

"The Digital Steward" — fuente de verdad = **proyecto Google Stitch `4741044715461206908`** (acceso MCP: `mcp__stitch__list_screens`, `get_screen`). ~25 pantallas. Los tokens ya están portados a Tailwind v4 `@theme` en [landing/app/globals.css](landing/app/globals.css) — reutilizarlos tal cual al levantar el frontend.

**Antes de crear/modificar UI:** traer la pantalla con `mcp__stitch__get_screen` y portar con los tokens existentes. No improvisar paleta.

## Infraestructura (servidor fenix — Azure)

**VM Azure `fenix`, Ubuntu 24.04 LTS. Serving edge: nginx directo. Este stack NO usa contenedores en producción.**

> ⚠️ **Nota de nombres (leer con cuidado):** hubo un server antiguo también llamado "Fenix" (pre-2026, ruta `/home/jnovoas/Desarrollo/`) y uno llamado **`fan`** (Rocky/podman, **apagado el 23-ago-2026**, ruta `/home/jnovoas/ONG_Impacta/`). El server ACTUAL es esta VM Azure llamada `fenix`, path `/home/jnovoas/proyectos/ONG_Impacta/`. Cualquier doc que hable de podman rootless, puertos host 5435/6381/3080 o volúmenes SELinux `:z` describe el server fan RETIRADO — ya no aplica.

- Host compartido con **múltiples proyectos en producción** (pinguinoseguro, laespiguita, lotaindomito, micelia, portfolio, transcript). **Regla dura: NO tocar infra existente de otros proyectos.** Solo agregar servicios.
- Wildcard cert `*.pinguinoseguro.cl` (`/etc/letsencrypt/live/pinguinoseguro.cl/`). Cubre un nivel de subdominio — usar `api-impacta.pinguinoseguro.cl` (**no** `api.impacta.pinguinoseguro.cl`).
- **Stack de Impacta en fenix (todo nativo):**
  - PostgreSQL 16 nativo — servicio systemd `postgresql`, escucha `127.0.0.1:5432`, DB `impacta`
  - Redis nativo — servicio systemd `redis-server`, escucha `127.0.0.1:6379`
  - Backend NestJS — servicio systemd **`impacta-backend.service`** (unit file en `/etc/systemd/system/`, user `jnovoas`, WorkingDirectory `~/proyectos/ONG_Impacta/backend`, `EnvironmentFile=~/proyectos/ONG_Impacta/.env`), puerto 3001
  - Frontend — **un solo sistema** servido por nginx desde `/var/www/impacta.pinguinoseguro.cl/` (landing + dashboard); `app-impacta.*` no sirve contenido — solo `301` a `impacta.*`. Nginx hace `proxy_pass http://127.0.0.1:3001` para `/api/`
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
for h in impacta api-impacta; do
  curl -s -o /dev/null -w "$h.pinguinoseguro.cl: %{http_code}\n" -m 5 https://$h.pinguinoseguro.cl/
done
curl -s -o /dev/null -w "app-impacta.pinguinoseguro.cl: %{http_code} (debe ser 301 → impacta.*)\n" -m 5 https://app-impacta.pinguinoseguro.cl/
curl -s https://api-impacta.pinguinoseguro.cl/organizations/public-stats | jq .
```

## Estado actual (2026-08-24 — single system)

- `https://impacta.pinguinoseguro.cl` — **UN SOLO SISTEMA**: landing pública (`LandingPage.tsx` con EarthBackground Three.js, stats reales vía `/api/organizations/public-stats`) + Front auth (`/login`, `/register`) + Panel de Control de Usuarios (`/dashboard/*`: Overview, Members, Donations, Campaigns, Species, Missions, Profile). Un build → `/var/www/impacta.pinguinoseguro.cl/`.
- `https://app-impacta.pinguinoseguro.cl` — **no sirve contenido**, solo `301 → https://impacta.pinguinoseguro.cl` (legado para bookmarks/DNS viejos). No agregar funcionalidad ahí — es un solo sistema, no dos.
- `https://api-impacta.pinguinoseguro.cl` — backend NestJS 11 corriendo como `impacta-backend.service`. Nota: `/health` responde 404 actualmente (endpoint no existe en el código pese a menciones históricas).
- Producción quedó sincronizada con `origin/main` durante la migración del 23-ago-2026 y consolidación a dominio único del 24-ago-2026 (verificado: `301` para app-impacta, bundle desplegado = build de main).

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

### Workflow correcto para arrancar trabajo

```bash
# 1. Sincronizar (estamos EN el server de producción)
git pull origin main

# 2. Rama de feature DESDE main
git checkout -b feat/<scope>

# 3. Al terminar: PR contra main, merge, push a origin,
#    luego deploy con ./deploy.sh frontend|backend y verificar
```

Si encuentras docs desfasados (como pasó aquí con "Rocky 9" → "Rocky 10.2", "Servidor Fenix" → "Servidor fan"), arréglalos en commits surgicales — **no reescribas masivamente el archivo**.
