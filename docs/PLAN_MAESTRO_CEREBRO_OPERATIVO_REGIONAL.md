# Impacta+ — Plan maestro del cerebro operativo regional

## Objetivo

Entregar un plan ejecutable para transformar Impacta+ en una plataforma regional
que conecte comunidad, profesionales, ciencia, financiamiento, periodismo
ciudadano y organizaciones pequeñas mediante una inteligencia independiente del
modelo y ejecutada sobre infraestructura Sentinel.

Este documento planifica; no autoriza por sí solo cambios de infraestructura,
despliegues ni publicación de capacidades sensibles.

## Principios no negociables

1. Un solo sistema y dominio: `https://impacta.pinguinoseguro.cl`.
2. Producción únicamente sobre nodos administrados por Sentinel.
3. Identidad, participación, credenciales y permisos son conceptos separados.
4. La IA propone, explica y prepara borradores; nunca publica, firma o adjudica.
5. La inteligencia pertenece a Impacta+, no al proveedor o modelo.
6. OmniRoute como gateway inicial; solo rutas explícitamente autorizadas pueden
   procesar contenido público o sensible.
7. Mensajes, denuncias y expedientes no forman datasets por defecto.
8. Catálogo global separado de observaciones tenant y aportes comunitarios.
9. Cifrado y anonimato se describen con garantías reales, no como invulnerables.
10. Toda publicación sensible exige revisión humana, trazabilidad y correcciones.

## Dependencias

```text
F0 Gobierno y baseline
 └─ F1 Identidad, perfiles y permisos
     ├─ F2 Runtime Sentinel + defensa cognitiva
     │   └─ F3 Cerebro API + recepción pública
     ├─ F4 Catálogo científico y educación
     │   └─ F5 Red profesional + oportunidades + proyectos
     └─ F6 Mensajería privada administrada
         ├─ F7 Reportes protegidos + periodismo
         └─ F8 Intercambio E2EE de inteligencia

F2 + F3 + F4 + F5 + F6 + evaluaciones
 └─ F9 Qwen local
     └─ F10 Fine-tuning y asistentes especializados

Todas las fases estables
 └─ F11 Escala regional, interoperabilidad y mejora continua
```

No se implementa F7 antes de contar con F1, F2 y F6. No se procesa un expediente
con IA antes de F9. No se entrena antes de tener evaluaciones y gobernanza.

## Fase 0 — Gobierno, baseline y seguridad de trabajo

### Objetivo

Congelar decisiones, proteger el estado actual y nombrar responsables.

### Entregables

- Inventario de cambios locales y ramas existentes.
- Matriz de responsables: producto, seguridad, privacidad, ciencia, comunidad,
  periodismo, legal y operaciones Sentinel.
- Clasificación de datos y tabla de retención.
- Modelo de amenazas inicial.
- Suite e2e multi-tenant restaurada y baseline de builds/tests.
- DB scratch donde todas las migraciones aplican desde cero.
- Registro de decisiones arquitectónicas.

### Criterio de salida

- Nadie inicia modelos, mensajería o denuncias sin responsables nombrados.
- `origin/main` y producción están comparados sin reset destructivo.
- Las pruebas de aislamiento existentes pasan y tienen dueño.
- Legal y seguridad identifican capacidades bloqueadas para producción.

## Fase 1 — Identidad global, comunidad y permisos

### Objetivo

Reemplazar gradualmente el rol único por una identidad capaz de representar
múltiples organizaciones, colectivos, profesiones y funciones.

### Backend y datos

- `Account`, `PersonProfile`.
- `OrganizationMembership`, `CollectiveMembership`.
- `Discipline`, `Expertise`, `ProfessionalCredential`.
- `RoleAssignment` con alcance, otorgante y vigencia.
- `TerritorialCollective` piloto Curanilahue.
- Compatibilidad temporal con `User.organizationId` y `User.role`.

### Frontend

- Perfil personal y participaciones.
- Solicitud y revisión de credenciales.
- Vista explicable de permisos.
- Perfiles ciudadano, voluntario, profesional y periodista.

### Criterio de salida

- Una persona puede tener varias participaciones sin crear ONG ficticias.
- Una credencial no concede publicación.
- E2E con dos organizaciones y un colectivo demuestra aislamiento.
- Cada permiso puede explicar quién lo concedió, dónde aplica y cuándo vence.

## Fase 2 — Runtime Sentinel y defensa independiente del modelo

### Objetivo

Convertir `fenix` en baseline reproducible y proteger toda frontera IA/telemetría.

### Componentes

- `SentinelManagedNode` y perfil de conformidad.
- `SentinelHostAdapter` de solo lectura.
- `ContentIngressGuard`.
- `PrivacySanitizer`.
- `DataPolicyEngine`.
- `SafeContextBuilder`.
- `ToolPolicyGateway`.
- `OutputGuard`.
- `SafeTelemetryEmitter`.

### Reutilización Sentinel

- Adoptar pipeline ingreso/salida, fail closed y corpus adversarial.
- Portar reglas útiles con atribución a una implementación TypeScript.
- No copiar allowlist global, almacenamiento de originales ni reglas semánticas
  específicas de infraestructura.
- Mantener `CrystalCipher` limitado a su dominio actual hasta auditoría y nonce
  único por mensaje.

### Criterio de salida

- Ningún prompt, respuesta, RUT, token o coordenada aparece en logs.
- Eventos Sentinel no entran directamente a contexto o herramientas.
- Caída de Cortex activa degradación sin relajar permisos.
- Deploy de Impacta+ no reinicia ni modifica Sentinel.

## Fase 3 — Cerebro API y recepción pública

### Objetivo

Validar la experiencia inteligente con información pública antes de usar datos
tenant o adquirir GPU.

### Componentes

- Contratos `AiGatewayClient` y `AiProvider`; OmniRoute es el gateway inicial y
  el modelo/combinación final permanece intercambiable.
- `ModelRegistry` y router por capacidades.
- Prompt Registry versionado.
- RAG público con citas.
- Recepción de visitantes con memoria mínima.
- Fallback a búsqueda y derivación humana.
- Conjunto de evaluación retenido inicial.

### Alcance permitido

- Orientación por módulos y formas de participación.
- Educación desde contenido publicado.
- Búsqueda pública de oportunidades.
- Derivación a contacto, soporte o canal protegido.

### Alcance prohibido

- Reportes, mensajes, documentos tenant o coordenadas sensibles.
- Herramientas de escritura o mutaciones.
- Entrenamiento desde conversaciones.

### Criterio de salida

- Respuestas identificadas como IA, citadas y con abstención.
- Cero datos privados enviados al proveedor.
- Métricas sin contenido y presupuesto de tokens conocido.
- Evaluaciones de recepción, prompt injection y fallback aprobadas.

## Fase 4 — Catálogo científico y educación regional

### Objetivo

Construir la base de conocimiento de biodiversidad para Biobío, con piloto en
Curanilahue.

### Alcance

- Catálogo global, taxonomía, fuentes, claims y multimedia licenciada.
- Observaciones tenant y aportes comunitarios separados.
- Estados editoriales y privacidad geográfica.
- 20–30 especies piloto.
- Integraciones “enlace antes que copia”.
- Fichas educativas públicas accesibles.

### Criterio de salida

- Toda afirmación publicada tiene fuente o tipo de observación explícito.
- No se exponen borradores o coordenadas sensibles.
- Migración canario conserva especies actuales.
- Revisor profesional y comunitario validan el piloto.

## Fase 5 — Red profesional, oportunidades y proyectos

### Objetivo

Conectar capacidades aisladas con recursos y colaboraciones concretas.

### Alcance

- Catálogo global `FundingOpportunity` versionado y verificado.
- Perfil privado de preparación organizacional.
- Perfil público/consentido de colaboración.
- Matching explicable con requisitos, brechas e incertidumbre.
- Invitaciones consentidas.
- Estudio de formulación con versiones y borradores.
- Conversión de adjudicaciones a misiones, compromisos e indicadores.

### Criterio de salida

- Una recomendación explica por qué coincide y qué falta.
- Ningún documento tenant se comparte para encontrar colaboradores.
- La IA no envía invitaciones ni postulaciones.
- Se mide distribución territorial para evitar concentración en Concepción.

## Fase 6 — Mensajería `PRIVATE_MANAGED`

### Objetivo

Entregar coordinación privada cifrada antes de asumir la complejidad E2EE.

### Alcance

- Directos, grupos, misiones y espacios de proyecto.
- Cifrado por envolvente y claves separadas.
- Autorización backend por operación.
- Adjuntos privados, bloqueo y reportes de abuso.
- Retención, exportación y eliminación definidas.
- IA ausente por defecto; Qwen local aún no procesa contenido.

### Criterio de salida

- E2E impide enumeración y lectura por no participantes.
- Backups y restauración conservan cifrado y permisos.
- Logs/notificaciones no contienen previews.
- La interfaz no lo llama E2EE.

## Fase 7 — Reportes protegidos y periodismo

### Objetivo

Conectar periodistas ciudadanos con profesionales verificados y un proceso de
investigación responsable.

### Alcance

- Wizard protegido sin cuenta obligatoria.
- Alias/recibo y casilla bidireccional.
- Separación de identidad, expediente y evidencia.
- Asignación mínima a periodistas verificados.
- Línea de tiempo, verificación, derecho de respuesta y correcciones.
- Publicación únicamente desde copia redactada.
- Evaluación GlobaLeaks/SecureDrop para el canal de fuente.

### Restricción IA

Durante la etapa API no se procesa contenido del expediente. La asistencia de
investigación espera Qwen local; mientras tanto se usan herramientas
deterministas de metadatos, cifrado y formularios.

### Criterio de salida

- La persona entiende riesgos antes de escribir.
- Ningún periodista puede enumerar casos no asignados.
- Identidad reservada requiere un rol y motivo separados.
- Publicación contempla evidencia, riesgo, revisión y corrección.
- Revisión jurídica chilena y simulacro de incidente completados.

## Fase 8 — E2EE e intercambio de inteligencia

### Objetivo

Ofrecer salas y paquetes que ni el servidor pueda descifrar.

### Alcance

- `CONFIDENTIAL_E2EE` usando protocolo revisado; MLS candidato para grupos.
- Identidad y revocación por dispositivo.
- Rotación por cambios de membresía.
- Adjuntos cliente-side y paquetes de inteligencia cifrados.
- Metadatos minimizados.
- Estrategia explícita de recuperación o pérdida de acceso.

### Criterio de salida

- Auditoría criptográfica externa.
- Vectores de interoperabilidad, replay, mensajes perdidos y multi-dispositivo.
- Nonce/clave únicos conforme al protocolo.
- Sentinel y backend no reciben plaintext.
- Qwen no participa todavía salvo piloto local explícito y consentido.

## Fase 9 — Qwen local sobre nodo Sentinel

### Objetivo

Cambiar gradualmente la ruta OmniRoute o sustituirla por inferencia local sin
cambiar experiencia ni permisos.

### Infraestructura planificada

- Nodo Sentinel con GPU, que puede ser distinto de `fenix`.
- Usuario y servicio de inferencia sin privilegios.
- Loopback o red privada autenticada.
- Sin acceso directo a DB, `.env`, adjuntos o internet.
- Límites de recursos, observabilidad sin plaintext y rollback.

### Migración

1. Medir Qwen base con la misma evaluación de la API.
2. Registrar como `CANDIDATE`.
3. Ejecutar casos offline públicos/sintéticos.
4. Modo `SHADOW` autorizado.
5. Tráfico porcentual de bajo riesgo.
6. Promover por contexto, no globalmente.

### Criterio de salida

- Qwen supera umbrales de cada contexto habilitado.
- Cero fuga tenant y cero acceso a herramientas prohibidas.
- API continúa como fallback solo para clases autorizadas.
- Periodismo sensible puede iniciar piloto local revisado.

## Fase 10 — Fine-tuning y asistentes especializados

### Objetivo

Enseñar comportamiento de Impacta+ cuando prompts y RAG no sean suficientes.

### Alcance

- 300–500 ejemplos SFT iniciales, de alta calidad.
- LoRA/QLoRA con Qwen base versionado.
- DPO opcional para tono y preferencias.
- Checkpoints evaluados, no asumir que el último es mejor.
- Asistentes de recepción, educación, profesional, editor, voluntariado,
  formulación y periodismo.

### Exclusiones de dataset

- Denuncias y expedientes.
- Conversaciones privadas.
- Coordenadas sensibles.
- Secretos y documentos tenant sin consentimiento/licencia.
- Feedback crudo no revisado.

### Criterio de salida

- El adaptador mejora una brecha medida sin degradar seguridad.
- Dataset, licencia, splits y transformaciones están documentados.
- Red-team científico, comunitario, periodístico y de privacidad aprobado.
- Rollback al modelo base probado.

## Fase 11 — Escala regional e interoperabilidad

### Objetivo

Extender desde Curanilahue a las provincias y comunas de Biobío sin centralizar
la red en una sola institución.

### Alcance

- Nuevos actores académicos, municipales y comunitarios.
- Conectores versionados y retorno Darwin Core/CSV/GeoJSON.
- Fuentes y fondos regionales, nacionales e internacionales.
- Métricas de cobertura y sesgo territorial.
- Federación futura entre nodos Sentinel mediante contratos privados, no nuevos
  dominios públicos.

### Criterio de salida

- La expansión mantiene privacidad, procedencia y aislamiento.
- Los datos retornan a sistemas fuente cuando licencia y acuerdos lo permiten.
- Organizaciones pequeñas pueden demostrar colaboraciones y recursos obtenidos.

## Tracks paralelos permitidos

Después de F0, el trabajo puede dividirse sin mezclar migraciones:

- **Track A — Identidad y seguridad:** F1–F3.
- **Track B — Ciencia y educación:** preparación editorial de F4 sin migraciones.
- **Track C — Recursos:** investigación de fuentes y taxonomía de requisitos F5.
- **Track D — UX protegida:** prototipos no conectados de F6–F7.
- **Track E — Evaluación IA:** casos sintéticos y públicos para F3/F9.

Una sola rama debe ser propietaria de `schema.prisma` a la vez. Cambios de
infraestructura se mantienen en PR separado y requieren confirmación.

## Mapa de módulos futuro

### Backend

- `identity`, `community`, `credentials`, `authorization`
- `catalog`, `knowledge-sources`, `observations`
- `opportunities`, `collaboration`, `grants`
- `messaging`, `intelligence-exchange`
- `protected-reports`, `journalism`, `editorial`
- `ai-orchestrator`, `ai-providers`, `ai-security`, `evaluations`
- `sentinel-adapter`, `safe-telemetry`

### Frontend — mismo build y dominio

- `/ayuda`
- `/biodiversidad`
- `/oportunidades`
- `/red`
- `/reportar`
- `/investigaciones/*`
- `/dashboard/mensajes`
- `/dashboard/proyectos`
- `/dashboard/catalogo`
- `/dashboard/periodismo`
- `/dashboard/configuracion/ia`

Las rutas finales se validarán con navegación y Stitch antes de implementar UI.

## Estrategia de pruebas

### Automatizadas

- Unitarias de políticas, sanitización, matching y estados editoriales.
- Integración de DB, cifrado, proveedores y Sentinel adapter.
- E2E con dos tenants, colectivo y usuarios multirol.
- Migraciones desde DB vacía y snapshot representativo.
- Vectores criptográficos y fuzzing.
- Evaluaciones IA reproducibles.

### Manuales y especializadas

- Accesibilidad y lectura móvil.
- Revisión científica y comunitaria.
- Threat modeling y red-team.
- Auditoría criptográfica.
- Revisión jurídica chilena.
- Simulacros de pérdida de claves, host, proveedor, Cortex y modelo.
- Pruebas con periodistas y personas no técnicas.

## Estrategia de release

- Feature flags backend por tenant/capacidad.
- Pilotos internos antes de público.
- Datos sintéticos en primeras pruebas.
- Canarios y rollout porcentual para IA.
- Denuncias, E2EE y publicación deshabilitados hasta completar sus gates.
- Rollback independiente para frontend, backend, modelo y Sentinel adapter.
- `./deploy.sh verify` se amplía solo después de aprobar cambios de infra.

## Decisiones que requieren personas responsables

- Ruta OmniRoute inicial, combinación de modelos y condiciones de
  retención/no entrenamiento.
- Política de datos y tiempos de retención.
- Instituciones y profesionales del piloto.
- Revisor científico y editor responsable.
- Periodistas profesionales y responsable de protección de fuentes.
- Operación propia o integración GlobaLeaks/SecureDrop.
- Protocolo y biblioteca E2EE.
- Hardware/nodo GPU para Qwen.
- Licencia y autorización de componentes derivados de Sentinel.
- Marco jurídico del canal público y derivaciones.

## Paquete de handoff para el agente implementador

Antes de comenzar cada fase, el agente debe:

1. Leer [`AGENTS.md`](../AGENTS.md), [`PLAN.md`](../PLAN.md),
   [`ARQUITECTURA_TECNICA.md`](../ARQUITECTURA_TECNICA.md) y este documento.
2. Leer la documentación y OpenSpec específicos de la fase.
3. Verificar `git status`, `origin/main`, producción y reflog cuando falte trabajo.
4. Declarar archivos y migraciones que tocará.
5. Crear rama desde `origin/main`; no mezclar formateo o cambios ajenos.
6. Implementar todos los escenarios OpenSpec y pruebas de aislamiento.
7. Validar en DB scratch antes de migrar producción.
8. Entregar evidencia de build, test, seguridad y criterios de salida.
9. Pedir confirmación antes de infra, deploy sensible o publicación.
10. No iniciar la fase siguiente hasta cerrar los gates de la actual.

### Baseline de validación al 25-ago-2026

Pasan `openspec validate <change> --strict`:

- `catalogo-biodiversidad-educacion`
- `comunicacion-grants-reporting`
- `comunidad-segura-asistente-ia`
- `runtime-sentinel-impacta`

`openspec validate --all --strict` todavía reporta fallas en artefactos anteriores
fuera de este paquete: `campanas-p2p-recaudacion`,
`membresias-voluntariado-eventos`, `misiones-offline` y `portal-donante`. No se
debe atribuir esas fallas a este plan ni corregirlas dentro de una feature nueva;
requieren una tarea documental separada.

El worktree actual también contiene formateo Prettier del backend y cambios
visuales previos del frontend. Son trabajo del usuario y deben conservarse; el
agente implementador no debe revertirlos ni mezclarlos accidentalmente con una
fase nueva.

## Documentos de referencia

- [`MODELO_PERFILES_COMUNIDAD_CONOCIMIENTO.md`](MODELO_PERFILES_COMUNIDAD_CONOCIMIENTO.md)
- [`PLAN_CATALOGO_BIODIVERSIDAD.md`](PLAN_CATALOGO_BIODIVERSIDAD.md)
- [`MAPA_ECOSISTEMA_CIENTIFICO_BIOBIO.md`](MAPA_ECOSISTEMA_CIENTIFICO_BIOBIO.md)
- [`FUENTES_BIODIVERSIDAD_BIOBIO.md`](FUENTES_BIODIVERSIDAD_BIOBIO.md)
- [`VISION_CEREBRO_OPERATIVO_RED_REGIONAL.md`](VISION_CEREBRO_OPERATIVO_RED_REGIONAL.md)
- [`PLAN_ASISTENTE_IA_IMPACTA.md`](PLAN_ASISTENTE_IA_IMPACTA.md)
- [`ARQUITECTURA_INTELIGENCIA_INDEPENDIENTE_MODELO.md`](ARQUITECTURA_INTELIGENCIA_INDEPENDIENTE_MODELO.md)
- [`REUTILIZACION_DEFENSA_COGNITIVA_SENTINEL.md`](REUTILIZACION_DEFENSA_COGNITIVA_SENTINEL.md)
- [`ARQUITECTURA_DESPLIEGUE_SOBRE_SENTINEL.md`](ARQUITECTURA_DESPLIEGUE_SOBRE_SENTINEL.md)
- [`ARQUITECTURA_CIFRADO_CONVERSACIONES_INTELIGENCIA.md`](ARQUITECTURA_CIFRADO_CONVERSACIONES_INTELIGENCIA.md)
- [`ARQUITECTURA_COMUNICACION_Y_DENUNCIAS.md`](ARQUITECTURA_COMUNICACION_Y_DENUNCIAS.md)
- [`MODELO_PERIODISMO_CIUDADANO_INVESTIGACION.md`](MODELO_PERIODISMO_CIUDADANO_INVESTIGACION.md)

Cambios OpenSpec:

- [`catalogo-biodiversidad-educacion`](../openspec/changes/catalogo-biodiversidad-educacion/)
- [`comunicacion-grants-reporting`](../openspec/changes/comunicacion-grants-reporting/)
- [`comunidad-segura-asistente-ia`](../openspec/changes/comunidad-segura-asistente-ia/)
- [`runtime-sentinel-impacta`](../openspec/changes/runtime-sentinel-impacta/)
