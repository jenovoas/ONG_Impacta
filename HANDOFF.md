---
titulo: Handoff vigente de Impacta+
updated: 2026-11-06
tags: [impacta, handoff]
---

# Handoff vigente de Impacta+

## Estado de entrada

- Commit `c88e83b` (recibos/handoff/grafo) publicado; integrado con el commit remoto `6faaede` en `ccdef74` y empujado a `origin/main`.
- Refactorización de despliegue publicada en `feat/deploy-separado-multitenant`, commit `cb9a455`; todavía no desplegada.
- Artefactos principales Graphify ya versionados; el estado/caché local previo está preservado en un stash.
- Se verificó producción en solo lectura; no se desplegó ni se modificaron servicios.
- Graphify actualizado sobre `cb9a455`: `graphify-out/GRAPH_REPORT.md` tiene 2423 nodos, 3702 aristas y 188 comunidades. Diagnóstico: sin nodos no verificados, extremos huérfanos ni bucles. 11 SQL no aportan nodos por falta de `tree_sitter_sql`.
- `PLAN.md` y `ARQUITECTURA_TECNICA.md` contienen contexto desfasado. Contrastar siempre con `AGENTS.md`, los commits actuales y las specs.

## Trabajo abierto y prioridad

1. Aplicar el aislamiento de red versionado: API solo por WireGuard y PostgreSQL/Redis solo por loopback. El 2026-11-06 se observó Docker publicando `3102`, `5435` y `6381` en `0.0.0.0`; modificar DB/Redis requiere recreación planificada y autorización explícita.
2. Preparar una base PostgreSQL scratch aislada y ejecutar el canario de migraciones. **Bloqueado:** `5432` y `5435` pertenecen a bases persistentes; no reutilizarlas ni iniciar otro servicio sin autorización.
3. Completar pagos P2P: recibo seguro en preparación local, sin compilar ni probar; faltan frontend público/QR, autoservicio de suscripciones y luego Webpay/Flow.
4. Cerrar las decisiones de gobierno, privacidad, responsables y revisión legal que son prerrequisito de mensajería, denuncias, periodismo y asistentes.
5. Completar la capacidad RAG: embeddings semánticos propios, historial editorial y corpus con fuentes verificadas.
6. Avanzar catálogo científico y educación tras confirmar especies, fuentes y responsables.
7. Dejar membresías, voluntariado, eventos, jornadas, subvenciones y board detrás de las dependencias de producto y gobierno.

Detalle vivo: [PENDIENTES.md](PENDIENTES.md). Estado persistente: `Impacta/PENDIENTES` en la bóveda y fila Impacta+ de `HANDOFF.md`.

## Punto de reanudación

- Para continuar el canario: provisionar una instancia scratch temporal/aislada, verificar su identidad y URL, y aplicar migraciones únicamente a esa base. No reutilizar el puerto 5432 ni el 5435 actuales.
- Para el análisis previo: revisar en conjunto el SQL de la migración RAG y toda la cadena de migraciones. En esta sesión la revisión estática inicial encontró creación de `KnowledgeDocument`/`KnowledgeChunk`, índices y claves foráneas; no se ejecutó DDL.
- Revisión P2P: el callback ya incrementa página y campaña en una transacción `Serializable`, es idempotente para una donación ya exitosa, y cierre/cancelación conserva historial. Casos unitarios existen; no se ejecutaron.
- Inicio del recibo seguro: añadido `ReceiptsController` y búsqueda por `captureId`, `organizationId` y miembro autenticado; el PDF incluye origen P2P/suscripción y referencia. No compilado ni probado.
- Mantener los cambios locales de `graphify-out/`; nunca limpiar o restaurar ese directorio para resolver el estado sin seguimiento.
- No se ejecutaron pruebas, compilaciones ni comandos de despliegue.

## Refactorización de despliegue — 2026-11-06

- Evidencia de solo lectura: host local `fenix`; contenedores `impacta-backend` en `0.0.0.0:3102`, `impacta-db` en `0.0.0.0:5435` y `impacta-redis` en `0.0.0.0:6381`. Kingu sirve el frontend y su Nginx enruta el mismo dominio a `10.88.0.1:3102` por WireGuard.
- Cambios locales: releases atómicos del frontend en Kingu con reversión; actualización de solo API en Fenix; migración Prisma separada y única para el esquema compartido; verificación pública/privada sin escrituras de tenants; bindings de API a WireGuard y de DB/Redis a loopback.
- `docker-compose.yml` ya no contiene la contraseña de ejemplo; el deploy requiere `POSTGRES_PASSWORD` y `DATABASE_URL_DOCKER`. La inspección de nombres de variables del `.env` confirmó que esas claves aún faltan. Configurarlas exige que coincidan con el rol de la base persistida; no se leyó ni registró ningún secreto.
- La configuración no se aplicó en producción. Para cambiar los binds de DB/Redis hay que recrear esos contenedores en una ventana autorizada.
- No se ejecutaron pruebas, compilaciones ni despliegues.
