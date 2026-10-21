# Catalogo de biodiversidad Specification

## Purpose

Definir un catálogo global, educativo y trazable de especies, separado de las observaciones y operaciones privadas de cada organización.

## ADDED Requirements

### Requirement: Catálogo global de especies

El sistema MUST permitir registrar una especie sin asociarla a una organización específica.

#### Scenario: Crear una especie global

- **WHEN** un curador autorizado crea una especie con nombre científico, nombre común, tipo y condición
- **THEN** el sistema crea un registro global con estado editorial `DRAFT`
- **AND** el registro queda disponible para revisión, pero no para consulta pública

### Requirement: Fuentes trazables

Cada afirmación científica o educativa publicada MUST tener una fuente o estar marcada explícitamente como observación comunitaria.

#### Scenario: Publicar una afirmación respaldada

- **WHEN** un revisor publica una afirmación relacionada con una especie
- **THEN** el sistema exige una fuente con autor o institución, fecha y URL o DOI cuando corresponda
- **AND** la ficha muestra la referencia y su fecha de revisión

### Requirement: Estados editoriales

El catálogo MUST controlar el ciclo `DRAFT`, `IN_REVIEW`, `PUBLISHED` y `OUTDATED`.

#### Scenario: Consulta pública

- **WHEN** una persona consulta el catálogo público
- **THEN** el sistema devuelve solo especies `PUBLISHED`
- **AND** nunca expone borradores ni comentarios internos

### Requirement: Aislamiento de observaciones

Las observaciones MUST pertenecer a una organización y MUST filtrarse por `organizationId`.

#### Scenario: Dos organizaciones observan la misma especie

- **WHEN** la organización A y la organización B registran observaciones de la misma especie
- **THEN** ambas observaciones pueden referenciar la misma ficha global
- **AND** cada organización solo puede consultar y editar sus propias observaciones

### Requirement: Protección de ubicaciones sensibles

El sistema MUST impedir que las coordenadas exactas de especies sensibles se publiquen por defecto.

#### Scenario: Consulta pública de observación sensible

- **WHEN** una persona sin permiso consulta una observación sensible
- **THEN** el sistema devuelve una región o geometría generalizada
- **AND** reserva la coordenada exacta para usuarios autorizados

### Requirement: Referencias académicas legales

El sistema MUST almacenar referencias a papers sin replicar artículos completos protegidos.

#### Scenario: Asociar paper a una especie

- **WHEN** un editor agrega un estudio con título, autores, año, DOI o URL
- **THEN** el estudio queda asociado a la especie y visible como referencia
- **AND** la ficha enlaza a la fuente original

### Requirement: Procedencia de registros externos

Todo dato descubierto o importado desde otro sistema MUST conservar su sistema
de origen, identificador original, URL, licencia y fecha de consulta.

#### Scenario: Importar una ocurrencia publicada en GBIF

- **WHEN** un conector recupera una ocurrencia asociada a una especie del catálogo
- **THEN** el sistema conserva `datasetKey`, `occurrenceID`, licencia y enlace original
- **AND** la ocurrencia entra como candidata a revisión
- **AND** no se convierte automáticamente en una observación propiedad de una ONG

### Requirement: Sistemas externos no sobrescribibles

Una sincronización externa MUST NOT modificar directamente una afirmación
publicada ni presentarse como autora de un registro perteneciente a otra
institución.

#### Scenario: Una fuente externa cambia

- **WHEN** la sincronización detecta que cambió la taxonomía o el estado de una fuente
- **THEN** el sistema crea una propuesta de actualización con el cambio detectado
- **AND** conserva el valor publicado hasta que una persona autorizada revise la propuesta

### Requirement: Retorno interoperable de datos

El sistema MUST permitir exportar observaciones autorizadas con procedencia,
licencia y privacidad en un formato interoperable.

#### Scenario: Preparar datos para una institución científica

- **WHEN** una organización selecciona observaciones validadas para compartir
- **THEN** el sistema genera una exportación Darwin Core, CSV o GeoJSON según el destino
- **AND** excluye o generaliza coordenadas sensibles
- **AND** no publica externamente sin aprobación y una institución publicadora definida
