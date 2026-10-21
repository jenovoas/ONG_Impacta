# Design: Catálogo global de biodiversidad y educación científica

## Context

El modelo actual de `Species` está ligado a `organizationId` y contiene pocos campos. Ese modelo sirve para una biblioteca interna, pero no para una fuente de conocimiento compartida entre organizaciones ni para fichas educativas públicas.

El diseño debe preservar el aislamiento multi-tenant de las operaciones, permitir fuentes verificables y evitar que la publicación de contenido científico dependa de una ONG específica.

El alcance territorial aprobado es la Región del Biobío. Curanilahue será el piloto para validar taxonomía, fuentes, contenido educativo, observaciones y privacidad geográfica antes de ampliar el catálogo regional.

## Goals / Non-Goals

**Goals:**

- Separar catálogo global, fuentes, afirmaciones, observaciones y misiones.
- Permitir contenido científico y educativo con estados de revisión.
- Mantener trazabilidad de autor, fecha, fuente y licencia.
- Mantener compatibilidad con las especies existentes durante la migración.
- Diseñar desde el inicio para privacidad de ubicaciones sensibles.
- Integrarse con sistemas científicos y oficiales sin sustituirlos ni duplicar
  innecesariamente sus datos.

**Non-Goals:**

- Ingesta automática sin revisión humana.
- Resolver taxonomía mundial de forma completa en la primera versión.
- Sustituir bases científicas oficiales.
- Crear una red social taxonómica paralela a iNaturalist o una nueva autoridad
  de datos equivalente a SIMBIO/SBAP o GBIF.

## Decisions

### Modelo lógico

- `CatalogSpecies`: registro global canónico de la especie.
- `TaxonName`: nombre científico, nombre común o sinónimo asociado.
- `KnowledgeSource`: fuente institucional, académica, bibliográfica o comunitaria.
- `SpeciesClaim`: afirmación científica o educativa vinculada a una especie y fuente.
- `SpeciesMedia`: imagen u otro recurso con autoría y licencia.
- `OrganizationObservation`: observación de terreno propiedad de una organización.
- `SpeciesOrganizationLink`: relación opcional entre una ONG y una especie que monitorea o trabaja.

La entidad global no tendrá `organizationId`. Las observaciones, enlaces operativos y misiones sí lo tendrán.

### Publicación

El catálogo usará estados `DRAFT`, `IN_REVIEW`, `PUBLISHED` y `OUTDATED`. Solo `PUBLISHED` será visible en la consulta pública. Cada cambio publicado debe conservar autor y fecha de revisión.

### Fuentes académicas

Se almacenarán título, autores, año, revista o institución, DOI, URL, licencia, resumen permitido y fecha de consulta. La plataforma mostrará el enlace original y distinguirá evidencia académica de interpretación educativa.

### Interoperabilidad y colaboración

Impacta+ aplicará el principio **enlace antes que copia**. Cada registro externo
conservará sistema de origen, identificador canónico, URL, licencia, fecha de
consulta y estado de revisión. Los conectores podrán descubrir candidatos, pero
no publicarán ni sobrescribirán afirmaciones científicas automáticamente.

Los mecanismos iniciales serán REST, OAI-PMH, DOI y Darwin Core para integrar,
según disponibilidad y permisos, GBIF, OBIS, iNaturalist, Crossref, DataCite,
OpenAlex y repositorios académicos DSpace/OJS. SIMBIO/SBAP seguirá siendo la
referencia oficial chilena y se integrará únicamente mediante servicios
documentados o acuerdos institucionales.

La plataforma debe poder devolver datos autorizados mediante Darwin Core
Archive, CSV o GeoJSON. La publicación externa requerirá revisión humana,
licencia explícita y una institución publicadora acordada.

El mapeo inicial de instituciones, herramientas y estrategia de acercamiento se
documenta en `docs/MAPA_ECOSISTEMA_CIENTIFICO_BIOBIO.md`.

### Privacidad geográfica

Las observaciones conservarán precisión interna según permisos. La salida pública podrá devolver una geometría generalizada, región o cuadrícula aproximada. La precisión exacta nunca será pública por defecto para especies sensibles.

### Participación comunitaria

Los aportes de personas que no pertenecen a una ONG se representarán como
`CommunitySubmission` dentro de un colectivo territorial. No se creará una
organización ficticia ni se convertirá el aporte automáticamente en
`OrganizationObservation`.

Identidad, participaciones, experiencia profesional y permisos editoriales se
mantendrán separados. El modelo completo está en
`docs/MODELO_PERFILES_COMUNIDAD_CONOCIMIENTO.md` y su implementación se planifica
en el cambio OpenSpec `comunidad-segura-asistente-ia`.

### Migración

1. Crear tablas nuevas sin eliminar `Species`.
2. Importar cada especie actual a `CatalogSpecies` con estado `DRAFT` o `IN_REVIEW`.
3. Crear relaciones de compatibilidad para pantallas existentes.
4. Validar datos en una DB scratch.
5. Migrar producción solo después de revisar conteos y aislamiento.

## Data flow

```text
Fuente / curador
       ↓
CatalogSpecies + SpeciesClaim
       ↓ publicación revisada
Ficha educativa pública

ONG / voluntario
       ↓
OrganizationObservation
       ↓ validación y permisos
Misión, informe e impacto agregado

Comunidad territorial
       ↓
CommunitySubmission
       ↓ revisión y consentimiento
Catálogo o contenido educativo
```

## Risks / Trade-offs

- **Complejidad:** separar catálogo y observaciones aumenta modelos, pero evita mezclar conocimiento global con datos tenant.
- **Calidad:** fuentes no garantizan que una afirmación esté actualizada; se requiere `reviewedAt` y estado editorial.
- **Privacidad:** mapas útiles pueden revelar especies vulnerables; se prioriza protección sobre precisión pública.
- **Derechos:** los papers no se pueden replicar libremente; se almacenan referencias y resúmenes permitidos.
- **Escala:** el piloto inicial debe limitarse a 20–30 especies del territorio aprobado.
- **Duplicación institucional:** importar información sin coordinación puede
  crear otra base aislada; se priorizan identificadores, enlaces, estándares y
  retorno de datos.
- **Cambios externos:** APIs y taxonomías evolucionan; los conectores serán
  versionados y cualquier cambio generará una propuesta revisable.
