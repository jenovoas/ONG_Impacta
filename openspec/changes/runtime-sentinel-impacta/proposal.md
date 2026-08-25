# Proposal: Runtime de Impacta+ sobre Sentinel

## Why

Impacta+ manejará identidad, conversaciones cifradas, inteligencia regional,
datos científicos y asistencia mediante modelos. Estas capacidades requieren
una base de host protegida y observable. `fenix` ya ejecuta Sentinel y es el
nodo de referencia; esta condición debe convertirse en una regla reproducible,
no en una particularidad informal del servidor actual.

## What Changes

- Se exige un nodo administrado por Sentinel para toda producción de Impacta+.
- Se registra conformidad, capacidades y estado del nodo.
- Se crea un adaptador local de solo lectura entre Impacta+ y Cortex.
- Se define telemetría sanitizada sin prompts, conversaciones ni PII.
- Se establecen degradaciones ante fallas de Cortex o inferencia.
- El futuro Qwen local se ejecuta aislado y observado por Sentinel.

## Capabilities

### New Capabilities

- `runtime-sentinel`: conformidad del host, integración segura con Cortex,
  telemetría minimizada y operación degradada.

## Non-goals

- No fusionar Impacta+ y Sentinel en un repositorio o servicio.
- No permitir que el deploy de Impacta+ modifique Sentinel implícitamente.
- No entregar contenido privado a Cortex para producir métricas.
- No sustituir permisos tenant por señales del host.
- No cambiar dominio, nginx, systemd o eBPF en esta propuesta documental.

## Impact

- **Backend:** `SentinelHostAdapter`, esquema de eventos y política de degradación.
- **Infra futura:** perfil versionado de nodo y verificaciones pre/post deploy.
- **IA:** API inicial y Qwen local pasan por las mismas defensas de aplicación.
- **Seguridad:** Sentinel protege el host; Impacta+ protege contenido, permisos y
  decisiones del dominio.

