## Context

Impacta+ está estabilizado como **UN SOLO SISTEMA** (landing + front + panel en `https://impacta.pinguinoseguro.cl`, `app-impacta` 301, fake data eliminada). Stack: Vite+React 19 + TanStack Query, NestJS 11 + Prisma 5 + Postgres nativo + Redis, nginx proxy `/api/` → `127.0.0.1:3001`, multi-tenant estricto por `organizationId`. Hoy Especies es CRUD básico, no existen Journey/Segment ni Grant/BoardMember. Investigación muestra que Procurios gana por journeys, Serv.ly por engagement/comunidades, MissionOps por grants+board+KPIs y SERCA por especies con UICN/observaciones/mapas — todo aditivo sin romper dominio único ni multi-tenant.

## Goals / Non-Goals

**Goals:**
- Segmentación de audiencia y journeys de email/SMS con plantillas y log de entregas, aislado por tenant y anti-spam.
- Pipeline de subvenciones con deadlines/documentos y directorio (board) con reportes KPI de gobernanza y fondos.
- Especies con categoría UICN, multimedia y observaciones geo-referenciadas con mapa simple.

**Non-Goals:**
- Satélite/tiempo-real/heatmaps complejos estilo EarthRanger/SERCA.
- CRM enterprise de donantes o CMS de contenidos completo estilo Procurios.
- Pasarela de pago nueva; envío transaccional vía proveedor externo (Resend/Twilio) sin infra nueva.

## Decisions

- **Prisma `Grant` (+ `GrantDocument`) y `BoardMember`**: `organizationId` obligatorio en cada fila, `deadline`/`status` enum en Grant (`DRAFT/SUBMITTED/AWARDED/REJECTED`), `termStart/termEnd` en BoardMember. Alternativa tabla genérica "grants" descartada por no capturar deadlines/estados.
- **Prisma `SpeciesObservation` y `SpeciesMedia`**: observaciones con `lat/lng + observedAt + observedById`, media con `type/url/caption/credit`; `Species.iucnStatus/iucnYear` con enum UICN global compartido. Mapas vía Leaflet liviano (no Mapbox) para ONGs pequeñas y sin geocodificación compleja.
- **Prisma `Segment`, `Journey`, `JourneyStep`, `JourneyDelivery`**: `memberId + stepId` único para idempotencia anti-dup; `deliveryStatus` (SENT/FAILED/OPTED_OUT). Motor simple con job (Redis BullMQ) que consulta segmentos y encola envíos al proveedor transaccional; sin workflow engine pesado.
- **Consentimiento anti-spam**: `Member.communicationOptIn` + `JourneyDelivery` audita, y el motor excluye miembros `OPTED_OUT`/no-consent en cada paso. Decision basada en ley chilena de spam (Ley 19.628) — mitigación de riesgo legal.
- **Envío transaccional**: plantillas se renderizan en backend con variables (`{{ member.firstName }}`) y las API keys de Resend/Twilio viven en `.env`; el frontend nunca las recibe — soberanía de datos PII localizada en Postgres nativo.
- **Separación Board vs Member**: `BoardMember` es tabla distinta de `Member` operativo/donante; no se fusionan para no contaminar roles del panel.

## Risks / Trade-offs

- **Spam/consentimiento**: envíos no consentidos dañan marca y pueden violar ley. Mitigación: `communicationOptIn` por defecto y respeto estricto de opt-out; tests de anti-dup.
- **Soberanía de datos**: PII de donantes debe quedar en Postgres nativo y no en proveedores. Trade-off: render local + enviar solo payload mínimo (destinatario + plantilla renderizada) al proveedor.
- **Datos geo de especies**: observaciones sensibles pueden requerir precisión limitada. Trade-off: lat/lng exacto en DB, pero el mapa público/vista puede redondear si la org lo configura.
- **Complejidad de journeys**: automación puede crecer (branching, retry avanzado). Non-goal: limitar a pasos lineales con triggers de tiempo y exclude-list; CRDT/estado complejo queda para futuro.