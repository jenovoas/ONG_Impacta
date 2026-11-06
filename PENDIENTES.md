---
titulo: Pendientes priorizados de Impacta+
updated: 2026-11-06
tags: [impacta, pendientes, openspec]
---

# Pendientes priorizados de Impacta+

Orden por dependencias, riesgo de datos y posibilidad de habilitar trabajo posterior. El estado deriva de las specs del repo; no implica que producción esté al día.

## P0 — Base segura para cambios y migraciones

- [x] Aplicar el aislamiento de puertos: API solo por WireGuard; PostgreSQL/Redis solo por loopback. Verificado en Docker tras recrear cada contenedor.
- [x] Configurar `POSTGRES_PASSWORD` y `DATABASE_URL_DOCKER` en el `.env` privado de Fenix, validar que Compose resuelve los mismos valores y confirmar autenticación PostgreSQL sin mostrar secretos. Archivo con permisos `0600`.
- [ ] Verificar `main`/`origin/main`, cambios locales y estado de producción antes de cada acción operativa.
- [x] Canario de migraciones desde cero completado en la base efímera de CI (`42152556855`); en Fenix `prisma migrate status` confirmó que el esquema ya estaba actualizado. No se aplicaron migraciones durante este despliegue.
- [x] Registrar y separar la preparación local del despliegue: el refactor se publicó y verificó en producción el 2026-11-06; volúmenes de PostgreSQL/Redis conservados.
- [ ] Mantener el puerto de datos `5435` reservado para PostgreSQL persistente; para un nuevo canario usar una instancia efímera aislada y sin publicar puertos.

## P1 — Pagos correctos antes de cobrar en producción

Fuente: `openspec/changes/campanas-p2p-recaudacion/`.

- [x] Incremento atómico página/campaña y protección contra callback exitoso repetido: está implementado en `donations.service.ts::confirmDonation` con `$transaction`/`Serializable`; hay casos unitarios escritos, no ejecutados en esta sesión.
- [x] Completar/cancelar páginas preservando donaciones y montos: está implementado en `campaigns.service.ts`.
- [x] Ruta `GET /receipts/:captureId`, filtro de ownership por tenant/miembro y PDF con origen/referencia compilados; CI backend aprobado en `42152556855`.
- [ ] Completar frontend para crear/editar páginas P2P y mostrar `/p2p/:slug`, QR y métricas sociales.
- [ ] Completar autoservicio de suscripciones en `/portal` y manejo UX de errores/recibos.
- [ ] Añadir y ejecutar pruebas de ownership del recibo, aislamiento de rutas P2P y reentrancia de callbacks.
- [ ] Implementar Webpay/Flow, alta de suscripción y cobro programado solo después de definir credenciales/entorno de pruebas y el contrato operativo.
- [ ] Completar páginas `/p2p/:slug`, QR y lista/autoservicio de suscripciones en `/portal`.

## P1 — Sincronización del grafo

- [ ] Reanudar la actualización incremental Graphify de los documentos operativos. El intento del 2026-11-06 omitió 47/112 fuentes y el guard de reducción conservó el grafo raíz previo (2436 nodos). No usar `--allow-partial`; revisar la copia preservada `graphify-out/2026-11-06-before-update/` y reintentar con chunks menores.

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

- Refactor de despliegue fusionado vía [PR #2](https://github.com/jenovoas/ONG_Impacta/pull/2) en `main` (`70b55a5`); cabeza `96189bf`; ramas local/remota eliminadas.
- CI `42152556855`: backend, frontend y landing aprobaron; backend completó migraciones efímeras, unitarias y e2e. Lint/build local pasaron en los tres proyectos.
- Graphify actualizado y etiquetado: 2436 nodos, 3723 aristas, 183 comunidades; diagnóstico en cero para nodos sin verificar, endpoints faltantes/huérfanos y bucles.
- Revisión estática inicial de la migración RAG: crea las dos tablas, índices y FKs esperados. No se ejecutó contra una base.
- Revisión de código P2P detectó atomicidad/idempotencia, cierre/cancelación y casos unitarios ya implementados; se corrigieron sus checkboxes OpenSpec.
- Recibo seguro: `ReceiptsController` en `/receipts/:captureId`, ownership por organización/miembro autenticado y PDF con procedencia P2P/suscripción; build y pruebas de backend aprobados en CI.
- Puertos observados: 5432 `sentinel-postgres`, 5435 `impacta-db`; ambos persistentes. No usar como scratch.
- Despliegue realizado desde `main` (`c32ecdb`): API `10.88.0.1:3102`; PostgreSQL `127.0.0.1:5435`; Redis `127.0.0.1:6381`. Datos y caché conservaron sus volúmenes existentes.
- Frontend publicado en Kingu como release `release-c32ecdbccdaf-20261106T034033Z`; se puede revertir con `./deploy.sh frontend-rollback <release-anterior>`.
- `./deploy.sh verify`: API privada, web pública y proxy API respondieron `200`; PostgreSQL/Redis saludables. `prisma migrate status` dio esquema actualizado; no se aplicó DDL en producción.
- Variables privadas faltantes incorporadas a `.env` en Fenix con permisos `0600`; valores no registrados en Git, salida ni handoff.
- Jaime confirmó la desactivación de Kilo en su panel. No existe integración local en workflows del repositorio.
- Aviso de build: chunk `LandingPage` de 913.38 kB sin comprimir; build correcto. CI del PR `42152556855` aprobó backend, frontend y landing.
- Graphify: intento incremental fallido con 47/112 fuentes omitidas; el guard conservó `graphify-out/graph.json` raíz. La copia previa de la carpeta fechada quedó preservada en `graphify-out/2026-11-06-before-update/`. Caché parcial queda local y sin seguimiento; no aceptar salida parcial.
