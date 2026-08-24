# Propuesta: Integrar aprendizajes de competencia (Neon/SERCA) — misiones offline + portal donante

## Why

Impacta+ es **UN SOLO SISTEMA** que ya une gestión ONG chilena (RUT, CLP entero, multi-tenant estricto) con conservación (Especies + Misiones) — intersección que ningún SaaS genérico (Neon One, Donorbox, Salesforce) ni plataforma de campo (SMART/EarthRanger) cubre completa.

Investigación internet (2026-08-24) mostró:
- **Genéricos** ganan por portal donante self-service y automatización, pero fallan en campo offline y especies.
- **SERCA/SMART** ganan por offline-first (IndexedDB + sync cuando hay señal) y patrullaje, pero ignoran donaciones/socios.
- Impacta+ hoy muestra datos reales pero **Misiones** falla sin señal en terreno y **Donaciones** no deja al donante gestionar sus aportes/recibos — dos fricciones que Neon y SERCA sí resuelven.

Si no integramos esos dos aprendizajes, Impacta+ queda como “Neon para Chile” sin diferencial de campo, ni “SMART para ONG” sin sustentabilidad financiera. Ahora es el momento: single-system ya estabilizado (301, EarthBackground solo landing, fake data eliminado), base lista para añadir capacidades offline y portal sin reintroducir duplicados.

## What Changes

- **BREAKING: Ninguno.** Todo es aditivo, detrás de flags y rutas nuevas.
- **Misiones offline-first**: `frontend/src/pages/Missions.tsx` pasa a leer/escribir en IndexedDB (`missions, missionTasks`) y hace sync `PATCH /missions/:id/tasks/:taskId` cuando vuelve online. Service worker leve, no PWA completa. Mantiene multi-tenant (`organizationId` en cada registro local).
- **Portal donante**: nueva ruta `/portal` (o `/dashboard/portal` según rol) donde donante autenticado via token RUT/email ve sus donaciones, descarga recibos PDF (jsPDF), gestiona recurrencia (pausa/cancela). Backend expone `GET /donations/me` filtrado por `memberId` del donante + `GET /donations/:id/receipt`.
- **No se replica** Salesforce/NPSP complejo ni EARTHRanger tiempo-real con satélite — fuera de scope para ONGs $500k-$2M/año chilenas.

## Capabilities

### New Capabilities
- `misiones-offline`: Capacidad de registrar y completar tareas de misiones sin conexión y sincronizar al recuperar señal.
- `portal-donante`: Capacidad de donante para consultar historial, recibos y recurrencia sin pasar por staff.

### Modified Capabilities
- Ninguna — todo es nuevo. `misiones` y `donaciones` existentes no cambian de contrato, solo se añaden endpoints paralelos (`/me`, `/receipt`) y storage local.

## Impact

- **Frontend**: `frontend/src/pages/Missions.tsx` + nuevo `frontend/src/lib/missions-db.ts` (idb), `frontend/src/pages/PortalDonante.tsx`, `frontend/src/app/serviceWorker` opcional, `frontend/src/pages/LandingPage.tsx` docs.
- **Backend**: `backend/src/modules/missions` (sync idempotente, conflicto last-write-wins), `backend/src/modules/donations` (`GET /me`, `receipt`), `backend/src/modules/members` vínculo donante↔member por RUT/email, Prisma `RecurringDonation` si aplica.
- **Infra**: Sin cambios — sigue dominio único `impacta.*` (API en `api-impacta.*`), `app-impacta` 301. Nativo systemd.
- **Docs**: `AGENTS.md` regla #1, `README.md`, `openspec/specs/misiones-offline`, `portal-donante`.
- **Riesgos**: IndexedDB por tenant debe aislar por `organizationId` + `userId` para no filtrar entre orgs; sync debe ser idempotente.
