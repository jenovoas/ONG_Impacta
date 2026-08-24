# Propuesta: Campañas P2P/crowdfunding + recurrencia Webpay/Flow + trazabilidad de pagos

## Why

Impacta+ es **UN SOLO SISTEMA** (landing + front + panel de control) que une gestión ONG chilena (RUT, CLP entero, multi-tenant estricto) con conservación (Especies + Misiones). Hoy las **campañas** (`Campaign`) solo soportan meta fija (`goalAmount`) y `currentAmount` global: la ONG crea la campaña y recibe aportes directos. No existe crowdfunding personal tipo Donorbox/GoFundMe, ni donación recurrente flexible, ni trazabilidad de pago por gift/QR.

Investigación internet (2026-08-24) mostró que **Donorbox** (US$4B recaudados) crece con:
- **P2P fundraising / crowdfunding personal**: cada socio crea su colecta y arrastra su red, la métrica de "social proof" motiva más donaciones.
- **Recurring flexible**: suscripción mensual/trimestral/anual desmodalizada, no solo "monto táctico".
- **QR + kiosco**: donación desde teléfono con QR y trazabilidad de cada aporte.

Impacta+ ya tiene `Donation.recurringStatus` (ACTIVE/PAUSED/CANCELLED) y portal donante self-service, pero la recurrencia es un flag simple sobre una donación puntual — no una suscripción real con cobro programado; no hay workflow P2P; y no hay trazabilidad por gift. Si no añadimos estas capacidades, las ONGs chilenas ($500k–$2M/año) siguen usando Donorbox de afuera (con su % de comisión y datos fuera de Chile) en vez de Impacta+. Ahora es el momento: single-system estabilizado, campañas y donaciones reales en producción, base lista para crowdfunding y recurrencia.

## What Changes

- **BREAKING: Ninguno.** Todo es aditivo, detrás de modelos y rutas nuevas. `Campaign` y `Donation` existentes no cambian de contrato.
- **Campañas P2P**: nuevo modelo `CampaignP2PPage` → página personal donde un socio (**`Member`**) crea una colecta asociada a una `Campaign` madre (heredando `goalAmount`/`currentAmount` como "campaña agregada"), define un subtítulo ("meta personal"), y arrastra su red compartiendo su URL/QR única. Cada aporte a la página suma a su propio `p2pAuth`/`currentAmount` **y** a la `currentAmount` de la campaña madre de forma atómica. Cierre: al completarse la campaña madre, se marcan `COMPLETED`; si caduca sin socios, la página se puede cerrar/cancelar sin borrar el historial de donaciones.
- **Recurrencia Webpay/Flow**: nuevo modelo `RecurringSubscription` con `organizationId`, `memberId`, `campaignId` (opcional), `frequency` (`MONTHLY`/`QUARTERLY`/`ANNUAL`), `amount`, `nextChargeAt`, `status`. La suscripción se crea vía **Webpay Plus Malla / Flow** (no por Stripe: Chile y CLP). El portal donante (`/portal`) complementa `portal-donante` permitiendo pausar/cancelar la suscripción y ver su estado; el backend programa `nextChargeAt` y ejecuta el cobro con **idempotencia** por `chargeReference`.
- **Trazabilidad de pagos**: todo cobro real (`CampaignP2PPage`, `RecurringSubscription`) emite una `Donation` con `captureId`/`gatewayRef` único, status `SUCCEEDED`/`FAILED`, y **actualización atómica de `currentAmount`** (transacción Prisma con `increment`). QR recurrente y "gift receipt" (comprobante por email de cada aporte que referencia la página/suscripción que lo originó).

## Capabilities

### New Capabilities
- `campanas-p2p`: Capacidad de que un socio cree una página de colecta personal vinculada a una campaña madre, la comparta por URL/QR y recaude con métricas de social proof; los aportes se agregan atómicamente al `currentAmount` de la campaña madre.
- `recurrencia-webpay`: Capacidad de crear una suscripción recurrente mensual/trimestral/anual con Webpay Plus Malla/Flow, programar cobros idempotentes y permitir al donante pausar/cancelar desde el portal.
- `pagos-trazabilidad`: Capacidad de rastrear cada pago (gift frente a puntual) por `gatewayRef`/`captureId`, emitir gift receipts y actualizar balances de campaña de forma atómica y sin estado intermedio inconsistente.

### Modified Capabilities
- `portal-donante`: Se modifica la gestión de recurrencia — pasa de `PATCH /donations/recurring/:id` sobre el flag `Donation.recurringStatus` a operar sobre `RecurringSubscription` real (pausa/cancelación de suscripciones Webpay/Flow), manteniendo retrocompatibilidad del endpoint para donaciones legadas.
- `campaigns`: Se modifica — la actualización de `currentAmount` incluye ahora aportes provenientes de páginas P2P (transacción atómica `increment`), sin cambiar `goalAmount` ni `status`.

## Impact

- **Backend** (`backend/src/modules/`):
  - `campaigns` — `CampaignP2PPage` en Prisma, `POST /campaigns/:id/p2p`, `GET /campaigns/:id/p2p/:pageId`, `GET /p2p/:pageId` público, close/complete de página y de campaña madre.
  - `donations` — endpoint de creación de suscripción, callback Webpay/Flow, cobro programado, gift receipts.
  - Nuevo módulo `subscriptions` (o sección en `donations`) — `RecurringSubscription`, job de cobro `nextChargeAt`, idempotencia por `chargeReference`.
  - `payments` — integración Webpay Plus Malla (transbank-sdk) y/o Flow; webhook/callback de confirmación.
- **Prisma** (`backend/prisma/schema.prisma`): `CampaignP2PPage`, `RecurringSubscription`, campos `captureId`/`chargeReference` y relación `giftOf`/`sourceType` en `Donation`.
- **Frontend** (`frontend/src/pages/`): `CampanaP2P.tsx` (crear/editar página), `P2PPublicPage.tsx` (ruta pública de compartir con QR), ampliación de `PortalDonante.tsx` para gestionar suscripciones Webpay/Flow (complementa `portal-donante`), `RecurringSubscription` UI (frequency selector en donaciones).
- **Infra**: sin cambios — sigue dominio único `impacta.*`, API en `api-impacta.*`, `app-impacta` 301. Se añaden credentials de Webpay/Flow al `.env` (solo server).
- **Riesgos**: duplicado de cobro en retry de pasarela (mitigado por idempotencia `chargeReference`); enumeración de URLs P2P (mitigado por slug aleatorio + 404 genérico); fuera de scope el CRM/Salesforce complejo.