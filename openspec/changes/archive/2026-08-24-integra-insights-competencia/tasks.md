## 1. Misiones offline — base local

- [x] 1.1 Crear `frontend/src/lib/missions-db.ts` con `idb`: stores `missions`, `missionTasks`, índices `pendingSync`, helpers `getAll(orgId,userId)`, `putTask()`, `getPending()`
- [x] 1.2 Hook `useMissionsSync()` que escucha `online/offline`, hace `PATCH /missions/:id/tasks/:taskId` por cada `pendingSync` con retry exponencial y marca `pendingSync:false` al 200
- [x] 1.3 Modificar `frontend/src/pages/Missions.tsx` para leer de IndexedDB en `onLine===false` y escribir local + `pendingSync:true` al marcar check; mostrar badge “Sin conexión — guardado local”

## 2. Misiones offline — backend sync idempotente

- [x] 2.1 Endurecer `PATCH /missions/:id/tasks/:taskId` para comparar `updatedAt` y devolver `409` con `serverTask` si `local < remote`
- [x] 2.2 Tests: dos tenants en mismo browser no se ven; sync tras offline re-aplica sin duplicar
- [x] 2.3 E2E: marcar tarea offline → reload offline → online → verificar `GET /missions` refleja check

## 3. Portal donante — backend

- [x] 3.1 `GET /donations/me` en `donations.controller.ts` — resuelve `Member` por `req.user.email` o RUT, filtra por `organizationId + memberId`, orden `createdAt desc`
- [x] 3.2 `GET /donations/:id/receipt` — verifica ownership, genera PDF con `pdf-lib` (`org.name`, `org.slug`, donante, `amount` CLP, `campaign.name`, fecha), `Content-Disposition: attachment`
- [x] 3.3 `PATCH /donations/recurring/:id` — pausa/cancela solo si `memberId` coincide; staff ve cambio en `/donations` lista

## 4. Portal donante — frontend

- [x] 4.1 Nueva ruta `frontend/src/pages/PortalDonante.tsx` + `/portal` en `App.tsx` con guard `member` (mismo `client.ts` + `useAuthStore`), lista `useQuery(['donations-me'])`, botón descargar recibo
- [x] 4.2 Componente `RecurrenceToggle` que hace `PATCH` y muestra estado `ACTIVE/PAUSED/CANCELLED`
- [x] 4.3 Manejo 404 genérico para `:id` ajeno (no revela existencia), toast “Recibo no disponible”

## 5. Hardening + docs + verificación

- [x] 5.1 Limpieza: verificar que `impacta.pinguinoseguro.cl` sigue 301 y que `misiones-db` aisla por `orgId:userId` — grep `pendingSync` sin filtro debe fallar
- [x] 5.2 Docs: actualizar `AGENTS.md` regla #1 y `README.md` con nuevas rutas `/portal` y nota offline
- [x] 5.3 Verificación post-deploy: `npm run build` frontend/backend, `npm test` backend 11/11, `./deploy.sh frontend`, `./deploy.sh verify` (impacta 200, impacta.pinguinoseguro.cl 301, api 401, public-stats real), navegación manual `/portal` + offline (Airplane mode) en Chrome
