# Impacta+ — Cerebro operativo para una red regional

## Visión

Impacta+ debe transformar grupos pequeños y profesionales aislados en una red
capaz de descubrir oportunidades, formar equipos, formular proyectos, ejecutar
acciones y demostrar resultados.

Qwen será el motor de razonamiento y asistencia, pero el verdadero cerebro
operativo será la combinación de:

- Personas y organizaciones con capacidades verificables.
- Conocimiento científico, comunitario y territorial trazable.
- Convocatorias, recursos y requisitos actualizados.
- Flujos de proyecto, misiones, presupuesto, evidencia y rendición.
- Herramientas controladas por permisos.
- Memoria institucional perteneciente a Impacta+, no al modelo.

El objetivo no es automatizar a las organizaciones: es entregarles una capacidad
de coordinación que individualmente no podrían financiar ni mantener.

La primera versión usará un modelo por API y la versión definitiva migrará a
Qwen local. Todo el conocimiento, permisos, herramientas, trazabilidad y memoria
permanecerá en Impacta+, de modo que reemplazar el proveedor no cambie el ciclo
operativo ni entregue a un tercero el cerebro institucional.

Esta separación se rige por
`docs/ARQUITECTURA_INTELIGENCIA_INDEPENDIENTE_MODELO.md`: incluso Qwen local es
reemplazable si otro motor demuestra mejor calidad o seguridad en las
evaluaciones de Impacta+.

## Ciclo operativo

```text
Detectar necesidad u oportunidad
            ↓
Comprender territorio, requisitos y capacidades disponibles
            ↓
Encontrar personas, organizaciones y recursos complementarios
            ↓
Proponer colaboración y proyecto
            ↓
Preparar borradores, documentos, presupuesto y plan de trabajo
            ↓
Personas revisan, acuerdan, firman y postulan
            ↓
Ejecutar misiones y reunir evidencia
            ↓
Rendir, comunicar resultados y aprender para la próxima oportunidad
```

Qwen acompaña todo el ciclo, pero no firma convenios, representa legalmente,
envía postulaciones, adjudica recursos ni publica resultados.

## Tres espacios de información

### Catálogo público de oportunidades

Información compartida y trazable:

- Fuente oficial y enlace original.
- Financiador, territorio y temática.
- Beneficiarios elegibles.
- Monto, cofinanciamiento y gastos permitidos.
- Fechas, documentos y obligaciones.
- Estado de verificación y fecha de consulta.

La detección automática crea candidatos. Una persona revisa los datos antes de
marcarlos como oportunidad verificada.

### Preparación privada de cada organización

- Perfil legal y territorial.
- Capacidades, experiencia y proyectos anteriores.
- Documentos de vigencia y registros requeridos.
- Presupuestos, postulaciones y evaluaciones.
- Brechas de admisibilidad y tareas pendientes.

Estos datos permanecen aislados por tenant. La plataforma nunca comparte un
borrador o una estrategia de postulación con otra organización.

### Red regional consentida

Cada profesional, colectivo u organización decide qué capacidades, necesidades
y disponibilidad hace visibles para colaborar. La red puede mostrar, por
ejemplo:

- Especialidades y territorios de experiencia.
- Equipamiento, laboratorios, espacios o datos que se pueden compartir.
- Necesidad de institución patrocinante, contraparte técnica o comunidad piloto.
- Interés en biodiversidad, restauración, agua, educación o innovación agraria.
- Disponibilidad para revisar, ejecutar, capacitar o investigar.

El contacto se inicia mediante una invitación consentida. La IA no entrega datos
privados ni agrega personas a consorcios automáticamente.

## Capacidades del cerebro operativo

### Radar de oportunidades

- Monitorear fuentes oficiales por API, RSS, correo autorizado o revisión web.
- Extraer requisitos y fechas como candidatos verificables.
- Detectar cambios en bases o plazos.
- Evitar duplicados y conservar versiones.
- Alertar solo a perfiles compatibles y con consentimiento.

Fuentes iniciales para el piloto:

- Portal Único de Fondos Concursables: <https://www.fondos.gob.cl/>
- Subvenciones del Gobierno Regional del Biobío:
  <https://gorebiobio.cl/postulaciones/>
- Fondos del Ministerio del Medio Ambiente:
  <https://fondos.mma.gob.cl/>
- Convocatorias FIA: <https://www.fia.cl/pilares-de-accion/impulso-para-innovar/convocatorias/>
- Programas de innovación Corfo: <https://www.corfo.cl/sites/cpp/area/innovacion>
- Concursos y sistemas de postulación ANID: <https://www.anid.cl/concursos/>

No se asumirá que una fuente ofrece API. Cada integración debe respetar términos
de uso, frecuencia de consulta y formato disponible.

### Diagnóstico de preparación

Para cada oportunidad, Qwen puede generar una matriz explicable:

| Dimensión | Resultado posible |
|---|---|
| Elegibilidad | Cumple, no cumple o requiere confirmación |
| Documentación | Disponible, vencida o faltante |
| Capacidad técnica | Suficiente o requiere contraparte |
| Cobertura territorial | Compatible o fuera de alcance |
| Financiamiento | Aporte propio disponible o brecha |
| Evidencia previa | Proyectos, misiones e indicadores reutilizables |
| Riesgo de plazo | Bajo, medio o alto con fundamento |

Cada resultado enlaza el requisito original y los datos utilizados. La IA no
descarta silenciosamente una oportunidad: muestra incertidumbre y permite
corrección humana.

### Motor de colaboración

Cuando una organización no cumple sola, el sistema puede sugerir:

- Profesionales con la especialidad faltante.
- Organizaciones con experiencia complementaria.
- Universidad, laboratorio o institución patrocinante potencial.
- Comunidades o territorios interesados en participar.
- Equipamiento, datos o espacios disponibles.

El orden de sugerencias debe ser explicable y auditable. No se venderá prioridad,
no se penalizará a grupos nuevos por falta de historial y se medirán sesgos
territoriales para no concentrar siempre los recursos en Concepción.

### Estudio de formulación

Qwen puede preparar, siempre como borrador:

- Resumen del problema y justificación territorial.
- Árbol de objetivos y resultados esperados.
- Matriz de actividades, responsables e indicadores.
- Cronograma y checklist de admisibilidad.
- Presupuesto estructurado según categorías permitidas.
- Cartas y acuerdos para revisión de sus firmantes.
- Matriz de evidencia que vincula datos, fuentes y afirmaciones.
- Adaptación del proyecto a formularios específicos sin inventar antecedentes.

El sistema marca cualquier campo que requiera decisión, cifra o declaración de
una persona responsable.

### Ejecución y rendición

Una postulación adjudicada se conecta con campañas, misiones, voluntarios,
compras, evidencias e indicadores. Qwen ayuda a:

- Convertir compromisos en tareas y fechas.
- Detectar desviaciones entre plan y ejecución.
- Organizar comprobantes y evidencia.
- Preparar informes narrativos y tablas desde datos autorizados.
- Recordar obligaciones y conservar memoria institucional.

La organización revisa y presenta toda rendición oficial.

## Ejemplo regional

Un pequeño grupo de ecólogos conoce un humedal, pero no tiene personalidad
jurídica ni experiencia formulando fondos. Una ONG local tiene la estructura
administrativa; una agrónoma aporta restauración; una universidad puede apoyar
el diseño de monitoreo.

Impacta+ podría:

1. Detectar una convocatoria compatible.
2. Explicar por qué el grupo solo no cumple la admisibilidad.
3. Sugerir contrapartes que declararon interés y disponibilidad.
4. Abrir un espacio privado de colaboración con consentimiento.
5. Preparar un borrador común, presupuesto, cronograma y matriz de evidencia.
6. Convertir el proyecto adjudicado en misiones e indicadores.
7. Preparar la rendición y devolver resultados educativos a la comunidad.

Ese es el impulso buscado: reducir el costo de coordinar capacidades que ya
existen, pero hoy están fragmentadas.

## Reglas de autoridad

Qwen MAY:

- Buscar, explicar, comparar, alertar y recomendar.
- Proponer conexiones entre perfiles públicos o consentidos.
- Crear y actualizar borradores con confirmación.
- Preparar checklists, cronogramas, presupuestos e informes.

Qwen MUST NOT:

- Postular, firmar o aceptar condiciones legales.
- Enviar invitaciones externas sin confirmación.
- Compartir documentos tenant entre organizaciones.
- Inventar elegibilidad, experiencia, costos, resultados o cartas de apoyo.
- Decidir adjudicaciones o priorizar acceso por pago.
- Convertir recomendaciones en tareas obligatorias sin aprobación.

## Modelo conceptual

- `FundingSource`: institución y mecanismo de consulta.
- `FundingOpportunity`: convocatoria global versionada.
- `EligibilityRule`: requisito extraído y revisado.
- `OrganizationCapabilityProfile`: capacidades privadas y públicas consentidas.
- `ResourceNeed`: brecha técnica, jurídica, financiera o territorial.
- `OpportunityMatch`: compatibilidad, evidencia, incertidumbre y explicación.
- `CollaborationProfile`: capacidades y disponibilidad visibles en la red.
- `CollaborationInvitation`: invitación consentida entre participantes.
- `ProjectConcept`: idea compartida con gobernanza y propietarios definidos.
- `GrantApplication`: postulación privada de una organización o consorcio.
- `ApplicationDraft`: versiones y aportes de personas o IA.
- `ApplicationRequirement`: checklist y evidencia asociada.
- `ProjectCommitment`: obligación asumida tras adjudicación.

## Fases

1. **Radar manual asistido:** catálogo global y verificación humana de fuentes.
2. **Preparación organizacional:** perfil, documentos y checklist de vigencia.
3. **Matching explicable:** oportunidades recomendadas y brechas visibles.
4. **Red regional:** perfiles consentidos e invitaciones de colaboración.
5. **Estudio de formulación:** borradores, presupuesto y revisión multi-actor.
6. **Ejecución conectada:** convertir compromisos en misiones e indicadores.
7. **Rendición y aprendizaje:** informes, resultados y memoria reutilizable.

## Indicadores de impacto

- Organizaciones y profesionales activos fuera de capitales regionales.
- Oportunidades verificadas y alertadas a tiempo.
- Coincidencias explicables aceptadas o rechazadas.
- Colaboraciones formadas entre actores antes desconectados.
- Postulaciones admisibles, adjudicaciones y recursos movilizados.
- Horas ahorradas en búsqueda, formulación y rendición.
- Distribución territorial de recursos y colaboraciones.
- Proyectos que devuelven datos o educación a la comunidad.
