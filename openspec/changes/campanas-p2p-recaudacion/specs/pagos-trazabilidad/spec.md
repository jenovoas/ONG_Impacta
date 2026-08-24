# pagos-trazabilidad Specification

## Purpose
Rastrear cada pago (gift/crowdfunding frente a puntual/recurrente) por su `gatewayRef`/`captureId` único, emitir gift receipts y actualizar los balances de campaña (`currentAmount`) de forma atómica, sin dejar estado intermedio inconsistente.

## ADDED Requirements

### Requirement: QR y enlace de trazabilidad por pago
Cada página P2P y cada suscripción deben exponer un QR/enlace que, al donar, vincula el aporte a su origen (página o suscripción) y registra un identificador de captura único.

#### Scenario: Donación desde QR de página P2P
- **WHEN** un visitante dona escaneando el QR de `GET /p2p/:slug`
- **THEN** la `Donation` resultante lleva `sourceType="P2P"`, `p2pPageId`, `gatewayRef`/`captureId` únicos y `status=PENDING` hasta confirmación de la pasarela

#### Scenario: Donación desde QR de suscripción
- **WHEN** un donante inicia una suscripción y la pasarela confirma el cobro
- **THEN** la `Donation` lleva `sourceType="SUBSCRIPTION"`, `subscriptionId` y `captureId` del ciclo, permitiendo trazar el regalo hasta su suscriptor

#### Scenario: No enumeración de pagos
- **WHEN** un tercero manipula `gatewayRef` en un endpoint de consulta/recibo
- **THEN** el backend responde `404` genérico si el `captureId` no pertenece al donante/tenant autenticado, sin revelar existencia

### Requirement: Gift receipt
Cada donación confirmada (especialmente las originadas en P2P o suscripción) debe poder emitir un comprobante (gift receipt) que referencia el origen del aporte.

#### Scenario: Emisión de comprobante P2P
- **WHEN** una donación `sourceType="P2P"` pasa a `SUCCEEDED` y el donante/visitante solicita recibo
- **THEN** el backend genera PDF (pdf-lib) incluyendo `org.name`, `donor RUT`, `amount` CLP, `campaign.name`, `p2pPage.title` y `captureId`, con `Content-Disposition: attachment`

#### Scenario: Comprobante de suscripción
- **WHEN** se cobra un ciclo de suscripción y se emite recibo
- **THEN** el PDF incluye `subscriptionId`, frecuencia y `captureId` del ciclo, además de los datos estándar de la ONG

### Requirement: Actualización atómica de currentAmount
Toda donación SUCCEEDED vinculada a una campaña (directa, P2P o de suscripción con `campaignId`) debe incrementar `currentAmount` en una transacción atómica, sin condición de carrera ni valor intermedio negativo.

#### Scenario: Incremento transaccional
- **WHEN** una donación P2P pasa a `SUCCEEDED` con `campaignId`
- **THEN** el backend ejecuta `prisma.$transaction` con `update({ currentAmount: { increment: amount } })` sobre la `CampaignP2PPage` y la `Campaign` madre en la misma operación, garantizando consistencia

#### Scenario: Sin duplicado por webhook repetido
- **WHEN** el callback de la pasarela llega dos veces para la misma `captureId`
- **THEN** el backend aplica el incremento una sola vez (idempotencia por `captureId`) y no sobre-suma `currentAmount`

#### Scenario: Reversión en fallo
- **WHEN** la pasarela reporta `FAILED` para una `captureId` ya contabilizada como PENDING
- **THEN** el backend marca la `Donation` `FAILED` y NO modifica `currentAmount` (no hay incremento a medias)
