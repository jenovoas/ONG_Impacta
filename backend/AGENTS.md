# Backend — guía para agentes

> 🛑 **ANTI-ALUCINACIÓN (NUNCA INVENTES SUBDOMINIOS):** En sesiones pasadas, varias IAs arruinaron el despliegue al inventar e intentar usar subdominios falsos como , , , , etc. **ESTO ESTÁ ESTRICTAMENTE PROHIBIDO**. Todo (frontend, API, webhooks de pagos) se rutea bajo . Configurar o sugerir despliegues en otros subdominios romperá la aplicación.

API REST multi-tenant para Impacta+. Expuesta como `https://api-impacta.pinguinoseguro.cl` vía nginx (`proxy_pass http://127.0.0.1:3001`) y como `https://impacta.pinguinoseguro.cl/api/` (proxy same-origin). Ver [../AGENTS.md](../AGENTS.md) regla #1 — UN SOLO SISTEMA: `impacta.*` sirve landing + front + panel, `app-impacta.*` es solo `301`, la API va aparte.

## Stack

- NestJS 11 (`@nestjs/common`, `@nestjs/core`, `platform-express`)
- Prisma 5 (`@prisma/client` + `prisma` CLI)
- `class-validator` + `class-transformer` con `ValidationPipe` global (`whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`).
- Postgres 16 y Redis 7 **nativos** en el server fenix como servicios systemd (`127.0.0.1:5432` / `127.0.0.1:6379`). Para desarrollo local fuera del server: `docker-compose.yml` de la raíz (puertos 5435/6381).
- Node 20+ en runtime (el servicio systemd usa `/usr/bin/node`).

## Estructura

```
src/
  main.ts              # bootstrap + ValidationPipe global
  app.module.ts
  database/
    database.module.ts
    database.service.ts  # extiende PrismaClient
  modules/
    organizations/       # único módulo implementado
      organizations.controller.ts
      organizations.service.ts
      organizations.module.ts
      dto/
        create-organization.dto.ts
prisma/
  schema.prisma          # Organization, User, Member
```

**Al crear un módulo nuevo:** `nest g module modules/<nombre>` + `nest g controller` + `nest g service`. DTOs tipados en `dto/`, siempre con validaciones `class-validator`. Nada de `any` en inputs.

## Schema actual

`Organization → User[]`, `Organization → Member[]`. Campos relevantes:
- `Organization.slug` único, `config Json?`, `plan` default `FREE`.
- `User` tiene `@@unique([organizationId, email])`.
- `Member.rut` con `@@unique([organizationId, rut])` (RUT chileno, con dígito verificador — validar en DTO).

Cada tabla nueva debe llevar `organizationId String` + `@relation` + incluirla en los `@@unique` o `@@index` compuestos para queries cross-tenant seguras.

## Multi-tenant (pendiente, ver fase A3 de PLAN.md)

Hasta que exista el middleware de tenant context, **no expongas endpoints que lean datos sin filtrar por `organizationId`**. El JWT llevará `{ sub, orgId, role }` y el middleware lo pondrá en `req.tenant`. Services deben recibir `orgId` explícito o derivarlo del request.

## Comandos

```bash
# dev (hot reload)
npm run start:dev

# build
npm run build

# tests
npm run test
npm run test:e2e

# Prisma
npx prisma migrate dev --name <mensaje>
npx prisma migrate deploy          # producción
npx prisma generate                # tras cambiar schema
npx prisma studio                  # UI local
npm run prisma:seed                # si existe prisma/seed.ts
```

`DATABASE_URL` en `.env` apunta al postgres **nativo** del server: `postgresql://impacta:...@127.0.0.1:5432/impacta?schema=public` (ver [.env.example](../.env.example)).

## Gotchas

- **`JsonValue` de Prisma vs. inputs tipados:** cuando un DTO tiene `config?: Record<string, unknown>`, en el service castear a `Prisma.InputJsonValue | undefined` al crear/actualizar. Ver [src/modules/organizations/organizations.service.ts](src/modules/organizations/organizations.service.ts).
- **`.env` está en gitignore** pero se lee por `dotenv` que viene con `@nestjs/config` si se agrega; hasta entonces Prisma lo lee solo para CLI. Las variables runtime del contenedor vienen del compose.
- **Prisma 5, no 6/7.** El schema se simplificó en una sesión previa por incompatibilidades con v7. Si se migra a v6/7, revisar [../docker-compose.yml](../docker-compose.yml) y types generados.
- **`ValidationPipe` global** rechaza propiedades desconocidas con 400. Para campos opcionales, marcar con `@IsOptional()` antes del validador específico.

## Deploy

- El backend corre como servicio systemd **`impacta-backend.service`** (unit file en `/etc/systemd/system/`, user `jnovoas`, WorkingDirectory `~/proyectos/ONG_Impacta/backend`, ejecuta `/usr/bin/node dist/src/main`, puerto 3001, `EnvironmentFile=~/proyectos/ONG_Impacta/.env`).
- Deploy: `./deploy.sh backend` (build + restart) · Migraciones: `./deploy.sh migrate` · Verificación: `./deploy.sh verify`.
- Expuesto como `impacta.pinguinoseguro.cl/api/` vía nginx (`proxy_pass http://127.0.0.1:3001`; config versionada en [../infra/nginx/](../infra/nginx/)).
- `backend/Dockerfile` y el compose quedan **solo para desarrollo local** — en producción no hay contenedores.

## Testing

`jest` + `@nestjs/testing` para unit, `supertest` + `test/jest-e2e.json` para e2e. Convención: `.spec.ts` junto al archivo para unit, `test/*.e2e-spec.ts` para e2e.

## Commits

`feat(<módulo>): ...`, `fix(<módulo>): ...`. Scope = nombre del módulo NestJS (`auth`, `organizations`, `members`, etc.) o `prisma`, `infra`.
