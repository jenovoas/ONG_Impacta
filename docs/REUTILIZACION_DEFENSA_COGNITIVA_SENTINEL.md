# Impacta+ — Reutilización de la defensa cognitiva de Sentinel

## Objetivo

Adoptar los aprendizajes del sanitizador de Sentinel para proteger el cerebro
API/local de Impacta+, sin copiar supuestos de telemetría de infraestructura a
un dominio comunitario, científico y social.

La revisión fue de solo lectura. No se modificó Sentinel.

## Implementación revisada

- `sentinel-cortex/src/security/telemetry_sanitizer.rs`
- `sentinel-cortex/src/security/lfm_security_pipeline.rs`
- `me-60os-core/src/soma_orchestrator.rs`
- `me-60os-core/src/scv.rs`
- `truthsync-core/src/lib.rs`
- `backend/app/security/telemetry_sanitizer.py`
- `backend/app/routers/ai.py`
- `backend/tests/test_telemetry_sanitizer.py`

El código conserva atribución de Jaime Novoa Sepúlveda y una cláusula no
comercial. La reutilización directa debe mantener los avisos y confirmar la
compatibilidad de licencia. Para Impacta+ se recomienda portar el patrón y el
corpus de pruebas a una implementación propia en TypeScript, dejando explícita
la inspiración y autoría.

## Lo reutilizable

### Frontera previa al modelo

Sentinel sanitiza datos antes de concatenarlos al contexto. Impacta+ aplicará la
misma regla a preguntas, RAG, OCR, papers, páginas externas, telemetría,
resultados de herramientas y archivos. Ningún texto se vuelve confiable por
estar almacenado en PostgreSQL o en un índice vectorial.

### Pipeline bidireccional

```text
Fuente no confiable
  ↓ validación estructural
  ↓ defensa cognitiva
  ↓ sanitización de privacidad
  ↓ política de datos y permisos
  ↓ construcción de contexto
  ↓ modelo API/local
  ↓ esquema, citas, privacidad y herramientas
Respuesta o borrador seguro
```

### Decisión explícita y fail closed

El patrón `is_safe` y sus motivos evolucionará a un resultado que no conserve
innecesariamente el original:

- `decision`: `ALLOW`, `REDACT`, `QUARANTINE`, `BLOCK`.
- `ruleIds`: identificadores sin fragmentos sensibles.
- `dataClass`: `PUBLIC`, `TENANT_PRIVATE`, `SENSITIVE_LOCAL_ONLY`,
  `PROHIBITED_AI`.
- `safeContent`: opcional y minimizado.
- `contentDigest`: HMAC para correlación, no contenido.
- `policyVersion` y `evaluatedAt`.

### Corpus adversarial

Los casos de SQL, shell, traversal, ejecución, longitud y entradas vacías de
Sentinel son una buena base. Impacta+ añadirá:

- Instrucciones ocultas en PDF, OCR y páginas web.
- Intentos de ignorar permisos o revelar otro tenant.
- Exfiltración mediante herramientas, URL o Markdown.
- RUT, correo, teléfono, domicilio y credenciales.
- Coordenadas de especies sensibles.
- Alias, recibos y contenido de denuncias.
- Fórmulas de spreadsheet, HTML y adjuntos activos.
- Unicode, texto fragmentado, codificación y ataques multilingües.

## Lo que debe adaptarse

### Las palabras no son la única defensa

Los patrones rápidos son útiles, pero pueden producir falsos positivos y ser
evadidos mediante paráfrasis, Unicode o fragmentación. La allowlist actual de
Sentinel se evalúa antes que todos los patrones de peligro; en Impacta+ una
excepción solo reduce una señal concreta y nunca omite las demás capas.

### No conservar ni registrar el original

Los esquemas actuales conservan `original_prompt`/`original`, y el router Python
registra fragmentos del prompt. Impacta+ no replicará esto: podría exponer PII o
datos tenant. Los logs tendrán IDs de regla, clase, digest, tamaño, latencia y
decisión, nunca prompts o respuestas crudas.

### Reglas propias del dominio Sentinel

`ScvEngine` filtra palabras como `Error`, `Failure`, `Corruption`, `Panic` y
`Attack`. Esas señales bloquearían contenido legítimo de soporte, investigación
o denuncias en Impacta+.

El score de `TruthSyncEngine` combina patrones y un digest ligado a telemetría
propia de Sentinel. No se usará como verificador de verdad científica en
Impacta+: la ciencia se valida contra fuentes, citas y revisión profesional.

### Sin bypass general en producción

Sentinel permite `enabled=false`. Impacta+ no tendrá un bypass global en
producción. Las excepciones serán políticas versionadas, acotadas por regla y
fuente, y auditadas.

## Componentes propuestos

### `ContentIngressGuard`

Valida tamaño, formato, codificación y esquema; aplica patrones rápidos, detecta
prompt injection y pone documentos sospechosos en cuarentena.

### `PrivacySanitizer`

Protege secretos, tokens, cookies, RUT, correos, teléfonos, domicilios,
identificadores y coordenadas. Aplica reglas diferentes para proveedor API,
telemetría, dataset e interfaz.

### `DataPolicyEngine`

Decide si un dato puede procesarse en API externa, Qwen local, flujo sin IA o
ningún sistema automático. Las denuncias son `PROHIBITED_AI` por defecto.

### `SafeContextBuilder`

Separa instrucciones y datos no confiables; etiqueta fuente, tenant, licencia y
procedencia; evita mezclar organizaciones y trata RAG como evidencia, no órdenes.

### `ToolPolicyGateway`

Expone solo herramientas autorizadas por backend. Valida parámetros fuera del
modelo y limita escritura a borradores confirmados. Aprobar, firmar, publicar y
enviar no existen como herramientas de IA.

### `OutputGuard`

Valida esquemas, existencia de citas, DLP, aislamiento tenant y llamadas de
herramientas antes de entregar la respuesta.

### `SafeTelemetryEmitter`

Emite solo IDs opacos, digests HMAC, contadores, categorías y buckets. Separa
telemetría operativa, auditoría de seguridad y datasets de evaluación. Un
dataset requiere consentimiento y revisión; nunca nace de logs crudos.

## Estrategia

La primera versión será un módulo NestJS/TypeScript para evitar otro servicio.
Si volumen o latencia lo justifican, el núcleo Rust de Sentinel podrá evaluarse
como librería o sidecar, con autorización de licencia y contrato estable.

## Criterios de aceptación

- Todo contexto pasa por ingreso, privacidad y política antes del modelo.
- La defensa se aplica tanto a API externa como a Qwen local.
- Ningún log contiene prompts, respuestas, RUT, secretos o coordenadas exactas.
- Las excepciones no saltan el pipeline completo.
- RAG y resultados de herramientas se consideran no confiables.
- La salida se valida antes de responder o guardar un borrador.
- El corpus Sentinel se amplía con privacidad, tenant y ciencia.

