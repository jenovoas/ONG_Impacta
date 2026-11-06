## 1. P2P — backend (modelo y endpoints)

- [x] 1.1 Crear modelo Prisma `CampaignP2PPage { id, organizationId, campaignId, memberId, slug, title, personalGoal?, currentAmount, status }` + migración y relación a `Campaign`/`Member` — verificado en merge `1a73832` (modelo + migración `...24171000` + FKs, 21-oct-2026)
- [x] 1.2 Endpoints `POST /campaigns/:id/p2p` (guard member + aislamiento org), `GET /campaigns/:id/p2p/:pageId`, `GET /p2p/:slug` público con `percentRaised`, `recentDonors`, `daysLeft` — endpoints existen (`campaigns.controller` + `p2p.controller`, `PATCH` incluido); payload social por confirmar
- [x] 1.3 Transacción de aporte: al SUCCEEDED, `increment` atómico de `currentAmount` en página y campaña madre (`prisma.$transaction`), idempotente ante callback repetido. Implementado en `donations.service.ts::confirmDonation` con aislamiento `Serializable` y retorno temprano si ya está `SUCCEEDED`.
- [x] 1.4 Cierre/cancelación: completar campaña cierra sus páginas en transacción; `PATCH .../p2p/:pageId { status:"CANCELLED" }` conserva donaciones y montos. Implementado en `campaigns.service.ts::completeCampaign` y `updateP2PPageStatus`.

## 2. Recurrencia — suscripción y pasarela

- [ ] 2.1 Modelo `RecurringSubscription { organizationId, memberId, campaignId?, frequency, amount, nextChargeAt, status, captureId? }` + migración; `POST /subscriptions` inicia transacción Webpay/Flow y devuelve `paymentUrl` — modelo + migración ✅ (`...24171000`); `POST /subscriptions` con `paymentUrl` pendiente (existe `POST callback` mock + `PATCH recurring/:id`)
- [ ] 2.2 Integrar Webpay Plus Malla / Flow (transbank-sdk / fallback Flow): callback de confirmación, alta de `captureId`, programación de `nextChargeAt`; feature flag de ambiente (TEST/PROD) sobre el mock actual — vigente mock (`mock_ref_` en `donations.service.ts:73`)
- [ ] 2.3 Job/cron de cobro: consulta `nextChargeAt <= now AND status=ACTIVE`, cobra con `chargeReference` único, crea `Donation { sourceType:"SUBSCRIPTION", subscriptionId, captureId, campaignId }` y avanza `nextChargeAt`
- [ ] 2.4 Idempotencia: índice único en `Donation.chargeReference`; webhook reentrante responde 200 sin duplicar (test) — índice ✅ (`Donation_chargeReference_key`); test de reentrancia pendiente

## 3. Pagos — trazabilidad y recibos

- [x] 3.1 Añadir `sourceType`/`sourceId` (P2P/SUBSCRIPTION/DIRECT) y `captureId`/`gatewayRef` únicos en `Donation` + migración; retrotraer los PDFs recibos a incluir origen (`p2pPage.title`/`subscriptionId`/`captureId`) — campos ✅ (`...24171000`); origen impreso en PDF por confirmar
- [x] 3.2 `GET /receipts/:captureId` implementado en `receipts.controller.ts`; el servicio filtra por `organizationId` y miembro autenticado, oculta ausencia/ajeno con 404 genérico y agrega al PDF origen, página P2P/suscripción y referencia de pago. Preparación local 2026-11-06; compilación y pruebas quedan pendientes en §5.1/5.3.
- [x] 3.3 Casos unitarios escritos para incremento atómico y callback exitoso repetido en `donations.service.spec.ts`; no ejecutados en esta sesión.

## 4. Frontend — páginas P2P y portal reforzado

- [ ] 4.1 `frontend/src/pages/CampanaP2P.tsx` (crear/editar página por socio) y `frontend/src/pages/P2PPublicPage.tsx` en ruta pública `/p2p/:slug` con QR (qrcode.react) y métricas sociales
- [ ] 4.2 Ampliar `PortalDonante.tsx` con lista de `RecurringSubscription`, selector `MONTHLY/QUARTERLY/ANNUAL` y `PATCH /subscriptions/:id` (pausar/cancelar/reactivar), reutilizando `RecurrenceToggle`/`RecurrenceStatus` — existe `RecurrenceToggle.tsx` y `PATCH recurring/:id`; lista en portal pendiente
- [ ] 4.3 Manejo de errores: 404 genérico en `/p2p/:slug` y en recibo, toast "Página no disponible"/"Recibo no disponible"; botón descargar gift receipt en donaciones P2P/suscripción

## 5. Hardening + docs + verificación

- [ ] 5.1 Aislamiento y enumeración: grep — `GET /p2p/:slug`, `receipts/:captureId` y `POST /campaigns/:id/p2p` filtran por `organizationId` y devuelven 404 genérico; sin filtro debe fallar
- [x] 5.2 Docs: actualizar `AGENTS.md` regla #1 (nueva ruta `/p2p/:slug` y suscripciones Webpay/Flow) y `README.md` con credenciales de pasarela solo en server — hecho 21-oct-2026 (AGENTS § Infraestructura + Estado 21-oct, PLAN, `infra/nginx/`)
- [ ] 5.3 Verificación: `npm run build` frontend/backend, `npm test` backend, `./deploy.sh frontend`, `./deploy.sh verify` (impacta 200, impacta.pinguinoseguro.cl 301, api 401, public-stats real), navegación manual: crear página P2P, abrir `/p2p/:slug`, activar suscripción en `/portal`, confirmar gift receipt — builds ✅ + 46 unit ✅ + frontend deployado 21-oct; backend deploy, e2e CI y navegación manual pendientes
