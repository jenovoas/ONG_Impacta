## Context

Impacta+ es **UN SOLO SISTEMA** estabilizado en `https://impacta.pinguinoseguro.cl` (landing + front + panel + portal donante + misiones offline). Stack: Vite+React 19 + TanStack Query, NestJS 11 + Prisma 5 + Postgres nativo + Redis (BullMQ para colas), nginx proxy `/api/` → `127.0.0.1:3001`, multi-tenant estricto por `organizationId`. `Member` hoy es plano (`firstName`, `lastName`, `email`, `rut`, `status`) con `Donation[]`; `Mission`/`MissionTask` existen; `Donation` y `RecurringDonation` están ligadas a `memberId`. El change `integra-insights-competencia` consolidó misiones offline + portal donante 4/4. Este change añade compromiso comunitario (membresías tier, voluntariado, eventos) reutilizando la infraestructura multi-tenant y de colas existente.

## Goals / Non-Goals

**Goals:**
- Membresías por tier (`SOCIO/BENEFACTOR/EMPRESA/GOLD`) con cuota CLP, auto-renovación idempotente y portal de socio + directorio público por org.
- Voluntariado con turnos ligados a misiones, disponibilidad y asignación, sin overbooking.
- Eventos con tickets (General/Sponsor, monto CLP), check-in por QR e idempotencia.
- Todo aislado por `organizationId` en cada nueva tabla (`Membership`, `VolunteerShift`, `VolunteerShiftAssignment`, `Event`, `Ticket`).

**Non-Goals:**
- PWA completa ni sincronización offline para estos módulos (misiones offline ya cubre terreno; eventos/membresías son online-first en este change).
- Pasarela de pagos nueva: cobro de cuotas y tickets queda como registro de monto CLP + estado; no se integra Webpay/Stripe aquí.
- CRM empresarial de Neon (donor portal avanzado, Xero/QuickBooks) ni mobile app nativa.
- Modificar contratos existentes de `misiones-offline` o `portal-donante`.

## Decisions

- **`Member.membershipTier` enum + modelo `Membership`**: replicar el tier sobre `Member` (no una tabla separada de perfiles) para que cualquier vista de socio (`Donation`, `Mission`) pueda leer el tier sin join; `Membership` guarda cuota, `interval`, `autoRenew`, `renewalDue`, `status`. Alternativa de split `MemberProfile` descartada por sobre-splitting para este tamaño de dato. Valor por defecto `SOCIO`, `membershipTier` nullable en migración para no romper miembros legacy (aditivo).
- **Auto-renovación via BullMQ worker idempotente**: un job recurrente (p.ej. diario) recorre `Membership` con `renewalDue < now()`. Para `autoRenew: true` extiende `renewalDue` y conserva `ACTIVE`; para `autoRenew: false` marca `LAPSED`. Idempotencia por `membershipId` + `renewalDue` (solo actúa si `LAPSED`/vencido), y bloqueo de procesamiento con Redis lock para que dos ticks no dupliquen. Toda comparación en UTC.
- **Overbooking por transacción con contador denormalizado**: tanto `VolunteerShift.capacity/filled` como `Event.capacity/ticketsSold` se incrementan en un `updateMany` con condición `filled < capacity` (update gana → cuenta exacta); si `0` filas, responder `409`. Alternativa `SELECT ... FOR UPDATE` descartada por complejidad; el contador denormalizado es suficiente con writes de bajo volumen.
- **QR del ticket**: `code` = hash corto (`crypto.randomUUID()` + hash HMAC con `org.metadata.secret`, trunca a 12 chars) — no predecible, no reversible a `ticketId`, contenido en el `code` del PDF/QR. Check-in valida por `code` + `organizationId`; respuesta encubierta `404` para códigos de otra org o ya canjeados, para no oracular IDs (mismo patrón que `receipt` del portal donante).
- **Relación `VolunteerShift.missionId`**: FK a `Mission`, por lo que un turno siempre pertenece a la misma org que su misión (se valida en `create` que `mission.organizationId === tenant.id`); evita asignar turnos de una misión ajena. `VolunteerShiftAssignment` lleva `memberId` + `status (pending/assigned)`.
- **`ticketType SPONSOR`** con `sponsorName` opcional mostrado en la sección de patrocinadores del evento publicado — sin tabla `Sponsor` separada en v1.
- **Rutas `/dashboard/{membership,voluntariado,eventos}`** bajo el panel de staff existente; el portal de socio extiende `/portal` con secciones nuevas reutilizando el `client.ts` + `useAuthStore` (mismo JWT) — no se crea un segundo esquema de auth.

## Risks / Trade-offs

- **Doble conteo en auto-renovación**: dos ticks de worker podrían extender `renewalDue` dos veces. Mitigación: Redis lock por org + condición `renewalDue < now()` en el update del job; tests con dos ticks concurrentes.
- **Overbooking de tickets/turnos**: la suma con contador denormalizado elimina la carrera pero desnormaliza el conteo. Mitigación: reconciliación periódica `ticketsSold` vs `COUNT(Ticket)` en caso de drift; log de rechazo `409` para auditoría.
- **Precios en CLP vs donaciones**: `Membership.amount` y `Ticket.amount` son montos CLP enteros; existe riesgo de colisión conceptual con `Donation.amount`. Mitigación: campos con nombre explícito (`membership.amount`, `ticket.amount`) y nunca se suman a `Donation.amount`; la recaudación de cuotas/tickets se reporta aparte del total donado.
- **Enumeración de QR**: si el código es débil, un tercero podría adivinar tickets. Mitigación: HMAC con secret de org + longitud 12; log interno de `denied_attempt` en check-in.
- **Aislamiento tenant**: cualquier nuevo endpoint debe filtrar `where: { organizationId: tenant.id }`. Mitigación: reusar la extensión Prisma multi-tenant ya existente (mismo patrón que members/donations) aunque para v1 los controllers lo inyectan explícitamente.