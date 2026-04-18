# Impacta+ — guía raíz para agentes

Plataforma SaaS multi-tenant para ONGs, gestación temprana. Antes de cualquier trabajo no trivial **lee [PLAN.md](PLAN.md)** (fases A→D con criterios de aceptación) y [ARQUITECTURA_TECNICA.md](ARQUITECTURA_TECNICA.md) para el modelo de dominio.

## Estructura del monorepo

- [backend/](backend/) — NestJS 11 + Prisma 5 + Postgres. Ver [backend/AGENTS.md](backend/AGENTS.md).
- [landing/](landing/) — Next.js 16 + Tailwind v4. Desplegado. Ver [landing/AGENTS.md](landing/AGENTS.md).
- [frontend/](frontend/) — Vite + React 19 (scaffold, sin diseño aplicado aún). Será `app.impacta.pinguinoseguro.cl`.
- [Impacta+PRD.md](Impacta+PRD.md), [DISENO_IDENTIDAD_VISUAL.md](DISENO_IDENTIDAD_VISUAL.md) — producto y marca.
- [docker-compose.yml](docker-compose.yml) — postgres, redis, backend (interno), landing (público).

## Design system

"The Digital Steward" — fuente de verdad = **proyecto Google Stitch `4741044715461206908`** (acceso MCP: `mcp__stitch__list_screens`, `get_screen`). ~25 pantallas. Los tokens ya están portados a Tailwind v4 `@theme` en [landing/app/globals.css](landing/app/globals.css) — reutilizarlos tal cual al levantar el frontend.

**Antes de crear/modificar UI:** traer la pantalla con `mcp__stitch__get_screen` y portar con los tokens existentes. No improvisar paleta.

## Infraestructura (servidor fenix)

**Rocky 9, podman rootless, traefik v3.**

- Host compartido con **múltiples proyectos en producción** (sentinel, pinguinoseguro, laespiguita, portfolio, minio).
- **Regla dura: NO tocar infra existente.** Solo agregar servicios. No consolidar, no reciclar, no borrar contenedores "huérfanos" sin consultar.
- Wildcard cert `*.pinguinoseguro.cl` vía resolver `powerdns` (DNS-01). Cubre un nivel de subdominio — `api.impacta.pinguinoseguro.cl` **no** está cubierto, usar `api-impacta.pinguinoseguro.cl`.
- Red externa compartida: `proxy` (traefik vive ahí).
- Convenciones del compose: nombre de contenedor con guiones (`impacta-backend`), volúmenes con sufijo SELinux `:z`, labels traefik según patrón de sentinel.
- Documentación de infra detallada: `~/Desarrollo/sentinel/` (fuera del repo).

## Comandos base

```bash
# build de imagen (el flag de red es OBLIGATORIO — evita EIDLETIMEOUT en rootless)
podman build --network=host -t <tag> <context>

# deploy incremental
podman-compose up -d <service>

# verificar
curl -s -o /dev/null -w "%{http_code}\n" https://<host>
```

## Estado (2026-04-17)

- Landing desplegado en `https://impacta.pinguinoseguro.cl` con el diseño "New Identity 2026".
- Backend con solo módulo `organizations` (CRUD básico). No hay auth, no hay tenant middleware, no hay migraciones aplicadas.
- Frontend sin empezar.

Siguiente bloque de trabajo está en [PLAN.md](PLAN.md) — fase A (migración + auth + tenant middleware).

## Convenciones de commits

`feat(<módulo>): <descripción>` / `fix(...)` / `chore(...)`. Scope = módulo NestJS, o `landing`, `frontend`, `infra`, `docs`.

## Al operar como agente

- Verifica lo que dice la memoria contra el repo actual antes de recomendar archivos/funciones concretas — pueden haber cambiado.
- Ejecución de tareas: completas, no atajos. El usuario ha pedido explícitamente "no me simplifiques cosas".
- Cambios en infra/compose/servicios visibles: confirmar antes de aplicar.
