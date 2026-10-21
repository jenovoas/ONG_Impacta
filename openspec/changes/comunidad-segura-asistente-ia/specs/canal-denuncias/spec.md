# Canal de denuncias Specification

## Purpose

Definir recepción y comunicación sensible con alias, mínima recolección y
publicación humana redactada.

## ADDED Requirements

### Requirement: Ingreso sin cuenta

El canal MUST permitir crear un expediente sin cuenta, correo, teléfono, RUT ni nombre.

#### Scenario: Envío con alias

- **WHEN** una persona envía una denuncia sin identificarse
- **THEN** el sistema crea un alias y recibo aleatorios
- **AND** permite continuar la comunicación usando solo el recibo

### Requirement: Separación de acceso

La administración general MUST NOT conceder acceso automático al contenido de denuncias.

#### Scenario: Administrador no receptor intenta abrir un expediente

- **WHEN** un administrador técnico carece de asignación como receptor
- **THEN** el sistema deniega el contenido y registra el intento sin datos sensibles

### Requirement: Minimización de metadatos

Las rutas del canal MUST NOT almacenar analítica, grabaciones de sesión, IP o
identificadores de navegador por defecto.

#### Scenario: Acceso al formulario seguro

- **WHEN** una persona carga o envía el formulario
- **THEN** no se ejecutan trackers de terceros
- **AND** los logs específicos no conservan metadatos prohibidos

### Requirement: Publicación redactada y revisada

Un expediente MUST NOT publicarse directa o automáticamente.

#### Scenario: Caso marcado para interés público

- **WHEN** un receptor propone publicar información
- **THEN** crea una copia redactada separada del expediente
- **AND** una persona autorizada revisa privacidad, evidencia y riesgo antes de publicar

### Requirement: Límites del anonimato

El sistema MUST informar que un alias no garantiza anonimato de red o dispositivo.

#### Scenario: Persona inicia una denuncia

- **WHEN** abre el canal antes de escribir contenido
- **THEN** recibe una explicación clara de riesgos y prácticas de seguridad

