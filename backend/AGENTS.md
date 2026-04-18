# Backend — guía para agentes

API REST multi-tenant para Impacta+. Expuesta solo internamente (sin labels traefik) hasta la fase C del [../PLAN.md](../PLAN.md).

## Stack

- NestJS 11 (`@nestjs/common`, `@nestjs/core`, `platform-express`)
- Prisma 5 (`@prisma/client` + `prisma` CLI)
- `class-validator` + `class-transformer` con `ValidationPipe` global (`whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`).
- Postgres 16 (contenedor `impacta-db`, puerto host 5435) + Redis 7 (`impacta-redis`, puerto host 6381).
- Node 20 Alpine en runtime.

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

`DATABASE_URL` en `.env` apunta al host del contenedor: `postgresql://impacta:impacta_pass@localhost:5435/impacta?schema=public`. Dentro del contenedor `backend`, el compose lo reemplaza por `postgres:5432`.

## Gotchas

- **`JsonValue` de Prisma vs. inputs tipados:** cuando un DTO tiene `config?: Record<string, unknown>`, en el service castear a `Prisma.InputJsonValue | undefined` al crear/actualizar. Ver [src/modules/organizations/organizations.service.ts](src/modules/organizations/organizations.service.ts).
- **`.env` está en gitignore** pero se lee por `dotenv` que viene con `@nestjs/config` si se agrega; hasta entonces Prisma lo lee solo para CLI. Las variables runtime del contenedor vienen del compose.
- **Prisma 5, no 6/7.** El schema se simplificó en una sesión previa por incompatibilidades con v7. Si se migra a v6/7, revisar [../docker-compose.yml](../docker-compose.yml) y types generados.
- **`ValidationPipe` global** rechaza propiedades desconocidas con 400. Para campos opcionales, marcar con `@IsOptional()` antes del validador específico.

## Deploy

- Imagen: `./backend/Dockerfile` (multi-stage, `node:20-alpine`, user no-root).
- En [../docker-compose.yml](../docker-compose.yml) como servicio `backend` — **sin labels traefik aún**. Se expondrá como `api-impacta.pinguinoseguro.cl` en fase C3 del PLAN (subdominio de primer nivel, cubierto por el wildcard `*.pinguinoseguro.cl`).
- Depende de `postgres` y `redis` con healthcheck.

## Testing

`jest` + `@nestjs/testing` para unit, `supertest` + `test/jest-e2e.json` para e2e. Convención: `.spec.ts` junto al archivo para unit, `test/*.e2e-spec.ts` para e2e.

## Commits

`feat(<módulo>): ...`, `fix(<módulo>): ...`. Scope = nombre del módulo NestJS (`auth`, `organizations`, `members`, etc.) o `prisma`, `infra`.
