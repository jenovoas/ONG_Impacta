# misiones-offline Specification

## Purpose
Permitir a brigadistas completar tareas de misiones de conservación sin conexión en terreno y sincronizar automáticamente al recuperar señal, manteniendo aislamiento multi-tenant y sin data loss — inspirado en SERCA/SMART offline-first.

## Requirements

### Requirement: Almacenamiento offline aislado por tenant
La app debe persistir misiones y tareas en IndexedDB local, segregadas por `organizationId` + `userId`, sin filtrar entre orgs.

#### Scenario: Guardar tarea offline
- **WHEN** el usuario marca una tarea como completada sin conexión
- **THEN** el estado queda en IndexedDB (`missionTasks` store) con `pendingSync: true` y `updatedAt` local, y la UI muestra “Pendiente de sincronizar”

#### Scenario: Aislamiento entre tenants
- **WHEN** dos usuarios de orgs distintas usan el mismo navegador en momentos distintos
- **THEN** cada uno solo ve sus misiones; IndexedDB usa clave compuesta `${organizationId}:${userId}:${missionId}`

### Requirement: Sincronización idempotente con backend
Al recuperar conexión, el cliente debe enviar cambios pendientes a `PATCH /missions/:id/tasks/:taskId` de forma idempotente (last-write-wins por `updatedAt`).

#### Scenario: Sync automático al volver online
- **WHEN** `navigator.onLine` pasa a true y hay `pendingSync`
- **THEN** el worker intenta `PATCH` por cada tarea, con reintento exponencial, y al 200 marca `pendingSync: false`; al conflicto 409 conserva `updatedAt` más reciente

#### Scenario: Operación sin pérdida offline
- **WHEN** el usuario recarga la página sin conexión
- **THEN** las misiones se cargan desde IndexedDB y son navegables/editables

### Requirement: Indicación UX de estado de conexión
La UI debe mostrar claramente offline / sincronizando / sincronizado sin bloquear el trabajo.

#### Scenario: Badge offline
- **WHEN** `navigator.onLine === false`
- **THEN** `Missions.tsx` muestra badge “Sin conexión — guardado local” y deshabilita solo acciones que requieren API (no el check de tarea)
