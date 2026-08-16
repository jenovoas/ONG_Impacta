# Impacta+ — guía raíz para agentes

Plataforma SaaS multi-tenant para ONGs, gestación temprana. Antes de cualquier trabajo no trivial **lee [PLAN.md](PLAN.md)** (fases A→D con criterios de aceptación) y [ARQUITECTURA_TECNICA.md](ARQUITECTURA_TECNICA.md) para el modelo de dominio.

## Estructura del monorepo

- [backend/](backend/) — NestJS 11 + Prisma 5 + Postgres. Ver [backend/AGENTS.md](backend/AGENTS.md).
- [landing/](landing/) — Next.js 16 + Tailwind v4. Desplegado. Ver [landing/AGENTS.md](landing/AGENTS.md).
- [frontend/](frontend/) — Vite + React 19 + TanStack Query. Pantallas: Login, Overview, Members, Donations, Campaigns, Species, Missions, Profile. Sirve estáticos en `https://app-impacta.pinguinoseguro.cl/` vía nginx (NO contenedor).
- [Impacta+PRD.md](Impacta+PRD.md), [DISENO_IDENTIDAD_VISUAL.md](DISENO_IDENTIDAD_VISUAL.md) — producto y marca.
- [docker-compose.yml](docker-compose.yml) — postgres, redis, backend (interno), landing (público).

## Design system

"The Digital Steward" — fuente de verdad = **proyecto Google Stitch `4741044715461206908`** (acceso MCP: `mcp__stitch__list_screens`, `get_screen`). ~25 pantallas. Los tokens ya están portados a Tailwind v4 `@theme` en [landing/app/globals.css](landing/app/globals.css) — reutilizarlos tal cual al levantar el frontend.

**Antes de crear/modificar UI:** traer la pantalla con `mcp__stitch__get_screen` y portar con los tokens existentes. No improvisar paleta.

## Infraestructura (servidor fan)

**Rocky 10.2 (Red Quartz), podman rootless. Serving edge: nginx directo (sin traefik).**

- Host compartido con **múltiples proyectos en producción** (pinguinoseguro, laespiguita, lotaindomito, micelia). **No** confundir con el antiguo "servidor Fenix" — esa infra ya no existe.
- **Regla dura: NO tocar infra existente.** Solo agregar servicios. No consolidar, no reciclar, no borrar contenedores "huérfanos" sin consultar.
- Wildcard cert `*.pinguinoseguro.cl` instalado vía certbot + DNS-01 PowerDNS (`/etc/letsencrypt/live/pinguinoseguro.cl/`). Cubre un nivel de subdominio — `api.impacta.pinguinoseguro.cl` **no** está cubierto, usar `api-impacta.pinguinoseguro.cl`.
- **Patrón de serving (idéntico al resto de proyectos del server):**
  - Frontends estáticos → nginx sirve archivos desde `/var/www/<dominio>/`. Config en `/etc/nginx/conf.d/<dominio>.conf`.
  - Servicios con runtime (backend Node, Next.js standalone) → contenedor podman con `ports: "<x>:<x>"` publicado al host, nginx hace `proxy_pass http://127.0.0.1:<x>`.
  - NO usar redes externas tipo `proxy` ni labels traefik — eso era del server Fenix.
- Convenciones del compose: nombre de contenedor con guiones (`impacta-backend`), volúmenes con sufijo SELinux `:z`.
- Configuración nginx activa de impacta en el server: `/etc/nginx/conf.d/impacta.pinguinoseguro.cl.conf`.
- Docs históricas del setup con traefik (referencia, NO operativo): `~/sentinel/` en el server.

## Comandos base

```bash
# build de imagen (el flag de red es OBLIGATORIO — evita EIDLETIMEOUT en rootless)
podman build --network=host -t <tag> <context>

# deploy incremental
podman-compose up -d <service>

# verificar
curl -s -o /dev/null -w "%{http_code}\n" https://<host>
```

## Estado actual (2026-08-16)

- `https://impacta.pinguinoseguro.cl` — landing Next.js 16 con stats reales del backend (ISR 60s).
- `https://api-impacta.pinguinoseguro.cl` — backend NestJS 11 con multi-tenant + JWT + 9 módulos. **Fuente de verdad de servicios en runtime.**
- `https://app-impacta.pinguinoseguro.cl` — frontend estático (Vite + React 19) servido por nginx desde `/var/www/impacta.pinguinoseguro.cl/`. **No es un contenedor** — se rebuild con `npm run build` y se copia el `dist/`.

Stack vivo en `fan`:
- postgres `impacta-db` (puerto host 5435)
- redis `impacta-redis` (6381)
- backend `impacta-backend` (3001)
- landing `impacta-landing` (3080→3000 interno)
- nginx edge proxy en `/etc/nginx/conf.d/impacta.pinguinoseguro.cl.conf`

Verificación rápida después de cada deploy:
```bash
for h in impacta api-impacta app-impacta; do
  curl -s -o /dev/null -w "$h.pinguinoseguro.cl: %{http_code}\n" -m 5 https://$h.pinguinoseguro.cl/
done
curl -s https://api-impacta.pinguinoseguro.cl/organizations/public-stats | jq .
```

Para próximos bloques de trabajo ver [PLAN.md](PLAN.md).

## Convenciones de commits

`feat(<módulo>): <descripción>` / `fix(...)` / `chore(...)`. Scope = módulo NestJS, o `landing`, `frontend`, `infra`, `docs`.

## Al operar como agente

- Verifica lo que dice la memoria contra el repo actual antes de recomendar archivos/funciones concretas — pueden haber cambiado.
- Ejecución de tareas: completas, no atajos. El usuario ha pedido explícitamente "no me simplifiques cosas".
- Cambios en infra/compose/servicios visibles: confirmar antes de aplicar.


## Source of truth y anti-patrones (leer antes de operar)

**`fan/main` ES el estado de producción.** Cualquier rama que propongas debe basarse en `fan/main`, no en un commit más viejo del historial.

### El desastre del 13-ago-2026 (contexto, NO repetir)

En esa fecha un commit `af06edb` ("revert: restore original 3D EarthBackground, Dashboard and repo state from 8ba8bec") borró la landing completa y revirtió docenas de archivos del backend. Estuvo mal etiquetado porque `8ba8bec` no contenía la landing Next.js — esa se agregó el mismo día en `06f8e33`. El revert borró trabajo bueno de meses y nunca fue intencional.

Después varios agentes修复 parcialmente y migraron a nginx directo. El estado vivo en `fan` quedó adelante de `origin/main`.

### Reglas duras (codificadas tras ese desastre)

1. **NUNCA uses un commit pre-desastre como baseline de un recovery.** El baseline correcto SIEMPRE es `fan/main` (o lo que haya sido el último deploy vivo en el server). Si dudas: `git fetch fan main && git log origin/main..fan/main` antes de cualquier reset.
2. **NUNCA reescribas docs correctos con info de un commit más viejo.** Las menciones históricas a "Fenix" / "traefik" en este archivo son **advertencias preservadas a propósito** ("no confundir con el antiguo servidor Fenix", "NO usar redes externas tipo proxy ni labels traefik — eso era del server Fenix"). Son load-bearing para futuros agentes.
3. **Antes de cualquier revert destructivo o rebase de historia:** exponer el plan completo y pedir confirmación. AGENTS.md del proyecto dice "Cambios en infra/compose/servicios visibles: confirmar antes de aplicar" — un revert masivo califica.
4. **El servidor es `fan`** (Rocky 10.2, podman rootless, nginx directo), NO `fenix`. Path en el server: `/home/jnovoas/ONG_Impacta/`. **No** `/home/jnovoas/Desarrollo/ONG_Impacta/` (esa era la ruta del server fenix viejo, ya no existe).

### Workflow correcto para arrancar trabajo

```bash
# 1. Verificar estado vivo en fan
git fetch fan main
git log origin/main..fan/main   # ¿hay commits no pusheados a origin?

# 2. Sincronizar a fan (fast-forward o merge)
git checkout main
git merge --ff-only fan/main    # o pull origin main + merge fan/main

# 3. Rama de feature DESDE main
git checkout -b feat/<scope>

# 4. Al terminar: PR contra main, merge, push a origin, pull en fan
```

Si encuentras docs desfasados (como pasó aquí con "Rocky 9" → "Rocky 10.2", "Servidor Fenix" → "Servidor fan"), arréglalos en commits surgicales — **no reescribas masivamente el archivo**.
