# eventos Specification

## Purpose

Crear eventos, emitir entradas (tickets) con tipo/monto CLP y sponsor, y hacer check-in por QR — manteniendo multi-tenant estricto por `organizationId` — inspirado en Neon events + ticketing.

## ADDED Requirements

### Requirement: Creación de evento
Staff debe poder crear eventos con fecha, lugar y capacidad, aislados por `organizationId`.

#### Scenario: Crear evento de recaudación
- **WHEN** staff hace `POST /events { name, date, location, capacity, orgSlug }` dentro de su tenant
- **THEN** backend crea `Event` con `organizationId` del tenant, `capacity`, `status DRAFT`, y aparece en `/dashboard/eventos`; un visitante anónimo de ese orgSlug ve solo los eventos con `status PUBLISHED`

#### Scenario: Aislamiento de eventos entre orgs
- **WHEN** dos orgs consultan sus eventos en la misma fecha
- **THEN** cada una solo ve sus `Event` (filtro `organizationId`), sin cruzarse

### Requirement: Emisión de tickets
Cada evento publicado debe permitir emitir tickets con `ticketType` (General/Sponsor), monto CLP opcional y un `code` QR único, sin overbooking.

#### Scenario: Comprar/registrar entrada
- **WHEN** un asistente (auto o vía staff) hace `POST /events/:id/tickets { ticketType: "General", amount }` y `ticketsSold < capacity`
- **THEN** backend crea `Ticket` con `code` QR único, `organizationId` del tenant y `status CONFIRMED`, y suma 1 a `ticketsSold`; si `ticketsSold === capacity`, devuelve `409` y bloquea nuevas entradas

#### Scenario: Ticket de sponsor
- **WHEN** un sponsor hace `POST /events/:id/tickets { ticketType: "Sponsor", sponsorName, amount }`
- **THEN** el ticket queda con `ticketType SPONSOR` y su nombre se muestra en la sección de patrocinadores del evento publicado

### Requirement: Check-in por QR
Staff debe poder validar un ticket en la puerta escaneando su code QR, marcándolo como asistido sin duplicar.

#### Scenario: Check-in válido
- **WHEN** staff hace `PATCH /events/tickets/:id/checkin` con un `Ticket` válido de su org y `status CONFIRMED`
- **THEN** backend valida `organizationId`, marca `status CHECKED_IN` y setea `checkedInAt`; responderlo de nuevo devuelve el mismo `status CHECKED_IN` (idempotente sin duplicar)

#### Scenario: Reconocimiento de QR ajeno
- **WHEN** staff escanea un `code` QR de un ticket que no pertenece a su `organizationId` o ya está canjeado
- **THEN** el backend responde `404` genérico (no revela existencia de tickets de otra org) y la UI muestra “Entrada no válida para esta organización”