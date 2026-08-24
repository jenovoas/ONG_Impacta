# subvenciones-board Specification

## Purpose
Permitir a la ONG llevar el pipeline de postulaciones a fondos con deadlines y documentos, y al directorio gestionar gobernanza (miembros, roles, mandatos) con KPIs/reportes — inspirado en los grants/financing y board governance de MissionOps — aislado por tenant.

## ADDED Requirements

### Requirement: Gestión de subvenciones (grants) con deadlines y documentos
El staff debe registrar postulaciones a fondos con financiador, monto postulado/otorgado, `deadline`, estado y documentos adjuntos, aislado por organización.

#### Scenario: Crear grant con deadline
- **WHEN** staff hace `POST /grants` con `{ financierId, amountRequested: 15000000, deadline: "2026-10-15", status: "DRAFT", organizationId }`
- **THEN** backend guarda el grant con `organizationId` fijo del tenant y alerta al acercarse al deadline (pipeline `DRAFT → SUBMITTED → AWARDED/REJECTED`)

#### Scenario: Aislamiento de grants entre orgs
- **WHEN** dos orgs postulan al mismo financiador
- **THEN** cada org solo ve y edita sus grants; `GET /grants` filtra por `organizationId` del JWT

#### Scenario: Adjuntar documento de postulación
- **WHEN** staff adjunta un PDF/folio a un grant vía `POST /grants/:id/documents`
- **THEN** backend asocia `GrantDocument` al grant con `url`, `filename` y `uploadedById`, y descarga exige rol `ADMIN/OPERATOR` del mismo tenant

### Requirement: Board portal (directorio y gobernanza)
La ONG debe llevar sus `BoardMember` (nombre, rol, inicio/fin de mandato) y el directorio no debe mezclarse con socios operativos.

#### Scenario: Alta de miembro del directorio
- **WHEN** staff hace `POST /board/members` con `{ fullName, role: "PRESIDENTE", termStart, termEnd }`
- **THEN** backend crea `BoardMember` con `organizationId` del tenant; el board se lista aparte de `Member` operativo en `/board`

#### Scenario: Renovación de mandato
- **WHEN** un `BoardMember.termEnd` es posterior a hoy y staff extiende el mandato
- **THEN** backend actualiza `termEnd` y refleja el cambio en `/board`, manteniendo histórico de mandatos

### Requirement: KPIs y reportes de fondos y gobernanza
El staff debe consultar agregados: total otorgado por financiador, pipeline de postulaciones activas y estado de cobertura del board, sin filas ajenas al tenant.

#### Scenario: Reporte por financiador
- **WHEN** staff llama `GET /grants/report` con rango de fechas
- **THEN** backend agrega `sum(amountAwarded)` por `financierId` y cuenta grants por `status`, solo del `organizationId` del tenant

#### Scenario: KPIs de gobernanza
- **WHEN** staff llama `GET /board/report`
- **THEN** backend devuelve total board members, roles activos, `termEnd` próximos (renovaciones en los próximos 90 días), aislado por `organizationId`