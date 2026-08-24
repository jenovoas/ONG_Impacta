# Impacta+ — Multi-tenant SaaS for NGOs 🌿

[![Tech Stack](https://img.shields.io/badge/Stack-NestJS%20|%20Next.js%20|%20Prisma-000?style=for-the-badge&logo=nestjs&logoColor=white)](https://impacta.pinguinoseguro.cl)
[![Status](https://img.shields.io/badge/Status-Beta%20V1.0-green?style=for-the-badge)](https://api-impacta.pinguinoseguro.cl/health)

> **Impacta+** es una solución empresarial diseñada para digitalizar y escalar el impacto de organizaciones sin fines de lucro. Un ecosistema robusto que integra gestión de socios, recaudación de fondos y monitoreo de proyectos de conservación bajo una arquitectura multi-tenant de alto rendimiento.

---

## 🚀 Ecosistema Productivo

> **Un solo dominio usuario-facing:** landing, login/registro, portal donante y dashboard conviven en `impacta.pinguinoseguro.cl` (`/` marketing, `/login`·`/register` acceso, `/portal` donante, `/dashboard/*` la app — Missions offline-first con IndexedDB + sync). Sin sesión solo se ve la landing.

| Servicio | Enlace Directo | Qué es |
| :--- | :--- | :--- |
| **🌐 Plataforma** | [impacta.pinguinoseguro.cl](https://impacta.pinguinoseguro.cl) | Landing pública (EarthBackground 3D, stats reales, demo modal) + acceso, portal donante y dashboard |
| **⚙️ Backend API** | [api-impacta.pinguinoseguro.cl](https://api-impacta.pinguinoseguro.cl) | API NestJS multi-tenant |
| ~~app-impacta~~ | — | Dominio legado: redirige a `impacta.*`; no agregar funcionalidad ahí |

---

## 🛠️ Stack Tecnológico

### Core
- **Backend**: NestJS 11 (Node 20+) con arquitectura modular.
- **Frontend**: Vite + React 19 — sirve la landing pública Y el dashboard (mismo build).
- **ORM**: Prisma 5 con extensiones para Multi-tenancy transparente.
- **Database**: PostgreSQL 16 + Redis 7 (Caching & BullMQ).

### Infraestructura (Servidor fenix — Azure)
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

1. Levantar dependencias: `docker compose up -d postgres redis` (compose = solo desarrollo local; en producción todo es nativo)
2. Configurar entorno: `cp .env.example .env`
3. Backend: `cd backend && npm i && npx prisma migrate dev && npm run start:dev`
4. Dashboard + landing: `cd frontend && npm i && npm run dev`

> Deploy en producción (server fenix): ver [`deploy.sh`](deploy.sh) y [AGENTS.md](AGENTS.md).

---
*Desarrollado con ❤️ para el ecosistema de conservación por el equipo de **PinguinoSeguro**.*
