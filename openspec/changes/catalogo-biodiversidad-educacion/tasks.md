# Tasks: Catálogo global de biodiversidad y educación científica

## 0. Validación de alcance

- [x] 0.1 Aprobar territorio: alcance Región del Biobío y piloto inicial en Curanilahue.
- [ ] 0.2 Seleccionar 20–30 especies iniciales, incluyendo flora, fauna, especies amenazadas e invasoras relevantes.
- [ ] 0.3 Confirmar primeras fuentes institucionales, académicas y comunitarias.
- [ ] 0.4 Definir responsable de revisión científica y responsable de edición educativa.
- [x] 0.5 Mapear actores científicos, repositorios y plataformas relacionadas en Biobío.
- [x] 0.6 Definir estrategia de interoperabilidad que complemente sistemas existentes.
- [ ] 0.7 Verificar endpoints, licencias y términos de uso de los conectores del piloto.
- [ ] 0.8 Contactar contrapartes iniciales: EULA, Herbario/Museo UdeC, CICAT y LIB/IEB.
- [ ] 0.9 Validar perfiles, consentimiento y revisión comunitaria con el cambio `comunidad-segura-asistente-ia`.

## 1. Modelo de datos

- [ ] 1.1 Diseñar modelos Prisma globales: `CatalogSpecies`, `TaxonName`, `KnowledgeSource`, `SpeciesClaim` y `SpeciesMedia`.
- [ ] 1.2 Diseñar modelos tenant: `OrganizationObservation` y `SpeciesOrganizationLink`.
- [ ] 1.3 Definir enums de taxonomía, estado editorial, tipo de fuente, licencia y privacidad geográfica.
- [ ] 1.4 Añadir índices para nombre científico, nombre común, estado editorial y territorio.
- [ ] 1.5 Crear migración en una base scratch y verificar que no genere DDL contra tablas inexistentes.
- [ ] 1.6 Mantener separados `OrganizationObservation` y `CommunitySubmission`.

## 2. Catálogo y fuentes — backend

- [ ] 2.1 Crear CRUD protegido para catálogo y taxonomía.
- [ ] 2.2 Crear CRUD de fuentes y referencias.
- [ ] 2.3 Crear relaciones especie–fuente y afirmación–fuente.
- [ ] 2.4 Implementar transición editorial `DRAFT → IN_REVIEW → PUBLISHED → OUTDATED`.
- [ ] 2.5 Crear endpoints públicos que devuelvan exclusivamente especies publicadas.
- [ ] 2.6 Agregar pruebas de permisos editoriales y aislamiento de observaciones.
- [ ] 2.7 Crear registro de sistemas y registros externos con procedencia y licencia.
- [ ] 2.8 Implementar importación como candidatos revisables, nunca como publicación automática.

## 3. Migración de especies actuales

- [ ] 3.1 Inventariar registros actuales de `Species` y sus imágenes.
- [ ] 3.2 Importar registros a catálogo con trazabilidad de migración.
- [ ] 3.3 Mantener compatibilidad de la pantalla actual durante la transición.
- [ ] 3.4 Verificar conteos, imágenes, nombres y asociaciones antes de activar nuevas rutas.

## 4. Dashboard de curación

- [ ] 4.1 Crear listado de catálogo con búsqueda y filtros.
- [ ] 4.2 Crear formulario de taxonomía, condición, hábitat y conservación.
- [ ] 4.3 Crear editor de fuentes y afirmaciones.
- [ ] 4.4 Crear bandeja de revisión con comentarios y fecha de actualización.
- [ ] 4.5 Mostrar créditos y licencias antes de publicar multimedia.

## 5. Fichas educativas públicas

- [ ] 5.1 Crear ruta pública de especie publicada.
- [ ] 5.2 Diseñar ficha con resumen, reconocimiento, hábitat, amenazas, acciones comunitarias y fuentes.
- [ ] 5.3 Añadir búsqueda y filtros accesibles.
- [ ] 5.4 Agregar estados de carga, vacío, error y contenido pendiente sin mostrar borradores.
- [ ] 5.5 Validar lectura en móvil y contraste visual.

## 6. Observaciones de conservación

- [ ] 6.1 Crear API para observaciones por organización.
- [ ] 6.2 Validar fecha, coordenadas, responsable, notas y multimedia.
- [ ] 6.3 Implementar privacidad geográfica y salida pública generalizada.
- [ ] 6.4 Relacionar observaciones con misiones existentes.
- [ ] 6.5 Crear resumen de observaciones validadas para informes de impacto.

## 7. Evidencia científica

- [ ] 7.1 Crear captura manual de papers y estudios.
- [ ] 7.2 Validar DOI, URL y campos bibliográficos básicos.
- [ ] 7.3 Relacionar papers con especies, amenazas y territorios.
- [ ] 7.4 Mostrar referencias en fichas públicas sin copiar contenido protegido.
- [ ] 7.5 Agregar fecha de revisión y marca de fuente desactualizada.
- [ ] 7.6 Crear conectores iniciales para DOI, publicaciones y ocurrencias abiertas.
- [ ] 7.7 Diseñar exportación Darwin Core Archive/CSV/GeoJSON para retorno de datos.
- [ ] 7.8 Registrar ejecuciones de sincronización, errores y cambios detectados.

## 8. Verificación y entrega

- [ ] 8.1 E2E de catálogo global visible solo en estado publicado.
- [ ] 8.2 E2E de aislamiento entre dos organizaciones.
- [ ] 8.3 E2E de privacidad de coordenadas sensibles.
- [ ] 8.4 `npm run build` frontend y backend.
- [ ] 8.5 `npm run lint` y tests relevantes.
- [ ] 8.6 Deploy controlado y verificación con `./deploy.sh verify`.
- [ ] 8.7 Documentar fuentes, licencias y procedimiento editorial.
