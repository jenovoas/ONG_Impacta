---
titulo: Pendientes priorizados de Impacta+
updated: 2026-11-06
tags: [impacta, pendientes, openspec]
---

# Pendientes priorizados de Impacta+

Orden por dependencias, riesgo de datos y posibilidad de habilitar trabajo posterior. El estado deriva de las specs del repo; no implica que producción esté al día.

## P0 — Base segura para cambios y migraciones

- [ ] Aplicar el aislamiento de puertos versionado: API solo por WireGuard y PostgreSQL/Redis por loopback. **Producción observada en `0.0.0.0` para 3102/5435/6381**; cambiar los binds de datos requiere recreación planificada y autorización.
- [ ] Mover las credenciales hard-coded de Compose a `.env` privado en Fenix: agregar `POSTGRES_PASSWORD` y `DATABASE_URL_DOCKER`, hacerlas coincidir con el rol persistido y verificar sin mostrar valores. El `.env` actual no contiene esas claves; no rotar el rol ni recrear la base sin una ventana autorizada.
- [ ] Verificar `main`/`origin/main`, cambios locales y estado de producción antes de cada acción operativa.
- [ ] Crear una instancia PostgreSQL scratch aislada, sin volumen ni credenciales de producción, y ejecutar allí toda la cadena `prisma migrate deploy` desde cero.
- [ ] Auditar especialmente `20260824171000_add_p2p_and_subscriptions` (limpieza de tablas ausentes con `IF EXISTS`) y `20260825170000_add_impacta_knowledge_rag` (tablas, índices y FKs contra `Organization`).
- [ ] Registrar resultado del canario y distinguir preparación local de cualquier migración aplicada en producción.
- **Bloqueo actual:** `5432` pertenece a `sentinel-postgres` y `5435` a `impacta-db`, ambos persistentes. No usar esos puertos ni iniciar otro servicio sin autorización explícita.

## P1 — Pagos correctos antes de cobrar en producción

Fuente: `openspec/changes/campanas-p2p-recaudacion/`.

- [x] Incremento atómico página/campaña y protección contra callback exitoso repetido: está implementado en `donations.service.ts::confirmDonation` con `$transaction`/`Serializable`; hay casos unitarios escritos, no ejecutados en esta sesión.
- [x] Completar/cancelar páginas preservando donaciones y montos: está implementado en `campaigns.service.ts`.
- [x] Ruta `GET /receipts/:captureId` y filtro de ownership por tenant/miembro implementados localmente; PDF incluye origen y referencia. Pendiente compilación y pruebas de acceso.
- [ ] Completar frontend para crear/editar páginas P2P y mostrar `/p2p/:slug`, QR y métricas sociales.
- [ ] Completar autoservicio de suscripciones en `/portal` y manejo UX de errores/recibos.
- [ ] Añadir y ejecutar pruebas de ownership del recibo, aislamiento de rutas P2P y reentrancia de callbacks.
- [ ] Implementar Webpay/Flow, alta de suscripción y cobro programado solo después de definir credenciales/entorno de pruebas y el contrato operativo.
- [ ] Completar páginas `/p2p/:slug`, QR y lista/autoservicio de suscripciones en `/portal`.

## P2 — Gobierno, privacidad y runtime Sentinel

Fuentes: `openspec/changes/comunidad-segura-asistente-ia/`, `openspec/changes/runtime-sentinel-impacta/` y `docs/PLAN_MAESTRO_CEREBRO_OPERATIVO_REGIONAL.md`.

- [ ] Definir responsables, perfiles, consentimiento, privacidad, retención y revisión legal antes de mensajería, denuncias o periodismo.
- [ ] Completar contrato de conformidad Sentinel, adaptador de host, versionado de políticas, degradación segura y separación de logs/auditoría/datasets.
- [ ] Mantener sin habilitar capacidades sensibles hasta cerrar sus gates humanos y de seguridad.

## P3 — Cerrar la primera capacidad RAG

- [ ] Completar canario de la migración en scratch (P0).
- [ ] Añadir embeddings semánticos propios y evaluación de recuperación/citas.
- [ ] Crear historial formal de revisiones editoriales.
- [ ] Poblar corpus con fuentes científicas verificadas, licencias y procedencia.
- [ ] Completar gobernanza, batería retenida y modo degradado del asistente antes de ampliar generación.

## P4 — Catálogo de biodiversidad y educación

Fuente: `openspec/changes/catalogo-biodiversidad-educacion/` y `docs/PLAN_CATALOGO_BIODIVERSIDAD.md`.

- [ ] Elegir 20–30 especies y fuentes institucionales/académicas; asignar revisión científica y educativa.
- [ ] Validar licencias y conectores; diseñar catálogo global separado de observaciones por organización.
- [ ] Implementar modelos/backend y migración canario; después curación y fichas públicas accesibles.
- [ ] Proteger coordenadas sensibles y probar aislamiento entre organizaciones.

## P5 — Identidad comunitaria, red profesional y oportunidades

Fuentes: `comunidad-segura-asistente-ia/` y `comunicacion-grants-reporting/`.

- [ ] Acordar colectivo piloto de Curanilahue, aportes con consentimiento y roles antes de habilitar publicación comunitaria.
- [ ] Diseñar fuentes de financiamiento, elegibilidad, procedencia y revisión humana.
- [ ] Implementar grants/board y matching explicable sin exponer documentos de otras organizaciones.

## P6 — Membresías, voluntariado, eventos y comunicación

Fuentes: `openspec/changes/membresias-voluntariado-eventos/` y `comunicacion-grants-reporting/`.

- [ ] Implementar membresías y cuotas, turnos de voluntariado y eventos/tickets con tenant isolation.
- [ ] Implementar jornadas segmentadas solo con consentimiento y control de duplicados.
- [ ] Añadir frontend, estados vacíos/errores, docs y verificación integral por módulo.

## Estado de specs

- `campanas-p2p-recaudacion`: modelo/rutas base; atomicidad, idempotencia, cierre/cancelación y recibo seguro implementados; CI backend aprobado; UI, gateway real y hardening pendientes.
- `comunidad-segura-asistente-ia`: primera rebanada de identidad y controles de ingreso implementados; gobierno, mensajería, denuncias, periodismo y la mayor parte de IA pendientes.
- `runtime-sentinel-impacta`: saneamiento/telemetría iniciales; conformidad, degradación y operación pendientes.
- `catalogo-biodiversidad-educacion`, `comunicacion-grants-reporting`, `membresias-voluntariado-eventos`: principalmente propuestas y tareas abiertas.

## Sesión actual — 2026-11-06

- Refactor de despliegue fusionado vía [PR #2](https://github.com/jenovoas/ONG_Impacta/pull/2) en `main` (`70b55a5`); cabeza `96189bf`; ramas local/remota eliminadas. Sin deploy a producción.
- CI `42152556855`: backend, frontend y landing aprobaron; backend completó migraciones efímeras, unitarias y e2e. Lint/build local pasaron en los tres proyectos.
- Graphify actualizado y etiquetado: 2436 nodos, 3723 aristas, 183 comunidades; diagnóstico en cero para nodos sin verificar, endpoints faltantes/huérfanos y bucles.
- Revisión estática inicial de la migración RAG: crea las dos tablas, índices y FKs esperados. No se ejecutó contra una base.
- Revisión de código P2P detectó atomicidad/idempotencia, cierre/cancelación y casos unitarios ya implementados; se corrigieron sus checkboxes OpenSpec.
- Recibo seguro: `ReceiptsController` en `/receipts/:captureId`, ownership por organización/miembro autenticado y PDF con procedencia P2P/suscripción; build y pruebas de backend aprobados en CI.
- Puertos observados: 5432 `sentinel-postgres`, 5435 `impacta-db`; ambos persistentes. No usar como scratch.
- Evidencia de solo lectura: despliegue separado Kingu/Fenix; API 3102, PostgreSQL 5435 y Redis 6381 aún publicados en todas las interfaces. Refactor Compose/script preparado localmente, sin aplicar.
- Sin despliegue de producción ni cambios de servicio. Las migraciones y pruebas del PR corrieron en la base efímera del runner.
