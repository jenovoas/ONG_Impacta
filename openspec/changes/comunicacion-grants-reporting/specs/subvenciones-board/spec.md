# subvenciones-board Specification

## Purpose
Permitir a la ONG llevar el pipeline de postulaciones a fondos con deadlines y documentos, y al directorio gestionar gobernanza (miembros, roles, mandatos) con KPIs/reportes — inspirado en los grants/financing y board governance de MissionOps — aislado por tenant.

## ADDED Requirements

### Requirement: Catálogo global de oportunidades verificables

El sistema MUST mantener convocatorias globales con fuente oficial, enlace,
territorio, beneficiarios, montos, fechas, requisitos, versión y fecha de consulta.

#### Scenario: Descubrimiento automático de una convocatoria

- **WHEN** un conector detecta una oportunidad nueva o modificada
- **THEN** crea un candidato con procedencia y diferencias respecto de la versión anterior
- **AND** no la marca verificada hasta una revisión humana

### Requirement: Matching explicable y privado

El sistema MUST comparar oportunidades con el perfil de una organización sin
revelar sus documentos, estrategia ni datos tenant a otros participantes.

#### Scenario: Coincidencia con una brecha técnica

- **WHEN** una organización cumple territorio y personalidad jurídica pero carece de una especialidad requerida
- **THEN** el sistema muestra requisitos cumplidos, brecha, evidencia e incertidumbre
- **AND** puede sugerir colaboradores que hicieron visible esa capacidad
- **AND** no comparte el borrador de postulación con ellos

### Requirement: Colaboración consentida

El sistema MUST exigir aceptación antes de abrir un espacio compartido o revelar
datos de contacto entre posibles colaboradores.

#### Scenario: Invitar a profesional complementario

- **WHEN** una organización decide contactar un perfil sugerido
- **THEN** el sistema envía una invitación con propósito y alcance
- **AND** solo crea el espacio colaborativo después de su aceptación

### Requirement: Formulación asistida sin envío autónomo

El sistema MAY crear borradores y checklists, pero la IA MUST NOT postular,
firmar ni comprometer recursos.

#### Scenario: Borrador listo para revisión

- **WHEN** el estudio de formulación completa una versión de proyecto
- **THEN** conserva fuentes, aportes y campos pendientes de decisión humana
- **AND** el envío final exige una persona autorizada fuera del asistente

### Requirement: Gestión de subvenciones (grants) con deadlines y documentos
El staff MUST poder registrar postulaciones a fondos con financiador, monto postulado/otorgado, `deadline`, estado y documentos adjuntos, aislado por organización.

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
La ONG MUST poder llevar sus `BoardMember` (nombre, rol, inicio/fin de mandato) y el directorio MUST NOT mezclarse con socios operativos.

#### Scenario: Alta de miembro del directorio
- **WHEN** staff hace `POST /board/members` con `{ fullName, role: "PRESIDENTE", termStart, termEnd }`
- **THEN** backend crea `BoardMember` con `organizationId` del tenant; el board se lista aparte de `Member` operativo en `/board`

#### Scenario: Renovación de mandato
- **WHEN** un `BoardMember.termEnd` es posterior a hoy y staff extiende el mandato
- **THEN** backend actualiza `termEnd` y refleja el cambio en `/board`, manteniendo histórico de mandatos

### Requirement: KPIs y reportes de fondos y gobernanza
El staff MUST poder consultar agregados: total otorgado por financiador, pipeline de postulaciones activas y estado de cobertura del board, sin filas ajenas al tenant.

#### Scenario: Reporte por financiador
- **WHEN** staff llama `GET /grants/report` con rango de fechas
- **THEN** backend agrega `sum(amountAwarded)` por `financierId` y cuenta grants por `status`, solo del `organizationId` del tenant

#### Scenario: KPIs de gobernanza
- **WHEN** staff llama `GET /board/report`
- **THEN** backend devuelve total board members, roles activos, `termEnd` próximos (renovaciones en los próximos 90 días), aislado por `organizationId`
