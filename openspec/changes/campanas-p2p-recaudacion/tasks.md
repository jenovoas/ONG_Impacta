## 1. P2P — backend (modelo y endpoints)

- [ ] 1.1 Crear modelo Prisma `CampaignP2PPage { id, organizationId, campaignId, memberId, slug, title, personalGoal?, currentAmount, status }` + migración y relación a `Campaign`/`Member`
- [ ] 1.2 Endpoints `POST /campaigns/:id/p2p` (guard member + aislamiento org), `GET /campaigns/:id/p2p/:pageId`, `GET /p2p/:slug` público con `percentRaised`, `recentDonors`, `daysLeft`
- [ ] 1.3 Transacción de aporte: al SUCCEEDED, `increment` atómico de `currentAmount` en página y campaña madre (`prisma.$transaction`), idempotente por `captureId`
- [ ] 1.4 Cierre/cancelación: marcar `COMPLETED` de página al completar campaña madre; `PATCH .../p2p/:pageId { status:"CANCELLED" }` sin borrar `Donation` ni afectar `currentAmount`

## 2. Recurrencia — suscripción y pasarela

- [ ] 2.1 Modelo `RecurringSubscription { organizationId, memberId, campaignId?, frequency, amount, nextChargeAt, status, captureId? }` + migración; `POST /subscriptions` inicia transacción Webpay/Flow y devuelve `paymentUrl`
- [ ] 2.2 Integrar Webpay Plus Malla / Flow (transbank-sdk / fallback Flow): callback de confirmación, alta de `captureId`, programación de `nextChargeAt`; feature flag de ambiente (TEST/PROD) sobre el mock actual
- [ ] 2.3 Job/cron de cobro: consulta `nextChargeAt <= now AND status=ACTIVE`, cobra con `chargeReference` único, crea `Donation { sourceType:"SUBSCRIPTION", subscriptionId, captureId, campaignId }` y avanza `nextChargeAt`
- [ ] 2.4 Idempotencia: índice único en `Donation.chargeReference`; webhook reentrante responde 200 sin duplicar (test)

## 3. Pagos — trazabilidad y recibos

- [ ] 3.1 Añadir `sourceType`/`sourceId` (P2P/SUBSCRIPTION/DIRECT) y `captureId`/`gatewayRef` únicos en `Donation` + migración; retrotraer los PDFs recibos a incluir origen (`p2pPage.title`/`subscriptionId`/`captureId`)
- [ ] 3.2 Gift receipt: `GET /receipts/:captureId` con guard de ownership (404 genérico si `captureId` ajeno), genera PDF con pdf-lib (org, RUT, amount CLP, campaign, origen, `Content-Disposition: attachment`)
- [ ] 3.3 Tests de idempotencia y atómica: doble callback de pasarela no duplica `currentAmount`; transacción P2P suma a página y madre en un solo paso

## 4. Frontend — páginas P2P y portal reforzado

- [ ] 4.1 `frontend/src/pages/CampanaP2P.tsx` (crear/editar página por socio) y `frontend/src/pages/P2PPublicPage.tsx` en ruta pública `/p2p/:slug` con QR (qrcode.react) y métricas sociales
- [ ] 4.2 Ampliar `PortalDonante.tsx` con lista de `RecurringSubscription`, selector `MONTHLY/QUARTERLY/ANNUAL` y `PATCH /subscriptions/:id` (pausar/cancelar/reactivar), reutilizando `RecurrenceToggle`/`RecurrenceStatus`
- [ ] 4.3 Manejo de errores: 404 genérico en `/p2p/:slug` y en recibo, toast "Página no disponible"/"Recibo no disponible"; botón descargar gift receipt en donaciones P2P/suscripción

## 5. Hardening + docs + verificación

- [ ] 5.1 Aislamiento y enumeración: grep — `GET /p2p/:slug`, `receipts/:captureId` y `POST /campaigns/:id/p2p` filtran por `organizationId` y devuelven 404 genérico; sin filtro debe fallar
- [ ] 5.2 Docs: actualizar `AGENTS.md` regla #1 (nueva ruta `/p2p/:slug` y suscripciones Webpay/Flow) y `README.md` con credenciales de pasarela solo en server
- [ ] 5.3 Verificación: `npm run build` frontend/backend, `npm test` backend, `./deploy.sh frontend`, `./deploy.sh verify` (impacta 200, impacta.pinguinoseguro.cl 301, api 401, public-stats real), navegación manual: crear página P2P, abrir `/p2p/:slug`, activar suscripción en `/portal`, confirmar gift receipt