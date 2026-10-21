# Impacta+ — Multi-tenant SaaS for NGOs 🌿

[![Tech Stack](https://img.shields.io/badge/Stack-NestJS%20|%20React%20|%20Prisma-000?style=for-the-badge&logo=nestjs&logoColor=white)](https://impacta.pinguinoseguro.cl)
[![Estado](https://img.shields.io/badge/Estado-Beta%20V1.0-green?style=for-the-badge)](https://impacta.pinguinoseguro.cl)

> **Impacta+** es una solución empresarial diseñada para digitalizar y escalar el impacto de organizaciones sin fines de lucro. Un ecosistema robusto que integra gestión de socios, recaudación de fondos y monitoreo de proyectos de conservación bajo una arquitectura multi-tenant de alto rendimiento.

---

## 🚀 Ecosistema Productivo

> **Un solo dominio usuario-facing:** landing, login/registro, portal donante y panel conviven en `impacta.pinguinoseguro.cl` (`/`, `/login`, `/register`, `/portal`, `/dashboard/*`). Sin sesión, la raíz muestra la landing.

| Servicio | Enlace Directo | Qué es |
| :--- | :--- | :--- |
| **🌐 Plataforma** | [impacta.pinguinoseguro.cl](https://impacta.pinguinoseguro.cl) | Landing pública (EarthBackground 3D, stats reales, demo modal) + acceso, portal donante y dashboard |
| **⚙️ Backend API** | `impacta.pinguinoseguro.cl/api/` | API NestJS multi-tenant detrás del proxy del mismo dominio |
| ~~app-impacta~~ | — | Dominio legado: redirige a `impacta.*`; no agregar funcionalidad ahí |

---

## 🛠️ Stack Tecnológico

### Core
- **Backend**: NestJS 11 (Node 20+) con arquitectura modular.
- **Frontend**: Vite + React 19 — sirve la landing pública, autenticación, portal donante y panel (mismo build).
- **ORM**: Prisma 5 con extensiones para Multi-tenancy transparente.
- **Database**: PostgreSQL 16 + Redis 7 (Caching & BullMQ).

### Infraestructura (servidor fenix — Azure)
- **VM**: Azure, Ubuntu 24.04 LTS.
- **Runtime**: 100% nativo — Postgres 16 y Redis como servicios systemd; backend como servicio systemd (`impacta-backend.service`).
- **Edge**: Nginx directo, certificados wildcard SSL (`/etc/letsencrypt/live/pinguinoseguro.cl/`).
- **Storage**: MinIO (S3 Compatible) para la gestión de assets multimedia.

---

## 📂 Estructura del Proyecto

```text
├── backend/        # API RESTful, lógica de negocio y tenants
├── frontend/       # React 19 — UN SOLO SISTEMA: landing + front auth + panel de control (un build)
├── landing/        # Next.js de referencia, NO desplegado (Path A revocado — solo tokens @theme)
├── infra/nginx/    # Copia versionada de la config nginx activa (un solo dominio + redirect legado)
└── deploy.sh       # Deploy de frontend/backend en fenix
```

---

## 📖 Documentación Relacionada

- 📈 **[PLAN.md](PLAN.md)**: Roadmap detallado de fases A, B, C y D.
- 🏗️ **[ARQUITECTURA_TECNICA.md](ARQUITECTURA_TECNICA.md)**: Detalles sobre el aislamiento de datos (Tenants).
- 🎨 **[DISENO_IDENTIDAD_VISUAL.md](DISENO_IDENTIDAD_VISUAL.md)**: Tokens de diseño y guía de estilo.
- 🤖 **[AGENTS.md](AGENTS.md)**: Guía para agentes de IA que operan en este monorepo.

---

## 🛠️ Desarrollo Local

1. Levantar dependencias locales: `docker compose up -d postgres redis`. Compose se usa solo en desarrollo; producción corre con servicios nativos.
2. Configurar el entorno desde `.env.example` y completar las credenciales locales necesarias.
3. Backend: `cd backend && npm install && npx prisma migrate dev && npm run start:dev`.
4. Frontend: `cd frontend && npm install && npm run dev`.

### Verificación y despliegue

- Backend: `cd backend && npm run build`.
- Frontend (landing y panel): `cd frontend && npm run build`.
- CI: el workflow de GitHub Actions ejecuta lint, build, pruebas unitarias y E2E para backend, además de lint y build de frontend y del proyecto Next.js de referencia.
- En producción, el despliegue se ejecuta desde el servidor `fenix`: `./deploy.sh frontend`, `./deploy.sh backend` o `./deploy.sh verify`.
- `/health` no está implementado actualmente; no usar esa ruta como verificación. La verificación de producción se describe en [AGENTS.md](AGENTS.md).

### Logs del backend

- El backend emite logs estructurados JSON a stdout en producción; systemd los recoge en `impacta-backend.service`.
- Para enviar una copia a Loki, configura `LOKI_HOST` en el entorno del backend. `LOKI_USERNAME` y `LOKI_PASSWORD` son opcionales y deben configurarse juntos. La salida a stdout se mantiene.
- En desarrollo se usa `pino-pretty`; Loki solo se activa en producción cuando se define `LOKI_HOST`.

> Deploy en producción (server fenix): ver [`deploy.sh`](deploy.sh) y [AGENTS.md](AGENTS.md).

---
*Desarrollado con ❤️ para el ecosistema de conservación por el equipo de **PinguinoSeguro**.*
