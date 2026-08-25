# Asistente de IA Specification

## Purpose

Definir asistencia automática trazable, subordinada a permisos humanos y sin
acceso por defecto a datos privados o de denuncia.

## ADDED Requirements

### Requirement: Proveedor de inferencia desacoplado

El frontend MUST consumir únicamente la API de Impacta+ y MUST NOT depender del
SDK, credenciales o contrato de un proveedor de modelos.

#### Scenario: Migrar de API a Qwen local

- **WHEN** Qwen local supera la evaluación y se cambia el proveedor configurado
- **THEN** las rutas, permisos, RAG, herramientas y componentes frontend permanecen iguales
- **AND** el sistema conserva rollback al proveedor anterior

### Requirement: Selección por capacidades

El sistema MUST registrar y seleccionar modelos por capacidades, clases de datos
permitidas y evaluaciones, no por nombres codificados en la lógica de negocio.

#### Scenario: Modelo apto solo para contenido público

- **WHEN** un modelo no está aprobado para datos tenant
- **THEN** el router puede usarlo en recepción pública
- **AND** nunca lo selecciona para una tarea que contenga documentos privados

### Requirement: Evaluación portable

Todo candidato MUST ejecutar las mismas suites canónicas antes de reemplazar un
modelo activo.

#### Scenario: Aparece un modelo más reciente

- **WHEN** se registra como `CANDIDATE`
- **THEN** ejecuta pruebas de calidad, citas, permisos, seguridad, herramientas y costo
- **AND** no recibe tráfico de producción hasta superar los umbrales del contexto

### Requirement: Continuidad sin modelo

El sistema MUST ofrecer fallback o modo degradado cuando no exista un motor
seguro y disponible.

#### Scenario: API externa y Qwen local no disponibles

- **WHEN** ningún proveedor aprobado responde
- **THEN** la plataforma mantiene búsqueda, formularios y derivación humana
- **AND** no relaja permisos ni utiliza un modelo no aprobado

### Requirement: Minimización hacia proveedor externo

La etapa API MUST enviar solo el contexto necesario y MUST NOT enviar denuncias,
mensajes privados, secretos o coordenadas sensibles.

#### Scenario: Recepción de visitante

- **WHEN** el asistente responde una consulta pública mediante un proveedor externo
- **THEN** envía únicamente la consulta minimizada y contenido público recuperado
- **AND** no incorpora automáticamente la conversación a un dataset de entrenamiento

#### Scenario: Documento tenant no aprobado

- **WHEN** una tarea intenta incluir un documento privado sin política aprobada
- **THEN** el backend bloquea su envío al proveedor externo

### Requirement: Defensa cognitiva independiente del proveedor

Toda entrada de usuario, RAG, OCR, herramienta o fuente externa MUST pasar por
validación y política antes de llegar a un modelo API o local.

#### Scenario: Paper contiene instrucciones ocultas

- **WHEN** un fragmento recuperado intenta ordenar al modelo ignorar permisos o instrucciones
- **THEN** el sistema lo bloquea o lo marca como contenido no confiable
- **AND** no permite que modifique herramientas, identidad ni política

### Requirement: Sanitización de privacidad por destino

El sistema MUST eliminar o bloquear PII, secretos, coordenadas sensibles y datos
tenant según el destino: proveedor, telemetría, dataset o interfaz.

#### Scenario: Error contiene RUT y token

- **WHEN** el orquestador emite telemetría de un fallo
- **THEN** registra categorías, regla y digest opaco
- **AND** no registra el RUT, token, prompt ni respuesta original

### Requirement: Salida verificada

Toda respuesta o llamada de herramienta MUST pasar por validación de esquema,
permisos, citas y prevención de fuga antes de llegar al usuario o al dominio.

#### Scenario: Modelo propone una herramienta no autorizada

- **WHEN** la salida solicita publicar o leer otro tenant
- **THEN** el gateway rechaza la llamada
- **AND** deriva a un flujo permitido sin ejecutar la acción

### Requirement: Sin bypass global en producción

La sanitización MUST NOT poder desactivarse globalmente en producción.

#### Scenario: Fuente legítima produce falso positivo

- **WHEN** una persona autorizada registra una excepción
- **THEN** la excepción queda versionada y limitada a una regla, fuente y alcance
- **AND** las demás capas continúan ejecutándose

### Requirement: Respuestas científicas con evidencia

Toda respuesta científica factual MUST citar fuentes autorizadas recuperadas o
declarar que no existe evidencia suficiente.

#### Scenario: Fuente insuficiente

- **WHEN** la recuperación no entrega respaldo para una afirmación
- **THEN** el asistente se abstiene o formula la incertidumbre
- **AND** no inventa una cita, DOI o institución

### Requirement: Permisos antes de recuperación

El backend MUST filtrar documentos y herramientas antes de construir el contexto del modelo.

#### Scenario: Consulta sobre datos de otra organización

- **WHEN** una cuenta intenta obtener información tenant no autorizada
- **THEN** esa información no entra al prompt ni a la respuesta
- **AND** el modelo no puede ampliar permisos

### Requirement: Exclusión de comunicaciones sensibles

Mensajes privados y denuncias MUST NOT usarse como contexto o entrenamiento por defecto.

#### Scenario: Indexación automática

- **WHEN** se actualizan los índices del asistente
- **THEN** el proceso excluye conversaciones, expedientes, alias y evidencias

### Requirement: Acciones humanas

El asistente MUST NOT publicar, validar ciencia, verificar credenciales, moderar
definitivamente ni cerrar denuncias de forma autónoma.

#### Scenario: Solicitud de publicar una ficha

- **WHEN** una persona pide al asistente publicar contenido
- **THEN** el asistente prepara como máximo un borrador
- **AND** deriva la decisión a una persona autorizada

### Requirement: Asistencia contextual

El sistema MUST adaptar fuentes, instrucciones y herramientas al contexto de
recepción, educación, voluntariado, trabajo profesional, edición o soporte.

#### Scenario: Visitante usa la recepción

- **WHEN** una persona sin sesión solicita orientación
- **THEN** el asistente utiliza únicamente información y herramientas públicas
- **AND** ofrece derivación a una persona o canal especializado cuando corresponde

#### Scenario: Profesional usa el copiloto

- **WHEN** una persona con permisos profesionales compara evidencia científica
- **THEN** el asistente recupera únicamente fuentes dentro de su alcance
- **AND** muestra el respaldo de cada sugerencia sin presentarla como validada

### Requirement: Permisos independientes del prompt

El contexto solicitado al modelo MUST NOT ampliar los permisos calculados por el backend.

#### Scenario: Usuario pide actuar como publicador

- **WHEN** una persona sin permiso ordena al asistente asumir un rol superior
- **THEN** el conjunto de fuentes y herramientas permanece sin cambios
- **AND** el intento no habilita aprobación ni publicación

### Requirement: Escritura limitada a borradores

Las herramientas de escritura del asistente MUST limitarse a borradores
reversibles y requerir confirmación humana.

#### Scenario: Editor solicita una versión educativa

- **WHEN** el asistente prepara una nueva versión de una ficha
- **THEN** el sistema muestra los cambios y fuentes antes de guardar
- **AND** registra solicitante, modelo, versión y fecha en el borrador
- **AND** no cambia el estado a `PUBLISHED`

### Requirement: Recepción identificada y minimizada

El asistente de recepción MUST identificarse como IA y MUST aplicar memoria y
retención mínimas a visitantes.

#### Scenario: Orientación pública

- **WHEN** un visitante inicia una conversación general
- **THEN** la interfaz informa que responde un asistente automático
- **AND** no exige identidad ni crea perfiles ocultos para entregar información pública
- **AND** no incorpora la conversación al entrenamiento automáticamente

### Requirement: Evaluación previa al fine-tuning

El sistema MUST medir un baseline con evaluación retenida antes de entrenar.

#### Scenario: RAG resuelve la tarea

- **WHEN** el modelo base con RAG cumple los umbrales aprobados
- **THEN** no se realiza fine-tuning sin demostrar una brecha adicional

### Requirement: Matching de recursos explicable

Toda recomendación de oportunidad o colaboración MUST mostrar los requisitos,
capacidades, brechas e incertidumbres que la originaron.

#### Scenario: Organización parcialmente elegible

- **WHEN** una convocatoria coincide con el territorio y propósito pero exige una capacidad faltante
- **THEN** el asistente muestra la coincidencia y la brecha por separado
- **AND** puede sugerir perfiles consentidos que aporten la capacidad
- **AND** no declara a la organización elegible sin confirmación humana

### Requirement: Postulación reservada a personas

El asistente MUST NOT enviar postulaciones, firmar declaraciones, comprometer
recursos ni contactar contrapartes sin confirmación humana explícita.

#### Scenario: Borrador de proyecto completo

- **WHEN** el asistente termina un borrador con todos los campos aparentes
- **THEN** el sistema conserva el estado de borrador
- **AND** exige revisión de antecedentes, cifras, compromisos y firmantes
- **AND** no ofrece al modelo una herramienta de envío final
