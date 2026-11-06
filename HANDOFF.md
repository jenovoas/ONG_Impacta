---
titulo: Handoff vigente de Impacta+
updated: 2026-11-06
tags: [impacta, handoff]
---

# Handoff vigente de Impacta+

## Estado de entrada

- Repo en `main`, `HEAD` y `origin/main` coinciden en `c1a816e` (2026-10-29).
- Cambios locales de esta sesión en `AGENTS.md`, `PENDIENTES.md`, `HANDOFF.md`, `backend/src/modules/donations/` y `openspec/changes/campanas-p2p-recaudacion/tasks.md`.
- `graphify-out/` se actualizó localmente y sigue sin seguimiento; conservarlo.
- No se verificó el estado de producción ni se hizo despliegue en esta sesión.
- Graphify actualizado el 2026-11-06; `graphify-out/GRAPH_REPORT.md` corresponde a `c1a816e` y contiene 2402 nodos, 3663 aristas y 190 comunidades. Diagnóstico: 0 nodos sin verificar, 0 aristas con extremos ausentes/huérfanos, 0 bucles; una pareja de extremos tiene dos relaciones distintas y se conserva como una arista en el grafo simple. 11 archivos SQL no aportan nodos por falta de `tree_sitter_sql`.
- `PLAN.md` y `ARQUITECTURA_TECNICA.md` contienen contexto desfasado. Contrastar siempre con `AGENTS.md`, los commits actuales y las specs.

## Trabajo abierto y prioridad

1. Preparar una base PostgreSQL scratch aislada y ejecutar el canario de migraciones, empezando por `backend/prisma/migrations/20260825170000_add_impacta_knowledge_rag/migration.sql`. **Bloqueado:** los puertos 5432 y 5435 están ocupados por `sentinel-postgres` e `impacta-db`; son bases persistentes y no deben usarse para la prueba. No iniciar ni cambiar servicios sin autorización.
2. Completar pagos P2P: API `GET /receipts/:captureId` quedó en preparación local con ownership por tenant/miembro y procedencia en PDF; faltan compilación/pruebas, frontend público/QR, autoservicio de suscripciones y luego Webpay/Flow.
3. Cerrar las decisiones de gobierno, privacidad, responsables y revisión legal que son prerrequisito de mensajería, denuncias, periodismo y asistentes.
4. Completar la capacidad RAG: embeddings semánticos propios, historial editorial y corpus con fuentes verificadas.
5. Avanzar catálogo científico y educación tras confirmar especies, fuentes y responsables.
6. Dejar membresías, voluntariado, eventos, jornadas, subvenciones y board detrás de las dependencias de producto y gobierno.

Detalle vivo: [PENDIENTES.md](PENDIENTES.md). Estado persistente: `Impacta/PENDIENTES` en la bóveda y fila Impacta+ de `HANDOFF.md`.

## Punto de reanudación

- Para continuar el canario: provisionar una instancia scratch temporal/aislada, verificar su identidad y URL, y aplicar migraciones únicamente a esa base. No reutilizar el puerto 5432 ni el 5435 actuales.
- Para el análisis previo: revisar en conjunto el SQL de la migración RAG y toda la cadena de migraciones. En esta sesión la revisión estática inicial encontró creación de `KnowledgeDocument`/`KnowledgeChunk`, índices y claves foráneas; no se ejecutó DDL.
- Revisión P2P: el callback ya incrementa página y campaña en una transacción `Serializable`, es idempotente para una donación ya exitosa, y cierre/cancelación conserva historial. Casos unitarios existen; no se ejecutaron.
- Inicio del recibo seguro: añadido `ReceiptsController` y búsqueda por `captureId`, `organizationId` y miembro autenticado; el PDF incluye origen P2P/suscripción y referencia. No compilado ni probado.
- Mantener los cambios locales de `graphify-out/`; nunca limpiar o restaurar ese directorio para resolver el estado sin seguimiento.
- No se ejecutaron pruebas, compilaciones ni comandos de despliegue.
