# Runtime Sentinel Specification

## Purpose

Definir la ejecución de Impacta+ sobre hosts administrados por Sentinel sin
mezclar responsabilidades ni exponer contenido privado.

## ADDED Requirements

### Requirement: Nodo Sentinel obligatorio

Toda instancia productiva de Impacta+ MUST ejecutarse en un nodo que cumpla un
perfil Sentinel versionado.

#### Scenario: Nodo no conforme

- **WHEN** una verificación requerida de Sentinel falla
- **THEN** el nodo queda `NON_COMPLIANT` o `DEGRADED` según la política
- **AND** no inicia Qwen local ni procesamiento clasificado como sensible

### Requirement: Separación de responsabilidades

Sentinel MUST NOT conceder permisos de negocio e Impacta+ MUST NOT administrar
el ciclo de vida de Sentinel durante un deploy normal.

#### Scenario: Señal host indica usuario confiable

- **WHEN** Sentinel emite una señal positiva sobre un proceso o cuenta
- **THEN** Impacta+ conserva sus verificaciones de identidad, tenant y rol
- **AND** la señal no amplía autorización

### Requirement: Telemetría minimizada

Los eventos enviados a Sentinel MUST NOT contener prompts, respuestas, mensajes,
adjuntos, PII, denuncias ni coordenadas sensibles.

#### Scenario: Falla del asistente con contenido privado

- **WHEN** Impacta+ emite un evento operativo
- **THEN** envía categoría, rule IDs, digest opaco y buckets
- **AND** omite contenido y parámetros originales

### Requirement: Señales de host no confiables

Todo dato recibido desde Cortex o telemetría MUST pasar por esquema y defensa de
ingreso antes de afectar a Impacta+ o a un modelo.

#### Scenario: Evento contiene instrucciones

- **WHEN** una señal intenta introducir texto de control o prompt injection
- **THEN** el sistema la bloquea o pone en cuarentena
- **AND** nunca la ejecuta ni concatena directamente al contexto de IA

### Requirement: Degradación segura

La plataforma MUST mantener un modo degradado que preserve funciones seguras sin
relajar permisos.

#### Scenario: Cortex no disponible

- **WHEN** el adaptador supera su umbral de fallas
- **THEN** desactiva herramientas IA privilegiadas y alerta
- **AND** mantiene landing, búsqueda pública y derivación humana cuando sea seguro

### Requirement: Inferencia local aislada

Qwen local MUST ejecutarse sin privilegios y MUST ser accesible solo mediante el
backend o red privada autorizada.

#### Scenario: Navegador intenta llamar a Qwen

- **WHEN** un cliente intenta acceder directamente al runtime de inferencia
- **THEN** no existe una ruta pública hacia ese servicio
- **AND** toda solicitud válida pasa por permisos y defensas de Impacta+

