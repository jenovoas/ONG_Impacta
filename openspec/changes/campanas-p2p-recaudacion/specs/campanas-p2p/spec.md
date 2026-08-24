# campanas-p2p Specification

## Purpose
Permitir que un socio (Member) cree una página de colecta personal vinculada a una campaña madre, la comparta por URL/QR y recaude arrastrando su red — inspirado en Donorbox P2P/crowdfunding — sumando cada aporte atómicamente al currentAmount de la campaña madre.

## ADDED Requirements

### Requirement: Página de colecta personal vinculada a campaña madre
Un socio autenticado de la organización debe poder crear una página P2P asociada a una `Campaign` existente (con `goalAmount`), definiendo un subtítulo y una meta personal opcional; la página hereda nombre/meta de la campaña madre y expone su propia URL/QR única.

#### Scenario: Creación de página por socio
- **WHEN** un `Member` autenticado hace `POST /campaigns/:id/p2p { title, personalGoal? }` dentro de su `organizationId`
- **THEN** el backend crea `CampaignP2PPage` con `campaignId=:id`, `slug` aleatorio, `currentAmount=0`, `status=ACTIVE` y devuelve `{ url: "/p2p/:slug", qrToken }` — nunca sobre otra org

#### Scenario: Acceso público a la página
- **WHEN** cualquier visitante abre `GET /p2p/:slug` (pública, sin sesión)
- **THEN** el backend responde los datos de la página (título, meta personal, `currentAmount`, campaña madre, socios que aportaron) sin exponer datos de administración ni de otros tenants

#### Scenario: Aislamiento multi-tenant
- **WHEN** se intenta crear una página P2P sobre una campaña de otra `organizationId`
- **THEN** el backend responde `404` (no revela existencia de la campaña ajena) y no crea ningún registro

### Requirement: Métrica de social proof en la página
La página pública debe mostrar indicadores de avance y actividad social que motiven nuevos aportes (donantes recientes, porcentaje de meta alcanzada, tiempo restante).

#### Scenario: Barra de avance y donantes recientes
- **WHEN** la página tiene `currentAmount` > 0 y al menos un aporte
- **THEN** el endpoint `GET /p2p/:slug` incluye `percentRaised` (currentAmount / personalGoal|goalAmount), `recentDonors` (top 5 por `createdAt desc`, solo nombre/avatar) y `daysLeft` si la campaña madre tiene `endDate`

#### Scenario: Sin filtración de datos sensibles
- **WHEN** se listan `recentDonors`
- **THEN** solo se exponen `firstName`, `initial` y monto; nunca `RUT`, `email` ni `lastName` completo

### Requirement: Cierre de página y agregación a campaña madre
Todos los aportes a una página P2P deben sumar atómicamente al `currentAmount` de la página y al `currentAmount` de la campaña madre; al completarse o caducar la campaña madre, la página pasa a `COMPLETED` y puede cerrarse sin borrar el historial.

#### Scenario: Aporte agrega atómicamente a ambas
- **WHEN** un visitante dona a `GET /p2p/:slug` (pago SUCCEEDED) con `amount`
- **THEN** en una transacción Prisma se ejecuta `increment` de `currentAmount` en la `CampaignP2PPage` y en su `Campaign` madre, y se crea `Donation` con `sourceType="P2P"`, `p2pPageId` y `captureId` único

#### Scenario: Cierre por campaña madre completada
- **WHEN** la campaña madre alcanza `currentAmount >= goalAmount` o su `endDate` vence
- **THEN** el backend marca `Campaign.status=COMPLETED` y todas sus `CampaignP2PPage` pasan a `COMPLETED`; los aportes ya registrados se conservan íntegros y la página muestra estado "Finalizada"

#### Scenario: Cancelación de página sin pérdida de datos
- **WHEN** el socio creador cancela su página (`PATCH /campaigns/:id/p2p/:pageId { status: "CANCELLED" }`)
- **THEN** la página queda `CANCELLED` (no recibe más aportes) pero sus `Donation` asociadas y la `currentAmount` de la campaña madre permanecen intactas
