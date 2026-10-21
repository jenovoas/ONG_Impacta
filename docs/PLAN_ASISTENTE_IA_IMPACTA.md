# Impacta+ — Plan del asistente de IA

## Decisión inicial

Impacta+ comenzará con **OmniRoute como gateway de IA**. Esto permite validar la
recepción, recuperación, herramientas y experiencia antes de invertir en GPU y
entrenamiento. El candidato para la etapa local definitiva es
**Qwen3.8-27B**, modelo abierto multimodal con licencia Apache 2.0. La elección
se confirmará mediante la misma evaluación usada durante la etapa API.

No se entrenará ni desplegará Qwen local hasta que estén estables el modelo de
permisos, la gobernanza de datos, las fuentes científicas y los flujos
editoriales.

El asistente tendrá dos componentes distintos:

- **RAG:** recupera catálogo, fuentes, estudios y procedimientos vigentes para
  responder con citas.
- **Fine-tuning LoRA/QLoRA:** enseña conducta, tono, formatos y flujos propios de
  Impacta+, no memoriza papers ni datos cambiantes.

La visión operativa completa —oportunidades, colaboración, formulación,
ejecución y rendición— está en
`docs/VISION_CEREBRO_OPERATIVO_RED_REGIONAL.md`.

La independencia tecnológica del modelo, sus adaptadores, evaluación y
protocolo de reemplazo se define en
`docs/ARQUITECTURA_INTELIGENCIA_INDEPENDIENTE_MODELO.md`.

La defensa cognitiva y de privacidad aprovecha el patrón ya implementado en
Sentinel y se adapta en
`docs/REUTILIZACION_DEFENSA_COGNITIVA_SENTINEL.md`.

## Transición de cerebro API a Qwen local

La aplicación utilizará los contratos internos `AiGatewayClient` y `AiProvider`;
el frontend nunca llamará directamente a OmniRoute ni al modelo final.

```text
Frontend
   ↓ /api/assistant
Backend Impacta+ — permisos, RAG, herramientas, auditoría
   ↓ AiGatewayClient
OmniRoute ───→ combinación/modelo aprobado ───→ respuesta canónica
   │
   └── futura ruta Qwen local cuando esté evaluada y autorizada
```

El contrato debe cubrir generación, streaming, salida estructurada, uso de
herramientas, embeddings, salud, límites y metadatos de modelo. Prompts,
documentos recuperados, permisos, sesiones, evaluaciones y feedback pertenecen
a Impacta+ y permanecen desacoplados del proveedor.

Un registro de rutas declarará gateway, combinación/modelo final, capacidades y
clases de datos autorizadas. El router elegirá por tarea, privacidad, calidad,
latencia y costo; nunca por un nombre de modelo codificado en las pantallas o
reglas de negocio.

### Reglas para la etapa API

- Comenzar con recepción y conocimiento público.
- Enviar únicamente el contexto mínimo necesario.
- No enviar denuncias, mensajes privados, secretos ni coordenadas sensibles.
- El uso de documentos tenant requiere aprobación de finalidad, minimización,
  política contractual de retención y exclusión de entrenamiento del proveedor.
- Mantener claves exclusivamente en backend y rotarlas.
- Registrar modelo, latencia, tokens, fuentes y resultado, sin copiar contenido
  sensible al log.
- Sanitizar por separado el ingreso al modelo y la telemetría que sale del
  orquestador.
- No incorporar conversaciones al futuro dataset sin consentimiento y revisión.

### Criterio de migración local

Qwen local reemplaza al proveedor solo si supera umbrales acordados en la misma
batería de recepción, ciencia, permisos, herramientas y seguridad. El cambio se
hará por configuración y despliegue gradual, con rollback a una ruta
OmniRoute autorizada. No
debe requerir cambiar componentes de frontend ni reglas de negocio.

## Por qué Qwen3.8-27B

- Es suficientemente capaz para español, razonamiento, uso de herramientas y
  tareas largas, sujeto a evaluación local.
- Es multimodal: en una etapa futura puede analizar fotografías de terreno y
  documentos.
- Sus pesos y licencia permiten experimentar sin quedar atados a una API única.
- Puede servirse con herramientas compatibles como Transformers, vLLM o SGLang.

El modelo tiene 27 mil millones de parámetros. Como estimación mínima, solo sus
pesos BF16 ocupan cerca de 54 GB; inferencia, caché de contexto y entrenamiento
requieren memoria adicional. La VM web `fenix` tiene actualmente 15 GiB de RAM
y no expone una GPU NVIDIA, por lo que no alojará este modelo. Se usará
inferencia GPU aislada o un servicio administrado, manteniendo la entrada
usuario-facing bajo `/api/assistant` en el dominio único.

## Un modelo, varios asistentes de contexto

Impacta+ no mantendrá una IA distinta para cada profesión. Usará un núcleo local
Qwen con políticas, fuentes, herramientas y memoria de sesión diferentes según
la persona y la pantalla. Así se aprovecha el mismo modelo sin mezclar datos ni
crear versiones incompatibles.

| Contexto | Ayuda permitida | Fuentes y herramientas | Decisión humana reservada |
|---|---|---|---|
| Recepción de visitantes | Orientar, explicar Impacta+, detectar intención, responder preguntas frecuentes y guiar registro o contacto | Solo contenido público, rutas y formularios públicos | Aceptar membresías, verificar identidad o comprometer a la ONG |
| Educación ambiental | Explicar especies, ecosistemas y acciones por nivel educativo | Catálogo publicado y fuentes públicas citables | Declarar una afirmación como validada |
| Voluntariado | Explicar misiones, requisitos, seguridad y ayudar a completar borradores | Misiones visibles para la persona y protocolos autorizados | Asignar responsabilidades críticas o certificar asistencia |
| Profesionales | Buscar y comparar papers, resumir evidencia, estructurar observaciones y señalar contradicciones | Catálogo, biblioteca científica e información autorizada por alcance | Validar ciencia, firmar informes o aprobar una ficha |
| Curadores y editores | Revisar consistencia, citas, lenguaje, accesibilidad, duplicados y preparar versiones educativas | Borradores y fuentes dentro de sus permisos | Aprobar o publicar contenido |
| Periodismo | Buscar antecedentes, construir cronologías, separar afirmaciones de evidencia y preparar preguntas | Fuentes públicas y expedientes asignados solo con Qwen local | Decidir credibilidad, identificar fuentes o publicar |
| Coordinación y soporte | Consultar procedimientos, preparar respuestas y borradores de informes | Manuales y datos tenant autorizados | Ejecutar acciones sensibles o resolver conflictos |
| Donantes y comunidad | Explicar campañas, impacto publicado y formas de participación | Información pública y datos propios autenticados | Emitir certificaciones o modificar transacciones |
| Recursos y proyectos | Detectar convocatorias, explicar compatibilidad, revelar brechas y preparar postulaciones | Fuentes oficiales, perfil tenant y red consentida | Postular, firmar, comprometer recursos o adjudicar |

La IA podrá crear o modificar **borradores** cuando la persona lo confirme. Cada
borrador conservará autor humano solicitante, modelo, versión, fuentes y fecha.
Las transiciones `APPROVED`, `VERIFIED`, `PUBLISHED`, `REFERRED` o equivalentes
no estarán disponibles como herramientas del modelo.

## Recepción inteligente

La recepción será el primer contacto para muchas personas y debe sentirse
humana sin fingir que lo es. El asistente:

- Preguntará qué necesita la persona antes de mostrar módulos.
- Adaptará lenguaje, longitud y nivel técnico.
- Podrá orientar a voluntariado, donaciones, catálogo, actividades, contacto o
  soporte de acceso.
- Mostrará siempre cuándo está respondiendo una IA y cómo contactar a una
  persona.
- No exigirá identificación para responder información pública.
- No diagnosticará intenciones sensibles ni generará perfiles ocultos del
  visitante.
- Derivará emergencias, amenazas, denuncias y asuntos profesionales al canal
  adecuado sin pedir que se narren detalles sensibles en el chat general.

Las conversaciones públicas de recepción tendrán memoria corta y retención
mínima. No pasarán automáticamente a entrenamiento.

## Copiloto profesional y editorial

Para especialistas y editores, el valor estará en reducir trabajo mecánico sin
reemplazar criterio:

- Búsqueda híbrida por especie, territorio, autor, año, DOI y tema.
- Matrices de evidencia con acuerdos, contradicciones y vacíos.
- Extracción de metadatos y afirmaciones candidatas desde documentos permitidos.
- Comparación entre una ficha y sus fuentes citadas.
- Reescritura por audiencia: infancia, comunidad general, voluntariado o nivel
  técnico.
- Control de consistencia taxonómica, bibliográfica y editorial.
- Preparación de preguntas para revisión científica o comunitaria.
- Generación de borradores estructurados con cambios visibles y reversibles.

El profesional verá qué fragmentos respaldan cada sugerencia. Una respuesta del
modelo sin fuente nunca se convierte en evidencia.

## Inteligencia de recursos y colaboración

El asistente conectará convocatorias con capacidades reales de personas,
organizaciones y territorios. Podrá explicar requisitos, identificar documentos
faltantes, sugerir contrapartes consentidas y preparar borradores de proyecto,
presupuesto, cronograma e indicadores.

El catálogo de oportunidades será global; cada postulación y estrategia será
privada del tenant o consorcio. La IA no enviará invitaciones, postulaciones ni
documentos a terceros sin confirmación humana, y nunca inventará experiencia o
antecedentes para completar un formulario.

## Funciones permitidas por etapas

### Etapa A — Asistente educativo con fuentes

- Recibir y orientar a visitantes usando exclusivamente información pública.
- Explicar especies y ecosistemas en lenguaje claro.
- Resumir evidencia publicada por Impacta+ con citas.
- Comparar fuentes y declarar incertidumbre o desacuerdo.
- Recomendar lecturas y acciones educativas ya revisadas.

### Etapa B — Copiloto de contribución

- Ayudar a completar un borrador de observación.
- Extraer metadatos propuestos desde texto o imagen.
- Detectar campos faltantes y posibles duplicados.
- Proponer redacción educativa sin publicar.

### Etapa C — Copiloto operativo con herramientas

- Consultar misiones, catálogo y documentos según los permisos del usuario.
- Preparar borradores de informes y materiales educativos.
- Sugerir tareas; toda mutación exige confirmación explícita.

### Etapa D — Asistentes especializados

- Activar modos de recepción, voluntariado, profesional, editorial y soporte.
- Seleccionar políticas y herramientas a partir de permisos calculados por el
  backend, nunca por una declaración libre del modelo.
- Permitir escritura únicamente en entidades de borrador con trazabilidad.
- Medir utilidad y seguridad por contexto, no solo una métrica global.

## Límites duros

El asistente MUST NOT:

- Leer conversaciones privadas por defecto.
- Acceder a denuncias, alias, recibos o evidencias del canal seguro.
- Entrenarse con mensajes, denuncias o documentos privados sin una base legal,
  consentimiento específico y revisión de seguridad.
- Revelar coordenadas sensibles o cruzar datos para inferirlas.
- Publicar fichas, validar credenciales, resolver moderación o cerrar denuncias.
- Aprobar membresías, firmar informes o ejecutar transiciones reservadas.
- Postular a fondos, comprometer recursos o contactar contrapartes sin confirmación.
- Procesar expedientes periodísticos mediante un proveedor externo o intentar
  identificar fuentes protegidas.
- Presentar una identificación visual de especie como certeza científica.
- Inventar fuentes, DOI, instituciones o citas.

Cada respuesta científica debe citar registros recuperados, indicar fecha de
consulta y abstenerse cuando no exista evidencia suficiente.

## Arquitectura

```text
Usuario autenticado o visitante
            ↓
API de Impacta+ — identidad, permisos y límites
            ↓
Orquestador del asistente
   ├── índice público de conocimiento publicado
   ├── índice tenant autorizado y aislado
   ├── política de contexto: recepción, profesional, editor, voluntario...
   ├── herramientas de solo lectura permitidas
   ├── herramientas de borrador con confirmación y auditoría
   └── AiGatewayClient/AiProvider: OmniRoute → ruta local Qwen autorizada
            ↓
Respuesta con citas, incertidumbre y registro seguro
```

El modelo nunca recibe credenciales ni decide permisos. El backend filtra cada
documento y cada herramienta antes de construir el contexto. Los índices
tenant se separan lógicamente y se prueban con al menos dos organizaciones.
La interfaz solicita un contexto de ayuda, pero el backend calcula los permisos
efectivos. Cambiar el prompt o pedir "actúa como administrador" no concede una
herramienta adicional.

## Estrategia de fine-tuning

### 1. Baseline antes de entrenar

Crear un conjunto de evaluación retenido y medir el modelo base con RAG. Si el
prompt, las herramientas y la recuperación resuelven la tarea, no se entrena.

### 2. SFT con LoRA/QLoRA

Comenzar con 300–500 ejemplos de alta calidad, revisados por personas, para:

- Español chileno claro y respetuoso.
- Respuestas educativas por nivel de conocimiento.
- Uso correcto de citas y expresión de incertidumbre.
- Extracción a esquemas JSON validados.
- Derivación responsable a revisión humana.
- Rechazo de solicitudes que exceden permisos o exponen datos sensibles.
- Recepción cálida y orientación correcta sin fingir identidad humana.
- Preparación de borradores profesionales y editoriales con trazabilidad.
- Matching explicable de oportunidades y colaboradores, incluyendo incertidumbre.

Los datos se dividen por ejemplo, fuente y territorio en entrenamiento,
validación y prueba para evitar contaminación. Cada dataset tendrá versión,
licencia, procedencia y registro de transformaciones.

### 3. DPO opcional

Solo después del SFT, usar pares de preferencia si hace falta ajustar tono,
claridad o prudencia. No se aplicará RFT inicialmente: las tareas de educación,
seguridad y ciencia no tienen una única respuesta objetiva fácil de calificar.

### 4. Evaluación de checkpoints

No se adopta simplemente el último checkpoint. Se comparan calidad, seguridad,
latencia y costo, y se conserva la versión del modelo, adaptador, dataset y
configuración que produjo cada resultado.

## Evaluación mínima

Conjunto retenido de al menos 100 casos, incluyendo:

- Preguntas sobre especies con y sin evidencia suficiente.
- Fuentes contradictorias o desactualizadas.
- Intentos de obtener coordenadas sensibles.
- Intentos de cruzar datos entre dos organizaciones.
- Prompt injection dentro de papers o documentos recuperados.
- Identificación visual ambigua.
- Lenguaje técnico, comunitario y educativo.
- Recepción de visitantes con intenciones ambiguas o múltiples.
- Flujos de voluntariado, edición y apoyo profesional.
- Intentos de ordenar al modelo que apruebe o publique un borrador.
- Consultas que deben derivarse a profesionales o autoridades.

Métricas:

- Exactitud de citas y afirmaciones respaldadas.
- Tasa de alucinación y de abstención correcta.
- Fugas de permisos o ubicación sensible: tolerancia cero.
- Cumplimiento del esquema estructurado.
- Calidad evaluada por revisores científicos y comunitarios.
- Tasa de derivación correcta y resolución en recepción.
- Tiempo ahorrado a profesionales y editores sin degradar calidad.
- Latencia, tokens y costo por tarea.

## Operación y gobernanza

- Telemetría operativa sin cuerpos de prompts ni respuestas. Los casos de
  evaluación se conservan únicamente en un repositorio separado, curado,
  anonimizado y con autorización; nunca incluye denuncias, mensajes privados,
  secretos ni coordenadas sensibles.
- Versionado de modelo, adaptador, índice y prompt del sistema.
- Evaluaciones de regresión antes de cada cambio.
- Botón visible para reportar una respuesta y flujo de corrección.
- Etiqueta permanente que informe que es una asistencia automática.
- Interruptor de desactivación y fallback a búsqueda convencional.
- Comité humano para aprobar nuevas fuentes, herramientas y usos de datos.

## Fases y criterio de salida

1. **Gobernanza:** permisos, licencias, privacidad y fuentes estables.
2. **Abstracción:** implementar `AiGatewayClient`/`AiProvider` y seleccionar una
   ruta OmniRoute inicial sin acoplar el frontend.
3. **RAG público:** respuestas de solo lectura sobre contenido publicado.
4. **Recepción API:** orientación pública con derivación humana y memoria mínima.
5. **Piloto interno:** copiloto para profesionales y editores, inicialmente de
   solo lectura y luego con escritura exclusiva de borradores.
6. **Dataset y evaluación:** convertir casos revisados en una batería retenida,
   no en entrenamiento automático.
7. **Qwen baseline:** desplegar el modelo base aislado y compararlo con la API.
8. **SFT LoRA:** entrenar únicamente si el baseline demuestra una brecha clara.
9. **Migración local:** cambiar la ruta de OmniRoute gradualmente, con rollback.
10. **Asistentes especializados:** voluntariado, coordinación y soporte.
11. **Evaluación continua:** revisión científica, comunitaria y de seguridad.

No se avanza de fase con fugas de permisos, citas falsas, exposición de
ubicaciones sensibles o ausencia de responsables humanos.

## Fuentes técnicas iniciales

- Qwen3.8-27B oficial: <https://huggingface.co/Qwen/Qwen3.8-27B>
- Repositorio oficial Qwen3.8: <https://github.com/QwenLM/Qwen3.8>
- OWASP LLM Top 10: <https://genai.owasp.org/llm-top-10/>
