# Propuesta: Membresías con tiers + voluntariado + eventos (Neon/SERCA)

## Why

Impacta+ es **UN SOLO SISTEMA** que ya une gestión ONG chilena (RUT, CLP entero, multi-tenant estricto) con conservación (Especies + Misiones + portal donante y offline). Investigación de competencia (2026-08-24) mostró que Neon One (son dues + eventos + voluntarios) y SERCA/SMART (turnos en terreno) tienen capacidades de compromiso comunitario que Impacta+ aún no cubre:

- **Membresías**: hoy `Member` es un registro plano (`firstName`, `lastName`, `email`, `rut`, `status`). No hay tiers (socio/benefactor/empresa), ni cuotas ni auto-renovación, ni portal de socio ni directorio público. Neon cobra cuotas por nivel y escala el compromiso; Impacta+ no puede segmentar ni retener socios de pago.
- **Voluntariado**: no hay concepto de turno, disponibilidad ni asignación a misiones. SERCA/SMART coordinan brigadistas en terreno; Impacta+ solo registra `Mission`/`MissionTask` sin asignar esfuerzo voluntario ni calendario.
- **Eventos**: no hay eventos con tickets, check-in QR ni sponsors. Neon vende tickets y maneja registro; Impacta+ no puede hacer recaudación presencial ni giras de difusión (feria binacional, workshops, días de campo).

Sin esto, una ONG que quiere cobrar socios, coordinar brigadas y hacer eventos de recaudación debe usar Neon aparte — Impacta+ queda como tabla de miembros simple y no compite en el módulo de compromiso comunitario de Neon. Ahora es el momento: single-system estabilizado, base multi-tenant lista, y el change `integra-insights-competencia` ya consolidó el ciclo proposal→spec→validate que se replica aquí.

## What Changes

- **BREAKING: Ninguno.** Solo `Member.*` no cambia; nada existente se borra o migra con riesgo.
- **Membresías con tiers**: se añade `Member.membershipTier` (enum `SOCIO/BENEFACTOR/EMPRESA/GOLD`) + modelo `Membership` con cuota CLP, frecuencia, `autoRenew`. Portal de socio (`/portal` extendido) ve su tier y cuota; directorio público por org muestra socios activos con permiso de publicación. Auto-renovación por worker en backend (BullMQ) que marca vencidos como `LAPSED` y renueva los que tienen `autoRenew: true`.
- **Voluntariado**: nuevo módulo con `VolunteerShift` (turno ligado a `Mission`/fecha/rol) y registro de disponibilidad del miembro. Staff asigna voluntarios a turnos de una misión; la UI de Missions puede listar turnos y su cobertura.
- **Eventos**: nuevo módulo `Event` + `Ticket` (asistentes, `ticketType`, monto CLP opcional, sponsor) con `code` QR único para check-in. Staff crea evento y genera tickets; check-in por QR en terreno.
- **Todo con `organizationId`** en cada nueva tabla (`Membership`, `VolunteerShift`, `Event`, `Ticket`) — multi-tenant estricto, sin romper el aislamiento existente.
- **No se replica** la suite completa de Neon (donor CRM, pagos Braintree, integración Xero/QuickBooks) ni ser del 100% de Neu: solo las capacidades de compromiso comunitario.

## Capabilities

### New Capabilities
- `membresias-avanzadas`: Capacidad de gestionar membresías por tier con cuota, auto-renovación, portal de socio y directorio público.
- `voluntariado`: Capacidad de gestionar turnos de voluntariado, disponibilidad y asignación a misiones.
- `eventos`: Capacidad de crear eventos, emitir tickets con monto/sponsor y hacer check-in por QR.

### Modified Capabilities
- Ninguna — todo es nuevo. `misiones-offline` y `portal-donante` existentes no cambian de contrato; el portal de socio extiende `/portal` con secciones nuevas pero no altera las rutas donante vigentes.

## Impact

- **Frontend**: nuevas páginas/secciones `frontend/src/pages/DashboardMembers.tsx` (tiers + directorio), `frontend/src/pages/Voluntariado.tsx` (turnos), `frontend/src/pages/Eventos.tsx` (eventos + check-in), extensión de `PortalDonante.tsx` con sección socio/tier, y enrutado en `App.tsx` bajo `/dashboard/membership`, `/dashboard/voluntariado`, `/dashboard/eventos`.
- **Backend**: `backend/src/modules/members` (campos `membershipTier`, endpoints tier), `backend/src/modules/memberships` (cuota, auto-renovación, worker BullMQ), `backend/src/modules/volunteers` (`VolunteerShift`), `backend/src/modules/events` (`Event`, `Ticket`, `check-in`), Prisma schema extendido.
- **Infra**: Sin cambios — sigue dominio único `impacta.*` (API en `impacta.pinguinoseguro.cl/api`), `impacta.pinguinoseguro.cl` 301, nativo systemd. Sin nuevos servicios.
- **Docs**: `README.md`, `AGENTS.md` regla #1 con módulos nuevos, `openspec/specs/{membresias-avanzadas,voluntariado,eventos}`.
- **Riesgos**: vencimiento/auto-renovación requiere worker idempotente y UTC consistente; overbooking de turnos y de tickets requiere control de inventario; tier con precios en CLP debe definir `amount`/`currency` para no colisionar con donaciones.