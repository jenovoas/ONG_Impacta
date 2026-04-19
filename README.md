# Impacta+ — Multi-tenant SaaS for NGOs 🌿

[![Tech Stack](https://img.shields.io/badge/Stack-NestJS%20|%20Next.js%20|%20Prisma-000?style=for-the-badge&logo=nestjs&logoColor=white)](https://impacta.pinguinoseguro.cl)
[![Status](https://img.shields.io/badge/Status-Beta%20V1.0-green?style=for-the-badge)](https://api-impacta.pinguinoseguro.cl/health)

> **Impacta+** es una solución empresarial diseñada para digitalizar y escalar el impacto de organizaciones sin fines de lucro. Un ecosistema robusto que integra gestión de socios, recaudación de fondos y monitoreo de proyectos de conservación bajo una arquitectura multi-tenant de alto rendimiento.

---

## 🚀 Ecosistema Productivo

| Servicio | Enlace Directo | Estado |
| :--- | :--- | :--- |
| **🌐 Landing Page** | [impacta.pinguinoseguro.cl](https://impacta.pinguinoseguro.cl) | `Operational` |
| **📱 Dashboard App** | [app-impacta.pinguinoseguro.cl](https://app-impacta.pinguinoseguro.cl) | `Development` |
| **⚙️ Backend API** | [api-impacta.pinguinoseguro.cl](https://api-impacta.pinguinoseguro.cl) | `Stable` |
| **📡 Health Check** | [/health](https://api-impacta.pinguinoseguro.cl/health) | `Pass` |

---

## 🛠️ Stack Tecnológico

### Core
- **Backend**: NestJS 11 (Node 20+) con arquitectura modular.
- **Frontend**: Vite + React 19 (Dashboard) y Next.js 16 (Landing).
- **ORM**: Prisma 5 con extensiones para Multi-tenancy transparente.
- **Database**: PostgreSQL 16 + Redis 7 (Caching & BullMQ).

### Infraestructura (Servidor Fenix)
- **Runtime**: Podman Rootless (Rocky Linux 9).
- **Orquestación**: Podman Compose.
- **Edge**: Traefik v3 con resolución DNS-01 (PowerDNS) para certificados wildcard SSL.
- **Storage**: MinIO (S3 Compatible) para la gestión de assets multimedia.

---

## 📂 Estructura del Proyecto

```text
├── backend/     # API RESTful, Lógica de negocio y Tenants
├── frontend/    # Aplicación React 19 (Dashboard administrativo)
├── landing/     # Sitio público optimizado (SEO & Performance)
├── prisma/      # Esquemas de datos y migraciones
└── docs/        # Guías técnicas y documentación de diseño
```

---

## 📖 Documentación Relacionada

- 📈 **[PLAN.md](PLAN.md)**: Roadmap detallado de fases A, B, C y D.
- 🏗️ **[ARQUITECTURA_TECNICA.md](ARQUITECTURA_TECNICA.md)**: Detalles sobre el aislamiento de datos (Tenants).
- 🎨 **[DISENO_IDENTIDAD_VISUAL.md](DISENO_IDENTIDAD_VISUAL.md)**: Tokens de diseño y guía de estilo.
- 🤖 **[AGENTS.md](AGENTS.md)**: Guía para agentes de IA que operan en este monorepo.

---

## 🛠️ Desarrollo Local

1. Levantar dependencias: `podman-compose up -d postgres redis`
2. Configurar entorno: `cp .env.example .env`
3. Backend: `cd backend && npm i && npx prisma migrate dev && npm run start:dev`
4. Dashboard: `cd frontend && npm i && npm run dev`

---
*Desarrollado con ❤️ para el ecosistema de conservación por el equipo de **PinguinoSeguro**.*
