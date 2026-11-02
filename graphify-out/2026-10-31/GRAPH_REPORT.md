# Graph Report - ONG_Impacta  (2026-10-31)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1204 nodes · 2392 edges · 59 communities (44 shown, 15 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.85)
- Token cost: 26,179 input · 701 output

## Graph Freshness
- Built from commit: `c1a816e6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Frontend Pages and App
- Authentication Service
- AI Gateway
- Community Credentials and Profiles
- Docker Development Environment
- Species Management
- Organization Validation
- CI Pipeline
- Mission Task Management
- User and Donation Endpoints
- Backend Dependencies
- NestJS Module Configuration
- Frontend Dependencies
- Backend Development Dependencies
- Campaign and P2P Services
- Campaign Data Validation
- Demo Request API
- Database Service and Tests
- Member Management and RUT Validation
- Backend TypeScript Configuration
- Backend Package Scripts
- Prisma and Tenant Context
- User Management API
- Frontend TypeScript Configuration
- Landing TypeScript Configuration
- Landing Development Dependencies
- Node TypeScript Configuration
- Authentication Module and Guards
- Donation Creation
- Next.js Landing Configuration
- Backend Scripts
- Landing Page Components
- Application Health Endpoint
- Tenant Middleware and Storage
- Deployment Scripts
- Frontend Development Dependencies
- Jest Configuration
- Role-Based Authorization
- ESLint Configuration
- Public P2P Pages
- Vite Configuration
- Nest CLI Configuration
- Backend Bootstrap and Logging
- Landing Build Scripts
- Backend Build Configuration
- Landing Package Scripts
- ESLint Dependency
- ESLint Core Dependency
- TypeScript ESLint Configuration
- Dependency Overrides
- Frontend Project References
- Code Review MCP Configuration
- Code Review MCP Configuration
- HTTP Logging Dependency
- Prettier Dependency
- ts-node Dependency
- Review Session Startup Script
- Review Graph Update Script
- PostCSS Configuration

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 69 edges
2. `CurrentTenant` - 42 edges
3. `DatabaseService` - 37 edges
4. `Roles()` - 24 edges
5. `Public()` - 23 edges
6. `compilerOptions` - 22 edges
7. `class-validator` - 22 edges
8. `CampaignsService` - 21 edges
9. `AuthService` - 19 edges
10. `AuthUser` - 19 edges

## Surprising Connections (you probably didn't know these)
- `typescript@^5` --declares--> `typescript`  [EXTRACTED]
  landing/package.json → backend/package.json
- `@types/node@^24.12.2` --declares--> `@types/node`  [EXTRACTED]
  frontend/package.json → backend/package.json
- `@types/node@^20` --declares--> `@types/node`  [EXTRACTED]
  landing/package.json → backend/package.json
- `typescript@~6.0.2` --declares--> `typescript`  [EXTRACTED]
  frontend/package.json → backend/package.json
- `globals@^17.4.0` --declares--> `globals`  [EXTRACTED]
  frontend/package.json → backend/package.json

## Import Cycles
- None detected.

## Communities (59 total, 15 thin omitted)

### Community 0 - "Frontend Pages and App"
Cohesion: 0.05
Nodes (80): client, App(), Campaigns, Donations, LandingPage, LegacyDomainRedirect(), LoginPage, Members (+72 more)

### Community 1 - "Authentication Service"
Cohesion: 0.05
Nodes (18): AuthController, AuthService, Public(), LoginDto, OAuthLoginDto, OAuthProvider, OAuthRegisterDto, SUPPORTED_OAUTH_PROVIDERS (+10 more)

### Community 2 - "AI Gateway"
Cohesion: 0.05
Nodes (29): AiGatewayController, AI_PROVIDER, AiGatewayModule, AiOrchestratorService, AiCompletionRequest, AiCompletionResult, AiGatewayClient, AiMessage (+21 more)

### Community 3 - "Community Credentials and Profiles"
Cohesion: 0.06
Nodes (12): CommunityController, CommunityModule, CommunityService, CredentialRow, DisciplineRow, ProfileRow, RoleAssignmentRow, CreateCredentialDto (+4 more)

### Community 4 - "Docker Development Environment"
Cohesion: 0.05
Nodes (44): build, container_name, depends_on, env_file, environment, ports, restart, context (+36 more)

### Community 5 - "Species Management"
Cohesion: 0.07
Nodes (7): @nestjs/platform-express@^11.0.1, CreateSpeciesDto, SpeciesController, SpeciesService, StorageController, StorageService, @nestjs/platform-express

### Community 6 - "Organization Validation"
Cohesion: 0.08
Nodes (6): CreateOrganizationDto, ORGANIZATION_PLANS, OrganizationPlan, OrganizationsController, OrganizationsModule, OrganizationsService

### Community 7 - "CI Pipeline"
Cohesion: 0.06
Nodes (39): defaults, env, runs-on, services, steps, run, DATABASE_URL, JWT_SECRET (+31 more)

### Community 8 - "Mission Task Management"
Cohesion: 0.09
Nodes (5): CreateMissionDto, CreateMissionTaskDto, UpdateTaskDto, MissionsController, MissionsService

### Community 9 - "User and Donation Endpoints"
Cohesion: 0.12
Nodes (6): AuthUser, CurrentUser, DonationsController, DonationsService, sanitizePdfText(), UpdateRecurringDonationDto

### Community 10 - "Backend Dependencies"
Cohesion: 0.06
Nodes (33): dependencies, @aws-sdk/client-s3@^3.1156.0, axios@^1.19.0, bcrypt@^6.0.0, class-transformer@^0.5.1, class-validator@^0.15.1, google-auth-library@^10.9.1, @nestjs/common@^11.0.1 (+25 more)

### Community 11 - "NestJS Module Configuration"
Cohesion: 0.12
Nodes (12): lokiHost, lokiUsername, DatabaseModule, AiSecurityModule, CampaignsModule, DonationsModule, MembersModule, MissionsModule (+4 more)

### Community 12 - "Frontend Dependencies"
Cohesion: 0.09
Nodes (29): dependencies, axios@^1.15.0, clsx@^2.1.1, framer-motion@^12.38.0, idb@^8.0.3, lucide-react@^1.8.0, react@^19.2.4, react-router-dom@^7.14.1 (+21 more)

### Community 13 - "Backend Development Dependencies"
Cohesion: 0.07
Nodes (29): devDependencies, eslint-config-prettier@^10.0.1, @eslint/eslintrc@^3.2.0, eslint-plugin-prettier@^5.2.2, globals@^17.0.0, @nestjs/schematics@^11.0.0, prisma@^5.11.0, source-map-support@^0.5.21 (+21 more)

### Community 14 - "Campaign and P2P Services"
Cohesion: 0.13
Nodes (3): CurrentTenant, CampaignsController, CampaignsService

### Community 15 - "Campaign Data Validation"
Cohesion: 0.10
Nodes (4): CreateCampaignDto, CreateP2PPageDto, UpdateCampaignDto, UpdateP2PPageDto

### Community 16 - "Demo Request API"
Cohesion: 0.11
Nodes (4): DemoRequestsController, DemoRequestsModule, DemoRequestsService, CreateDemoRequestDto

### Community 17 - "Database Service and Tests"
Cohesion: 0.13
Nodes (7): @nestjs/testing@^11.0.1, AppModule, DatabaseService, resetDb(), bcrypt, @nestjs/testing, supertest

### Community 18 - "Member Management and RUT Validation"
Cohesion: 0.12
Nodes (3): validateRut(), MembersController, MembersService

### Community 19 - "Backend TypeScript Configuration"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 20 - "Backend Package Scripts"
Cohesion: 0.11
Nodes (18): author, description, jest@^30.0.0, @nestjs/cli@^11.0.0, pino-pretty@^13.2.0, tsconfig-paths@^4.2.0, @types/jest@^30.0.0, license (+10 more)

### Community 21 - "Prisma and Tenant Context"
Cohesion: 0.12
Nodes (9): @prisma/client@^5.11.0, prisma, prisma, { PrismaClient }, TenantContext, tenantContextStorage, multiTenantExtension, prisma (+1 more)

### Community 23 - "Frontend TypeScript Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+10 more)

### Community 24 - "Landing TypeScript Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 25 - "Landing Development Dependencies"
Cohesion: 0.14
Nodes (17): @types/node@^24.0.0, @types/node, tailwindcss@^4.2.2, @types/node@^24.12.2, @types/react-dom@^19.2.3, devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4 (+9 more)

### Community 26 - "Node TypeScript Configuration"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+9 more)

### Community 27 - "Authentication Module and Guards"
Cohesion: 0.16
Nodes (6): AuthModule, IS_PUBLIC_KEY, JwtAuthGuard, JwtStrategy, @nestjs/core, @nestjs/passport

### Community 29 - "Next.js Landing Configuration"
Cohesion: 0.14
Nodes (10): react-dom@^19.2.4, nextConfig, dependencies, next@^16.4.2, react@19.2.4, react-dom@19.2.4, react, react-dom (+2 more)

### Community 30 - "Backend Scripts"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 31 - "Landing Page Components"
Cohesion: 0.23
Nodes (10): getPublicStats(), LandingPage(), DemoButton(), Props, DemoModal(), DemoModalProps, EMPTY, Field() (+2 more)

### Community 34 - "Deployment Scripts"
Cohesion: 0.58
Nodes (10): deploy_backend(), deploy_frontend(), die(), log(), ok(), require_repo_root(), require_secrets(), run_migrations() (+2 more)

### Community 35 - "Frontend Development Dependencies"
Cohesion: 0.22
Nodes (9): typescript@^5.7.3, typescript, devDependencies, eslint-plugin-react-refresh@^0.5.2, @types/react@^19.2.14, typescript@~6.0.2, @types/react@^19, @types/react (+1 more)

### Community 36 - "Jest Configuration"
Cohesion: 0.22
Nodes (9): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+1 more)

### Community 37 - "Role-Based Authorization"
Cohesion: 0.33
Nodes (3): Roles(), ROLES_KEY, RolesGuard

### Community 40 - "Vite Configuration"
Cohesion: 0.29
Nodes (6): @tailwindcss/vite@^4.2.2, vite@^8.0.4, @vitejs/plugin-react@^6.0.1, @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 41 - "Nest CLI Configuration"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 42 - "Backend Bootstrap and Logging"
Cohesion: 0.40
Nodes (5): nestjs-pino@^5.3.1, bootstrap(), logger, validateRequiredEnv(), nestjs-pino

### Community 43 - "Landing Build Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 44 - "Backend Build Configuration"
Cohesion: 0.50
Nodes (3): exclude, extends, ./tsconfig.json

### Community 45 - "Landing Package Scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, start

### Community 46 - "ESLint Dependency"
Cohesion: 0.67
Nodes (3): eslint@^9.18.0, eslint, eslint@^9.39.4

### Community 47 - "ESLint Core Dependency"
Cohesion: 0.67
Nodes (3): @eslint/js@^9.18.0, @eslint/js, @eslint/js@^9.39.4

### Community 48 - "TypeScript ESLint Configuration"
Cohesion: 0.67
Nodes (3): typescript-eslint@^8.20.0, typescript-eslint, typescript-eslint@^8.58.0

### Community 49 - "Dependency Overrides"
Cohesion: 0.67
Nodes (3): overrides, js-yaml, multer

## Knowledge Gaps
- **3 isolated node(s):** `./tsconfig.json`, `uvx`, `uvx`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 431 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `NestJS Module Configuration` to `Authentication Service`, `AI Gateway`, `Community Credentials and Profiles`, `Species Management`, `Organization Validation`, `Mission Task Management`, `User and Donation Endpoints`, `Backend Dependencies`, `Campaign and P2P Services`, `Campaign Data Validation`, `Demo Request API`, `Database Service and Tests`, `Member Management and RUT Validation`, `Backend Package Scripts`, `User Management API`, `Authentication Module and Guards`, `Application Health Endpoint`, `Tenant Middleware and Storage`, `Role-Based Authorization`, `Public P2P Pages`, `Backend Bootstrap and Logging`?**
  _High betweenness centrality (0.338) - this node is a cross-community bridge._
- **What connects `./tsconfig.json`, `uvx`, `uvx` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Pages and App` be split into smaller, more focused modules?**
  _Cohesion score 0.05103324348607367 - nodes in this community are weakly interconnected._
- **Why does `CurrentTenant` connect `Campaign and P2P Services` to `Community Credentials and Profiles`, `Role-Based Authorization`, `Organization Validation`, `Species Management`, `Mission Task Management`, `User and Donation Endpoints`, `Campaign Data Validation`, `Member Management and RUT Validation`, `User Management API`, `Donation Creation`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Should `Authentication Service` be split into smaller, more focused modules?**
  _Cohesion score 0.05101807366735301 - nodes in this community are weakly interconnected._
- **Why does `class-validator` connect `Community Credentials and Profiles` to `Authentication Service`, `AI Gateway`, `Species Management`, `Organization Validation`, `Mission Task Management`, `User and Donation Endpoints`, `Backend Dependencies`, `Campaign Data Validation`, `Demo Request API`, `Backend Package Scripts`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `AI Gateway` be split into smaller, more focused modules?**
  _Cohesion score 0.053946053946053944 - nodes in this community are weakly interconnected._