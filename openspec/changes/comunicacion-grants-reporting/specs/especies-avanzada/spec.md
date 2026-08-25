# especies-avanzada Specification

## Purpose
Elevar Especies de CRUD básico a biblioteca con estado de conservación UICN, evidencia multimedia, observaciones geo-referenciadas de campo y mapa simple — inspirado en la riqueza de datos de SERCA — aislado por tenant y sin satélite.

## ADDED Requirements

### Requirement: Estado de conservación UICN por especie
Cada especie MUST registrar su categoría UICN (EX, EW, CR, EN, VU, NT, LC, DD, NE) y año de evaluación.

#### Scenario: Registrar categoría UICN
- **WHEN** staff hace `PATCH /species/:id` con `{ iucnStatus: "EN", iucnYear: 2024 }`
- **THEN** backend persiste la categoría y año; el listado y ficha de especie muestran la categoría validada contra el enum UICN

#### Scenario: Aislamiento de catálogos por org
- **WHEN** dos orgs tienen especies del mismo nombre
- **THEN** cada org solo edita su `Species` (filtro `organizationId`); el catálogo UICN es compartido (referencia global) pero el registro es propio

### Requirement: Multimedia por especie
Cada especie MUST poder tener una galería de imágenes/audio con captura de créditos y coexistencia con el mapa.

#### Scenario: Subir evidencia multimedia
- **WHEN** staff hace `POST /species/:id/media` con `{ type: "IMAGE", url, caption, credit }`
- **THEN** backend guarda `SpeciesMedia` asociado a la `Species` del tenant y lo muestra en la galería de la ficha

### Requirement: Observaciones de campo geo-referenciadas
Voluntarios y staff MUST poder registrar avistamientos con lat/lng, timestamp y nota, y verlos agregados en un mapa simple por especie.

#### Scenario: Registrar observación con coordenadas
- **WHEN** un usuario autenticado hace `POST /species/:id/observations` con `{ lat, lng, notes, observedAt }`
- **THEN** backend crea `SpeciesObservation` con `organizationId`, `observedById` (miembro/voluntario) y valida `lat ∈ [-90,90]`, `lng ∈ [-180,180]`

#### Scenario: Mapa simple de avistamientos
- **WHEN** staff hace `GET /species/:id/map`
- **THEN** backend devuelve lista de observaciones con `lat/lng` del tenant y el frontend las pinta en Leaflet —sin heatmap-tiempo-real— con tooltip de `observedAt` y `notes`

#### Scenario: Aislamiento de observaciones
- **WHEN** un usuario de la org A consulta avistamientos de una especie
- **THEN** solo ve observaciones con `organizationId = A`; las de la org B nunca se incluyen en el mapa
