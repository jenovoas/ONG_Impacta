# recurrencia-webpay Specification

## Purpose
Permitir que un donante cree una suscripción recurrente mensual/trimestral/anual vía Webpay Plus Malla/Flow (Chile, CLP), con cobros programados e idempotentes y gestión self-service de pausa/cancelación desde el portal donante — complementando `portal-donante`.

## ADDED Requirements

### Requirement: Creación de suscripción recurrente con Webpay/Flow
Un donante autenticado debe poder crear una suscripción con frecuencia `MONTHLY`/`QUARTERLY`/`ANNUAL`, monto CLP y campaña opcional, iniciando el flujo de pago en la pasarela chilena y registrando `RecurringSubscription` con `organizationId`.

#### Scenario: Alta de suscripción mensual
- **WHEN** donante hace `POST /subscriptions { frequency: "MONTHLY", amount, campaignId? }` con JWT de miembro
- **THEN** el backend crea `RecurringSubscription { organizationId, memberId, campaignId, frequency, amount, nextChargeAt=now+1 mes, status: "PENDING" }`, inicia transacción Webpay/Flow y devuelve `paymentUrl` de la pasarela

#### Scenario: Confirmación e inicio de ciclo
- **WHEN** la pasarela notifica callback con `captureId` exitoso para la suscripción
- **THEN** el backend marca `status=ACTIVE`, registra `captureId` y programa el siguiente `nextChargeAt` según la frecuencia; si falla, marca `FAILED` y notifica al donante

#### Scenario: Aislamiento multi-tenant
- **WHEN** donante crea suscripción en org A pero usa token/slug de org B
- **THEN** el backend valida `organizationId` del token y rechaza (`404`/`403` genérico) sin cruzar datos entre tenants

### Requirement: Cobro programado e idempotente
El backend debe ejecutar el cobro en cada `nextChargeAt` y garantizar que un mismo ciclo no se cobre dos veces ante reintentos de la pasarela.

#### Scenario: Ejecución del ciclo
- **WHEN** un job encuentra `RecurringSubscription` con `status=ACTIVE` y `nextChargeAt <= now`
- **THEN** el backend intenta cobro con `chargeReference` único por ciclo (`${subscriptionId}:${periodo}`), crea `Donation { sourceType:"SUBSCRIPTION", subscriptionId, captureId }` y avanza `nextChargeAt`

#### Scenario: Idempotencia ante reintento
- **WHEN** la pasarela reenvía el mismo webhook de un ciclo ya cobrado
- **THEN** el backend detecta `chargeReference` existente y responde `200` sin crear una segunda `Donation` ni duplicar el monto

### Requirement: Portal de pausa/cancelación (complementa portal-donante)
El donante debe poder pausar, cancelar o reactivar su suscripción desde `/portal` sin contactar staff, y ver su estado.

#### Scenario: Pausar desde el portal
- **WHEN** donante hace `PATCH /subscriptions/:id { status: "PAUSED" }` desde `/portal`
- **THEN** el backend actualiza `status` solo si `memberId` coincide; el job deja de cobrar y la UI (`portal-donante`) muestra "Pausada"

#### Scenario: Cancelar sin borrar historial
- **WHEN** donante hace `PATCH /subscriptions/:id { status: "CANCELLED" }`
- **THEN** `RecurringSubscription` queda `CANCELLED` (sin más cobros) pero sus `Donation` previas se conservan y el staff las ve en `/dashboard/donations`

#### Scenario: Reactivar
- **WHEN** donante hace `PATCH /subscriptions/:id { status: "ACTIVE" }` sobre una `PAUSED`
- **THEN** el backend reprograma `nextChargeAt=now+1 ciclo` y reanuda el cobro
