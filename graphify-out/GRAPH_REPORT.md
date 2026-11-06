# Graph Report - ONG_Impacta  (2026-11-06)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2402 nodes · 3663 edges · 190 communities (144 shown, 46 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 138 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c1a816e6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- lucide-react
- auth.controller.ts
- Public AI Gateway
- .verifyCredential
- Development Containers
- Species Management
- Organization Validation
- CI Database Setup
- Mission Management
- User and Donation APIs
- Backend Dependencies
- @nestjs/common
- dependencies
- devDependencies
- P2P Campaign Proposal
- Demo Request API
- Database Services and Tests
- Member Management
- Backend TypeScript Configuration
- Database Schema Migrations
- Multi-Tenant Context
- User Management API
- Frontend TypeScript Configuration
- Landing TypeScript Configuration
- Landing Page Dependencies
- Node TypeScript Configuration
- auth.module.ts
- CreateDonationDto
- community.controller.ts
- Backend Package Scripts
- Landing Page Components
- app.module.ts
- PortalDonante.tsx
- Deployment Scripts
- devDependencies
- Jest Configuration
- Impacta+ Product Requirements
- ESLint Configuration
- AI Assistant Specification
- oauth.service.ts
- Nest CLI Configuration
- AI Content Security
- Public P2P Pages API
- Backend Build Configuration
- Forensic Incident Reports
- Biodiversity Knowledge Catalog
- Scientific Interoperability
- Public
- backend/package.json
- Frontend Project References
- Code Review MCP Configuration
- Code Review MCP Configuration
- AI Fine-Tuning Strategy
- Recurring Payments and Receipts Tasks
- Biodiversity Catalog Requirements
- Review Session Startup Script
- Review Update Script
- PostCSS Configuration
- Grant Management Board
- Forensic Incident Reports
- Demo Request Schema
- Secure Reporting and Journalism
- Offline Mission Storage
- Community Profiles API
- Local AI Runtime Strategy
- Citizen Journalism Design
- Regional Operations Planning
- Encrypted Internal Messaging
- Citizen Journalism Requirements
- Sentinel Runtime Requirements
- Platform Architecture and Operations
- AI Security Guardrails
- Encrypted Conversations and Intelligence
- Model-Independent AI Architecture
- Membership and Volunteer Design
- Recurring Webpay Payments
- AuthUser
- AI Provider Integration
- Communication Journeys
- Anonymous Reporting Channel
- Impacta+ — guía raíz para agentes
- Sentinel Deployment Architecture
- Biodiversity Data Sources
- Safe Community AI Design
- Event Management Requirements
- Advanced Memberships
- Sentinel Runtime Design
- Donor Portal Requirements
- Project Work Plan
- AuthService
- frontend/package.json
- Overview.tsx
- Donor Portal Requirements
- Community Knowledge Governance
- Volunteer Management
- Offline Mission Synchronization
- Backend Developer Guide
- ai-gateway.module.ts
- Offline Mission Synchronization
- Backend Project Documentation
- Community Credential Creation
- Community Participation and Knowledge
- Regional AI Master Plan
- CreateP2PPageDto
- Biodiversity Catalog Implementation
- Species Observations and Media
- Platform Overview and Technology Stack
- CreateCampaignDto
- File Storage API
- RecurrenceToggle
- ref_react
- Biodiversity Catalog Proposal
- Safe Community AI Implementation
- Pendientes priorizados de Impacta+
- vite.config.ts
- Tasks: Runtime de Impacta+ sobre Sentinel
- Visual Brand Guidelines
- Competitor Insights Integration
- Communication and Grant Reporting
- Safe Community AI Proposal
- Sentinel Runtime Proposal
- AI Security Components
- Species Catalog and Conservation Status
- Biodiversity Collaboration Model
- OAuthService
- Biodiversity Catalog Design
- Communication and Grant Implementation
- Membership and Volunteer Implementation
- CampaignsController
- Debugging Workflow Guide
- Codebase Exploration Guide
- Safe Refactoring Guide
- Code Review Guide
- CodeBuddy Tooling Guide
- Debugging Workflow Guide
- Codebase Exploration Guide
- Safe Refactoring Guide
- Code Review Guide
- Protected Reporting
- Specialized AI Fine-Tuning
- Global Identity and Permissions
- Local Qwen Deployment
- Graph Tool Workflow
- Issue Debugging Guide
- Codebase Exploration Guide
- Safe Refactoring Guide
- Change Review Guide
- Graph Tool Workflow
- Graph Tool Workflow
- Competitive Insights Design
- Grant Reporting Design
- Graph Tool Workflow
- Scientific Catalog and Education
- Professional Network and Projects
- Private Managed Messaging
- Encrypted Intelligence Exchange
- Regional Interoperability
- Governance and Security Baseline
- Sentinel Runtime Defense
- Frontend Setup Guide
- Landing Page Setup Guide
- Testing Strategy
- Application Architecture
- UpdateProfileDto
- LoginDto
- UpdateCampaignDto
- Landing Page Agent Guide
- Competitive Insights Project
- Peer-to-Peer Fundraising
- Grant Reporting Project
- Secure Community AI Assistant
- Memberships and Volunteer Events
- Sentinel Runtime Project
- scripts
- fix_species.js
- @nestjs/platform-express
- pino@^10.4.0
- eslint-plugin-prettier
- jest@^30.0.0
- @nestjs/schematics@^11.0.0
- @types/node@^24.0.0
- typescript@^5.7.3
- typescript-eslint@^8.20.0

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 70 edges
2. `CurrentTenant` - 44 edges
3. `DatabaseService` - 38 edges
4. `PRD del Proyecto Impacta+` - 33 edges
5. `Roles()` - 24 edges
6. `AuthUser` - 23 edges
7. `Public()` - 23 edges
8. `Impacta+ — Plan maestro del cerebro operativo regional` - 23 edges
9. `compilerOptions` - 22 edges
10. `class-validator` - 22 edges

## Surprising Connections (you probably didn't know these)
- ``ContentIngressGuard`` --references--> `ContentIngressGuard`  [INFERRED]
  docs/REUTILIZACION_DEFENSA_COGNITIVA_SENTINEL.md → backend/src/modules/ai-security/content-ingress-guard.ts
- `Estado actual (2026-10-21 — merges + deploy parcial)` --references--> `DatabaseService`  [INFERRED]
  AGENTS.md → backend/src/database/database.service.ts
- ``PrivacySanitizer`` --references--> `PrivacySanitizer`  [INFERRED]
  docs/REUTILIZACION_DEFENSA_COGNITIVA_SENTINEL.md → backend/src/modules/ai-security/privacy-sanitizer.ts
- `4. Qwen local futuro` --references--> `AiProvider`  [INFERRED]
  openspec/changes/runtime-sentinel-impacta/tasks.md → backend/src/modules/ai-gateway/ai-provider.ts
- `Context` --references--> `Species()`  [INFERRED]
  openspec/changes/catalogo-biodiversidad-educacion/design.md → frontend/src/pages/Species.tsx

## Import Cycles
- None detected.

## Communities (190 total, 46 thin omitted)

### Community 0 - "lucide-react"
Cohesion: 0.20
Nodes (9): RecurrenceToggleProps, Donation, Donations(), formatCLP(), StatusBadge(), statuses, speciesStatusLabels, lucide-react (+1 more)

### Community 1 - "auth.controller.ts"
Cohesion: 0.12
Nodes (5): OAuthLoginDto, OAuthRegisterDto, SUPPORTED_OAUTH_PROVIDERS, RefreshDto, RegisterDto

### Community 2 - "Public AI Gateway"
Cohesion: 0.15
Nodes (3): AiGatewayController, AiOrchestratorService, PublicAssistantDto

### Community 4 - "Development Containers"
Cohesion: 0.05
Nodes (44): build, container_name, depends_on, env_file, environment, ports, restart, context (+36 more)

### Community 6 - "Organization Validation"
Cohesion: 0.08
Nodes (6): CreateOrganizationDto, ORGANIZATION_PLANS, OrganizationPlan, OrganizationsController, OrganizationsModule, OrganizationsService

### Community 7 - "CI Database Setup"
Cohesion: 0.06
Nodes (39): defaults, env, runs-on, services, steps, run, DATABASE_URL, JWT_SECRET (+31 more)

### Community 8 - "Mission Management"
Cohesion: 0.08
Nodes (6): CreateMissionDto, CreateMissionTaskDto, UpdateTaskDto, MissionsController, MissionsModule, MissionsService

### Community 10 - "Backend Dependencies"
Cohesion: 0.06
Nodes (35): dependencies, @aws-sdk/client-s3@^3.1156.0, axios@^1.19.0, bcrypt@^6.0.0, class-transformer@^0.5.1, class-validator@^0.15.1, google-auth-library@^10.9.1, @nestjs/common@^11.0.1 (+27 more)

### Community 11 - "@nestjs/common"
Cohesion: 0.10
Nodes (9): DatabaseModule, CampaignsModule, ReceiptDonation, receiptDonationInclude, UpdateRecurringDonationDto, CreateSpeciesDto, StorageModule, StorageService (+1 more)

### Community 12 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, axios@^1.15.0, clsx@^2.1.1, framer-motion@^12.38.0, idb@^8.0.3, lucide-react@^1.8.0, react@^19.2.4, react-router-dom@^7.14.1 (+13 more)

### Community 13 - "devDependencies"
Cohesion: 0.06
Nodes (31): devDependencies, eslint@^9.18.0, eslint-config-prettier@^10.0.1, @nestjs/cli@^11.0.0, @nestjs/testing@^11.0.1, pino-pretty@^13.2.0, prettier@^3.4.2, source-map-support@^0.5.21 (+23 more)

### Community 15 - "P2P Campaign Proposal"
Cohesion: 0.05
Nodes (40): Campaign, Context, Decisions, Goals / Non-Goals, Risks / Trade-offs, Capabilities, Impact, Modified Capabilities (+32 more)

### Community 16 - "Demo Request API"
Cohesion: 0.11
Nodes (4): DemoRequestsController, DemoRequestsModule, DemoRequestsService, CreateDemoRequestDto

### Community 17 - "Database Services and Tests"
Cohesion: 0.11
Nodes (9): prisma, AppModule, DatabaseService, prisma, resetDb(), bcrypt, @nestjs/testing, @prisma/client (+1 more)

### Community 18 - "Member Management"
Cohesion: 0.14
Nodes (4): Roles(), validateRut(), MembersController, MembersService

### Community 19 - "Backend TypeScript Configuration"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 20 - "Database Schema Migrations"
Cohesion: 0.06
Nodes (49): "Member", Member_organizationId_rut_key, "Organization", Organization_slug_key, "User", User_organizationId_email_key, "Donation", "Campaign" (+41 more)

### Community 21 - "Multi-Tenant Context"
Cohesion: 0.38
Nodes (3): TenantContext, tenantContextStorage, multiTenantExtension

### Community 22 - "User Management API"
Cohesion: 0.14
Nodes (3): UsersController, UsersModule, UsersService

### Community 23 - "Frontend TypeScript Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+10 more)

### Community 24 - "Landing TypeScript Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 25 - "Landing Page Dependencies"
Cohesion: 0.07
Nodes (29): nextConfig, dependencies, next@^16.4.2, react@19.2.4, react-dom@19.2.4, devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4 (+21 more)

### Community 26 - "Node TypeScript Configuration"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+9 more)

### Community 27 - "auth.module.ts"
Cohesion: 0.17
Nodes (6): AuthModule, IS_PUBLIC_KEY, JwtAuthGuard, JwtStrategy, @nestjs/core, @nestjs/passport

### Community 29 - "community.controller.ts"
Cohesion: 0.12
Nodes (9): ROLES_KEY, RolesGuard, UpdateP2PPageDto, CredentialRow, DisciplineRow, ProfileRow, RoleAssignmentRow, VerifyCredentialDto (+1 more)

### Community 30 - "Backend Package Scripts"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 31 - "Landing Page Components"
Cohesion: 0.23
Nodes (10): getPublicStats(), LandingPage(), DemoButton(), Props, DemoModal(), DemoModalProps, EMPTY, Field() (+2 more)

### Community 32 - "app.module.ts"
Cohesion: 0.08
Nodes (15): AppController, lokiHost, lokiUsername, AppService, TenantRequest, TenantMiddleware, bootstrap(), logger (+7 more)

### Community 33 - "PortalDonante.tsx"
Cohesion: 0.19
Nodes (14): client, LocalMissionTask, RETRY_DELAYS, areas, LoginPage(), DEFAULT_STATUS_CONFIG, PortalDonante(), STATUS_CONFIGS (+6 more)

### Community 34 - "Deployment Scripts"
Cohesion: 0.58
Nodes (10): deploy_backend(), deploy_frontend(), die(), log(), ok(), require_repo_root(), require_secrets(), run_migrations() (+2 more)

### Community 35 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, eslint@^9.39.4, @eslint/js@^9.39.4, globals@^17.4.0, @types/node@^24.12.2, @types/react@^19.2.14, @types/react-dom@^19.2.3, typescript@~6.0.2 (+9 more)

### Community 36 - "Jest Configuration"
Cohesion: 0.22
Nodes (9): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+1 more)

### Community 37 - "Impacta+ Product Requirements"
Cohesion: 0.04
Nodes (46): 10. Riesgos y Dependencias, 11. Plan de Monetización, 12. Glosario, 13. Aprobaciones, 1.1 Propósito, 1.2 Problema a Resolver, 1.3 Visión del Producto, 1.4 Modelo de Negocio (+38 more)

### Community 38 - "ESLint Configuration"
Cohesion: 0.24
Nodes (4): eslint-plugin-react-hooks@^7.0.1, eslint-plugin-react-refresh@^0.5.2, eslint-plugin-react-hooks, eslint-plugin-react-refresh

### Community 39 - "AI Assistant Specification"
Cohesion: 0.04
Nodes (45): ADDED Requirements, Asistente de IA Specification, Purpose, Requirement: Acciones humanas, Requirement: Asistencia contextual, Requirement: Continuidad sin modelo, Requirement: Defensa cognitiva independiente del proveedor, Requirement: Escritura limitada a borradores (+37 more)

### Community 40 - "oauth.service.ts"
Cohesion: 0.22
Nodes (6): FacebookStrategy, GithubStrategy, GoogleStrategy, OAuthModule, OAuthProfile, OAuthVerifier

### Community 41 - "Nest CLI Configuration"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 42 - "AI Content Security"
Cohesion: 0.15
Nodes (14): ContentIngressGuard, PrivacySanitizer, Rule, SafeTelemetryEmitter, DataClass, IngressDecision, ProviderKind, RedactionKind (+6 more)

### Community 44 - "Backend Build Configuration"
Cohesion: 0.50
Nodes (3): exclude, extends, ./tsconfig.json

### Community 45 - "Forensic Incident Reports"
Cohesion: 0.07
Nodes (26): 1. Desastre `af06edb` (13-ago) — documentado, reparado, 2. Subdominios alucinados (`api-impacta`, `app-impacta`), 3. Reset oculto del 24-ago — descartó ~4000 líneas de trabajo legítimo, 5. Migración fantasma — drift entre DB de prod y repo, 6. `backend/test/` borrado en rama P2P, 7. `members.service.ts findOne` — 200+null en vez de 404 cross-tenant, Acciones tomadas (25-ago), Informe forense — 25-ago-2026 (+18 more)

### Community 46 - "Biodiversity Knowledge Catalog"
Cohesion: 0.07
Nodes (27): Afirmación científica o educativa, Catálogo inicial, Criterios de aceptación de la Fase 0, Decisiones propuestas para revisar, Entidades conceptuales, Especie del catálogo, Fase 0 — Modelo de conocimiento, Fase 0 — Modelo de conocimiento y alcance (+19 more)

### Community 47 - "Scientific Interoperability"
Cohesion: 0.08
Nodes (24): Actores científicos y académicos prioritarios, Arquitectura de interoperabilidad propuesta, Conectores técnicamente viables, Decisiones pendientes antes de implementar sincronización, Etapa A — prueba técnica sin convenios, Etapa B — mesa de colaboración territorial, Etapa C — piloto cooperativo, Etapa D — retorno de datos (+16 more)

### Community 49 - "backend/package.json"
Cohesion: 0.09
Nodes (21): author, description, @eslint/eslintrc@^3.2.0, @eslint/js@^9.18.0, globals@^17.0.0, prisma@^5.11.0, @types/passport-jwt@^4.0.1, @eslint/js (+13 more)

### Community 53 - "AI Fine-Tuning Strategy"
Cohesion: 0.09
Nodes (22): 1. Baseline antes de entrenar, 2. SFT con LoRA/QLoRA, 3. DPO opcional, 4. Evaluación de checkpoints, Arquitectura, Copiloto profesional y editorial, Decisión inicial, Estrategia de fine-tuning (+14 more)

### Community 54 - "Recurring Payments and Receipts Tasks"
Cohesion: 0.33
Nodes (4): 1. P2P — backend (modelo y endpoints), 2. Recurrencia — suscripción y pasarela, 3. Pagos — trazabilidad y recibos, 5. Hardening + docs + verificación

### Community 55 - "Biodiversity Catalog Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Catalogo de biodiversidad Specification, Purpose, Requirement: Aislamiento de observaciones, Requirement: Catálogo global de especies, Requirement: Estados editoriales, Requirement: Fuentes trazables, Requirement: Procedencia de registros externos (+13 more)

### Community 59 - "Grant Management Board"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Purpose, Requirement: Board portal (directorio y gobernanza), Requirement: Catálogo global de oportunidades verificables, Requirement: Colaboración consentida, Requirement: Formulación asistida sin envío autónomo, Requirement: Gestión de subvenciones (grants) con deadlines y documentos, Requirement: KPIs y reportes de fondos y gobernanza (+13 more)

### Community 60 - "Forensic Incident Reports"
Cohesion: 0.16
Nodes (17): Lecciones 25-ago-2026 (forense post-sabotaje), 4. Commit camuflado `40873de` — desmanteló protecciones de dominio único, App(), Campaigns, Donations, LandingPage, LegacyDomainRedirect(), LoginPage (+9 more)

### Community 62 - "Secure Reporting and Journalism"
Cohesion: 0.10
Nodes (20): Acceso sin cuenta, Alcance inicial, Autorización, Canal de denuncias, Construir o integrar, Criterios de aceptación, Fases, Flujo y publicación (+12 more)

### Community 63 - "Offline Mission Storage"
Cohesion: 0.31
Nodes (15): assertTenant(), clearTenant(), getAll(), getDB(), getPending(), LocalMission, markTaskSynced(), MissionsDBSchema (+7 more)

### Community 64 - "Community Profiles API"
Cohesion: 0.19
Nodes (3): CurrentUser, CommunityController, CommunityService

### Community 65 - "Local AI Runtime Strategy"
Cohesion: 0.16
Nodes (13): AiGatewayClient, AiProvider, Qwen local sobre Sentinel, Criterio de migración local, Fases y criterio de salida, Reglas para la etapa API, Transición de cerebro API a Qwen local, Alcance permitido (+5 more)

### Community 66 - "Citizen Journalism Design"
Cohesion: 0.11
Nodes (19): Criterios de aceptación, Editor de investigación, Entrada pública, Evidencia y verificación, Experiencia de reporte, Flujo asistido, Flujo editorial, Impacta+ — Periodismo ciudadano e investigación protegida (+11 more)

### Community 68 - "Regional Operations Planning"
Cohesion: 0.11
Nodes (18): Capacidades del cerebro operativo, Catálogo público de oportunidades, Ciclo operativo, Diagnóstico de preparación, Ejecución y rendición, Ejemplo regional, Estudio de formulación, Fases (+10 more)

### Community 69 - "Encrypted Internal Messaging"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Mensajería interna Specification, Purpose, Requirement: Autorización por conversación, Requirement: Cambios de membresía rotan claves, Requirement: Contenido fuera de logs, Requirement: E2EE mediante protocolo revisado, Requirement: IA como participante consentido (+9 more)

### Community 70 - "Citizen Journalism Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Periodismo ciudadano Specification, Purpose, Requirement: Asignación mínima a periodistas, Requirement: Experiencia simple y asistida, Requirement: IA local sin autoridad editorial, Requirement: Identidad separada de investigación, Requirement: Perfil ciudadano sin credencial profesional (+9 more)

### Community 71 - "Sentinel Runtime Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Purpose, Requirement: Degradación segura, Requirement: Inferencia local aislada, Requirement: Nodo Sentinel obligatorio, Requirement: Puerto de backend reservado sin interferir con Sentinel, Requirement: Separación de responsabilidades, Requirement: Señales de host no confiables (+9 more)

### Community 72 - "Platform Architecture and Operations"
Cohesion: 0.12
Nodes (17): 11.1 Estrategia de Backup, 11.2 RTO/RPO, 11.3 Script de Backup, 12.1 Protección de Datos, 12.2 Contabilidad, 13.1 Escalabilidad Horizontal, 2.1 Frontend, 2.2 Backend (+9 more)

### Community 73 - "AI Security Guardrails"
Cohesion: 0.12
Nodes (15): Corpus adversarial, Criterios de aceptación, Decisión explícita y fail closed, Estrategia, Frontera previa al modelo, Impacta+ — Reutilización de la defensa cognitiva de Sentinel, Implementación revisada, Las palabras no son la única defensa (+7 more)

### Community 74 - "Encrypted Conversations and Intelligence"
Cohesion: 0.13
Nodes (15): Adjuntos, Auditoría requerida, Claves y dispositivos, `CONFIDENTIAL_E2EE`, Criterios de aceptación, Dos modos visibles, IA dentro de conversaciones, Impacta+ — Cifrado de conversaciones e intercambio de inteligencia (+7 more)

### Community 75 - "Model-Independent AI Architecture"
Cohesion: 0.13
Nodes (15): Anti-patrones prohibidos, Arquitectura, Contratos canónicos, Criterios de aceptación, Decisión fundamental, Evaluación como puerta de entrada, Impacta+ — Arquitectura de inteligencia independiente del modelo, OmniRoute como gateway inicial (+7 more)

### Community 76 - "Membership and Volunteer Design"
Cohesion: 0.11
Nodes (19): Mission, MissionTask, MissionItemProps, Organization, Context, Decisions, Goals / Non-Goals, Risks / Trade-offs (+11 more)

### Community 77 - "Recurring Webpay Payments"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Purpose, recurrencia-webpay Specification, Requirement: Cobro programado e idempotente, Requirement: Creación de suscripción recurrente con Webpay/Flow, Requirement: Portal de pausa/cancelación (complementa portal-donante), Scenario: Aislamiento multi-tenant, Scenario: Alta de suscripción mensual (+6 more)

### Community 78 - "AuthUser"
Cohesion: 0.27
Nodes (4): AuthUser, DonationsService, sanitizePdfText(), P1 — Pagos correctos antes de cobrar en producción

### Community 79 - "AI Provider Integration"
Cohesion: 0.22
Nodes (7): AiCompletionRequest, AiCompletionResult, AiMessage, OmniRouteConfig, OmniRouteProvider, OmniRouteResponse, sanitizeAssistantContent()

### Community 80 - "Communication Journeys"
Cohesion: 0.14
Nodes (13): ADDED Requirements, jornadas-comunicacion Specification, Purpose, Requirement: Control de consentimiento (anti-spam), Requirement: Journeys con plantillas email/SMS, Requirement: Segmentación de audiencia multi-tenant, Scenario: Aislamiento entre orgs, Scenario: Crear journey con pasos (+5 more)

### Community 81 - "Anonymous Reporting Channel"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Canal de denuncias Specification, Purpose, Requirement: Ingreso sin cuenta, Requirement: Límites del anonimato, Requirement: Minimización de metadatos, Requirement: Publicación redactada y revisada, Requirement: Separación de acceso (+5 more)

### Community 82 - "Impacta+ — guía raíz para agentes"
Cohesion: 0.14
Nodes (14): Comandos base, Convenciones de commits, Design system, El desastre del 13-ago-2026 (contexto, NO repetir), Estado actual (2026-08-25 — post-forense sabotaje), Estado actual (2026-10-21 — merges + deploy parcial), Estructura del monorepo, Impacta+ — guía raíz para agentes (+6 more)

### Community 83 - "Sentinel Deployment Architecture"
Cohesion: 0.15
Nodes (12): Adaptador Sentinel local, Criterios de aceptación, Degradación segura, Despliegue y verificación futura, Esquema mínimo de evento, Estado verificado de `fenix` — 2026-08-25, Eventos desde Sentinel hacia Impacta+, Fronteras de responsabilidad (+4 more)

### Community 84 - "Biodiversity Data Sources"
Cohesion: 0.15
Nodes (13): Alcance, Fuentes académicas iniciales, Fuentes de ocurrencias y comunidad, Fuentes iniciales — Biodiversidad del Biobío y piloto Curanilahue, Fuentes oficiales prioritarias, Fuentes regionales y territoriales, Inventario forestal comunal, Jerarquía de confianza propuesta (+5 more)

### Community 85 - "Safe Community AI Design"
Cohesion: 0.15
Nodes (12): Asistente de IA, Conocimiento comunitario, Context, Data flow, Decisions, Denuncias, Design: Comunidad segura y asistente de IA, Goals / Non-Goals (+4 more)

### Community 86 - "Event Management Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, eventos Specification, Purpose, Requirement: Check-in por QR, Requirement: Creación de evento, Requirement: Emisión de tickets, Scenario: Aislamiento de eventos entre orgs, Scenario: Check-in válido (+4 more)

### Community 87 - "Advanced Memberships"
Cohesion: 0.15
Nodes (12): ADDED Requirements, membresias-avanzadas Specification, Purpose, Requirement: Auto-renovación y vencimiento de membresía, Requirement: Membresía por tier con cuota, Requirement: Portal de socio y directorio público, Scenario: Aislamiento por tenant, Scenario: Directorio público de socios (+4 more)

### Community 88 - "Sentinel Runtime Design"
Cohesion: 0.15
Nodes (12): Adaptador local, Cifrado, Conformidad, Context, Data flow, Decisions, Degradación, Design: Runtime de Impacta+ sobre Sentinel (+4 more)

### Community 89 - "Donor Portal Requirements"
Cohesion: 0.15
Nodes (12): portal-donante Specification, Purpose, Requirement: Acceso sin exponer datos de otros donantes, Requirement: Descarga de recibo PDF, Requirement: Gestión de recurrencia, Requirement: Historial de donaciones del donante autenticado, Requirements, Scenario: Aislamiento por org (+4 more)

### Community 90 - "Project Work Plan"
Cohesion: 0.18
Nodes (11): 0.5 Source of truth y reglas duras (anti-patrones), 1. Design system — "The Digital Steward", 2. Backlog ordenado, 3. Convenciones de ejecución, 4. Entrypoint para el agente, Bloqueantes futuros, El desastre, Fase D — Pulido (en curso) (+3 more)

### Community 92 - "frontend/package.json"
Cohesion: 0.15
Nodes (12): react-dom@^19.2.4, tailwind-merge@^3.5.0, @types/three@^0.184.0, zustand@^5.0.12, react-dom, name, private, type (+4 more)

### Community 93 - "Overview.tsx"
Cohesion: 0.27
Nodes (8): CampaignCard(), Campaigns(), Donation, formatCLP(), OrganizationSummary, Overview(), StatCard(), Fase C — Frontend app (consolidada en dominio único — 24-ago-2026)

### Community 94 - "Donor Portal Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Purpose, Requirement: Acceso sin exponer datos de otros donantes, Requirement: Descarga de recibo PDF, Requirement: Gestión de recurrencia, Requirement: Historial de donaciones del donante autenticado, Scenario: Aislamiento por org, Scenario: Consulta filtrada por miembro (+3 more)

### Community 95 - "Community Knowledge Governance"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Comunidad y conocimiento Specification, Purpose, Requirement: Credencial no equivale a permiso, Requirement: Perfiles múltiples, Requirement: Permisos con alcance, Requirement: Procedencia y consentimiento comunitario, Scenario: Agrónomo verificado propone una afirmación (+3 more)

### Community 96 - "Volunteer Management"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Purpose, Requirement: Asignación de voluntarios a misiones, Requirement: Disponibilidad y auto-asignación del voluntario, Requirement: Turno de voluntariado ligado a misión, Scenario: Aislamiento de turnos entre orgs, Scenario: Confirmar asignación, Scenario: Crear turno para una misión (+3 more)

### Community 97 - "Offline Mission Synchronization"
Cohesion: 0.17
Nodes (11): misiones-offline Specification, Purpose, Requirement: Almacenamiento offline aislado por tenant, Requirement: Indicación UX de estado de conexión, Requirement: Sincronización idempotente con backend, Requirements, Scenario: Aislamiento entre tenants, Scenario: Badge offline (+3 more)

### Community 98 - "Backend Developer Guide"
Cohesion: 0.18
Nodes (10): Backend — guía para agentes, Comandos, Commits, Deploy, Estructura, Gotchas, Multi-tenant (pendiente, ver fase A3 de PLAN.md), Schema actual (+2 more)

### Community 99 - "ai-gateway.module.ts"
Cohesion: 0.15
Nodes (8): AI_PROVIDER, AiGatewayModule, AiSecurityModule, KnowledgeModule, KnowledgeSearchRow, KnowledgeService, PublicKnowledgeCitation, PublicKnowledgeContext

### Community 100 - "Offline Mission Synchronization"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Purpose, Requirement: Almacenamiento offline aislado por tenant, Requirement: Indicación UX de estado de conexión, Requirement: Sincronización idempotente con backend, Scenario: Aislamiento entre tenants, Scenario: Badge offline, Scenario: Guardar tarea offline (+2 more)

### Community 101 - "Backend Project Documentation"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 103 - "Community Participation and Knowledge"
Cohesion: 0.20
Nodes (10): Conocimiento comunitario y consentimiento, Credenciales y confianza, Criterios de aceptación, Decisión de arquitectura, Flujo de contribución, Impacta+ — Perfiles, participación y conocimiento comunitario, Modelo conceptual, Perfiles de participación (+2 more)

### Community 104 - "Regional AI Master Plan"
Cohesion: 0.20
Nodes (10): Baseline de validación al 25-ago-2026, Decisiones que requieren personas responsables, Dependencias, Documentos de referencia, Estrategia de release, Impacta+ — Plan maestro del cerebro operativo regional, Objetivo, Paquete de handoff para el agente implementador (+2 more)

### Community 106 - "Biodiversity Catalog Implementation"
Cohesion: 0.20
Nodes (9): 0. Validación de alcance, 1. Modelo de datos, 2. Catálogo y fuentes — backend, 4. Dashboard de curación, 5. Fichas educativas públicas, 6. Observaciones de conservación, 7. Evidencia científica, 8. Verificación y entrega (+1 more)

### Community 107 - "Species Observations and Media"
Cohesion: 0.20
Nodes (9): ADDED Requirements, especies-avanzada Specification, Purpose, Requirement: Multimedia por especie, Requirement: Observaciones de campo geo-referenciadas, Scenario: Aislamiento de observaciones, Scenario: Mapa simple de avistamientos, Scenario: Registrar observación con coordenadas (+1 more)

### Community 108 - "Platform Overview and Technology Stack"
Cohesion: 0.20
Nodes (10): Core, 🛠️ Desarrollo Local, 📖 Documentación Relacionada, 🚀 Ecosistema Productivo, 📂 Estructura del Proyecto, Impacta+ — Multi-tenant SaaS for NGOs 🌿, Infraestructura (servidor fenix — Azure), Logs del backend (+2 more)

### Community 112 - "RecurrenceToggle"
Cohesion: 0.22
Nodes (8): RecurrenceStatus, RecurrenceToggle(), MyDonation, 2. Misiones offline — backend sync idempotente, 3. Portal donante — backend, 4. Portal donante — frontend, 5. Hardening + docs + verificación, 4. Frontend — páginas P2P y portal reforzado

### Community 113 - "ref_react"
Cohesion: 0.19
Nodes (12): Al operar como agente, Earth(), EarthBackground(), cn(), groupsByPath, NavGroup, navGroups, NavItem (+4 more)

### Community 114 - "Biodiversity Catalog Proposal"
Cohesion: 0.22
Nodes (8): Capabilities, Impact, Modified Capabilities, New Capabilities, Non-goals, Proposal: Catálogo global de biodiversidad y educación científica, What Changes, Why

### Community 115 - "Safe Community AI Implementation"
Cohesion: 0.22
Nodes (8): 0. Gobierno y validación, 1. Identidad y comunidad, 2. Mensajería interna, 3. Canal de denuncias, 3B. Periodismo ciudadano e investigación, 5. Fine-tuning y producción futura, 6. Verificación integral, Tasks: Comunidad segura y asistente de IA

### Community 116 - "Pendientes priorizados de Impacta+"
Cohesion: 0.08
Nodes (26): Guía raíz para agentes de Impacta+, Reglas de reanudación y backlog vigente, ReceiptsController, Canario de migraciones en PostgreSQL scratch, Grafo actualizado: 2402 nodos, 3663 aristas y 190 comunidades, Estado de entrada, Handoff vigente de Impacta+, Punto de reanudación (+18 more)

### Community 117 - "vite.config.ts"
Cohesion: 0.29
Nodes (6): @tailwindcss/vite@^4.2.2, vite@^8.0.4, @vitejs/plugin-react@^6.0.1, @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 118 - "Tasks: Runtime de Impacta+ sobre Sentinel"
Cohesion: 0.29
Nodes (6): 0. Baseline, 1. Contratos, 3. Degradación, 4. Qwen local futuro, 5. Operación, Tasks: Runtime de Impacta+ sobre Sentinel

### Community 119 - "Visual Brand Guidelines"
Cohesion: 0.25
Nodes (8): 1.1 Colores Principales, 1.2 Colores Secundarios (Derivados), 2.1 Fuente Principal, 2.2 Fuente Secundaria (Títulos/Logo), 4.1 Border Radius, 5.1 Botones, 6.1 Logo, Identidad Visual - Impacta+

### Community 120 - "Competitor Insights Integration"
Cohesion: 0.25
Nodes (7): Capabilities, Impact, Modified Capabilities, New Capabilities, Propuesta: Integrar aprendizajes de competencia (Neon/SERCA) — misiones offline + portal donante, What Changes, Why

### Community 121 - "Communication and Grant Reporting"
Cohesion: 0.25
Nodes (7): Capabilities, Impact, Modified Capabilities, New Capabilities, Propuesta: Comunicación por jornadas, subvenciones/board y biblioteca de especies avanzada, What Changes, Why

### Community 122 - "Safe Community AI Proposal"
Cohesion: 0.25
Nodes (7): Capabilities, Impact, New Capabilities, Non-goals, Proposal: Comunidad segura y asistente de IA, What Changes, Why

### Community 123 - "Sentinel Runtime Proposal"
Cohesion: 0.25
Nodes (7): Capabilities, Impact, New Capabilities, Non-goals, Proposal: Runtime de Impacta+ sobre Sentinel, What Changes, Why

### Community 124 - "AI Security Components"
Cohesion: 0.29
Nodes (7): Componentes propuestos, `ContentIngressGuard`, `DataPolicyEngine`, `OutputGuard`, `PrivacySanitizer`, `SafeContextBuilder`, `ToolPolicyGateway`

### Community 125 - "Species Catalog and Conservation Status"
Cohesion: 0.29
Nodes (7): Species(), SpeciesForm(), Migración, 3. Migración de especies actuales, Requirement: Estado de conservación UICN por especie, Scenario: Aislamiento de catálogos por org, Scenario: Registrar categoría UICN

### Community 126 - "Biodiversity Collaboration Model"
Cohesion: 0.29
Nodes (7): Decisions, Fuentes académicas, Interoperabilidad y colaboración, Modelo lógico, Participación comunitaria, Privacidad geográfica, Publicación

### Community 128 - "Biodiversity Catalog Design"
Cohesion: 0.33
Nodes (5): Context, Data flow, Design: Catálogo global de biodiversidad y educación científica, Goals / Non-Goals, Risks / Trade-offs

### Community 129 - "Communication and Grant Implementation"
Cohesion: 0.33
Nodes (5): 1. Jornadas de comunicación — modelos y motor, 2. Subvenciones / board — backend, 3. Especies avanzada — backend, 4. Frontend — pantallas y rutas, 5. Hardening + docs + verificación

### Community 130 - "Membership and Volunteer Implementation"
Cohesion: 0.33
Nodes (5): 1. Membresías — base (backend + worker), 2. Voluntariado (backend + frontend), 3. Eventos (backend + frontend), 4. Frontend — integración y directorio, 5. Hardening + docs + verificación

### Community 132 - "Debugging Workflow Guide"
Cohesion: 0.40
Nodes (4): Debug Issue, Steps, Tips, Token Efficiency Rules

### Community 133 - "Codebase Exploration Guide"
Cohesion: 0.40
Nodes (4): Explore Codebase, Steps, Tips, Token Efficiency Rules

### Community 134 - "Safe Refactoring Guide"
Cohesion: 0.40
Nodes (4): Refactor Safely, Safety Checks, Steps, Token Efficiency Rules

### Community 135 - "Code Review Guide"
Cohesion: 0.40
Nodes (4): Output Format, Review Changes, Steps, Token Efficiency Rules

### Community 136 - "CodeBuddy Tooling Guide"
Cohesion: 0.40
Nodes (4): Key Tools, MCP Tools: code-review-graph, When to use graph tools FIRST, Workflow

### Community 137 - "Debugging Workflow Guide"
Cohesion: 0.40
Nodes (4): Debug Issue, Steps, Tips, Token Efficiency Rules

### Community 138 - "Codebase Exploration Guide"
Cohesion: 0.40
Nodes (4): Explore Codebase, Steps, Tips, Token Efficiency Rules

### Community 139 - "Safe Refactoring Guide"
Cohesion: 0.40
Nodes (4): Refactor Safely, Safety Checks, Steps, Token Efficiency Rules

### Community 140 - "Code Review Guide"
Cohesion: 0.40
Nodes (4): Output Format, Review Changes, Steps, Token Efficiency Rules

### Community 141 - "Protected Reporting"
Cohesion: 0.40
Nodes (5): Alcance, Criterio de salida, Fase 7 — Reportes protegidos y periodismo, Objetivo, Restricción IA

### Community 142 - "Specialized AI Fine-Tuning"
Cohesion: 0.40
Nodes (5): Alcance, Criterio de salida, Exclusiones de dataset, Fase 10 — Fine-tuning y asistentes especializados, Objetivo

### Community 143 - "Global Identity and Permissions"
Cohesion: 0.40
Nodes (5): Backend y datos, Criterio de salida, Fase 1 — Identidad global, comunidad y permisos, Frontend, Objetivo

### Community 144 - "Local Qwen Deployment"
Cohesion: 0.40
Nodes (5): Criterio de salida, Fase 9 — Qwen local sobre nodo Sentinel, Infraestructura planificada, Migración, Objetivo

### Community 145 - "Graph Tool Workflow"
Cohesion: 0.40
Nodes (4): Key Tools, MCP Tools: code-review-graph, When to use graph tools FIRST, Workflow

### Community 146 - "Issue Debugging Guide"
Cohesion: 0.40
Nodes (4): Debug Issue, Steps, Tips, Token Efficiency Rules

### Community 147 - "Codebase Exploration Guide"
Cohesion: 0.40
Nodes (4): Explore Codebase, Steps, Tips, Token Efficiency Rules

### Community 148 - "Safe Refactoring Guide"
Cohesion: 0.40
Nodes (4): Refactor Safely, Safety Checks, Steps, Token Efficiency Rules

### Community 149 - "Change Review Guide"
Cohesion: 0.40
Nodes (4): Output Format, Review Changes, Steps, Token Efficiency Rules

### Community 150 - "Graph Tool Workflow"
Cohesion: 0.40
Nodes (4): Key Tools, MCP Tools: code-review-graph, When to use graph tools FIRST, Workflow

### Community 151 - "Graph Tool Workflow"
Cohesion: 0.40
Nodes (4): Key Tools, MCP Tools: code-review-graph, When to use graph tools FIRST, Workflow

### Community 152 - "Competitive Insights Design"
Cohesion: 0.40
Nodes (4): Context, Decisions, Goals / Non-Goals, Risks / Trade-offs

### Community 153 - "Grant Reporting Design"
Cohesion: 0.40
Nodes (4): Context, Decisions, Goals / Non-Goals, Risks / Trade-offs

### Community 154 - "Graph Tool Workflow"
Cohesion: 0.40
Nodes (4): Key Tools, MCP Tools: code-review-graph, When to use graph tools FIRST, Workflow

### Community 156 - "Scientific Catalog and Education"
Cohesion: 0.50
Nodes (4): Alcance, Criterio de salida, Fase 4 — Catálogo científico y educación regional, Objetivo

### Community 157 - "Professional Network and Projects"
Cohesion: 0.50
Nodes (4): Alcance, Criterio de salida, Fase 5 — Red profesional, oportunidades y proyectos, Objetivo

### Community 158 - "Private Managed Messaging"
Cohesion: 0.50
Nodes (4): Alcance, Criterio de salida, Fase 6 — Mensajería `PRIVATE_MANAGED`, Objetivo

### Community 159 - "Encrypted Intelligence Exchange"
Cohesion: 0.50
Nodes (4): Alcance, Criterio de salida, Fase 8 — E2EE e intercambio de inteligencia, Objetivo

### Community 160 - "Regional Interoperability"
Cohesion: 0.50
Nodes (4): Alcance, Criterio de salida, Fase 11 — Escala regional e interoperabilidad, Objetivo

### Community 161 - "Governance and Security Baseline"
Cohesion: 0.50
Nodes (4): Criterio de salida, Entregables, Fase 0 — Gobierno, baseline y seguridad de trabajo, Objetivo

### Community 162 - "Sentinel Runtime Defense"
Cohesion: 0.50
Nodes (4): Criterio de salida, Fase 2 — Runtime Sentinel y defensa independiente del modelo, Objetivo, Reutilización Sentinel

### Community 163 - "Frontend Setup Guide"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 164 - "Landing Page Setup Guide"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 165 - "Testing Strategy"
Cohesion: 0.67
Nodes (3): Automatizadas, Estrategia de pruebas, Manuales y especializadas

### Community 166 - "Application Architecture"
Cohesion: 0.67
Nodes (3): Backend, Frontend — mismo build y dominio, Mapa de módulos futuro

### Community 180 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

## Knowledge Gaps
- **11 isolated node(s):** `./tsconfig.json`, `uvx`, `uvx`, `Canario de migraciones en PostgreSQL scratch`, `Grafo actualizado: 2402 nodos, 3663 aristas y 190 comunidades` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1193 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `app.module.ts`, `auth.controller.ts`, `Public AI Gateway`, `ai-gateway.module.ts`, `Organization Validation`, `oauth.service.ts`, `Mission Management`, `Backend Dependencies`, `AI Content Security`, `AI Provider Integration`, `Demo Request API`, `backend/package.json`, `Database Services and Tests`, `Member Management`, `User Management API`, `auth.module.ts`, `community.controller.ts`?**
  _High betweenness centrality (0.172) - this node is a cross-community bridge._
- **What connects `./tsconfig.json`, `uvx`, `uvx` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `auth.controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12333333333333334 - nodes in this community are weakly interconnected._
- **Why does `Impacta+ — guía raíz para agentes` connect `Impacta+ — guía raíz para agentes` to `ref_react`, `Platform Architecture and Research Plans`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Should `Development Containers` be split into smaller, more focused modules?**
  _Cohesion score 0.048484848484848485 - nodes in this community are weakly interconnected._
- **Why does `DatabaseService` connect `Database Services and Tests` to `Community Profiles API`, `auth.controller.ts`, `ai-gateway.module.ts`, `Organization Validation`, `Mission Management`, `@nestjs/common`, `Public P2P Pages API`, `Demo Request API`, `Impacta+ — guía raíz para agentes`, `Member Management`, `User Management API`, `community.controller.ts`, `OAuthService`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `Species Management` be split into smaller, more focused modules?**
  _Cohesion score 0.14761904761904762 - nodes in this community are weakly interconnected._