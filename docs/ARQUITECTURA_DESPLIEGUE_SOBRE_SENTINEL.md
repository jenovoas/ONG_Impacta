# Impacta+ — Arquitectura de despliegue sobre Sentinel

## Regla de plataforma

Toda instancia productiva de Impacta+ debe ejecutarse sobre un servidor
administrado por Sentinel. `fenix` es el nodo de referencia actual.

Esto no significa fusionar los repositorios ni conceder a Impacta+ control de
Sentinel. Sentinel protege y observa el host; Impacta+ mantiene autenticación,
aislamiento multi-tenant, privacidad, flujos humanos y políticas del asistente.

## Estado verificado de `fenix` — 2026-08-25

La inspección de systemd confirmó activos:

- `sentinel-bpf-setup.service`
- `sentinel-cortex.service`
- `sentinel-verifier.service`
- `sentinel-adm-agent.service`
- `sentinel-gamma-watchdog.service`
- `sentinel-hex-daemon.service`
- `sentinel-pai-neural.service`
- `sentinel-qhc-agent.service`
- `sentinel-vid-agent.service`
- `impacta-backend.service`

`sentinel-cortex.service` corre como servicio del host y usa Redis local. El
backend de Impacta+ corre como `jnovoas` desde su propio directorio y archivo de
entorno. Esta separación se conserva.

## Fronteras de responsabilidad

| Capa | Responsabilidad |
|---|---|
| Sentinel host | Integridad y telemetría del nodo, eBPF, procesos, Cortex y verificación operativa |
| Nginx | TLS, rutas, límites y exposición del dominio único |
| Impacta+ backend | Identidad, permisos, tenant, datos, herramientas y auditoría de negocio |
| Defensa IA de Impacta+ | PII, secretos, RAG, prompt injection, salida y telemetría segura |
| Modelo API/local | Inferencia sin autoridad propia |
| Personas responsables | Validación, publicación, firma, postulación y decisiones sensibles |

Sentinel no sustituye `organizationId`, `RoleAssignment`, consentimiento ni
revisión científica. Impacta+ no sustituye la protección del host.

## Integración prevista

### Adaptador Sentinel local

El backend usará un `SentinelHostAdapter` de solo lectura para:

- Consultar salud de Cortex por loopback.
- Conocer versión de política y estado del nodo.
- Emitir eventos de seguridad ya sanitizados.
- Activar degradación segura cuando la protección requerida no esté disponible.

El frontend nunca llamará directamente a Cortex ni verá puertos internos.

### Esquema mínimo de evento

`ImpactaSecurityEvent` no transportará prompts, respuestas, documentos ni datos
personales:

- `eventId`, `occurredAt`, `service`, `environment`.
- `category`, `severity`, `decision`, `ruleIds`.
- `routeTemplate`, nunca URL con parámetros sensibles.
- `tenantRef` y `actorRef` pseudonimizados con HMAC y claves separadas.
- `modelProfile`, `providerClass` y `policyVersion`.
- Buckets de latencia, tokens y tamaño, no valores de contenido.
- `correlationId` opaco con retención limitada.

Sentinel puede detectar anomalías operativas sin recibir el contenido que debe
proteger.

### Eventos desde Sentinel hacia Impacta+

Las señales del host son datos no confiables hasta pasar por esquema y defensa
cognitiva. Podrán alimentar alertas o un panel operativo, pero nunca convertirse
directamente en instrucciones para Qwen o ejecutar acciones de negocio.

## Perfil de conformidad del nodo

Cada nodo se registrará como `SentinelManagedNode` con:

- Identificador y entorno.
- Versiones de Cortex y políticas.
- Estado requerido de servicios.
- Última verificación satisfactoria.
- Capacidades disponibles: eBPF, telemetría, sanitización, modelo local.
- Estado `COMPLIANT`, `DEGRADED`, `NON_COMPLIANT` o `MAINTENANCE`.

La lista exacta de servicios se versionará como un perfil y no quedará dispersa
en scripts de despliegue.

## Degradación segura

| Falla | Respuesta de Impacta+ |
|---|---|
| Cortex temporalmente no disponible | Mantener funciones básicas, alertar y desactivar herramientas IA privilegiadas |
| Protección requerida del nodo ausente | Marcar `NON_COMPLIANT`; no iniciar modelo local ni procesamiento sensible |
| Proveedor IA externo caído | Usar fallback aprobado o búsqueda/derivación humana |
| Qwen local caído | Volver a API solo para clases de datos autorizadas |
| Canal de telemetría caído | No almacenar eventos crudos para reenviarlos después |

Una falla de observabilidad no debe causar una fuga de privacidad. Tampoco se
debe apagar automáticamente la landing, autenticación o acceso a información
pública por un fallo aislado de IA.

## Qwen local sobre Sentinel

El futuro runtime de Qwen:

- Se ejecutará con usuario dedicado sin privilegios.
- Escuchará únicamente en loopback o red privada del nodo.
- Será accesible solo mediante el backend y `AiProvider`.
- No montará `.env`, PostgreSQL, adjuntos ni claves de Impacta+ directamente.
- Tendrá límites de CPU, memoria, GPU, reinicio y archivos abiertos.
- Será observado por Sentinel sin exportar prompts o respuestas.
- No tendrá salida de red por defecto; cualquier conector será explícito.

La GPU puede residir en otro nodo Sentinel. Para la experiencia pública todo
sigue entrando por `https://impacta.pinguinoseguro.cl/api/assistant`.

## Despliegue y verificación futura

Sin modificar todavía la infraestructura, el flujo objetivo será:

1. Validar perfil Sentinel del nodo.
2. Ejecutar migraciones y builds de Impacta+.
3. Desplegar backend/frontend con los comandos actuales.
4. Verificar aplicación y aislamiento tenant.
5. Verificar `SentinelHostAdapter`, sanitización y modo degradado.
6. Habilitar el proveedor IA correspondiente por configuración.
7. Ejecutar canarios de privacidad, herramientas y telemetría.

Los cambios a systemd, eBPF, nginx, usuarios, puertos o servicios requieren
confirmación explícita antes de aplicarse. Los despliegues de Impacta+ no deben
actualizar, reiniciar ni reconfigurar Sentinel implícitamente.

## Criterios de aceptación

- Producción se ejecuta únicamente en nodos conformes administrados por Sentinel.
- Sentinel e Impacta+ conservan usuarios, servicios y responsabilidades separados.
- Ningún evento de host o aplicación entra directamente al modelo.
- Sentinel no recibe contenido privado para obtener métricas operativas.
- Un fallo de IA o Cortex activa degradación definida, no bypass de seguridad.
- Cambiar el nodo de inferencia no cambia el dominio público.
- El deploy de Impacta+ nunca muta Sentinel sin una operación explícita y aprobada.

