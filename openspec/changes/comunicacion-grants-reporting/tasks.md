## 1. Jornadas de comunicación — modelos y motor

- [ ] 1.1 Prisma: añadir `Segment`, `Journey`, `JourneyStep`, `JourneyDelivery` + enum `deliveryStatus`, con `organizationId` obligatorio y único `memberId + stepId`; correr migración
- [ ] 1.2 Backend `GET/POST /communication/segments` y `GET/POST /communication/journeys` + `POST /communication/journeys/:id/send` (motor encola pasos y persiste `JourneyDelivery`, excluye miembros sin `communicationOptIn`)
- [ ] 1.3 Plantillas: CRUD de plantillas con variables `{{ member.* }}`/`{{ organization.name }}`, render en backend vía proveedor transaccional (Resend/Twilio) con API keys en `.env`; anti-dup por `memberId + stepId`

## 2. Subvenciones / board — backend

- [ ] 2.1 Prisma: añadir `Grant` (deadline, `status`, monto postulado/otorgado, financiador), `GrantDocument`, `BoardMember` (rol, termStart/termEnd) con `organizationId` fijo; migración
- [ ] 2.2 Backend `GET/POST/PATCH /grants`, `POST /grants/:id/documents` (rol ADMIN/OPERATOR del tenant) y CRUD `GET/POST /board/members`
- [ ] 2.3 Endpoints de reporte: `GET /grants/report` (sum otorgado por financiador + pipeline por status) y `GET /board/report` (roles activos, termEnd próximos 90 días)

## 3. Especies avanzada — backend

- [ ] 3.1 Prisma: añadir `iucnStatus/iucnYear` a `Species` + `SpeciesMedia` y `SpeciesObservation` (lat/lng validado, `observedAt`, `observedById`); migración
- [ ] 3.2 Backend `POST /species/:id/media`, `POST /species/:id/observations` y `GET /species/:id/map` — todas filtradas por `organizationId`

## 4. Frontend — pantallas y rutas

- [ ] 4.1 Rutas nuevas en `App.tsx`: `/dashboard/jornadas`, `/dashboard/subvenciones`, `/dashboard/board`, `/dashboard/especies/avanzada` (extiende `Especies.tsx`)
- [ ] 4.2 Páginas `Jornadas.tsx` (editor de journey + selector de segmento/plantilla con log de entregas), `Subvenciones.tsx` (grants con deadlines y docs), `BoardPortal.tsx` (directorio y renovaciones)
- [ ] 4.3 Mapa Leaflet en ficha de especie (`map.ts` liviano, sin heatmap) + galería multimedia y control lat/lng para observaciones

## 5. Hardening + docs + verificación

- [ ] 5.1 Tests backend: anti-dup de jornadas (mismo `memberId + stepId` re-ejecutado no reenvía), aislamiento de grants/observaciones entre dos tenants, validación lat/lng y `iucnStatus` enum
- [ ] 5.2 Docs: `README.md` con nuevas rutas `/jornadas`, `/subvenciones`, `/board`; nota de consentimiento y soberanía de datos en `AGENTS.md`/guía de comunicación
- [ ] 5.3 Verificación: `npm run build` frontend y backend, `npm test` backend verde, `./deploy.sh frontend`, `./deploy.sh verify` (impacta 200, app-impacta 301, api 401, public-stats real) y navegación manual de las 4 pantallas nuevas