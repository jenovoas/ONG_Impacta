---
titulo: Handoff vigente de Impacta+
updated: 2026-11-06
tags: [impacta, handoff]
---

# Handoff vigente de Impacta+

## Estado de entrada

- Commit `c88e83b` (recibos/handoff/grafo) publicado; integrado con el commit remoto `6faaede` en `ccdef74` y empujado a `origin/main`.
- Refactorización de despliegue fusionada mediante PR [#2](https://github.com/jenovoas/ONG_Impacta/pull/2), commit de `main` `70b55a5` (commit de cabeza `96189bf`); rama local y remota eliminadas.
- Artefactos principales Graphify ya versionados; el estado/caché local previo está preservado en un stash.
- Se verificó producción en solo lectura; no se desplegó ni se modificaron servicios.
- Graphify actualizado: `graphify-out/GRAPH_REPORT.md` tiene 2436 nodos, 3723 aristas y 183 comunidades. Diagnóstico: 0 nodos no verificados, extremos huérfanos, endpoints faltantes ni bucles.
- CI del PR, ejecución `42152556855`: backend, frontend y landing aprobados; backend completó migraciones, pruebas unitarias y e2e. Lint y build de backend/frontend/landing también pasaron localmente. La revisión Kilo seguía en curso al fusionar y no era un requisito de protección; `main` no tiene protección de rama configurada.
- `PLAN.md` y `ARQUITECTURA_TECNICA.md` contienen contexto desfasado. Contrastar siempre con `AGENTS.md`, los commits actuales y las specs.

## Trabajo abierto y prioridad

1. Aplicar el aislamiento de red versionado: API solo por WireGuard y PostgreSQL/Redis solo por loopback. El 2026-11-06 se observó Docker publicando `3102`, `5435` y `6381` en `0.0.0.0`; modificar DB/Redis requiere recreación planificada y autorización explícita.
2. Preparar una base PostgreSQL scratch aislada y ejecutar el canario de migraciones. **Bloqueado:** `5432` y `5435` pertenecen a bases persistentes; no reutilizarlas ni iniciar otro servicio sin autorización.
3. Completar pagos P2P: recibo seguro ya compilado y probado por CI; faltan frontend público/QR, autoservicio de suscripciones y luego Webpay/Flow.
4. Cerrar las decisiones de gobierno, privacidad, responsables y revisión legal que son prerrequisito de mensajería, denuncias, periodismo y asistentes.
5. Completar la capacidad RAG: embeddings semánticos propios, historial editorial y corpus con fuentes verificadas.
6. Avanzar catálogo científico y educación tras confirmar especies, fuentes y responsables.
7. Dejar membresías, voluntariado, eventos, jornadas, subvenciones y board detrás de las dependencias de producto y gobierno.

Detalle vivo: [PENDIENTES.md](PENDIENTES.md). Estado persistente: `Impacta/PENDIENTES` en la bóveda y fila Impacta+ de `HANDOFF.md`.

## Punto de reanudación

- Para continuar el canario: provisionar una instancia scratch temporal/aislada, verificar su identidad y URL, y aplicar migraciones únicamente a esa base. No reutilizar el puerto 5432 ni el 5435 actuales.
- Para el análisis previo: revisar en conjunto el SQL de la migración RAG y toda la cadena de migraciones. En esta sesión la revisión estática inicial encontró creación de `KnowledgeDocument`/`KnowledgeChunk`, índices y claves foráneas; no se ejecutó DDL.
- Revisión P2P: el callback ya incrementa página y campaña en una transacción `Serializable`, es idempotente para una donación ya exitosa, y cierre/cancelación conserva historial. Casos unitarios existen; no se ejecutaron.
- Recibo seguro: añadido `ReceiptsController` y búsqueda por `captureId`, `organizationId` y miembro autenticado; PDF con origen P2P/suscripción y referencia. Compilado y validado por CI, incluidas las pruebas backend.
- Mantener los cambios locales de `graphify-out/`; nunca limpiar o restaurar ese directorio para resolver el estado sin seguimiento.
- No hubo despliegue de producción ni cambios de servicios. Los builds y pruebas se ejecutaron localmente/por CI según lo indicado arriba.

## Refactorización de despliegue — 2026-11-06

- Evidencia de solo lectura: host local `fenix`; contenedores `impacta-backend` en `0.0.0.0:3102`, `impacta-db` en `0.0.0.0:5435` y `impacta-redis` en `0.0.0.0:6381`. Kingu sirve el frontend y su Nginx enruta el mismo dominio a `10.88.0.1:3102` por WireGuard.
- Cambios locales: releases atómicos del frontend en Kingu con reversión; actualización de solo API en Fenix; migración Prisma separada y única para el esquema compartido; verificación pública/privada sin escrituras de tenants; bindings de API a WireGuard y de DB/Redis a loopback.
- `docker-compose.yml` ya no contiene la contraseña de ejemplo; el deploy requiere `POSTGRES_PASSWORD` y `DATABASE_URL_DOCKER`. La inspección de nombres de variables del `.env` confirmó que esas claves aún faltan. Configurarlas exige que coincidan con el rol de la base persistida; no se leyó ni registró ningún secreto.
- La configuración no se aplicó en producción. Para cambiar los binds de DB/Redis hay que recrear esos contenedores en una ventana autorizada.
- CI del PR #2 ejecutó migraciones de la base efímera del runner, pruebas unitarias/e2e y builds; todos los pasos del backend aprobaron. Frontend y landing también aprobaron lint/build. No se ejecutó deploy ni se modificaron servicios de producción.
