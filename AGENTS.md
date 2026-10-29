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

"The Digital Steward" — el proyecto de Google Stitch `4741044715461206908` es el prototipo visual inicial, no la fuente permanente de verdad. Para el trabajo posterior, la referencia es el frontend React actual; sus tokens viven en [frontend/src/index.css](frontend/src/index.css). El proyecto Next.js de `landing/` se conserva como referencia de diseño y no está desplegado.

**Antes de crear o modificar la UI:** revisar la pantalla existente y reutilizar los tokens y patrones de interacción del frontend actual. Consultar Stitch como referencia visual cuando aporte valor, sin reemplazar ni degradar el trabajo vigente para imitar el primer prototipo.

**Pulido visual no significa simplificar ni recortar trabajo existente.** Conserva las secciones, el contenido, las interacciones y la riqueza visual que ya tiene cada pantalla; mejora jerarquía, adaptación a tamaños, accesibilidad y consistencia sin reemplazar componentes completos por versiones más pobres. Si una parte contiene datos falsos o una acción que aún no funciona, corrige ese problema de forma explícita y conserva la intención y presencia de la sección cuando sea posible. Antes de retirar una función o sección útil, consulta al usuario.

## Infraestructura y Separación de Seguridad (Kingu - Edge / Fenix - Backend)

Por principios estrictos de seguridad y aislamiento, **el Frontend y el Backend están completamente separados física y lógicamente**:

1. **Host de Borde y Frontend público (`kingu` — `64.176.8.191` / `10.88.0.2`):**
   - **Frontend:** SPA Vite + React 19 servida como archivos estáticos puros desde `/var/www/impacta.pinguinoseguro.cl/`. No ejecuta Node.js ni tiene acceso a base de datos, secretos (`.env`) ni código de backend.
   - **SSL/TLS:** Gestionado por Certbot/Let's Encrypt para `impacta.pinguinoseguro.cl`.
   - **Reverse Proxy:** Nginx enruta `/api/` hacia el backend en Fenix (`http://10.88.0.1:3102/`) a través del enlace privado WireGuard (`10.88.0.0/24`). Configuración en `/etc/nginx/conf.d/impacta.pinguinoseguro.cl.conf` (copia versionada en `infra/nginx/`).

2. **Host de Cómputo y Datos (`fenix` — `10.88.0.1`):**
   - **Backend:** Proceso NestJS en contenedor Docker (`impacta-backend`), escuchando en el puerto privado de host `10.88.0.1:3102` (`3101` interno).
   - **Datos:** PostgreSQL 16 (`impacta-db:5435`) y Redis 7 (`impacta-redis:6381`) en contenedores propios aislados.
   - **Secretos:** `.env` privado en Fenix (con `JWT_SECRET` y credenciales de BD); nunca se sincroniza hacia Kingu.

## Comandos base

```bash
# Deploy de frontend (compila SPA y sincroniza con rsync a Kingu /var/www/...)
./deploy.sh frontend

# Migraciones (contenedor backend en Fenix; requiere .env local con JWT_SECRET)
./deploy.sh migrate

# Deploy de backend (build + up del stack docker en Fenix puerto 3102)
./deploy.sh backend

# Verificación post-deploy (comprueba backend local y endpoints HTTPS públicos)
./deploy.sh verify
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

## Estado actual (2026-10-21 — merges + deploy parcial)

- `main` = `1a73832`: fusionadas `feat/frontend-login-polish` (`8e338d8`, pulido pantallas + Logger/Loki), `chore-direnv-envrc` (`aa872bd`, solo `.envrc`) y `origin/feat/campanas-p2p` (`1a73832`, P2P + suscripciones + community + ai-security + ai-gateway + knowledge RAG). Ramas `frontend-login-polish` y `feat/auth-polish-oauth` (vacía, 0 ahead) eliminadas. Conflictos resueltos: páginas/App con polish de main, `app.module.ts` combinado, e2e lado p2p (`db.base` ya no existe en `DatabaseService`), `.env.example` Loki+OmniRoute.
- **Frontend desplegado 21-oct:** build fresco en `frontend/dist` servido por nginx (`/` y `/login` 200 con SNI correcto).
- **Nginx 21-oct:** agregado `location /api/ → 127.0.0.1:3101` en `/etc/nginx/http.d/impacta.conf` (verificado: sin backend responde 502, proxy OK). Copia versionada actualizada en `infra/nginx/`.
- **Backend pendiente 21-oct:** compilado y testeado (46 unit ✅), pero sin `.env` (`DATABASE_URL`, `JWT_SECRET`) no arranca ni migra. 3 migraciones nuevas (`...24171000` P2P/subs, `...5150000` community, `...5170000` knowledge) lineales y aditivas, listas para `migrate deploy`. Pasarela real (Webpay/Flow) sigue en mock (`mock_ref_`); páginas P2P públicas (`/p2p/:slug`) y lista de suscripciones en portal, pendientes (ver `openspec/changes/campanas-p2p-recaudacion/tasks.md`).

## Convenciones de commits

`feat(<módulo>): <descripción>` / `fix(...)` / `chore(...)`. Scope = módulo NestJS, o `landing`, `frontend`, `infra`, `docs`.

## Al operar como agente

- Verifica lo que dice la memoria contra el repo actual antes de recomendar archivos/funciones concretas — pueden haber cambiado.
- Ejecución de tareas: completas, no atajos. El usuario ha pedido explícitamente "no me simplifiques cosas".
- Cambios en infra/compose/servicios visibles: confirmar antes de aplicar.
- **Lección 16-ago-2026 (Path A revert):** nunca reemplaces un diseño más rico con uno más pobre. El frontend React tiene `EarthBackground` (Three.js), `logo.png`, navbar con Inicio/Módulos/Impacto Vivo, cards con "Ver módulo en acción", modal con logo, footer con imagen. El Next.js landing genérico NO tiene nada de eso. Si una decisión arquitectural ("Path A: deploy Next.js") requiere borrar elementos visuales visibles (animaciones, branding, secciones), **parar y consultar al usuario**.

## Source of truth y anti-patrones (leer antes de operar)

**El estado de producción es este mismo server (`fenix`)**: el repo en `/home/jnovoas/proyectos/ONG_Impacta/` sincronizado con `origin/main`, más lo desplegado en `frontend/dist/` (nginx) y el backend que escuche en `127.0.0.1:3101`. Cualquier rama que propongas debe basarse en `origin/main`.

> El server anterior `fan` fue **apagado el 23-ago-2026** y con él desapareció su remote `fan`/`fan main`. Las instrucciones históricas `git fetch fan main` **ya no son ejecutables ni necesarias**: ahora se trabaja DESDE el propio server.

### El desastre del 13-ago-2026 (contexto, NO repetir)

En esa fecha un commit `af06edb` ("revert: restore original 3D EarthBackground, Dashboard and repo state from 8ba8bec") borró la landing completa y revirtió docenas de archivos del backend. Estuvo mal etiquetado porque `8ba8bec` no contenía la landing Next.js — esa se agregó el mismo día en `06f8e33`. El revert borró trabajo bueno de meses y nunca fue intencional. La causa raíz de fondo: **el agente confundió la landing pública con el dashboard** (ver regla #1 arriba).

### Reglas duras (codificadas tras ese desastre)

1. **NUNCA uses un commit pre-desastre como baseline de un recovery.** El baseline correcto SIEMPRE es `origin/main`, y antes de cualquier reset verifica qué hay desplegado en producción (bundle de `frontend/dist/` vs build de main, respuesta de `/api/` con SNI).
2. **NUNCA reescribas docs correctos con info de un commit más viejo.** Las menciones históricas a "Fenix"/"fan"/"traefik"/podman en este archivo son advertencias preservadas a propósito para explicar DE DÓNDE venimos. No las borres sin actualizar el contexto.
3. **Antes de cualquier revert destructivo o rebase de historia:** exponer el plan completo y pedir confirmación. Un revert masivo califica como cambio de infra visible.
4. **El servidor actual es `fenix`** (Azure, Ubuntu 24.04, nginx + docker/sentinel conviviendo — ver sección Infraestructura 21-oct-2026), path `/home/jnovoas/proyectos/ONG_Impacta/`. NO confundir con el fenix histórico pre-2026 (`/home/jnovoas/Desarrollo/`) ni con `fan` (apagado 23-ago-2026).

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
