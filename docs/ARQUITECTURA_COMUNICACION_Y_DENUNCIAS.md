# Impacta+ — Arquitectura de comunicación privada y denuncias seguras

## Propósito

Incorporar dos capacidades diferentes:

1. **Mensajería interna privada** para el trabajo cotidiano entre participantes.
2. **Canal seguro de denuncias** para recibir información sensible con alias y
   comunicación bidireccional.

No compartirán conversaciones, permisos ni operadores. Una bandeja de mensajes
privados no ofrece por sí sola anonimato de red, protección frente a represalias
ni garantías adecuadas para denunciantes.

## Principios comunes

- Mínimo privilegio y denegación por defecto.
- Cifrado en tránsito y en almacenamiento.
- Sin contenido sensible en logs, telemetría, correo ni notificaciones push.
- Retención definida y eliminación verificable.
- Accesos trazables sin registrar el cuerpo de los mensajes.
- Archivos analizados, con límites de tamaño y tipo.
- IA desactivada por defecto en toda conversación privada o denuncia.
- Todo permanece bajo `https://impacta.pinguinoseguro.cl`; no se crearán
  subdominios.

## Mensajería interna

### Alcance inicial

- Conversaciones directas.
- Grupos de trabajo.
- Canales asociados a misión, proyecto u organización.
- Solicitudes de conversación y bloqueo de usuarios.
- Archivos adjuntos autorizados.
- Confirmación de lectura configurable.

### Autorización

Una persona solo puede acceder a una conversación si es participante activo y
el alcance de la conversación coincide con su participación vigente. El backend
debe verificar esto en cada lectura, envío, descarga y conexión en tiempo real;
no se confiará en filtros del frontend.

### Privacidad realista

Existirán dos modos visibles. `PRIVATE_MANAGED` utilizará cifrado administrado
por el servidor para permitir respaldo, búsqueda acotada y recuperación; no se
describirá como E2EE. `CONFIDENTIAL_E2EE` cifrará en los dispositivos y el
servidor solo almacenará ciphertext y metadatos mínimos.

El modo E2EE usará un protocolo revisado —MLS para grupos es el candidato— y
requerirá auditoría criptográfica. Sentinel protegerá host, claves de servidor y
telemetría, pero su `CrystalCipher` actual no se usará directamente para
mensajes. La arquitectura completa está en
`docs/ARQUITECTURA_CIFRADO_CONVERSACIONES_INTELIGENCIA.md`.

La IA estará ausente por defecto. En modo administrado podrá habilitarse para un
alcance concreto; en E2EE solo Qwen local podrá entrar como participante
criptográfico visible y con consentimiento de todos.

### Modelo conceptual

- `Conversation`: tipo, alcance y política de retención.
- `ConversationSecurityMode`: `PRIVATE_MANAGED` o `CONFIDENTIAL_E2EE`.
- `ConversationParticipant`: cuenta, estado y fechas de participación.
- `DeviceIdentity`: dispositivo, clave pública, estado y revocación.
- `Message`: remitente, envolvente cifrada, época, versión y estado.
- `MessageAttachment`: objeto privado, hash, análisis y metadatos mínimos.
- `MessageReceipt`: entrega o lectura, si está habilitada.
- `ConversationReport`: reporte de abuso separado del hilo.
- `IntelligencePackage`: paquete cifrado, procedencia, destinatarios y restricciones.

## Canal de denuncias

### Modelo de amenaza

Antes de implementarlo se documentará frente a quién protege y frente a quién
no. Como mínimo debe contemplar:

- Exposición accidental por administradores o logs.
- Acceso indebido de miembros de una organización.
- Correlación mediante IP, navegador, horarios o archivos.
- Robo de credenciales de receptores.
- Identificación por metadatos de imágenes o documentos.
- Publicación que exponga a la persona, terceros o especies sensibles.

Un formulario en una SPA convencional no garantiza anonimato fuerte frente al
proveedor de internet, el dispositivo comprometido o una investigación con
capacidad de correlación. La interfaz debe decirlo con claridad y ofrecer pautas
de seguridad antes de iniciar.

### Acceso sin cuenta

- El denunciante no necesita una cuenta normal.
- El sistema genera un alias aleatorio y un recibo o código de recuperación de
  alta entropía.
- No se exige correo, teléfono, RUT ni nombre.
- El recibo permite volver a una casilla anónima bidireccional.
- La pérdida del recibo no se resuelve mediante preguntas personales.

### Separación de responsabilidades

- `WhistleblowerCase`: expediente cifrado y estado de tramitación.
- `AnonymousMailbox`: intercambio cifrado asociado al recibo.
- `CaseRecipient`: receptor expresamente autorizado por tema o territorio.
- `CaseEvidence`: evidencia original cifrada y copia saneada para revisión.
- `CaseDecision`: decisión, fundamento, responsable y fecha.
- `PublicationCandidate`: versión redactada y separada del expediente original.

Un administrador técnico no obtiene automáticamente acceso al contenido. Las
claves y permisos de receptores deben estar separados de la administración
general de Impacta+.

### Minimización técnica

- Desactivar analítica, trackers y grabación de sesión en las rutas del canal.
- Evitar almacenar IP, `User-Agent`, `Referer` y parámetros sensibles.
- Configurar logs específicos de nginx y backend antes de habilitar producción.
- No incluir asunto ni contenido en notificaciones.
- Eliminar EXIF y metadatos de copias destinadas a revisión o publicación.
- Conservar el original cifrado cuando sea necesario como evidencia, con hash y
  cadena de custodia.
- Analizar malware en un entorno aislado antes de que un receptor abra archivos.

Los cambios de nginx, servicios, claves o infraestructura requieren revisión y
confirmación explícita antes de aplicarse.

### Flujo y publicación

Estados mínimos: `SUBMITTED`, `TRIAGED`, `NEEDS_INFORMATION`, `REFERRED` y
`CLOSED`.

Opciones de destino:

- `PRIVATE_ONLY`
- `SHARE_WITH_AUTHORIZED_RECIPIENTS`
- `REFER_TO_AUTHORITY`
- `PUBLIC_REDACTED`

`PUBLIC_REDACTED` nunca publica automáticamente. Requiere revisión humana,
eliminación de datos personales y ubicaciones sensibles, evaluación de riesgo
de represalias, respaldo suficiente y revisión legal cuando exista una
acusación contra una persona u organización. El alias público se genera para
cada expediente y no debe ser reutilizable para correlacionar casos.

### Relación con autoridades

Impacta+ no reemplazará canales formales. Debe orientar, según la materia, hacia
las autoridades competentes y permitir que el denunciante decida si autoriza
una derivación. La denuncia ambiental ante la SMA exige datos y formalidades
propias; un reporte anónimo dentro de Impacta+ no equivale automáticamente a una
denuncia administrativa formal.

La Ley chilena 21.592 regula protección al denunciante en un ámbito público y de
probidad específico; no debe presentarse como una garantía legal general para
este canal privado. Antes de producción se requiere revisión jurídica chilena,
incluyendo protección de datos personales y deberes de conservación o entrega
de evidencia.

### Construir o integrar

La opción preferida para anonimato serio es evaluar una solución madura como
GlobaLeaks, integrada detrás de una ruta del dominio único, en vez de inventar
criptografía y flujos de anonimato desde cero. La decisión requiere una prueba
de concepto, revisión de operaciones, respaldo, actualización y compatibilidad
con el modelo de amenazas.

### Investigación periodística

Un reporte podrá compartirse, con consentimiento, con periodistas profesionales
verificados y asignados. Ellos trabajarán sobre un expediente separado de la
identidad de fuente, con evidencia, revisiones y comunicación cifrada. El perfil
de periodista ciudadano, la asistencia de Qwen local y el flujo editorial se
definen en `docs/MODELO_PERIODISMO_CIUDADANO_INVESTIGACION.md`.

El sistema invitará a reportar con protección y control, sin afirmar que es
inhackeable o que elimina todo riesgo de represalias.

## Fases

1. Modelo de amenazas, política de privacidad, retención y revisión legal.
2. Mensajería `PRIVATE_MANAGED`, con autorización y pruebas de aislamiento.
3. Diseño y auditoría de `CONFIDENTIAL_E2EE` e intercambio de inteligencia.
4. Prueba de concepto del canal de denuncias en entorno aislado.
5. Auditoría de seguridad, simulacro de incidente y capacitación de receptores.
6. Pilotos limitados, sin publicación pública automática.

## Criterios de aceptación

- Mensajería y denuncias tienen almacenamiento, permisos y operadores separados.
- Ningún usuario fuera de una conversación puede enumerarla o leerla.
- Ningún administrador general puede abrir denuncias por defecto.
- No hay cuerpos, adjuntos, tokens ni datos del denunciante en logs.
- Cada conversación muestra su modo de seguridad y sus límites.
- Sentinel y la telemetría no reciben plaintext E2EE.
- Una publicación deriva de una copia redactada, nunca del expediente original.
- El sistema informa honestamente los límites del anonimato.
- La IA no recibe contenido privado sin consentimiento granular y una finalidad
  aprobada; las denuncias quedan excluidas por diseño.

## Fuentes de referencia

- OWASP ASVS: <https://owasp.org/www-project-application-security-verification-standard/>
- OWASP Logging Cheat Sheet: <https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html>
- Modelo de amenazas de GlobaLeaks: <https://docs.globaleaks.org/en/stable/technical/security/threat-model.html>
- Modelo de amenazas de SecureDrop: <https://docs.securedrop.org/en/stable/threat_model/threat_model.html>
- Canal de denuncias ambientales de la SMA: <https://portal.sma.gob.cl/index.php/portal-ciudadano/denuncia/>
- Ley 21.592: <https://www.bcn.cl/leychile/navegar?idNorma=1195215>
- Ley 21.719: <https://nuevo.leychile.cl/navegar?idNorma=1209272>
