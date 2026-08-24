## 1. Membresías — base (backend + worker)

- [ ] 1.1 Extender Prisma: agregar `Member.membershipTier` (enum, nullable aditivo) y modelo `Membership` (`tier`, `amount`, `interval`, `autoRenew`, `renewalDue`, `status`, `organizationId`) + migración
- [ ] 1.2 Endpoints en `backend/src/modules/members`: `PATCH /members/:id { membershipTier }` y `GET /members/directory?orgSlug` (solo `publishToDirectory` + `ACTIVE`, sin RUT/email)
- [ ] 1.3 Worker BullMQ `memberships.processor.ts`: recorre `renewalDue < now()` con Redis lock, renueva `autoRenew: true` (extiende `renewalDue`) y marca `LAPSED` los `autoRenew: false`, idempotente por `membershipId`
- [ ] 1.4 Tests: elevar tier, vencimiento→`LAPSED`, auto-renovación sin doble conteo con dos ticks, directorio no expone datos privados
- [ ] 1.5 Extender `/portal` (frontend `PortalDonante.tsx`): sección “Mi membrecía” con tier/cuota/estado/`renewalDue` desde `GET /portal/membership`

## 2. Voluntariado (backend + frontend)

- [ ] 2.1 Prisma: modelos `VolunteerShift` (`missionId`, `date`, `role`, `capacity`, `filled`, `organizationId`) y `VolunteerShiftAssignment` (`shiftId`, `memberId`, `status`) + migración; validar `mission.organizationId === tenant.id` al crear
- [ ] 2.2 Endpoints `backend/src/modules/volunteers`: `POST /shifts`, `POST /shifts/:id/apply` (update `filled < capacity` transaccional, `409` al lleno), `PATCH /shifts/:id/assign`, `POST /availability`
- [ ] 2.3 Frontend `frontend/src/pages/Voluntariado.tsx`: calendario de turnos con `filled/capacity`, badge “Te conviene” por disponibilidad; ruta `/dashboard/voluntariado`
- [ ] 2.4 Tests: postulación llena el turno y rechaza `409`, aislamiento de turnos entre orgs, asignación confirma en `/dashboard/missions/:id`

## 3. Eventos (backend + frontend)

- [ ] 3.1 Prisma: modelos `Event` (`name`, `date`, `location`, `capacity`, `ticketsSold`, `status`, `organizationId`) y `Ticket` (`code`, `ticketType`, `amount`, `sponsorName`, `status`, `organizationId`) + migración
- [ ] 3.2 Endpoints `backend/src/modules/events`: `POST /events`, `POST /events/:id/tickets` (hash HMAC del `code`, `update ticketsSold < capacity`, `409` a capacidad), `PATCH /events/tickets/:id/checkin` (idempotente, `404` encubierto)
- [ ] 3.3 Frontend `frontend/src/pages/Eventos.tsx`: crear/publicar evento, lista para anónimos de orgSlug, vista check-in con escáner QR; ruta `/dashboard/eventos`
- [ ] 3.4 Tests: compra sin overbooking, check-in repetido idempotente, QR de otra org → `404`, ticket sponsor en sección patrocinadores

## 4. Frontend — integración y directorio

- [ ] 4.1 Rutas en `frontend/src/App.tsx`: `/dashboard/membership`, `/dashboard/voluntariado`, `/dashboard/eventos` bajo panel existente; sección socio en `/portal`
- [ ] 4.2 Directorio público `frontend/src/pages/MembersDirectory.tsx` consumiendo `GET /members/directory` (filtrado por `orgSlug`, sin datos privados)
- [ ] 4.3 Estados UX: badge `LAPSED`/`FULL`/vencido en portal y dashboard, toast genérico “Entrada no válida” en check-in

## 5. Hardening + docs + verificación

- [ ] 5.1 Aislamiento: grep `organizationId` en `memberships/volunteers/events` services (filtro obligatorio en todo query/update), tests con dos tenants en una misma sesión
- [ ] 5.2 Docs: actualizar `README.md` y `AGENTS.md` regla #1 con los tres módulos y rutas nuevas
- [ ] 5.3 Verificación: `npm run build` frontend y backend, `npm test` backend completo, `./deploy.sh` (frontend y backend) y `./deploy.sh verify` (impacta 200, api 401, `app-impacta` 301), test manual de tier, turno y check-in QR