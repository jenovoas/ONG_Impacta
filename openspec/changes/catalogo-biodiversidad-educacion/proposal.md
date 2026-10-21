# Proposal: Catálogo global de biodiversidad y educación científica

## Why

Impacta+ necesita evolucionar el módulo de especies desde un CRUD básico hacia una base de conocimiento local, educativa y científicamente trazable. La plataforma debe ayudar a las ONG a administrar su trabajo y a la comunidad a comprender qué especies existen en su territorio, qué amenazas enfrentan y qué acciones pueden realizar para protegerlas.

El catálogo debe distinguir entre conocimiento compartido y datos operativos privados. Una ficha de especie puede ser global y educativa; una observación, misión, responsable o coordenada pertenece a una organización y debe respetar el aislamiento multi-tenant.

## What Changes

- Se crea un catálogo global de especies con taxonomía, sinónimos, condición biológica, hábitat y estado editorial.
- Se crean fuentes y referencias para respaldar datos científicos y educativos.
- Se separan las fichas globales de las observaciones y acciones de cada organización.
- Se agrega un flujo editorial para curadores, revisores científicos y editores educativos.
- Se preparan fichas públicas educativas para especies publicadas.
- Se incorporan estudios y papers mediante metadatos, DOI, enlaces y resúmenes permitidos; no se almacenan artículos completos protegidos.
- Se protegen coordenadas de especies sensibles mediante permisos y generalización pública.

## Capabilities

### New Capabilities

- `catalogo-biodiversidad`: catálogo global de especies, taxonomía, fuentes y estados editoriales.
- `educacion-especies`: fichas públicas educativas con lenguaje claro y referencias.
- `observaciones-conservacion`: registros de campo por organización relacionados con especies del catálogo.
- `evidencia-cientifica`: estudios, papers y afirmaciones vinculadas a fuentes.

### Modified Capabilities

- `especies`: migrar el CRUD actual hacia referencias del catálogo global sin perder los datos existentes.

## Non-goals

- No se catalogará todo Chile en la primera iteración.
- No se copiarán papers completos ni contenido protegido.
- No se construirán mapas satelitales ni heatmaps en tiempo real en la primera versión.
- No se publicarán coordenadas exactas de especies vulnerables por defecto.
- No se cambiará el dominio único ni la infraestructura de producción.

## Impact

- **Backend:** nuevos modelos Prisma, módulos de catálogo, fuentes, referencias, observaciones y permisos editoriales.
- **Frontend:** administración del catálogo en dashboard y fichas educativas públicas en el mismo frontend React.
- **Datos:** migración cuidadosa del modelo `Species` actual, con prueba canario en una base scratch antes de producción.
- **Seguridad:** catálogo global de lectura pública solo para fichas publicadas; observaciones y datos sensibles aislados por organización.
- **Documentación:** plan de biodiversidad, especificaciones OpenSpec y guía de fuentes/licencias.
