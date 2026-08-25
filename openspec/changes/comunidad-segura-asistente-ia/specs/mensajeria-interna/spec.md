# Mensajería interna Specification

## Purpose

Definir comunicación privada y cifrada entre participantes autorizados, con un
modo administrado y un modo de extremo a extremo de garantías explícitas.

## ADDED Requirements

### Requirement: Autorización por conversación

El backend MUST verificar participación activa en cada operación de una conversación.

#### Scenario: Usuario ajeno intenta leer mensajes

- **WHEN** una cuenta no participante solicita una conversación o adjunto
- **THEN** el sistema deniega la operación sin revelar su contenido ni participantes

### Requirement: Contenido fuera de logs

El sistema MUST NOT registrar cuerpos, adjuntos, tokens ni vistas previas de
mensajes en logs o telemetría.

#### Scenario: Error al enviar un mensaje

- **WHEN** falla el procesamiento o almacenamiento
- **THEN** el log contiene un identificador técnico y código de error
- **AND** no contiene el texto ni el archivo enviado

### Requirement: Modo de seguridad explícito

Cada conversación MUST declarar `PRIVATE_MANAGED` o `CONFIDENTIAL_E2EE` y mostrar
qué actores pueden descifrarla.

#### Scenario: Persona consulta la privacidad del canal

- **WHEN** abre la información de seguridad de una conversación
- **THEN** conoce quién puede acceder, la retención y los límites del cifrado

### Requirement: E2EE mediante protocolo revisado

El modo `CONFIDENTIAL_E2EE` MUST cifrar y descifrar en dispositivos mediante un
protocolo revisado y MUST NOT usar `CrystalCipher` directamente como protocolo
de mensajería.

#### Scenario: Enviar mensaje confidencial

- **WHEN** un participante envía en una conversación E2EE
- **THEN** el servidor recibe y almacena solo una envolvente cifrada autenticada
- **AND** cada operación AEAD cumple la unicidad de clave y nonce del protocolo
- **AND** Sentinel y la telemetría no reciben plaintext

### Requirement: Cambios de membresía rotan claves

El modo E2EE MUST actualizar el estado criptográfico al agregar, retirar o
revocar participantes y dispositivos.

#### Scenario: Revocar un dispositivo

- **WHEN** una persona revoca uno de sus dispositivos
- **THEN** las conversaciones afectadas avanzan de época o sesión
- **AND** el dispositivo revocado no recibe mensajes futuros

### Requirement: Intercambio cifrado de inteligencia

El sistema MUST permitir compartir paquetes cifrados con procedencia,
destinatarios, propósito, restricciones y expiración.

#### Scenario: Dos organizaciones comparten un informe confidencial

- **WHEN** ambas aceptan colaborar y se seleccionan destinatarios
- **THEN** el sistema cifra el paquete para esos destinatarios
- **AND** conserva manifest, hashes y restricciones sin exponer el contenido

### Requirement: IA como participante consentido

La IA MUST estar ausente por defecto de conversaciones privadas y MUST NOT usar
un proveedor externo para contenido E2EE.

#### Scenario: Grupo E2EE solicita ayuda de Qwen local

- **WHEN** todos los participantes activos consienten agregarlo
- **THEN** Qwen local entra como miembro visible con alcance informado
- **AND** el sistema registra el evento y rota claves al retirarlo
- **AND** el contenido no se usa para entrenamiento automático
