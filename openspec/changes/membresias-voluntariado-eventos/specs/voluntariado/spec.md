# voluntariado Specification

## Purpose

Gestionar turnos de voluntariado ligados a misiones, la disponibilidad del miembro y la asignación de voluntarios — manteniendo multi-tenant estricto por `organizationId` — inspirado en SERCA/SMART stint/patrol roster.

## ADDED Requirements

### Requirement: Turno de voluntariado ligado a misión
Staff debe poder crear turnos con fecha, rol y capacidad, asociados a una `Mission` de su org.

#### Scenario: Crear turno para una misión
- **WHEN** staff hace `POST /volunteers/shifts { missionId, date, role, capacity }` dentro de su tenant
- **THEN** backend crea `VolunteerShift` con `organizationId` del tenant, `missionId`, `date`, `role`, `capacity` y `filled: 0`; se lista en `/dashboard/voluntariado` y en la ficha de la misión

#### Scenario: Aislamiento de turnos entre orgs
- **WHEN** dos orgs consultan sus turnos en la misma fecha
- **THEN** cada una solo ve sus `VolunteerShift` (filtro `organizationId`), sin cruzarse

### Requirement: Disponibilidad y auto-asignación del voluntario
Un miembro autenticado debe poder registrar su disponibilidad y postularse a un turno abierto, sin permitir overbooking.

#### Scenario: Postularse con capacidad firme
- **WHEN** un miembro hace `POST /volunteers/shifts/:id/apply` y `filled < capacity` de su org
- **THEN** backend suma 1 a `filled` en una transacción y vincula `VolunteerShiftAssignment(memberId, shiftId)`; si `filled === capacity`, el turno pasa a status `FULL` y rechaza nuevas postulaciones con `409`

#### Scenario: Registrar disponibilidad
- **WHEN** un voluntario marca `disponible` para rangos de fecha (`POST /volunteers/availability`)
- **THEN** el sistema muestra en el calendario de `/dashboard/voluntariado` los turnos de su org que caen dentro de su disponibilidad, con badge “Te conviene”

### Requirement: Asignación de voluntarios a misiones
Staff debe poder confirmar qué voluntarios quedan asignados a una misión y los coordinadores ver la cobertura.

#### Scenario: Confirmar asignación
- **WHEN** staff hace `PATCH /volunteers/shifts/:id/assign { memberId }` a un voluntario postulado
- **THEN** la asignación pasa de `pending` a `assigned`; `/dashboard/missions/:id` muestra el turno, sus `assigned` y `capacity` restante, con `organizationId` del tenant