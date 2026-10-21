# Impacta+ — Cifrado de conversaciones e intercambio de inteligencia

## Propósito

Ofrecer a profesionales, organizaciones y colectivos un espacio para conversar
y compartir inteligencia de manera privada, cifrada y verificable sobre nodos
protegidos por Sentinel.

La palabra “privada” debe corresponder a garantías técnicas concretas. Impacta+
distinguirá entre privacidad administrada y cifrado de extremo a extremo.

## Dos modos visibles

### `PRIVATE_MANAGED`

- TLS entre cliente e Impacta+.
- Cifrado por envolvente en almacenamiento.
- Claves de datos separadas por conversación y versión.
- El backend puede descifrar para búsqueda, moderación, recuperación y asistencia
  local explícitamente habilitada.
- Nunca se envía contenido a una API de IA sin política y consentimiento.

Este modo se describe como “privado y cifrado”, no como E2EE.

### `CONFIDENTIAL_E2EE`

- Cifrado y descifrado en los dispositivos participantes.
- El servidor almacena ciphertext y metadatos mínimos.
- No hay búsqueda del contenido, recuperación del texto ni moderación server-side.
- Para grupos se evaluará MLS, estándar RFC 9420, en vez de diseñar un protocolo
  propio.
- Para sesiones directas se evaluará un protocolo maduro con acuerdo asíncrono y
  ratchet, sin implementar criptografía ad hoc.

Este modo se reserva para inteligencia y conversaciones que requieran que ni
administradores ni servidor puedan leer el contenido.

## Uso de Sentinel

Sentinel aporta:

- Host protegido y observado.
- Cortex y verificación operativa.
- Sanitización previa a IA y telemetría.
- Primitiva `CrystalCipher` basada en AES-256-GCM para su capa interna.
- Base para encapsular señales entre procesos locales.

`CrystalCipher` no se usará tal cual como protocolo de conversación. En su
implementación actual, la clave y el nonce se mantienen durante un pulso, por lo
que dos cifrados en ese intervalo pueden reutilizar el par clave/nonce. AES-GCM
requiere unicidad de IV/nonce por clave. Antes de reutilizarlo fuera de su capa
interna debe incorporar un nonce único por mensaje y un protocolo de claves
auditado.

El cifrado de mensajería se construirá sobre bibliotecas y protocolos revisados;
Sentinel protegerá el runtime, las claves del servidor y la telemetría.

## Intercambio de inteligencia

Una conversación no es suficiente para compartir datasets, informes, alertas o
evidencia entre organizaciones. Se define `IntelligencePackage`:

- Identificador, versión y clasificación.
- Autoría, organización o colectivo de origen.
- Destinatarios o grupo criptográfico.
- Propósito y restricciones de uso.
- Procedencia, licencia y fecha de expiración.
- Manifest con hashes de archivos.
- Payload cifrado y claves envueltas para destinatarios.
- Firma de autenticidad separada del cifrado.
- Recibos de entrega sin revelar contenido.

Clasificaciones iniciales:

- `PUBLIC`
- `COMMUNITY_SHARED`
- `TENANT_CONFIDENTIAL`
- `CONSORTIUM_CONFIDENTIAL`
- `SENSITIVE_LOCAL_ONLY`
- `PROHIBITED_AI`

Compartir un paquete requiere seleccionar destinatarios, propósito y duración.
Agregar una persona después no le concede automáticamente acceso al historial.

## IA dentro de conversaciones

- La IA está ausente por defecto.
- En `PRIVATE_MANAGED`, los participantes pueden habilitar Qwen local para una
  tarea y rango de mensajes concretos.
- Una API externa no recibe conversaciones privadas salvo una futura política
  explícita; no es parte del piloto.
- En `CONFIDENTIAL_E2EE`, la IA solo participa si el grupo agrega de forma
  visible un endpoint local como miembro criptográfico.
- Agregar IA genera un evento de sistema, muestra qué contenido podrá leer y
  requiere consentimiento de todos los participantes activos.
- Retirar la IA rota la época o claves del grupo.
- La IA no recibe automáticamente el historial anterior ni usa el contenido para
  entrenamiento.

## Claves y dispositivos

- Identidad criptográfica por dispositivo, vinculada a una cuenta mediante
  verificación explícita.
- Alta y revocación de dispositivos visibles para la persona.
- Rotación de claves al agregar o eliminar participantes.
- Claves privadas E2EE nunca almacenadas en texto plano en el servidor.
- Recuperación como decisión de producto: respaldo cifrado opt-in o pérdida de
  acceso; nunca puerta trasera silenciosa.
- Eliminación segura de claves antiguas en la medida que permitan navegador y
  dispositivo.
- Separación entre claves de mensajería, archivos, telemetría y servidor.

## Metadatos

E2EE no oculta necesariamente quién conversa, cuándo, desde qué red ni el tamaño
de los mensajes. Impacta+ minimizará:

- Direcciones y agentes de usuario en logs.
- Nombres de archivo y previews.
- Participantes en notificaciones.
- Retención de recibos y presencia.
- Correlación entre organizaciones mediante identificadores públicos.

La interfaz explicará estos límites sin prometer anonimato.

## Adjuntos

- Cifrado cliente-side en modo E2EE.
- Clave única por objeto o derivada de forma segura por archivo.
- Hash y autenticación ligados al manifest.
- Nombre y MIME sensibles dentro del payload cifrado.
- Escaneo de malware antes del cifrado cuando el emisor lo permita, o en un
  entorno local después del descifrado; la limitación debe ser visible.
- Cuotas para impedir abuso de almacenamiento.

## Modelo conceptual

- `DeviceIdentity`
- `DeviceKeyPackage`
- `ConversationSecurityMode`
- `EncryptedConversationState`
- `EncryptedMessageEnvelope`
- `EncryptedAttachment`
- `KeyEpoch`
- `DeviceRevocation`
- `IntelligencePackage`
- `IntelligenceRecipient`
- `IntelligenceReceipt`
- `AiParticipantGrant`

PostgreSQL almacena ciphertext y estado protocolar, no claves privadas de
dispositivo.

## Auditoría requerida

Antes de producción:

- Modelo de amenazas por modo.
- Revisión criptográfica externa.
- Vectores oficiales y pruebas de interoperabilidad.
- Pruebas de nonce único, replay, reordenamiento y mensajes perdidos.
- Rotación por cambios de membresía y revocación de dispositivos.
- Compromiso de claves, forward secrecy y recuperación posterior.
- Fuzzing de parsers y ciphertext.
- Respaldo y restauración sin romper estados criptográficos.
- Pruebas de que Sentinel y telemetría nunca reciben plaintext.

## Criterios de aceptación

- Cada conversación muestra claramente su modo y garantías.
- E2EE usa un protocolo revisado, no `CrystalCipher` directamente.
- Cada cifrado AEAD usa clave/nonce conforme al protocolo.
- El servidor no puede descifrar `CONFIDENTIAL_E2EE`.
- La IA solo entra mediante consentimiento visible y Qwen local.
- El intercambio de inteligencia conserva origen, destinatarios y restricciones.
- Sentinel observa salud y anomalías sin recibir contenido.

## Referencias

- NIST SP 800-38D, AES-GCM: <https://csrc.nist.gov/pubs/sp/800/38/d/final>
- Signal Double Ratchet: <https://signal.org/docs/specifications/doubleratchet/>
- Signal X3DH: <https://signal.org/docs/specifications/x3dh/>
- IETF MLS, RFC 9420: <https://www.rfc-editor.org/rfc/rfc9420.html>

