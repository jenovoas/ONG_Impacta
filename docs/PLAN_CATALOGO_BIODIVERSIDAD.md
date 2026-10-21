# Impacta+ — Plan del Catálogo de Biodiversidad

## Propósito

Convertir el módulo de especies en una base de conocimiento local, educativa y científicamente trazable sobre flora y fauna, conectada con las observaciones y misiones de las organizaciones.

La plataforma debe ayudar a responder tres preguntas:

1. ¿Qué especies existen en nuestro territorio?
2. ¿Qué sabemos sobre ellas y de dónde proviene ese conocimiento?
3. ¿Qué acciones concretas puede realizar la comunidad para protegerlas?

## Principio central

El catálogo científico y educativo es compartido. Las observaciones, misiones, responsables y datos operativos pertenecen a cada organización y respetan el aislamiento multi-tenant.

```text
Catálogo global
      ↓
Observaciones de una organización
      ↓
Misiones y acciones de conservación
      ↓
Educación, informes e impacto visible
```

## Fase 0 — Modelo de conocimiento

### Entidades conceptuales

#### Especie del catálogo

Registro canónico y compartido de una especie:

- Nombre común y nombre científico.
- Sinónimos.
- Reino, filo, clase, orden, familia, género y especie.
- Tipo: animal, vegetal, hongo u otro.
- Condición: nativa, endémica, introducida o invasora.
- Hábitat y distribución general.
- Estado de conservación, fuente y fecha de revisión.
- Descripción científica y descripción educativa.
- Imágenes, autoría y licencia.
- Estado editorial: `DRAFT`, `IN_REVIEW`, `PUBLISHED`, `OUTDATED`.

#### Fuente de conocimiento

Referencia que respalda una afirmación o ficha:

- Tipo: paper, libro, institución, base oficial, observación comunitaria u otra.
- Título, autores, año e institución.
- DOI o enlace original cuando exista.
- Licencia y permisos de uso.
- Fecha de consulta.

No se copiarán papers completos protegidos por derechos de autor. Se almacenarán metadatos, enlaces y resúmenes permitidos.

#### Observación de organización

Registro de campo perteneciente a una ONG:

- Especie relacionada.
- Fecha y responsable.
- Fotografías y notas.
- Ubicación aproximada o exacta según permisos.
- Misión relacionada.
- Estado: pendiente, revisada o validada.

#### Afirmación científica o educativa

Contenido que conecta una especie con una fuente. Esto permite saber qué información está respaldada, cuándo fue revisada y qué fuente la sostiene.

## Propiedad y privacidad

| Información | Alcance |
|---|---|
| Ficha de especie publicada | Global y educativa |
| Paper y referencia bibliográfica | Global |
| Observación de terreno | Organización propietaria |
| Misión de conservación | Organización propietaria |
| Ubicación sensible de especie amenazada | Privada o generalizada |
| Informe agregado de impacto | Publicable según permisos |

Las coordenadas exactas de especies vulnerables no se mostrarán públicamente por defecto.

## Roles editoriales propuestos

- `CATALOG_CURATOR`: crea y mantiene fichas.
- `SCIENTIFIC_REVIEWER`: revisa contenido y fuentes.
- `EDUCATION_EDITOR`: adapta contenido para la comunidad.
- `FIELD_CONTRIBUTOR`: registra observaciones.
- `PUBLIC_VIEWER`: consulta fichas publicadas.

Estos roles se implementarán después de validar el modelo con el sistema actual de roles.

El diseño definitivo no usará un único rol por usuario. Separará identidad,
participación, credenciales y permisos con alcance; además permitirá aportes de
personas que no pertenecen a una ONG mediante un colectivo territorial. Ver
`docs/MODELO_PERFILES_COMUNIDAD_CONOCIMIENTO.md` y el cambio OpenSpec
`comunidad-segura-asistente-ia`.

## Fuentes y calidad

Cada dato importante debe poder responder:

- ¿Quién lo agregó?
- ¿Cuándo fue agregado o revisado?
- ¿Qué fuente lo respalda?
- ¿Está publicado o todavía en revisión?
- ¿Puede haber cambiado?

Las fichas no deben presentar como certeza información que todavía está en revisión.

## Decisiones propuestas para revisar

### Territorio inicial

**Decisión aprobada:** el catálogo tendrá alcance para toda la Región del Biobío y comenzará con un piloto territorial en la comuna de Curanilahue.

El piloto considerará inicialmente:

- Cordillera de Nahuelbuta y remanentes de bosque nativo asociados.
- Río Curanilahue, humedal urbano y tributarios relevantes.
- Paisajes forestales, cuencas y sectores urbanos/periurbanos de la comuna.

Motivos:

- Curanilahue conecta bosque de Nahuelbuta, ríos, humedal urbano y paisaje forestal.
- Permite trabajar con flora, fauna, agua, restauración y educación comunitaria.
- Entrega un territorio concreto para validar el modelo.
- Evita intentar catalogar toda Chile antes de comprobar el flujo.

El modelo debe soportar más territorios desde el inicio, pero el primer contenido será local y acotado.

### Catálogo inicial

**Propuesta:** comenzar con 20–30 especies seleccionadas:

- Flora nativa.
- Aves de humedales y bosque.
- Mamíferos representativos.
- Anfibios o reptiles relevantes.
- Especies amenazadas o endémicas.
- Algunas especies invasoras importantes para educación ambiental.

La selección final debe ser revisada por una persona con conocimiento biológico local.

### Fuentes iniciales

**Propuesta de categorías:**

- Organismos públicos de biodiversidad y conservación.
- Bases taxonómicas reconocidas.
- Publicaciones académicas con DOI o enlace institucional.
- Universidades y centros de investigación regionales.
- Registros comunitarios claramente marcados como observaciones.

Cada fuente debe conservar su nombre, URL, autores, fecha y licencia o condición de uso.

## Roadmap completo

### Fase 0 — Modelo de conocimiento y alcance

**Objetivo:** aprobar el vocabulario, el territorio inicial, las fuentes y los límites de privacidad antes de modificar la base de datos.

**Entregables:**

- Este documento.
- Territorio inicial aprobado.
- Lista inicial de fuentes.
- Criterios de selección de especies.
- Reglas para datos sensibles.
- Definición de estados editoriales y roles.

**Criterio de salida:** producto, tecnología y responsable científico comprenden qué se va a construir y qué queda fuera.

### Fase 1 — Catálogo científico global

**Objetivo:** reemplazar el modelo mínimo actual de especies por un catálogo compartido, trazable y preparado para crecer.

**Backend y datos:**

- Crear entidad global de especie.
- Crear taxonomía y sinónimos.
- Crear estados de conservación.
- Crear fuentes y referencias.
- Crear relación entre especie y fuente.
- Crear estados editoriales.
- Mantener compatibilidad temporal con las especies actuales.
- Agregar índices para nombre común, científico y estado.

**Administración:**

- Crear y editar fichas.
- Subir imágenes con autoría y licencia.
- Buscar por nombre común o científico.
- Filtrar por tipo, estado y condición.
- Marcar fichas en revisión o desactualizadas.

**Criterios de aceptación:**

- Una especie puede existir sin pertenecer a una ONG específica.
- Toda ficha publicada tiene al menos una fuente o está explícitamente marcada como observación.
- Los usuarios de una organización no pueden editar el catálogo global sin permiso editorial.
- Las especies actuales no se pierden durante la migración.

### Fase 2 — Fichas educativas públicas

**Objetivo:** transformar el catálogo en una experiencia educativa para visitantes y comunidades.

**Contenido de la ficha:**

- Nombre común y científico.
- Imagen principal.
- Cómo reconocerla.
- Dónde vive.
- Qué necesita para sobrevivir.
- Amenazas principales.
- Estado de conservación.
- Qué puede hacer la comunidad.
- Fuentes y fecha de actualización.

**Experiencia:**

- Ruta pública para consultar especies publicadas.
- Diseño accesible y responsive.
- Búsqueda simple.
- Filtros educativos.
- Lenguaje claro, sin perder rigor.
- Separación visual entre información científica y recomendación educativa.

**Criterios de aceptación:**

- Una persona sin conocimientos técnicos entiende la ficha.
- Una persona especializada puede identificar las fuentes.
- No se muestran fichas en borrador al público.
- La ubicación sensible nunca aparece sin generalización.

### Fase 3 — Observaciones y trabajo de campo

**Objetivo:** conectar el catálogo con el trabajo real de cada ONG sin mezclar datos entre organizaciones.

**Funciones:**

- Registrar observación de una especie.
- Adjuntar fotografía y notas.
- Fecha, responsable y misión relacionada.
- Ubicación aproximada o exacta según permisos.
- Estado de revisión.
- Convertir una observación validada en evidencia de impacto.

**Modelo de propiedad:**

- La especie pertenece al catálogo global.
- La observación pertenece a una organización.
- La misión pertenece a una organización.
- Los informes públicos solo muestran datos autorizados o agregados.

**Criterios de aceptación:**

- Una ONG no puede leer observaciones privadas de otra.
- Una observación puede existir sin alterar la ficha científica.
- Una observación revisada conserva quién y cuándo la validó.
- El sistema protege coordenadas de especies sensibles.

### Fase 4 — Estudios, papers y evidencia

**Objetivo:** enriquecer las fichas con investigación académica sin infringir derechos de autor.

**Funciones:**

- Registrar paper o estudio.
- Guardar título, autores, año, revista, DOI y URL.
- Relacionar estudio con especies, regiones y amenazas.
- Guardar resumen permitido o redactado por el equipo.
- Registrar fecha de consulta.
- Marcar fuente como vigente o pendiente de revisión.

**Reglas:**

- No almacenar artículos completos protegidos.
- No presentar un resumen automático como validado sin revisión.
- Distinguir evidencia académica de observación comunitaria.
- Mostrar siempre el enlace a la fuente original.

**Criterios de aceptación:**

- Una ficha puede mostrar sus estudios relacionados.
- Cada estudio tiene referencia verificable.
- Las afirmaciones importantes pueden vincularse a una fuente.
- El usuario entiende qué información es evidencia y qué información es interpretación educativa.

### Fase 5 — Revisión científica y colaboración

**Objetivo:** permitir que el catálogo crezca con control de calidad.

**Funciones:**

- Bandeja de revisión.
- Comentarios internos.
- Historial de cambios.
- Aprobación o devolución de fichas.
- Revisión por fecha.
- Alertas para contenido desactualizado.
- Registro de autor y revisor.

**Roles:**

- Curador de catálogo.
- Revisor científico.
- Editor educativo.
- Colaborador de terreno.
- Administrador de organización.

**Criterios de aceptación:**

- Una ficha publicada tiene historial.
- Un colaborador no puede publicar directamente contenido científico sin revisión.
- Es posible saber quién modificó una afirmación.
- El sistema puede marcar contenido pendiente sin ocultar el trabajo interno.

### Fase 6 — Mapas, relaciones e informes

**Objetivo:** convertir la información acumulada en herramientas para decisiones, educación y rendición de cuentas.

**Funciones futuras:**

- Mapa general de distribución.
- Mapa de observaciones autorizado.
- Capas de amenazas y hábitat.
- Relación entre especie, misión y campaña.
- Informes para donantes y comunidades.
- Exportación de datos.
- Indicadores de restauración.

**Protección:**

- Generalizar ubicaciones de especies vulnerables.
- Aplicar permisos por capa.
- Registrar quién consulta datos sensibles.
- Evitar que un mapa revele una localización exacta por combinación de filtros.

## Orden técnico recomendado

1. Validar territorio, fuentes y especies iniciales.
2. Diseñar el modelo Prisma en una base de datos de prueba.
3. Ejecutar migración canario contra una DB scratch.
4. Crear API del catálogo global.
5. Migrar especies actuales sin borrarlas.
6. Crear administración interna.
7. Crear fichas públicas.
8. Agregar observaciones por organización.
9. Agregar estudios y referencias.
10. Agregar revisión, mapas e informes.

No se debe empezar por mapas ni por ingestión automática de papers: dependen de un modelo estable y de reglas de calidad. El asistente de IA también queda después de la gobernanza, los permisos y las fuentes; su plan está en `docs/PLAN_ASISTENTE_IA_IMPACTA.md`.

## Riesgos principales

| Riesgo | Mitigación |
|---|---|
| Datos taxonómicos inconsistentes | Fuentes, sinónimos y revisión editorial |
| Copia indebida de papers | Guardar metadatos, enlaces y resúmenes permitidos |
| Exposición de especies vulnerables | Generalización de coordenadas y permisos |
| Mezcla de datos entre ONG | Catálogo global separado de observaciones tenant |
| Catálogo demasiado grande al inicio | Piloto de 20–30 especies locales |
| Contenido educativo incorrecto | Revisión y fecha de actualización |
| Modelo difícil de migrar | Migración canario en DB scratch antes de producción |

## Criterios de aceptación de la Fase 0

- [x] Se distingue catálogo global de datos por organización.
- [x] Se define una entidad para fuentes y referencias.
- [x] Se define un flujo editorial básico.
- [x] Se contemplan licencias y derechos de autor.
- [x] Se contemplan ubicaciones sensibles.
- [ ] Validar el modelo con el responsable del producto.
- [x] Elegir el territorio inicial: Región del Biobío, piloto Curanilahue.
- [ ] Definir las primeras fuentes institucionales y académicas.

La Fase 1 no comienza hasta resolver los puntos pendientes de validación.
