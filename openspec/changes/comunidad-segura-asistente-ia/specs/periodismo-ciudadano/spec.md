# Periodismo ciudadano Specification

## Purpose

Definir reportes protegidos conectados con periodistas profesionales,
verificación trazable y publicación humana de interés público.

## ADDED Requirements

### Requirement: Perfil ciudadano sin credencial profesional

El sistema MUST permitir reportar como periodista ciudadano sin presentar una
credencial profesional y MUST distinguir ese perfil de un periodista verificado.

#### Scenario: Persona inicia un reporte

- **WHEN** elige participar como periodista ciudadano
- **THEN** puede usar cuenta, alias o acceso sin cuenta
- **AND** no obtiene acceso a otros casos ni publicación directa

### Requirement: Experiencia simple y asistida

El flujo MUST presentar una decisión principal por paso y explicar riesgos antes
de solicitar contenido sensible.

#### Scenario: Persona no experta reporta un hecho

- **WHEN** abre el flujo protegido
- **THEN** recibe opciones claras de identidad, evidencia y destino
- **AND** puede guardar, salir o pedir ayuda sin completar campos innecesarios

### Requirement: Asignación mínima a periodistas

Un periodista verificado MUST acceder únicamente a casos expresamente asignados
y al material necesario para investigarlos.

#### Scenario: Periodista busca reportes no asignados

- **WHEN** intenta enumerar o abrir otro expediente
- **THEN** el sistema deniega existencia, contenido e identidad de fuente

### Requirement: Identidad separada de investigación

La identidad reservada de una fuente MUST almacenarse y autorizarse por separado
del expediente de investigación.

#### Scenario: Periodista investiga con fuente anónima

- **WHEN** recibe la asignación
- **THEN** puede comunicarse mediante una casilla protegida
- **AND** no obtiene la identidad ni metadatos que la revelen

### Requirement: IA local sin autoridad editorial

El contenido sensible del caso MUST NOT enviarse a un proveedor externo. Qwen
local MAY ayudar a investigar, pero MUST NOT decidir credibilidad ni publicar.

#### Scenario: Periodista solicita una línea de tiempo

- **WHEN** Qwen local procesa un expediente autorizado
- **THEN** separa hechos, afirmaciones, inferencias y vacíos con referencias
- **AND** conserva el resultado como borrador revisable

### Requirement: Publicación revisada

Un reporte protegido MUST NOT convertirse directamente en contenido público.

#### Scenario: Investigación lista para publicar

- **WHEN** el periodista termina un borrador
- **THEN** una revisión humana evalúa evidencia, fuente, PII, riesgo y derecho de respuesta
- **AND** publica desde una copia redactada separada si se aprueba
- **AND** mantiene un mecanismo visible de corrección

### Requirement: Promesa de seguridad honesta

La interfaz MUST explicar las protecciones y límites y MUST NOT afirmar que el
sistema es inhackeable o elimina todo riesgo de represalias.

#### Scenario: Persona evalúa denunciar

- **WHEN** consulta cómo se protege su información
- **THEN** conoce cifrado, minimización, destinatarios y riesgos residuales
- **AND** recibe pautas y derivación humana cuando el riesgo sea alto

