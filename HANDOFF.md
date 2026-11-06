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
- Refactor desplegado el 2026-11-06 desde `main` (`c32ecdb`); evidencia y puertos finales en la sección de despliegue.
- Graphify conserva el grafo completo previo (2436 nodos, 3723 aristas, 183 comunidades). El intento incremental de hoy omitió 47/112 fuentes y el guard de reducción impidió sobrescribir el grafo raíz; no usar `--allow-partial`. Detalle para reanudar abajo.
- CI del PR `42152556855` y CI de cierre `42159609305`: backend, frontend y landing aprobados; backend completó migraciones, lint, build, unitarias y e2e. El cierre mostró solo avisos no bloqueantes de Node.js 20 en acciones, transición de `ubuntu-latest` y fuentes Next. Jaime confirmó que desactivó Kilo en su panel; no configurar ni reactivar. `main` no tiene protección de rama configurada.
- `PLAN.md` y `ARQUITECTURA_TECNICA.md` contienen contexto desfasado. Contrastar siempre con `AGENTS.md`, los commits actuales y las specs.

## Trabajo abierto y prioridad

1. Continuar pagos P2P: frontend público/QR, autoservicio de suscripciones y después Webpay/Flow con contrato y credenciales de prueba.
2. Cerrar gobierno, privacidad, responsables y revisión legal antes de mensajería, denuncias, periodismo y asistentes.
3. Completar RAG: embeddings propios, historial editorial y corpus con fuentes verificadas.
4. Avanzar catálogo científico y educación tras confirmar especies, fuentes y responsables.
5. Dejar membresías, voluntariado, eventos, jornadas, subvenciones y board detrás de las dependencias de producto y gobierno.

Detalle vivo: [PENDIENTES.md](PENDIENTES.md). Estado persistente: `Impacta/PENDIENTES` en la bóveda y fila Impacta+ de `HANDOFF.md`.

## Punto de reanudación

- Mañana: auditar el commit documental y el despliegue del 2026-11-06 con las evidencias de abajo; `main` debe seguir sincronizado con `origin/main`. `.graphify_python` y `graphify-out/cache/semantic/` siguen en disco e ignorados por `.gitignore`; no versionar la extracción parcial.
- Producción quedó con puertos restringidos y checks HTTP 200; no repetir despliegue ni aplicar migraciones sin cambios nuevos.
- Sincronización Graphify pendiente: `graphify . --update --no-viz` omitió 47 de 112 fuentes semánticas y rechazó el grafo menor. `graphify-out/graph.json` raíz permanece intacto. La copia anterior de `graphify-out/2026-11-06/` se preservó en `graphify-out/2026-11-06-before-update/`; no sobrescribir ni borrar. No pasar `--allow-partial`; reintentar mañana con chunks menores y solo después de auditar el diff.
- El siguiente trabajo de producto está en `PENDIENTES.md`, P1 (UI pública/QR y autoservicio de suscripciones P2P).
- Revisión P2P: el callback ya incrementa página y campaña en una transacción `Serializable`, es idempotente para una donación ya exitosa, y cierre/cancelación conserva historial. Casos unitarios existen; no se ejecutaron.
- Recibo seguro: añadido `ReceiptsController` y búsqueda por `captureId`, `organizationId` y miembro autenticado; PDF con origen P2P/suscripción y referencia. Compilado y validado por CI, incluidas las pruebas backend.
- Mantener los cambios locales de `graphify-out/`; nunca limpiar o restaurar ese directorio para resolver el estado sin seguimiento.

## Refactorización de despliegue — 2026-11-06

- Despliegue desde `main` (`c32ecdb`) en `fenix` y `kingu`. API `impacta-backend`: solo `10.88.0.1:3102` (WireGuard). PostgreSQL: `127.0.0.1:5435`; Redis: `127.0.0.1:6381`.
- PostgreSQL y Redis se recrearon por separado, manteniendo `ong_impacta_postgres_data` y `ong_impacta_redis_data`; ambos quedaron `healthy`. No se borraron volúmenes ni datos.
- Frontend Vite publicado bajo el dominio único con release reversible `release-c32ecdbccdaf-20261106T034033Z`. El build completó; aviso no bloqueante: `LandingPage` 913.38 kB sin comprimir.
- Verificación final: `./deploy.sh verify` pasó para API privada, frontend HTTPS y proxy API; endpoints devolvieron `200`. `prisma migrate status` confirmó esquema al día; no se aplicó ninguna migración en producción.
- `.env` privado de Fenix completado con credenciales extraídas de la configuración del contenedor vigente y validadas mediante conexión local a Postgres; se dejó en modo `0600`. No se copiaron secretos al frontend, Git ni esta nota.
- CI `42152556855` ejecutó la cadena de migraciones en PostgreSQL efímero y aprobó pruebas/builds. No se ejecutaron pruebas locales durante este cierre.
- El build Graphify incompleto dejó caché semántica local sin seguimiento bajo `graphify-out/cache/semantic/`; se conserva para auditoría y no se incluyó en el commit. `.graphify_python` es un auxiliar local no versionado.
