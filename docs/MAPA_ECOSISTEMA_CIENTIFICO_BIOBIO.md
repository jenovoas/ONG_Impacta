# Mapa del ecosistema científico y tecnológico ambiental del Biobío

## Propósito

Este documento identifica instituciones, equipos, repositorios y plataformas con
las que Impacta+ podría colaborar para biodiversidad, restauración, agua,
educación ambiental y ciencia ciudadana en la Región del Biobío. Curanilahue es
el territorio piloto.

La decisión de producto es explícita: **Impacta+ no pretende sustituir las
plataformas científicas, colecciones ni sistemas oficiales existentes**. Su rol
será conectar el trabajo cotidiano de las ONG y comunidades con esas fuentes,
conservar la procedencia de cada dato y facilitar que la evidencia validada pueda
volver a las redes científicas correspondientes.

## Hallazgo principal

La región tiene capacidades científicas y tecnológicas importantes, pero están
distribuidas entre sistemas con propósitos distintos:

- Las universidades producen estudios, colecciones, metodologías y educación.
- Los organismos públicos mantienen información oficial y monitoreo nacional.
- Las redes globales agregan ocurrencias y metadatos normalizados.
- Las aplicaciones ciudadanas capturan observaciones.
- Las plataformas comerciales apoyan monitoreo, cumplimiento o análisis.
- Las ONG necesitan socios, voluntariado, campañas, misiones y evidencia de
  impacto.

No se encontró, durante esta revisión, una plataforma regional que conecte todas
esas funciones. Esto es una **inferencia del mapeo disponible**, no significa que
las instituciones no colaboren ni que no existan iniciativas internas aún no
publicadas.

## Actores científicos y académicos prioritarios

| Actor | Capacidades relevantes | Activos o plataformas | Integración inicial posible | Prioridad |
|---|---|---|---|---|
| Centro EULA-Chile, UdeC | Biodiversidad acuática, peces nativos, calidad de agua, bioindicadores, restauración y trabajo socioambiental | Laboratorios, publicaciones, estudios y monitoreo; LEC-PAD | Metadatos desde repositorios; convenio para protocolos, datos autorizados y revisión experta | Muy alta |
| Herbario CONC y Museo de Zoología UdeC | Colecciones de referencia, identificación taxonómica, especímenes y educación | Colecciones científicas; parte de sus datos aparece en GBIF | GBIF/Darwin Core para registros publicados; enlace a ejemplares; colaboración curatorial | Muy alta |
| Laboratorio de Invasiones Biológicas, UdeC–IEB | Especies exóticas e invasoras, riesgo, monitoreo y divulgación | Base Invasoras Chile, app Invasoras CL, datasets en GBIF | Consumir datasets publicados; conversar antes de intercambiar observaciones o integrar la app | Muy alta |
| Laboratorio de Ecología del Paisaje, UdeC | Conservación, restauración, modelación espacial y planificación ecológica | Estudios, cartografía y metodologías | Metadatos y enlaces ahora; capas SIG mediante acuerdo y licencia | Muy alta |
| CICAT UdeC | Comunicación pública de la ciencia y experiencias educativas | Exposiciones y programas de educación; trabajo previo en Curanilahue | Co-diseño de fichas, actividades escolares y recursos educativos | Muy alta |
| Centro IRIS, UdeC | Ríos, invasiones y biodiversidad de agua dulce | Centro nacional adjudicado en 2025 e iniciado públicamente en 2026 | Relación temprana para estándares, agenda de investigación y pilotos | Alta/estratégica |
| CRHIAM, UdeC | Seguridad hídrica, calidad de agua, servicios ecosistémicos y gobernanza | Biblioteca virtual, papers, libros, policy briefs y formación | Descubrimiento bibliográfico; colaboración en indicadores de cuenca y educación hídrica | Alta |
| Campus Naturaleza UdeC | Conservación y restauración in situ/ex situ, biodiversidad y educación biocultural | Sitio demostrativo, investigación y vinculación | Reutilizar metodologías y colaborar en contenidos de restauración | Alta |
| CIBAS, UCSC | Sistemas costeros, acuáticos y terrestres, contaminación, hidrología y resiliencia | Investigación, protocolos y oferta tecnológica | Metadatos bibliográficos; convenios para protocolos y revisión científica | Alta |
| Universidad del Bío-Bío | Producción académica regional, revistas y tesis | Repositorio Ciencia Abierta y portal OJS de revistas | Cosecha de metadatos mediante DSpace/OAI-PMH y DOI; identificar equipos por tema | Media |
| Centro de Biotecnología UdeC | Microbiología ambiental, biotecnología y divulgación | Laboratorios y proyectos educativos | Colaboración en agua, contaminación y contenido educativo especializado | Media |

### Evidencia territorial directa en Curanilahue

La relación no tendría que comenzar desde cero:

- EULA/UdeC desarrolló durante dos años el proyecto **“Revaloriza el(tú)
  entorno”** sobre residuos, diagnóstico participativo y educación ambiental en
  Curanilahue:
  <https://noticias.udec.cl/revaloriza-eltu-entorno-cierra-su-ciclo-en-curanilahue-con-llamado-a-fortalecer-la-educacion-ambiental/>
- El Herbario CONC y el Museo de Zoología UdeC realizaron una muestra educativa
  en Curanilahue y mantienen colecciones científicas de referencia:
  <https://noticias.udec.cl/colecciones-cientificas-del-herbario-y-museo-de-zoologia-visitan-curanilahue-en-el-dia-de-los-patrimonios/>
- El repositorio UdeC contiene material biológico recolectado en Trongol Alto,
  Curanilahue, incluyendo ejemplares depositados en la colección CONC-F:
  <https://repositorio.udec.cl/server/api/core/bitstreams/d6e8a9b7-2d35-48c4-8eae-9e783a5d2b7c/content>
- CICAT llevó a Curanilahue una experiencia educativa sobre restauración y
  conservación ecológica:
  <https://noticias.udec.cl/dale-una-vuelta-la-exposicion-del-cicat-que-inspira-la-restauracion-ecologica/>
- El Centro de Biotecnología UdeC desarrolló divulgación de microbiología
  ambiental en una escuela de Curanilahue:
  <https://www.centrodebiotecnologia.udec.cl/blogs/noticias/dra-katherine-sossa-realiza-charla-y-taller-cientifico-en-escuela-de-curanilahue>

Estos antecedentes hacen de UdeC el primer nodo institucional recomendado para
el piloto, especialmente EULA, Herbario/Museo, CICAT, LEP y LIB.

## Plataformas existentes y relación con Impacta+

### Sistemas públicos y redes de datos

| Plataforma | Qué resuelve | Qué debe hacer Impacta+ | Qué no debe hacer |
|---|---|---|---|
| SIMBIO / futura operación SBAP | Información oficial sobre especies, ecosistemas, áreas y políticas de biodiversidad | Enlazar la ficha oficial, conservar fecha de consulta y sincronizar metadatos cuando exista un servicio documentado | Declararse fuente oficial o sobrescribir estados oficiales |
| GBIF Chile / GBIF global | Agregación mundial de ocurrencias y datasets con estándares de biodiversidad | Consultar taxonomía y ocurrencias vía API; preparar exportaciones Darwin Core; citar dataset y descarga | Copiar datos sin licencia, cita o identificador persistente |
| SIMEF | Monitoreo de ecosistemas forestales nativos y monitoreo participativo | Enlazar proyectos y capas descargables; alinear el piloto con su protocolo ciudadano | Crear otro protocolo forestal incompatible |
| iNaturalist Chile | Observaciones comunitarias, identificación y proyectos de ciencia ciudadana | Crear o vincular proyectos territoriales; consumir la API respetando licencias y geoprivacidad | Construir una red social taxonómica paralela o copiar imágenes sin permiso |
| OBIS | Ocurrencias marinas estandarizadas | Consumir API para el componente costero de la región y conservar `datasetID`/`occurrenceID` | Tratar registros marinos como evidencia terrestre local |
| Repositorios DSpace y revistas OJS | Tesis, publicaciones y documentos institucionales | Cosechar solo metadatos mediante REST/OAI-PMH; resolver DOI y enlazar al original | Almacenar copias completas sin licencia |

SIMBIO informa que, desde el 2 de febrero de 2026, el SBAP es responsable de los
datos oficiales de biodiversidad y que SIMBIO mantendrá interoperabilidad y una
sincronización gradual. Esto obliga a diseñar conectores reemplazables, no a
acoplar el catálogo a la interfaz web actual:
<https://simbio.mma.gob.cl/Especies>.

### Herramientas chilenas relacionadas

| Herramienta | Coincidencia con Impacta+ | Relación recomendada |
|---|---|---|
| Invasoras CL / Invasoras Chile | Registro, revisión y educación sobre especies invasoras | Aliado especializado; enlazar y acordar intercambio, no duplicar su base |
| Nviro Capture / Monitor / Report | Captura, análisis y monitoreo profesional de biodiversidad | Posible proveedor o integración para proyectos que requieran análisis especializado |
| Fotomonitoreo SNASPE | Red colaborativa de cámaras trampa | Referenciar metodología y explorar interoperabilidad para fotomonitoreo |
| DondeLaViste? / WWF Chile | Avistamientos de fauna y validadores expertos | Enlace y colaboración; sus FAQ indican que los datos para investigación se solicitan a WWF |
| BiodiversiUp | Crowdfunding ambiental, implementación comunitaria y evidencia | Posible aliado en campañas; evitar replicar su mercado de soluciones basadas en naturaleza |
| CAPCA | Geovisor y gestión de iniciativas territoriales | Posible intercambio de capas y proyectos; Impacta+ conserva foco ONG y biodiversidad educativa |
| MIMAsoft, SIGEA, SIMCII y Tero | Gestión corporativa, cumplimiento, indicadores o pronósticos ambientales | Referentes o integraciones B2B futuras; no son prioridad para el piloto comunitario |

### Referentes internacionales

- **SMART Conservation Software:** gestión de áreas de conservación, terreno y
  patrullaje; es gratuito y de código abierto.
  <https://smartconservationtools.org/en-us/SMART-Approach/Technology>
- **EarthRanger:** operación de conservación en tiempo real, trabajo offline,
  sensores, mapas y más de cien integraciones.
  <https://www.earthranger.com/>
- **Miradi:** planificación y gestión adaptativa basada en los Conservation
  Standards; conecta amenazas, acciones, presupuesto, monitoreo y resultados.
  <https://www.miradishare.org/>
- **Wildbook:** investigación de fauna, identificación individual asistida por
  imágenes y colaboración científica.
  <https://lynx.wildbook.org/overview.jsp>

Impacta+ no necesita clonar estas herramientas. Debe adoptar sus buenas ideas y
estándares, y permitir exportar o enlazar datos cuando una ONG llegue a necesitar
una solución especializada.

## Posicionamiento propuesto para Impacta+

Impacta+ será el **sistema operativo comunitario de la organización**, no la
autoridad científica universal:

```text
ONG y comunidad
  socios · voluntariado · donaciones · campañas · misiones · educación
                              │
                              ▼
                         Impacta+
       coordinación territorial · trazabilidad · traducción educativa
             │                  │                  │
             ▼                  ▼                  ▼
     universidades       redes de datos      sistemas oficiales
   revisión y estudios   GBIF/iNaturalist     SIMBIO/SBAP/SIMEF
```

Su valor diferencial está en cerrar el ciclo que hoy suele quedar separado:

1. Una fuente científica respalda una afirmación.
2. Impacta+ la transforma en contenido educativo revisado.
3. Una ONG organiza una misión de terreno relacionada.
4. La comunidad registra observaciones con consentimiento y procedencia.
5. Una persona experta valida o corrige.
6. Los datos autorizados se exportan a una red científica interoperable.
7. El resultado vuelve a la comunidad como aprendizaje e impacto verificable.

## Arquitectura de interoperabilidad propuesta

### Principio: enlace antes que copia

Cada registro externo debe conservar:

- Sistema y organización de origen.
- Identificador original y URL canónica.
- Tipo y versión del esquema recibido.
- Licencia, atribución y restricciones.
- Fecha de consulta o sincronización.
- Huella del contenido para detectar cambios.
- Estado de revisión dentro de Impacta+.

### Identificadores que deben ser de primera clase

- DOI para publicaciones.
- ORCID para autores cuando esté disponible.
- ROR/OpenAlex ID para instituciones.
- GBIF `taxonKey`, `datasetKey`, `occurrenceID` y claves de descarga.
- Identificadores iNaturalist de taxón, proyecto y observación.
- `scientificNameID`, `catalogNumber` e `institutionCode` de Darwin Core.
- UUID o handle del repositorio institucional.

### Niveles de integración

1. **Enlace curado:** registro manual de metadatos y URL; no copia contenido.
2. **Descubrimiento:** consulta periódica a OpenAlex, Crossref, DataCite,
   DSpace/OAI-PMH, GBIF, OBIS o iNaturalist.
3. **Importación revisable:** los resultados entran como candidatos, nunca como
   contenido publicado automáticamente.
4. **Cuenta o proyecto conectado:** OAuth o token cuando la plataforma lo
   soporte y la organización lo autorice.
5. **Publicación de retorno:** exportación Darwin Core Archive, CSV o GeoJSON;
   publicación en la red externa solo mediante acuerdo y revisión.

### Conectores técnicamente viables

| Sistema | Mecanismo | Uso en Impacta+ |
|---|---|---|
| GBIF | REST API y descargas Darwin Core | Taxonomía, ocurrencias, datasets y procedencia |
| OBIS | REST API y GeoJSON | Biodiversidad marina y costera |
| iNaturalist | REST API, OAuth2 y proyectos | Observaciones y ciencia ciudadana territorial |
| Crossref | REST API pública | Validación y enriquecimiento de DOI |
| DataCite | REST API pública/OAI-PMH | Datasets y otros resultados de investigación |
| OpenAlex | REST API por obra, autor e institución | Descubrimiento continuo de investigación regional |
| DSpace 7+ | REST API; OAI-PMH cuando esté expuesto | Tesis y documentos institucionales |
| OJS | OAI-PMH y DOI según configuración | Artículos de revistas universitarias |

Los endpoints concretos de cada institución deben verificarse antes de programar
un conector. Que una institución use DSpace u OJS no garantiza que todas sus
interfaces estén habilitadas o mantengan la misma versión.

## Modelo mínimo adicional

Además de `KnowledgeSource`, la implementación debería contemplar:

- `ExternalSystem`: plataforma, institución, base URL y política de uso.
- `ExternalRecord`: identificador, URL, esquema, licencia y estado de enlace.
- `IngestionRun`: ejecución, parámetros, fechas, conteos y errores.
- `FieldMapping`: correspondencia versionada entre esquema externo e Impacta+.
- `ReviewDecision`: aceptación, rechazo o corrección de un dato importado.
- `DataSharingAgreement`: alcance y vigencia de un convenio cuando exista.

Una sincronización nunca debe editar directamente una afirmación publicada. Si
la fuente cambia, se crea una propuesta de actualización para revisión humana.

## Secuencia recomendada

### Etapa A — prueba técnica sin convenios

1. Resolver DOI con Crossref/DataCite.
2. Descubrir publicaciones regionales con OpenAlex.
3. Consultar ocurrencias publicadas en GBIF e iNaturalist para Curanilahue.
4. Probar cosecha de metadatos en repositorios UdeC y UBB.
5. Guardar únicamente metadatos, licencias, identificadores y enlaces.

### Etapa B — mesa de colaboración territorial

Contactar, en este orden:

1. EULA/UdeC, aprovechando su trabajo previo con residuos en Curanilahue.
2. Herbario CONC y Museo de Zoología UdeC.
3. CICAT para el componente educativo.
4. LIB/IEB para invasoras y estándares de observación.
5. LEP e IRIS para restauración, territorio y agua dulce.
6. CIBAS/UCSC y CRHIAM para ampliar revisión y agua.
7. Municipalidad, escuelas y organizaciones comunitarias como copropietarias
   del diseño del piloto.

### Etapa C — piloto cooperativo

- Catálogo inicial revisado de 20–30 especies.
- Proyecto territorial de observaciones enlazado con iNaturalist/SIMEF cuando
  sea pertinente.
- Una misión educativa con protocolo aprobado por el socio científico.
- Panel que muestre fuente, nivel de confianza y estado de revisión.
- Exportación de prueba en Darwin Core, sin publicarla todavía.

### Etapa D — retorno de datos

- Acordar con GBIF Chile/SBAP o la institución patrocinante quién publica.
- Asignar licencias registro por registro y proteger ubicaciones sensibles.
- Publicar un dataset piloto con DOI o identificador persistente.
- Registrar la cita de descarga y mostrarla en el informe de impacto.

## Preguntas para cada institución

1. ¿Qué datos o metadatos pueden compartirse y bajo qué licencia?
2. ¿Existe API, OAI-PMH, descarga Darwin Core, GeoJSON, CSV o servicio SIG?
3. ¿Qué información es sensible o no puede salir de la institución?
4. ¿Quién puede revisar taxonomía, contenido educativo o protocolos?
5. ¿Podrían estudiantes o tesistas participar en la curación del piloto?
6. ¿Qué problema operativo podría resolver Impacta+ sin duplicar sus sistemas?
7. ¿Cómo quieren recibir de vuelta las observaciones validadas?
8. ¿Cómo deben aparecer créditos, autorías y afiliaciones?

## Fuentes técnicas principales

- GBIF API: <https://techdocs.gbif.org/en/openapi/v1/occurrence>
- OBIS API: <https://api.obis.org/>
- iNaturalist Developers: <https://www.inaturalist.org/pages/developers>
- Crossref REST API: <https://www.crossref.org/documentation/retrieve-metadata/rest-api/>
- DataCite REST API: <https://support.datacite.org/docs/rest-api>
- OpenAlex API: <https://help.openalex.org/api/>
- DSpace REST contract: <https://github.com/DSpace/RestContract>
- OAI-PMH: <https://www.openarchives.org/pmh/>
- GBIF Chile: <https://gbifchile.mma.gob.cl/>
- SIMEF monitoreo participativo:
  <https://simef.minagri.gob.cl/herramientas/monitoreo-participativo>

## Decisiones pendientes antes de implementar sincronización

- Identificar una contraparte científica y una contraparte comunitaria.
- Verificar endpoints y términos de uso de cada institución.
- Definir quién será publicador de los datos generados por Impacta+.
- Aprobar licencias por defecto para observaciones y fotografías.
- Acordar política de embargo y generalización geográfica.
- Decidir si el piloto usa un proyecto iNaturalist existente o uno nuevo.

