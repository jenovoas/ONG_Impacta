# Design: Runtime de Impacta+ sobre Sentinel

## Context

En `fenix`, el 2026-08-25, se verificaron activos Cortex, setup eBPF, Verifier,
agentes Sentinel e `impacta-backend.service`. El backend conserva un servicio y
usuario separados. El objetivo es hacer reproducible esta relación sin acoplar
la lógica tenant ni el deploy de Impacta+ al ciclo de vida de Sentinel.

## Goals / Non-Goals

**Goals:**

- Exigir conformidad Sentinel en producción.
- Integrar salud y eventos mediante contratos mínimos.
- Proteger telemetría y plaintext.
- Definir respuesta segura a fallas parciales.
- Aislar el futuro runtime de Qwen.

**Non-Goals:**

- Administrar Sentinel desde el panel de Impacta+.
- Reiniciar o actualizar servicios Sentinel durante un deploy normal.
- Exponer Cortex o Qwen directamente al navegador.
- Enviar conversaciones o inteligencia a telemetría.

## Decisions

### Responsabilidad separada

Sentinel protege y observa el nodo. Impacta+ decide identidad, tenant, permisos,
consentimiento, ciencia, publicación y herramientas. Una señal Sentinel nunca
amplía permisos ni se convierte directamente en prompt o acción.

### Adaptador local

`SentinelHostAdapter` consultará salud por loopback y emitirá eventos ya
sanitizados. No expondrá un proxy general a Cortex. El frontend solo consume la
API de Impacta+.

### Conformidad

`SentinelManagedNode` conservará perfil, versiones, capacidades, última
verificación y estado `COMPLIANT`, `DEGRADED`, `NON_COMPLIANT` o `MAINTENANCE`.
La política del entorno determina qué servicios son obligatorios.

### Telemetría

`ImpactaSecurityEvent` usa rutas plantillas, rule IDs, referencias HMAC y
buckets. No contiene prompts, respuestas, mensajes, adjuntos, RUT, alias,
denuncias o coordenadas.

### Degradación

La caída de Cortex desactiva herramientas IA privilegiadas y alerta, sin apagar
landing o funciones públicas. Un nodo no conforme no inicia Qwen local ni
procesamiento sensible. Nunca se relajan permisos para mantener disponibilidad.

### Cifrado

Sentinel protege host e intercambios internos. `CrystalCipher` no será protocolo
E2EE de conversaciones mientras no cumpla nonce único por mensaje, identidad,
acuerdo de claves y auditoría. La mensajería se rige por
`docs/ARQUITECTURA_CIFRADO_CONVERSACIONES_INTELIGENCIA.md`.

## Data flow

```text
Impacta+ → SafeTelemetryEmitter → SentinelHostAdapter → Cortex local

Sentinel event → schema + ingress guard → alerta/estado Impacta+
                                      └─ nunca instrucción directa al modelo

Usuario → Impacta+ backend → AiProvider → API o Qwen local aislado
```

## Risks / Trade-offs

- Sentinel añade una dependencia operativa; el modo degradado evita caída total.
- Mayor observabilidad puede aumentar riesgo de privacidad; se emiten solo
  metadatos minimizados.
- Un perfil rígido puede dificultar recuperación; mantenimiento es un estado
  explícito, no un bypass oculto.
- Ejecutar Qwen en otro nodo exige red privada y autenticación mutua sin crear
  subdominios públicos.

