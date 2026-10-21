# Design: Comunidad segura y asistente de IA

## Context

El modelo actual exige `organizationId` y un único `User.role`. Esto funciona
para operadores de una ONG, pero no representa a una persona que puede ser
voluntaria, miembro, profesional y colaboradora territorial al mismo tiempo.
Tampoco debe reutilizarse como modelo de acceso a mensajes o denuncias.

## Goals / Non-Goals

**Goals:**

- Identidad global con múltiples participaciones y permisos explicables.
- Conocimiento comunal con procedencia y revisión humana.
- Mensajería privada con aislamiento comprobable.
- Canal de denuncias con mínima recolección y separación de operadores.
- Asistente con RAG, citas y herramientas sujetas a permisos.

**Non-Goals:**

- Anonimato fuerte sin modelado de amenazas y auditoría.
- Moderación, validación científica o publicación autónoma por IA.
- Criptografía de mensajería inventada sin protocolo revisado y auditoría.
- Entrenar con información privada o sensible.

## Decisions

### Identidad y autorización

`Account` y `PersonProfile` serán globales. `OrganizationMembership` y
`CollectiveMembership` representarán pertenencia. `ProfessionalCredential` y
`Expertise` describirán experiencia. `RoleAssignment` concederá un permiso
funcional dentro de organización, colectivo, proyecto, territorio o disciplina.

La migración mantendrá temporalmente `User.organizationId` y `User.role`; no se
eliminarán hasta contar con compatibilidad y e2e multi-tenant.

### Conocimiento comunitario

`CommunitySubmission` pertenece a un colectivo territorial y conserva
consentimiento. No se convertirá en `OrganizationObservation` ni en afirmación
publicada sin una decisión registrada en `ContributionReview`.

### Mensajería

Las conversaciones tendrán dos modos explícitos. `PRIVATE_MANAGED` será
server-readable, cifrado en almacenamiento y apto para respaldo y búsqueda;
no se llamará E2EE. `CONFIDENTIAL_E2EE` cifrará en dispositivos mediante un
protocolo revisado, con MLS como candidato para grupos. El contenido no se
incluirá en logs, notificaciones ni telemetría Sentinel.

Sentinel protegerá el host y los intercambios internos. `CrystalCipher` no se
usará directamente para conversaciones mientras no exista nonce único por
mensaje y protocolo auditado. La IA estará ausente por defecto; en E2EE solo
Qwen local podrá agregarse como participante criptográfico visible con
consentimiento de todos. Ver
`docs/ARQUITECTURA_CIFRADO_CONVERSACIONES_INTELIGENCIA.md`.

### Denuncias

El canal no exigirá cuenta y entregará alias y recibo aleatorio. Tendrá modelos,
claves, rutas, logs y receptores separados. Un administrador de Impacta+ no será
receptor por defecto. Se evaluará integrar GlobaLeaks detrás de una ruta del
dominio único antes de desarrollar una solución propia.

Una publicación se genera desde una copia redactada del expediente y requiere
revisión humana y legal cuando corresponda. Impacta+ orientará hacia canales
formales como la SMA, pero no afirmará que su ingreso anónimo constituye una
denuncia administrativa.

### Periodismo ciudadano e investigación

El perfil `CITIZEN_REPORTER` permitirá aportar sin credencial profesional. Los
periodistas profesionales tendrán credencial separada y acceso solo mediante
`JournalistAssignment`. Identidad de fuente, expediente, evidencia y borrador
publicable estarán separados.

Qwen local ayudará a construir cronologías, buscar fuentes públicas, detectar
contradicciones, redactar PII y preparar preguntas; no decidirá credibilidad ni
publicará. Mientras el cerebro sea una API externa, el contenido sensible del
caso no se enviará al modelo. El diseño completo está en
`docs/MODELO_PERIODISMO_CIUDADANO_INVESTIGACION.md`.

### Asistente de IA

La primera etapa consumirá OmniRoute como gateway detrás de los contratos
`AiGatewayClient` y `AiProvider`; el modelo o combinación final será decidido
por el gateway y quedará registrado en la respuesta canónica.
Qwen3.8-27B es el candidato para la etapa local. El conocimiento vigente se
suministrará por RAG; LoRA/QLoRA se reservará para tono, formatos, uso de citas,
abstención y flujos. El backend aplicará permisos antes de la recuperación y de
cada herramienta. Mensajes privados, denuncias y coordenadas sensibles quedan
fuera del contexto y entrenamiento por defecto.

El frontend solo usará `/api/assistant`. El proveedor no será propietario de
prompts, memoria, índices, herramientas o feedback. La selección API/local se
resolverá por configuración backend y ambos motores deberán pasar la misma
evaluación. Documentos tenant no se enviarán externamente sin una política
aprobada de finalidad, minimización, retención y no entrenamiento.

Un `ModelRegistry` registrará capacidades, clases de datos permitidas, métricas
y estado operativo. Un router seleccionará por tarea y privacidad, con fallback
y modo degradado. Los contratos, portabilidad y protocolo de cambio se detallan
en `docs/ARQUITECTURA_INTELIGENCIA_INDEPENDIENTE_MODELO.md`.

La defensa tomará de Sentinel su frontera previa al modelo, pipeline de ingreso
y salida, decisión explícita y corpus adversarial. No copiará literalmente sus
reglas de telemetría. Impacta+ añadirá sanitización de PII, secretos,
coordenadas y tenant, sin registrar originales. El diseño se documenta en
`docs/REUTILIZACION_DEFENSA_COGNITIVA_SENTINEL.md`.

Se utilizará un núcleo intercambiable —API al inicio, Qwen local después— con
asistentes de contexto para recepción, educación, voluntariado, profesionales,
edición y soporte. Cada
contexto selecciona su política, fuentes y herramientas, pero no modifica la
identidad ni los permisos efectivos. El modelo podrá trabajar sobre borradores
confirmados por la persona; no recibirá herramientas para aprobar, verificar,
publicar, firmar ni resolver definitivamente.

Qwen también operará como capa de inteligencia para recursos y proyectos:
cruzará oportunidades globales verificadas con capacidades tenant y perfiles de
colaboración consentidos. Podrá explicar coincidencias, detectar brechas y
preparar borradores, pero no postular, firmar, comprometer recursos ni contactar
terceros sin confirmación. El modelo detallado se encuentra en
`docs/VISION_CEREBRO_OPERATIVO_RED_REGIONAL.md` y complementa el cambio OpenSpec
`comunicacion-grants-reporting`.

## Data flow

```text
Cuenta → participación → permiso acotado → aporte → revisión → publicación

Participante → conversación autorizada → mensaje privado

Persona sin cuenta → alias + recibo → expediente aislado → receptor autorizado
                                              └→ copia redactada → revisión → público

Consulta → backend de permisos → recuperación autorizada → Qwen → respuesta citada
```

## Risks / Trade-offs

- Separar identidad y tenant exige una migración amplia, pero evita organizaciones
  ficticias y roles globales excesivos.
- `PRIVATE_MANAGED` facilita búsqueda y recuperación, pero permite descifrado del
  servidor; `CONFIDENTIAL_E2EE` protege el contenido a costa de esas funciones.
  La interfaz debe explicar el modo activo.
- Un alias no elimina metadatos de red o documento; la comunicación debe evitar
  promesas engañosas.
- Qwen3.8-27B requiere infraestructura GPU aislada y evaluación de costo.
- RAG reduce desactualización, pero documentos maliciosos introducen riesgo de
  prompt injection y deben tratarse como datos no confiables.
