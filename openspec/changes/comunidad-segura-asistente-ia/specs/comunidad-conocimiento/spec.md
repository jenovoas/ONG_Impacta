# Comunidad y conocimiento Specification

## Purpose

Definir identidad, participaciones, experiencia y aportes comunales con permisos
acotados y trazabilidad.

## ADDED Requirements

### Requirement: Perfiles múltiples

El sistema MUST permitir que una cuenta tenga múltiples participaciones y áreas
de experiencia simultáneas.

#### Scenario: Profesional que también es voluntaria

- **WHEN** una persona participa como voluntaria en un colectivo y acredita una especialidad profesional
- **THEN** el sistema conserva ambas relaciones por separado
- **AND** ninguna relación reemplaza ni eleva automáticamente a la otra

### Requirement: Permisos con alcance

Cada permiso editorial u operativo MUST indicar rol, alcance, otorgante y vigencia.

#### Scenario: Revisión científica acotada

- **WHEN** se asigna a una persona revisión científica de flora en Arauco
- **THEN** puede revisar únicamente contenido dentro de ese alcance
- **AND** no puede publicar ni revisar otras disciplinas por esa asignación

### Requirement: Credencial no equivale a permiso

Una credencial profesional verificada MUST NOT conceder publicación automática.

#### Scenario: Agrónomo verificado propone una afirmación

- **WHEN** la persona crea un aporte científico
- **THEN** el aporte entra al flujo de revisión correspondiente
- **AND** requiere una asignación editorial separada para aprobar o publicar

### Requirement: Procedencia y consentimiento comunitario

Todo aporte comunitario MUST conservar procedencia, alcance territorial y
consentimiento de uso.

#### Scenario: Conocimiento local con restricción pública

- **WHEN** una persona comparte conocimiento para uso interno pero no publicación
- **THEN** el sistema permite revisarlo dentro del colectivo autorizado
- **AND** impide mostrarlo públicamente o transferirlo a una institución

