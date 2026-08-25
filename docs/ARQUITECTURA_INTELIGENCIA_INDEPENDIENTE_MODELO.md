# Impacta+ — Arquitectura de inteligencia independiente del modelo

## Decisión fundamental

La inteligencia de Impacta+ pertenece a la plataforma y a su comunidad, no a un
modelo ni proveedor. Los modelos son motores intercambiables que reciben una
tarea ya autorizada y un contexto mínimo preparado por Impacta+.

Esto permite comenzar con una API, migrar a Qwen local y adoptar futuros modelos
sin reconstruir la experiencia, perder memoria institucional ni cambiar las
reglas de seguridad.

## Qué compone la inteligencia de Impacta+

- Modelo de identidad, roles y permisos.
- Catálogos científicos, fuentes y procedencia.
- Perfiles de capacidades y red regional consentida.
- Oportunidades, proyectos, misiones, indicadores y memoria institucional.
- Políticas de privacidad, seguridad y autoridad humana.
- Recuperación RAG e índices propios.
- Herramientas del dominio y sus confirmaciones.
- Prompts versionados por contexto.
- Evaluaciones, feedback revisado y datasets gobernados.
- Orquestación, trazabilidad y métricas.
- Defensa cognitiva y sanitización de privacidad independientes del proveedor.

Ninguno de estos componentes debe quedar encerrado en el formato propietario de
un proveedor.

## Arquitectura

```text
Web Impacta+
     ↓ contrato estable /api/assistant
Assistant Orchestrator
├── Identity & Policy Engine
├── Context Builder / RAG
├── Tool Gateway
├── Prompt Registry
├── Memory & Consent
├── Evaluation & Observability
└── Model Gateway
    ├── Adapter API inicial
    ├── Adapter Qwen local
    └── Adaptadores futuros
```

El `Model Gateway` traduce entre un contrato canónico de Impacta+ y el formato
de cada motor. El resto del sistema no importa SDKs ni tipos específicos del
proveedor.

Todo tráfico hacia o desde el gateway pasa por la defensa descrita en
`docs/REUTILIZACION_DEFENSA_COGNITIVA_SENTINEL.md`: ingreso, privacidad, política
de datos, herramientas y salida. Estas capas son obligatorias tanto para API
como para Qwen local.

## Contratos canónicos

### Solicitud

- Contexto de asistencia: recepción, educación, profesional, edición, etc.
- Identidad técnica y permisos ya calculados.
- Mensajes minimizados.
- Documentos recuperados con procedencia.
- Herramientas permitidas con esquemas propios.
- Requisitos de salida, idioma, latencia y privacidad.

### Respuesta

- Texto o estructura validada.
- Citas a identificadores internos de fuentes.
- Solicitudes de herramienta en formato canónico.
- Incertidumbre y motivo de abstención.
- Identificador de proveedor, modelo y versión.
- Tokens, latencia y resultado de validaciones.

El contenido del razonamiento interno de un proveedor no será un contrato de
producto ni requisito para operar.

## Registro de modelos y capacidades

La selección no se hará por nombres escritos en el código. Un registro declarará:

- Proveedor, modelo, versión y tipo de despliegue.
- Texto, visión, audio, embeddings, streaming y salida estructurada.
- Uso de herramientas y límites de contexto.
- Regiones de procesamiento y política de retención.
- Clases de datos permitidas.
- Latencia, costo y capacidad disponible.
- Resultados por suite de evaluación.
- Estado: `CANDIDATE`, `SHADOW`, `ACTIVE`, `FALLBACK`, `RETIRED`.

El router elige un motor por capacidad, privacidad y evaluación. Nunca reduce
los permisos del backend ni agrega herramientas por capacidad del modelo.

## Portabilidad de conocimiento y entrenamiento

- Fuentes y fragmentos RAG usan identificadores internos, no IDs del proveedor.
- Prompts se guardan en plantillas versionadas y testeables.
- Datasets se conservan en formatos abiertos con procedencia, licencia y splits.
- Ejemplos de herramientas usan el esquema canónico de Impacta+.
- Un adaptador LoRA registra modelo base, versión, dataset, parámetros y licencia.
- Feedback de usuarios no se transforma automáticamente en verdad ni entrenamiento.

Si un nuevo modelo necesita otra plantilla de conversación, el adaptador la
traduce sin modificar los casos de uso ni los datos originales.

## Router y continuidad

El router puede aplicar:

- **Ruta pública:** modelo API o local aprobado para contenido público.
- **Ruta privada:** solo motores aprobados para esa clase de datos.
- **Ruta sensible:** sin IA externa; canal convencional o modelo local autorizado.
- **Fallback:** otro motor que haya pasado los mismos requisitos mínimos.
- **Modo degradado:** búsqueda, formularios y derivación humana si ningún modelo
  seguro está disponible.

No se enviará la misma solicitud a múltiples proveedores para comparar sin
consentimiento y política de datos. El modo `SHADOW` usará casos sintéticos,
públicos o previamente autorizados.

## Evaluación como puerta de entrada

Un modelo nuevo no se activa por popularidad ni por una demostración llamativa.
Debe ejecutar suites versionadas para:

- Recepción y derivación.
- Exactitud científica y citas.
- Trabajo profesional y editorial.
- Matching de fondos y colaboradores.
- Aislamiento multi-tenant y privacidad.
- Resistencia a prompt injection.
- Uso de herramientas y respeto de confirmaciones.
- Español chileno, accesibilidad, latencia y costo.

Los umbrales se definen por contexto. Un modelo puede ser excelente para visión
de terreno y quedar rechazado para herramientas operativas.

## Protocolo de cambio de modelo

1. Registrar el candidato y sus políticas de datos.
2. Implementar o actualizar solo su adaptador.
3. Ejecutar evaluaciones offline con casos retenidos.
4. Revisar fallos científicos, de seguridad y permisos.
5. Probar en `SHADOW` solo con datos autorizados.
6. Habilitar un porcentaje pequeño y reversible.
7. Comparar calidad, latencia, costo y reportes humanos.
8. Promover a `ACTIVE` o volver al modelo anterior.

Toda respuesta conserva qué versión de modelo, prompt, fuentes y herramientas
la produjo, de modo que un cambio pueda auditarse y reproducirse.

## Anti-patrones prohibidos

- Llamar al proveedor directamente desde React.
- Guardar claves o IDs de proveedor en entidades de negocio.
- Diseñar funciones que solo existan en el SDK de un modelo.
- Usar memoria o vector stores propietarios como única copia del conocimiento.
- Mezclar autorización con instrucciones del prompt.
- Registrar prompts o respuestas crudas como telemetría.
- Tratar una allowlist de palabras como bypass del pipeline completo.
- Cambiar de modelo sin ejecutar regresiones.
- Entrenar desde logs crudos de producción.
- Tratar la salida de un modelo como dato publicado o validado.

## Criterios de aceptación

- Cambiar API por Qwen local no modifica frontend ni contratos de dominio.
- Cada modelo declara capacidades, privacidad y evaluaciones.
- Impacta+ conserva prompts, índices, herramientas, memoria y datasets.
- Existe fallback y modo degradado sin IA.
- Todo modelo activo supera umbrales específicos por contexto.
- Es posible reconstruir qué produjo una respuesta sin registrar secretos.
