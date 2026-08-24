# jornadas-comunicacion Specification

## Purpose
Permitir a la ONG segmentar su audiencia e impulsar journeys de comunicación (email/SMS) con plantillas y registro de entregas — inspirado en los journeys de Procurios y el compromiso de comunidades de Serv.ly — aislado por tenant y sin envíos no consentidos.

## ADDED Requirements

### Requirement: Segmentación de audiencia multi-tenant
El staff debe agrupar contactos por criterios (rol, RUT, campaña activa, u orgSlug) en segmentos aislados por organización.

#### Scenario: Crear segmento por campaña
- **WHEN** staff hace `POST /communication/segments` con `{ name, criteria: { campaignId, status: "ACTIVE" }, organizationId }`
- **THEN** backend guarda el segmento con `organizationId` fijo del tenant y expone count de miembros resultantes; nunca filtra miembros de otra org

#### Scenario: Aislamiento entre orgs
- **WHEN** dos orgs crean segmentos con el mismo nombre
- **THEN** cada uno solo ve y ejecuta sus propios contactos, segregados por `organizationId`

### Requirement: Journeys con plantillas email/SMS
El staff debe crear journeys programados con pasos que envían email o SMS usando plantillas con variables, y un log de entregas.

#### Scenario: Crear journey con pasos
- **WHEN** staff hace `POST /communication/journeys` con `{ steps: [{ trigger: "3 días", channel: "EMAIL", templateId }], segmentId }`
- **THEN** backend crea `Journey` + `JourneyStep`, valida que la plantilla exista en el mismo tenant y programa los primeros envíos vía proveedor transaccional

#### Scenario: Plantilla con variables
- **WHEN** staff renderiza una plantilla que referencia `{{ member.firstName }}` y `{{ organization.name }}`
- **THEN** el backend sustituye las variables con el miembro y tenant reales antes del envío, y nunca expone tokens/API keys de proveedor al frontend

#### Scenario: Registro de entrega
- **WHEN** se envía un paso a un miembro
- **THEN** se persiste un `JourneyDelivery` con `status` (SENT/FAILED/OPTED_OUT), `sentAt` y `channel`, visible en el panel sin reenviar a miembros que opt-out (salvaguarda anti-spam)

### Requirement: Control de consentimiento (anti-spam)
El sistema no debe enviar a contactos que hayan optado out ni duplicar envíos en relanzamientos.

#### Scenario: Respetar opt-out
- **WHEN** un miembro marca `communicationOptIn: false` o está en `JourneyDelivery.status = "OPTED_OUT"`
- **THEN** el motor excluye a ese miembro de todo step posterior y el log queda auditado

#### Scenario: Relanzamiento sin duplicar
- **WHEN** staff re-ejecuta un journey sobre el mismo segmento
- **THEN** el motor filtra miembros con entrega ya `SENT` para el mismo `stepId`, evitando doble email por `memberId + stepId` único