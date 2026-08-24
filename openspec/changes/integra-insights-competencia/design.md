## Context

Impacta+ está estabilizado como **UN SOLO SISTEMA** (landing + front + panel en `https://impacta.pinguinoseguro.cl`, `app-impacta` 301, fake data eliminada). Stack: Vite+React 19 + TanStack Query, NestJS 11 + Prisma 5 + Postgres nativo + Redis, nginx proxy `/api/` → `127.0.0.1:3001`. Misiones hoy es online-only (`GET/PATCH /missions`), Donaciones no tiene portal self-service. Investigación muestra que SERCA gana por offline-first y Neon por portal donante — ambas se pueden añadir sin romper dominio único ni multi-tenant.

## Goals / Non-Goals

**Goals:**
- Misiones operables 100% offline en terreno (check de tareas) con sync automático e idempotente.
- Donante ve su historial, descarga recibo CLP y gestiona recurrencia sin staff.
- Todo aislado por `organizationId` + `memberId`/`userId`, sin filtraciones entre tenants.

**Non-Goals:**
- PWA completa con push, install prompt o background sync avanzado.
- Tiempo-real satelital / AI cámaras (EarthRanger) o CRM enterprise tipo Salesforce NPSP.
- Pagos: se reutiliza `campaign.currentAmount` y `donation.status`; no se integra nueva pasarela en este change.

## Decisions

- **IndexedDB via `idb` (no localForage)**: tipado, promises, control de índices por `organizationId`. Stores: `missions` (`key: ${orgId}:${userId}:${id}`), `missionTasks` (`key: ${orgId}:${missionId}:${taskId}` + índice `pendingSync`). Alternativa localStorage descartada por cuota 5MB y sin índices.
- **Clave compuesta `${orgId}:${userId}:${id}`**: evita leak entre orgs si el mismo device lo usan dos brigadistas. `orgId` viene de `useAuthStore.organizationId`, `userId` de `user.id`.
- **Sync last-write-wins por `updatedAt`**: cliente envía `If-Unmodified-Since` con `updatedAt` local; backend compara `missionTask.updatedAt`. Si `local > remote`, acepta; si no, responde `409` con `serverTask` y cliente mergea. Idempotencia vía `taskId` estable + `PATCH` (no POST).
- **Detección online `navigator.onLine` + `online/offline` events + retry 3× exponencial (1s, 3s, 9s)**: simple, sin Workbox. Service worker solo para cache de `index.html`/`assets` si se añade después.
- **Portal donante auth**: reutiliza JWT existente pero resuelve `Member` por `user.email` o `RUT` del donante. `GET /donations/me` filtra por `memberId` resuelto, no por `userId` directo — mantiene vínculo donante↔socio que ya existe en `Donation.memberId`.
- **Recibo PDF en backend (pdf-lib) vs frontend jsPDF**: backend, para incluir firma digital futura y no exponer `org.config` al cliente. `Content-Disposition: attachment; filename=recibo-${id}.pdf`.
- **Ruta portal `/portal` pública con guard `member` vs `/dashboard/portal`**: se elige `/portal` separada para no mezclar roles `ADMIN/OPERATOR` de dashboard con `MEMBER` donante; usa mismo `client.ts` con `Bearer`.

## Risks / Trade-offs

- **Aislamiento IndexedDB**: riesgo de leer otra org si se olvida prefijo. Mitigación: helper `missionsDb.getAll(orgId, userId)` fuerza filtro; tests con dos tenants en mismo browser.
- **Conflicto offline**: dos brigadistas editan misma tarea offline y sync luego. Trade-off: last-write-wins es simple para v1; CRDT sería overkill para checklist booleano.
- **Cuota storage**: IndexedDB ~50MB, suficiente para 100 misiones. Riesgo en dispositivos low-end; se limita a últimas 50 misiones por org.
- **Enumeración de donaciones**: `GET /donations/:id/receipt` debe devolver 404 genérico si no es del donante, para no oracular IDs. Trade-off: log interno guarda `denied_attempt` para auditoría.
