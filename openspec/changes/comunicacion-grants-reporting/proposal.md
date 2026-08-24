# Propuesta: Comunicación por jornadas, subvenciones/board y biblioteca de especies avanzada

## Why

Impacta+ es **UN SOLO SISTEMA** que une gestión ONG chilena (RUT, CLP entero, multi-tenant estricto) con conservación (Especies + Misiones). La investigación de competencia (2026-08-24) mostró tres huecos frente a Impacta actual (que hoy solo expone `public-stats` pública y gestión interna de campañas/donaciones):

- **Procurios** gana por CMS de contenidos y **journeys** de comunicación segmentada con plantillas; **Serv.ly** gana por **comunidades** y compromiso de socios con puntaje de engagement. Impacta+ no tiene jornadas automatizadas (email/SMS) ni segmentación de audiencia.
- **MissionOps** gana por **grants con deadlines** (seguimiento de postulaciones de fondos), **board portal** (directorio y minutas) y **KPIs/reportes** para gobernanza. Impacta+ no modela subvenciones ni reportes de gobernanza.
- **SERCA** gana por **especies con estado UICN, multimedia, observaciones de campo y mapas/heatmaps**. Impacta+ hoy modela Especies de forma básica (CRUD), sin estado de conservación, evidencia multimedia ni observaciones geo-referenciadas.

Si no integramos estos tres aprendizajes, Impacta+ sigue como “CRM de campañas + conservación básica” sin el eje de comunicación, financiamiento por fondos ni evidencia científica que sí ofrecen Procurios, MissionOps y SERCA. Ahora es el momento: single-system ya estabilizado (301, EarthBackground solo landing, fake data eliminada) y base de datos normalizada lista para añadir estas capacidades sin reintroducir duplicados.

## What Changes

- **BREAKING: Ninguno.** Todo es aditivo, detrás de rutas y endpoints nuevos.
- **Jornadas de comunicación**: modelo `Segment`, `Journey`, `JourneyStep` y plantillas email/SMS con variables; motor que programa envíos con segmentación por rol/perfil/campaña; log de entregas. Backend expone CRUD de segmentos, journeys y plantillas, más endpoint de envío. Frontend añade pantallas de segmentación y construcción de journeys en el panel.
- **Subvenciones / board**: modelos `Grant` (con `deadline`, financiador, monto postulado/otorgado, documentos adjuntos, estado) y `BoardMember` (miembros del directorio, roles, mandatos). Backend CRUD de grants/board y endpoints de reportes KPI (totales por financiador, pipeline de postulaciones, quórum/renovaciones de board). Frontend añade pantallas de grants, board portal y reportes.
- **Especies avanzada**: modelo `SpeciesObservation` (avistamiento con RUT/voluntario, coordenadas, timestamp, estado UICN asociado) y campos multimedia/UICN en `Species`; mapa simple (Leaflet) en frontend. Backend CRUD de observaciones y `GET /species/:id/map`.
- **No se replica** el componente de satélite / heatmaps tiempo-real de SERCA complejo, ni el CRM enterprise de donantes de Procurios — fuera de scope para ONG chilena de ~$500k/año.

## Capabilities

### New Capabilities
- `jornadas-comunicacion`: Capacidad de segmentar audiencia, construir journeys de email/SMS con plantillas y programar envíos.
- `subvenciones-board`: Capacidad de gestionar postulaciones a fondos con deadlines/documentos y el directorio/gobernanza de la organización.
- `especies-avanzada`: Capacidad de registrar observaciones geo-referenciadas, estado UICN y multimedia de especies con mapa simple.

### Modified Capabilities
- Ninguna — las tres capacidades son nuevas. `misiones-offline` y `portal-donante` existentes no cambian de contrato.

## Impact

- **Frontend**: `frontend/src/pages/Jornadas.tsx`, `frontend/src/pages/Subvenciones.tsx`, `frontend/src/pages/BoardPortal.tsx`, `frontend/src/pages/EspeciesAvanzada.tsx` + componentes (editor de journey, editor de plantilla, mapa Leaflet), rutas nuevas en `App.tsx`, extensión de `frontend/src/pages/Especies.tsx`.
- **Backend**: `backend/src/modules/comunicacion` (Segment, Journey, JourneyStep, plantillas, envío), `backend/src/modules/subvenciones` (Grant, GrantDocument, BoardMember), `backend/src/modules/especies` (SpeciesObservation, multimedia, `GET /species/:id/map`), Prisma models nuevos.
- **Infra**: Sin cambios — sigue dominio único `impacta.*` (API en `api-impacta.*`), `app-impacta` 301. Nativo systemd. Envío email/SMS a través de proveedor transaccional (Resend/Twilio) con API keys en `.env`; sin infra nueva.
- **Docs**: `README.md`, `openspec/specs/jornadas-comunicacion`, `subvenciones-board`, `especies-avanzada`.
- **Riesgos**: envío no deseado (spam) requiere consenso/log; soberanía de datos de donantes localizando PII en Postgres nativo y plantillas sin exponer tokens; observaciones geo-referenciadas deben aislarse por tenant.