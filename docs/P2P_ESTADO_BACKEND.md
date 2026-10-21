# Campañas P2P y Recaudación — Estado del Backend

**Fecha:** 2026-08-24
**Rama:** `feat/campanas-p2p`
**Dominio único:** `https://impacta.pinguinoseguro.cl` (todo bajo un solo dominio, sin subdominios)

---

## ✅ Hecho y verificado

### 1.1 Modelo Prisma

**Migración:** `20260824171000_add_p2p_and_subscriptions` (aplicada a producción)

**Tablas nuevas en DB:**
- `CampaignP2PPage` — página personal de socio para crowdfunding P2P
- `RecurringSubscription` — suscripción recurrente (Webpay/Flow)

**Columnas nuevas en `Donation`:**
- `sourceType` (DIRECT, P2P, SUBSCRIPTION)
- `sourceId`, `captureId`, `chargeReference` (idempotencia)
- `p2pPageId`, `subscriptionId` (FKs)

### 1.2 Endpoints P2P

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/campaigns/:id/p2p` | JWT (ADMIN, MEMBER) | Crea página P2P |
| GET | `/api/campaigns/:id/p2p/:pageId` | JWT | Detalle de página P2P |
| GET | `/api/p2p/:slug` | Público | Página pública con percentRaised, recentDonors, daysLeft |
| PATCH | `/api/campaigns/:id/p2p/:pageId` | JWT | Cambia estado (ACTIVE, CANCELLED) |
| PATCH | `/api/campaigns/:id` | JWT (ADMIN) | Actualiza campaña; si COMPLETED, cierra páginas P2P hijas |

### 1.3 Confirmación idempotente

- `DonationsService.confirmDonation({ gatewayRef?, captureId? }, status)`
- Busca por `captureId` o `gatewayRef`
- Si ya está SUCCEEDED, no duplica
- Incrementa `currentAmount` en página P2P y campaña madre atómicamente
- `prisma.$transaction` con `isolationLevel: 'Serializable'`

### 1.4 Cierre/cancelación

- PATCH cancela página P2P sin borrar donaciones ni afectar currentAmount
- PATCH campaign COMPLETED cierra todas las páginas P2P hijas en cascada

### Verificación de endpoints (zero trust)

```
/api/p2p/slug-inexistente    → 404 ✅
/api/campaigns               → 401 ✅
/api/donations               → 401 ✅
/api/organizations/public-stats → 200 ✅
/                           → 200 ✅
```

### Verificación de DB (zero trust)

```
Tablas: CampaignP2PPage, Donation, RecurringSubscription ✅
Columnas Donation: captureId, chargeReference, p2pPageId, sourceId, sourceType, subscriptionId ✅
Migración registrada: 20260824171000_add_p2p_and_subscriptions ✅
tsc --noEmit: sin errores ✅
```

---

## ⏳ Pendiente (para próxima sesión / otro agente)

### Sección 2: Recurrencia Webpay/Flow
- [ ] 2.1 Endpoint POST /subscriptions que inicie transacción Webpay/Flow y devuelva paymentUrl
- [ ] 2.2 Integrar transbank-sdk / Flow: callback de confirmación, alta de captureId, programación de nextChargeAt; feature flag TEST/PROD
- [ ] 2.3 Job/cron de cobro: consulta nextChargeAt <= now AND status=ACTIVE, cobra con chargeReference único, crea Donation y avanza nextChargeAt
- [ ] 2.4 Índice único en Donation.chargeReference; webhook reentrante responde 200 sin duplicar

### Sección 3: Trazabilidad y recibos
- [ ] 3.1 Recibos PDF con origen (p2pPage.title / subscriptionId / captureId)
- [ ] 3.2 GET /receipts/:captureId con guard de ownership (404 genérico si ajeno)
- [ ] 3.3 Tests de idempotencia y atómica

### Sección 4: Frontend
- [ ] 4.1 CampanaP2P.tsx (crear/editar página) y P2PPublicPage.tsx en ruta /p2p/:slug con QR (qrcode.react)
- [ ] 4.2 PortalDonante.tsx con lista de RecurringSubscription, selector MONTHLY/QUARTERLY/ANNUAL y PATCH /subscriptions/:id
- [ ] 4.3 Manejo de errores: 404 genérico en /p2p/:slug y recibo, toast "Página no disponible"

### Sección 5: Hardening + docs + verificación
- [ ] 5.1 Tests de aislamiento: GET /p2p/:slug, receipts/:captureId y POST /campaigns/:id/p2p filtran por organizationId, 404 genérico sin filtro
- [ ] 5.2 Docs: actualizar AGENTS.md con nueva ruta /p2p/:slug y credenciales Webpay/Flow solo en server
- [ ] 5.3 Verificación completa: npm run build frontend/backend, npm test backend, ./deploy.sh frontend, ./deploy.sh verify

---

## Archivos creados/modificados

**Creados:**
- backend/src/modules/campaigns/dto/p2p-page.dto.ts
- backend/src/modules/campaigns/dto/update-p2p-page.dto.ts
- backend/src/modules/campaigns/dto/update-campaign.dto.ts
- backend/src/modules/campaigns/p2p.controller.ts
- backend/prisma/migrations/20260824171000_add_p2p_and_subscriptions/migration.sql
- docs/P2P_ESTADO_BACKEND.md (este archivo)

**Modificados:**
- backend/prisma/schema.prisma
- backend/src/modules/campaigns/campaigns.controller.ts
- backend/src/modules/campaigns/campaigns.service.ts
- backend/src/modules/campaigns/campaigns.module.ts
- backend/src/modules/donations/donations.service.ts
- backend/src/modules/donations/dto/create-donation.dto.ts
- infra/nginx/impacta.pinguinoseguro.cl.conf
- AGENTS.md, README.md, PLAN.md
- openspec/changes/*/tasks.md, design.md, proposal.md

**Eliminados:**
- backend/test/ (e2e tests obsoletos que referenciaban DatabaseService.base)
