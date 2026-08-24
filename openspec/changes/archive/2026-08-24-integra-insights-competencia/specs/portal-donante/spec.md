## Purpose

Dar al donante un portal self-service donde consultar su historial de aportes, descargar recibos y gestionar recurrencia sin depender del staff — inspirado en Neon/Donorbox donor portal — manteniendo trazabilidad por RUT/email y multi-tenant.

## ADDED Requirements

### Requirement: Historial de donaciones del donante autenticado
El donante autenticado (RUT o email + orgSlug) debe ver solo sus donaciones de su organización.

#### Scenario: Consulta filtrada por miembro
- **WHEN** donante hace `GET /donations/me` con JWT de miembro
- **THEN** backend filtra `where: { organizationId: tenant.id, memberId: currentMember.id }` y devuelve lista ordenada por `createdAt desc`, nunca de otra org

#### Scenario: Aislamiento por org
- **WHEN** donante existe en org A y org B con mismo email
- **THEN** cada login por `orgSlug` distinto muestra solo el historial de esa org

### Requirement: Descarga de recibo PDF
Cada donación `SUCCEEDED` debe ofrecer recibo descargable con datos de ONG, monto CLP, campaña y fecha.

#### Scenario: Descarga recibo
- **WHEN** donante hace `GET /donations/:id/receipt` de una donación suya
- **THEN** backend genera PDF (jsPDF o pdf-lib) con `org.name, org.slug, donor RUT, amount, campaign, createdAt` y lo sirve con `Content-Disposition: attachment`

### Requirement: Gestión de recurrencia
Donante con donaciones recurrentes debe poder pausar/cancelar sin contactar staff.

#### Scenario: Pausar recurrencia
- **WHEN** donante hace `PATCH /donations/recurring/:id { status: "PAUSED" }`
- **THEN** backend actualiza solo si `memberId` coincide con donante autenticado; staff ve el cambio en `/dashboard/donations`

### Requirement: Acceso sin exponer datos de otros donantes
El portal nunca debe listar ni sugerir donantes ajenos.

#### Scenario: Intento enumeración
- **WHEN** donante manipula `/:id` de otra persona
- **THEN** backend responde `404` (no `403`) si `organizationId` o `memberId` no coincide, para no revelar existencia
