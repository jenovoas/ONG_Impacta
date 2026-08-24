# membresias-avanzadas Specification

## Purpose

Gestionar membresías por tier con cuota en CLP, auto-renovación, portal de socio y directorio público — manteniendo multi-tenant estricto por `organizationId` — inspirado en Neon one (member dues by level).

## ADDED Requirements

### Requirement: Membresía por tier con cuota
Un miembro debe tener un `membershipTier` (`SOCIO`, `BENEFACTOR`, `EMPRESA`, `GOLD`) y una `Membership` asociada con cuota CLP, frecuencia y estado, aislada por `organizationId`.

#### Scenario: Elevar de tier un socio
- **WHEN** staff hace `PATCH /members/:id { membershipTier: "BENEFACTOR" }` sobre un miembro de su org
- **THEN** backend crea/actualiza `Membership` con `tier`, `amount CLP`, `interval (MONTHLY/YEARLY)`, `status ACTIVE` y `organizationId` del tenant; queda visible en `/dashboard/members` y en el portal del socio

#### Scenario: Aislamiento por tenant
- **WHEN** dos orgs tienen roles de tier con el mismo nombre pero distinta cuota
- **THEN** cada `Membership` conserva su `organizationId` y `amount` propio; un socio de org A nunca ve la cuota de org B

### Requirement: Auto-renovación y vencimiento de membresía
Las membresías con `autoRenew` deben renovarse en su ciclo y las vencidas pasar a `LAPSED` sin intervención manual, de forma idempotente.

#### Scenario: Renovar automáticamente
- **WHEN** un worker de backend (BullMQ) corre para membresías `autoRenew: true` cuya `renewalDue` ya pasó
- **THEN** extiende `renewalDue` al siguiente ciclo y conserva `status ACTIVE`; al correcrlo de nuevo no duplica ni retrasa el vencimiento (idempotente por `membershipId`)

#### Scenario: Vencimiento sin auto-renovación
- **WHEN** una membresía `autoRenew: false` supera su `renewalDue`
- **THEN** el worker la marca `status LAPSED`; el portal de socio muestra “Membresía vencida — renueva para reactivarla” y ya no aparece en el directorio público

### Requirement: Portal de socio y directorio público
El socio debe ver su tier/cuota/estado en `/portal` y, con permiso de publicación, aparecer en un directorio público de su org.

#### Scenario: Ver mi membrecía en portal
- **WHEN** un miembro autenticado consulta su sección “Mi membrecía” en `/portal`
- **THEN** `/portal` muestra `membership.tier`, `amount CLP`, `interval`, `status` y `renewalDue` de su `organizationId` y `memberId`, sin datos de otro socio

#### Scenario: Directorio público de socios
- **WHEN** un visitante anónimo hace `GET /members/directory?orgSlug=...`
- **THEN** la respuesta lista solo socios con `publishToDirectory: true` y `status ACTIVE` de esa org (nombre, tier, mes de inicio), nunca datos privados tipo RUT, email ni cuota