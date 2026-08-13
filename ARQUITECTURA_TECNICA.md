# Arquitectura Técnica - Impacta+

| **Versión** | 1.0 |
|-------------|-----|
| **Fecha** | 4 de abril de 2026 |
| **Estado** | En desarrollo |
| **Dominio** | impacta.pinguinoseguro.cl |

---

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CAPA DE PRESENTACIÓN                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌────────┐│
│  │   Landing Page  │  │  Dashboard Web  │  │   Portal Socio  │  │App Móvil││
│  │   (Next.js)     │  │   (React + Vite)│  │   (React)       │  │ (Fase 2)││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └────────┘│
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           CAPA DE API GATEWAY                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Nginx (Reverse Proxy + SSL)                   │   │
│  │              Rate Limiting • Cache • Compresión                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         CAPA DE APLICACIÓN (Backend)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │   Auth       │  │   Core       │  │   Pagos      │  │  Contable  │  │
│  │   Service    │  │   Service    │  │   Service    │  │  Service   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │   Eventos    │  │  Voluntarios │  │   Ecología   │  │  Reportes  │  │
│  │   Service    │  │   Service    │  │   Service    │  │  Service   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      SaaS Super-Admin Service                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                    (NestJS + TypeScript + REST/GraphQL)                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           CAPA DE DATOS                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │   PostgreSQL     │  │     Redis        │  │  MinIO / S3      │      │
│  │   (Principal)    │  │   (Cache/Colas)  │  │  (Archivos)      │      │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SERVICIOS EXTERNOS                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────┐    │
│  │MercadoPago │  │   PayPal   │  │   Stripe   │  │  SendGrid/     │    │
│  │            │  │            │  │            │  │  Resend        │    │
│  └────────────┘  └────────────┘  └────────────┘  └────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 2.1 Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.x | Librería UI principal |
| **Next.js** | 14.x | Landing Page, SSR, SEO |
| **Vite** | 5.x | Build tool para dashboard |
| **TypeScript** | 5.x | Tipado estático |
| **TailwindCSS** | 3.x | Estilos utilitarios |
| **shadcn/ui** | latest | Componentes UI |
| **TanStack Query** | 5.x | Data fetching, cache |
| **Zustand** | 4.x | Estado global |
| **React Hook Form** | 7.x | Formularios |
| **Zod** | 3.x | Validación de esquemas |
| **Lucide Icons** | latest | Iconografía |
| **Recharts** | 2.x | Gráficos y dashboards |
| **Apollo Client** | 3.x | Cliente GraphQL (Reportes) |
| **FullCalendar** | 6.x | Calendario |
| **React Table** | 8.x | Tablas avanzadas |

### 2.2 Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 20.x LTS | Runtime |
| **NestJS** | 10.x | Framework backend |
| **TypeScript** | 5.x | Tipado estático |
| **Prisma ORM** | 5.x | ORM type-safe |
| **PostgreSQL** | 16.x | Base de datos principal |
| **Redis** | 7.x | Cache, colas, sesiones |
| **BullMQ** | 5.x | Colas de trabajos |
| **JWT** | 9.x | Autenticación |
| **class-validator** | 0.x | Validación de DTOs |
| **Swagger/OpenAPI** | latest | Documentación API |
| **Apollo Server** | 4.x | Servidor GraphQL (NestJS plugin) |
| **Winston** | 3.x | Logging estructurado |
| **Playwright** | latest | Tests E2E y Visuales |

### 2.3 Infraestructura
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Docker** | 24.x | Contenedores |
| **Docker Compose** | 2.x | Orquestación local |
| **Nginx** | 1.25.x | Reverse proxy, SSL |
| **GitHub Actions** | latest | CI/CD |
| **Prometheus** | 2.x | Métricas |
| **Grafana** | 10.x | Dashboards de monitoreo |
| **Loki** | 2.x | Agregación de logs |
| **pgAdmin** | latest | Admin PostgreSQL |
| **Redis Commander** | latest | Admin Redis |

---

### 3.1 Monorepo (Turborepo)
```
impacta-saas/
├── apps/
│   ├── web/                    # Dashboard principal (React + Vite)
│   ├── landing/                # Landing pages (Next.js)
│   ├── api/                    # Backend API (NestJS)
│   ├── mobile/                 # App móvil (Fase 2 - Expo)
│   └── admin/                  # Panel SaaS Super-Admin (React)
├── packages/
│   ├── ui/                     # Componentes UI compartidos
│   ├── database/               # Schema Prisma, migraciones
│   ├── auth/                   # Lógica de autenticación
│   ├── payments/               # Módulo de pagos
│   ├── accounting/             # Módulo contable chileno
│   ├── types/                  # Tipos TypeScript compartidos
│   ├── utils/                  # Utilidades compartidas
│   └── eslint-config/          # Configuración ESLint
├── docker/
│   ├── nginx/
│   ├── postgres/
│   └── redis/
├── infra/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   └── scripts/
├── .github/
│   └── workflows/
├── docs/
├── .env.example
├── .gitignore
├── turbo.json
├── package.json
├── turbo.json
├── package.json
└── README.md
```

### 3.2 Backend (NestJS) - Estructura Modular
```
apps/api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── jwt.config.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── strategies/
│   │   │   └── dto/
│   │   ├── users/
│   │   ├── organizations/
│   │   ├── members/
│   │   ├── volunteers/
│   │   ├── roles/
│   │   ├── calendar/
│   │   ├── tasks/
│   │   ├── payments/
│   │   ├── donations/
│   │   ├── events/
│   │   ├── raffles/
│   │   ├── accounting/
│   │   ├── social-aid/
│   │   ├── ecology/
│   │   ├── species/
│   │   ├── crm/
│   │   └── reports/
│   └── database/
│       ├── prisma.service.ts
│       └── migrations/
```

---

### 4.1 Multi-tenancy
```prisma
// Schema Prisma simplificado

model Organization {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  logo        String?
  colors      Json?
  config      Json?
  plan        PlanType @default(FREE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  users       User[]
  members     Member[]
  events      Event[]
  donations   Donation[]
  
  @@index([slug])
}

enum PlanType {
  FREE
  BASIC
  PRO
  ENTERPRISE
}
```

### 4.2 Usuarios y Autenticación
```prisma
model User {
  id            String    @id @default(uuid())
  organizationId String
  email         String
  passwordHash  String
  role          RoleType
  positions     Position[]  // Cargos directivos
  isActive      Boolean   @default(true)
  lastLogin     DateTime?
  createdAt     DateTime  @default(now())
  
  organization  Organization @relation(fields: [organizationId], references: [id])
  
  @@unique([organizationId, email])
}

enum RoleType {
  SUPER_ADMIN
  ORGANIZATION_ADMIN
  COORDINATOR
  MEMBER
  VOLUNTEER
  DONOR
}

model Position {
  id            String   @id @default(uuid())
  userId        String
  name          String   // Presidente, Tesorero, etc.
  description   String?
  permissions   Json
  startDate     DateTime
  endDate       DateTime?
  
  user          User     @relation(fields: [userId], references: [id])
}
```

### 4.3 Módulo Contable Chileno
```prisma
model AccountingPlan {
  id             String   @id @default(uuid())
  organizationId String
  code           String   // Código de cuenta (ej: 1.1.01.001)
  name           String   // Nombre de la cuenta
  type           AccountType
  parentId       String?
  level          Int
  normalBalance  DebitCredit
  isActive       Boolean  @default(true)
  
  organization   Organization @relation(fields: [organizationId], references: [id])
  parent         AccountingPlan? @relation("AccountHierarchy", fields: [parentId], references: [id])
  children       AccountingPlan[] @relation("AccountHierarchy")
  movements      AccountingMovement[]
}

enum AccountType {
  ASSET           // Activo
  LIABILITY       // Pasivo
  EQUITY          // Patrimonio
  REVENUE         // Ingresos
  EXPENSE         // Gastos
}

enum DebitCredit {
  DEBIT
  CREDIT
}

model AccountingMovement {
  id             String   @id @default(uuid())
  organizationId String
  date           DateTime
  description    String
  reference      String?    // Número de documento
  source         String     // Origen (manual, pago, donación, etc.)
  sourceId       String?    // ID del documento origen
  isPosted       Boolean    @default(false)
  
  organization   Organization @relation(fields: [organizationId], references: [id])
  lines          AccountingLine[]
}

model AccountingLine {
  id             String   @id @default(uuid())
  movementId     String
  accountId      String
  debit          Decimal  @db.Decimal(15, 2)
  credit         Decimal  @db.Decimal(15, 2)
  
  movement       AccountingMovement @relation(fields: [movementId], references: [id])
  account        AccountingPlan @relation(fields: [accountId], references: [id])
  
  @@index([movementId])
  @@index([accountId])
}
```

### 4.4 Socios y Voluntarios
```prisma
model Member {
  id             String   @id @default(uuid())
  organizationId String
  userId         String?
  rut            String?  // RUT chileno
  firstName      String
  lastName       String
  email          String
  phone          String?
  birthDate      DateTime?
  gender         String?
  address        String?
  city           String?
  region         String?
  emergencyContact Json?
  
  membership     Membership?
  positions      Position[]
  tasks          Task[]
  
  @@unique([organizationId, rut])
}

model Membership {
  id             String   @id @default(uuid())
  memberId       String   @unique
  type           MembershipType
  status         MembershipStatus @default(ACTIVE)
  startDate      DateTime
  endDate        DateTime?
  fee            Decimal  @db.Decimal(10, 0)
  paymentFrequency PaymentFrequency
  
  member         Member   @relation(fields: [memberId], references: [id])
}

enum MembershipType {
  HONORARIO
  TITULAR
  JUVENIL
  COLABORADOR
}

enum MembershipStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  CANCELLED
}

enum PaymentFrequency {
  MONTHLY
  QUARTERLY
  ANNUAL
  LIFETIME
}
```

---

### 9.2 Docker Compose (Producción)
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:1.25-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
      - certbot-www:/var/www/certbot
    depends_on:
      - api
      - web

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    environment:
      - NEXT_PUBLIC_API_URL=/api

  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=impacta
      - POSTGRES_USER=impacta
      - POSTGRES_PASSWORD=${DB_PASSWORD}

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  grafana:
    image: grafana/grafana:latest
    volumes:
      - grafana_data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:
  certbot-www:
```

---

### 11.1 Estrategia de Backup
| Tipo | Frecuencia | Retención | Ubicación |
|------|------------|-----------|-----------|
| **Database** | Cada 6 horas | 30 días | Local + S3 |
| **Archivos** | Diario | 90 días | S3 |
| **Logs** | Diario | 7 días | Local |
| **Config** | On change | 10 versiones | Git + S3 |

### 11.2 RTO/RPO
| Métrica | Objetivo |
|---------|----------|
| **RTO** (Recovery Time Objective) | 4 horas |
| **RPO** (Recovery Point Objective) | 6 horas |

### 11.3 Script de Backup
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"

# Backup PostgreSQL
pg_dump -h postgres -U impacta impacta | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup a S3 (opcional)
aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://impacta-backups/postgres/

# Limpiar backups antiguos (> 30 días)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

---

### 12.1 Protección de Datos
- Cumplimiento **Ley 19.628** (Protección de la Vida Privada)
- Registro de bases de datos en **Registro Nacional de Bancos de Datos**

### 12.2 Contabilidad
- Libros contables según **Normas Chilenas de Contabilidad**
- Exportación de datos para **SII** (Formularios F29, F39)

---

### 13.1 Escalabilidad Horizontal
```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                        │
│                    (Nginx / HAProxy)                    │
└─────────────────────────────────────────────────────────┘
          │              │              │
          ▼              ▼              ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │  API #1  │  │  API #2  │  │  API #3  │
    └──────────┘  └──────────┘  └──────────┘
```

*Documento de arquitectura para el sistema SaaS de ONG Impacta+*
