## Context

Impacta+ es **UN SOLO SISTEMA** estable: Vite+React 19 + TanStack Query en `https://impacta.pinguinoseguro.cl/`, backend NestJS 11 + Prisma 5 + Postgres nativo en `impacta.pinguinoseguro.cl/api`, nginx `proxy_pass /api/` → `127.0.0.1:3001`. Multi-tenant estricto con `organizationId` en cada registro, CLP entero.

Hoy `Campaign { goalAmount, currentAmount, status }` con `Donation { amount, status, recurringStatus, campaignId, gatewayRef }`. `recurringStatus` (ACTIVE/PAUSED/CANCELLED) es un flag sobre una donación puntual, no una suscripción con ciclo de cobro. El portal donante existe (`PortalDonante.tsx` + `PATCH /donations/recurring/:id`) pero opera sobre ese flag, sin pasarela chilena real ni cobro programado. No hay crowdfunding personal ni trazabilidad de pago por gift/QR.

Investigación (2026-08-24): Donorbox (US$4B) crece por P2P personal, recurring flexible y QR/kiosco. Impacta+ debe adaptar eso a CLP/RUT, multi-tenant y dominio único `impacta.*` (comisión cero hacia afuera: el pago queda en Chile).

## Goals / Non-Goals

**Goals:**
- Página de colecta personal por socio, con URL/QR única y métrica de social proof, sumando atómicamente al `currentAmount` de la campaña madre.
- Suscripción recurrente real (MONTHLY/QUARTERLY/ANNUAL) con pasarela chilena (Webpay Plus Malla/Flow), cobro programado e idempotente.
- Donante pausa/cancela/reactiva su suscripción desde `/portal` (complementa `portal-donante`).
- Trazabilidad de cada pago por `captureId`/`chargeReference`, gift receipt y `currentAmount` consistente sin duplicados.

**Non-Goals:**
- PWA satelital / app de campo para kiosco físico standalone (sería un segundo cliente).
- CRM/enterprise tipo Salesforce NPSP o conciliación contable completa.
- Migrar la pasarela mock existente a Stripe (no aplica a CLP); Webpay/Flow es la única pasarela nueva.
- Indexación SEO multidimensional ni app móvil nativa; la página pública P2P es una ruta SPA dentro del build único.

## Decisions

- **`CampaignP2PPage` como modelo Prisma independiente** (no un campo en `Campaign`): cada socio tiene su registro con `slug` aleatorio, `currentAmount`, `status`, `campaignId` FK. Alternativa (embarrar `Campaign` con `parentCampaignId`) rechazada por acoplar campañas y ensuciar queries de staff. `slug` = nanoid/no secret, pero `GET /p2p/:slug` devuelve `404` genérico ante slug inexistente para no oracular.
- **Jump-in agregado en transacción**: al SUCCEEDED de un pago P2P, `prisma.$transaction` con `increment` sobre `CampaignP2PPage.currentAmount` y `Campaign.currentAmount` (madre) en una misma operación. Idempotencia por `captureId`: el callback de la pasarela solo incrementa una vez.
- **`RecurringSubscription { organizationId, memberId, campaignId?, frequency, amount, nextChargeAt, status }`**: separa la suscripción de la `Donation` puntual (el `recurringStatus` de `Donation` queda solo para legadas). Un job consulta `nextChargeAt <= now AND status=ACTIVE`, cobra con `chargeReference = ${subscriptionId}:${link}` y crea `Donation { sourceType:"SUBSCRIPTION", subscriptionId, captureId, campaignId }`.
- **Webpay Plus Malla / Flow en vez de Stripe**: Chile → CLP, tarjetas débito/crédito locales, no requiere cuenta proveedor extranjera. "Plus Malla" modela suscripción (card token reutilizable). Fallback Flow (transferencia/onepay) para donantes sin tarjeta. El mock `paymentUrl` actual se sustituye por transacción real detrás de credenciales en `.env` (solo server, controlado por feature flag de ambiente).
- **Idempotencia de cobro**: índice único en `Donation.chargeReference` (o guard por `chargeReference + gatewayRef`). El webhook reentrante detecta la referencia existente y responde 200 sin duplicar. Para `currentAmount`, la actualización atómica se hace SOLO al crear la `Donation` SUCCEEDED (un solo punto de incremento).
- **`sourceType` + `sourceId` en `Donation`** (`P2P`/`SUBSCRIPTION`/`DIRECT`): permite gift receipt y trazabilidad por origen sin tocar `recurringStatus` legado.
- **Portal suscripciones hereda `portal-donante`**: `PATCH /subscriptions/:id` con guard de `memberId` (mismo patrón `findMemberForUser`), y `PATCH /donations/recurring/:id` queda retrocompatible mapeando a suscripción si existe o al flag legado.
- **Recurrido público P2P = ruta SPA** (`/p2p/:slug` servido por el mismo build, sin subdominio ni webhook ajeno): mantiene el dominio único y evita un segundo tenant fraguado.

## Risks / Trade-offs

- **Duplicado de cobro por retry de pasarela**: riesgo de cobrar dos veces un ciclo si el webhook se reenvía. Mitigado por `chargeReference` con índice único e idempotencia; log `denied_attempt` para auditoría.
- **Enumeración de URLs/slugs P2P y `gatewayRef`**: riesgo de oracular páginas o pagos de otro tenant. Mitigado: slug y `captureId` aleatorios + `404` genérico en P2P público y en consulta de recibo por `captureId` ajeno (misma postura que `portal-donante`).
- **Condición de carrera en `currentAmount`**: si dos callbacks SUCCEEDED de dos gateways llegan casi a la vez por la misma página. Mitigado: incremento en transacción Prisma + idempotencia por `captureId`; nunca lectura-modificación-escritura manual.
- **Webpay Plus Malla requiere TLE/certificados y credenciales de producción**: en ambientes sin `.env` preparado la suscripción se comporta como mock. Se aísla detrás de flag de pasarela y `npm test` corre con la pasarela en `TEST`.
- **Cambio de alcance de `portal-donante` / `campaigns`**: al tocar contractos modificados, se exige delta de spec (`specs upgrade`) que mantenga retrocompatibilidad del flag `recurringStatus` y de `goalAmount`/`status` de campaña.