# Impacta+ — Periodismo ciudadano e investigación protegida

## Propósito

Permitir que cualquier persona alerte sobre hechos de interés público y que
periodistas profesionales verificados puedan encontrar, contrastar y desarrollar
esa información con protección de fuentes, evidencia trazable y apoyo de Qwen
local.

Impacta+ invitará a informar con confianza, pero no prometerá invulnerabilidad o
ausencia absoluta de represalias. La promesa verificable será: reducir exposición,
dar control sobre identidad y destino, cifrar el intercambio, minimizar rastros y
acompañar cada decisión sensible.

## Perfiles

### Periodista ciudadano

No requiere título profesional. Puede:

- Crear un reporte identificado, pseudónimo o sin cuenta.
- Adjuntar evidencia y conservar un recibo seguro.
- Decidir si el reporte queda privado, se comparte con periodistas autorizados,
  se prepara para una autoridad o se propone para publicación redactada.
- Responder preguntas mediante una casilla protegida.
- Solicitar retiro o restricción de usos futuros cuando corresponda.

No obtiene acceso a otros reportes, no publica acusaciones directamente y no se
presenta legalmente como periodista profesional verificado.

### Periodista profesional verificado

Su credencial se verifica separadamente. Puede:

- Recibir asignaciones de casos según tema y territorio.
- Buscar fuentes públicas y antecedentes relacionados.
- Solicitar información adicional sin conocer necesariamente la identidad.
- Construir líneas de tiempo, matrices de evidencia y contradicciones.
- Preparar un borrador de investigación.
- Solicitar revisión editorial, científica, de seguridad o jurídica.

No puede enumerar todos los reportes ni acceder a identidades reservadas por el
solo hecho de estar verificado.

### Editor de investigación

Controla asignación, revisión, derecho a respuesta, correcciones y decisión de
publicación. La publicación requiere una asignación funcional independiente de
la credencial periodística.

### Responsable de protección de fuentes

Administra políticas y accesos excepcionales a identidad o material altamente
sensible. No es automáticamente administrador de sistemas ni editor publicador.

## Experiencia de reporte

### Entrada pública

Texto sugerido:

> ¿Viste algo que la comunidad necesita saber?
>
> Cuéntalo con protección. Tú decides cómo identificarte, quién puede revisar la
> información y si deseas mantener una comunicación segura.

Acción principal: **Comenzar un reporte protegido**.

Acción secundaria: **Cómo protegemos tu información**.

La interfaz no utilizará “100 % anónimo”, “inhackeable” o “sin represalias”.

### Flujo asistido

1. **Antes de comenzar:** explicación breve de riesgos de dispositivo, red,
   archivos y entorno físico.
2. **Cómo participar:** identificado, alias persistente o sin cuenta.
3. **Qué ocurrió:** relato libre o guía por hechos, fecha, territorio y actores.
4. **Evidencia:** adjuntos, procedencia, consentimiento y advertencia de metadatos.
5. **Destino:** privado, periodistas autorizados, derivación consentida o
   candidato público redactado.
6. **Revisión:** resumen, información que podría identificar y confirmación.
7. **Recibo:** código de recuperación y pautas para conservarlo.

Cada pantalla tendrá una sola decisión principal, lenguaje simple, guardado
cifrado y salida rápida. Preguntas sensibles serán opcionales y explicarán por
qué se solicitan.

## Flujo editorial

```text
Reporte protegido
      ↓ triage de seguridad y competencia
Lead de investigación
      ↓ asignación mínima
Periodista profesional verificado
      ↓ contraste y evidencia
Revisión editorial + científica/técnica + jurídica según el caso
      ↓
Cierre privado, derivación consentida o PublicationCandidate redactado
      ↓ decisión humana
PublicInterestReport + derecho de respuesta + correcciones
```

El expediente original nunca se publica. La publicación utiliza una copia
redactada con nueva identidad técnica y sin metadatos que permitan reconstruir la
fuente.

## Qwen para investigación

Qwen local puede:

- Convertir relatos extensos en una línea de tiempo propuesta.
- Separar hechos observados, inferencias, opiniones y preguntas pendientes.
- Buscar antecedentes públicos y papers con citas.
- Comparar documentos y detectar contradicciones o vacíos.
- Proponer preguntas de entrevista y checklist de verificación.
- Detectar PII, ubicaciones y metadatos antes de compartir.
- Preparar resúmenes y borradores con procedencia visible.
- Señalar posibles autoridades o especialistas sin enviar información.

Qwen MUST NOT:

- Declarar verdadero o falso un reporte.
- Puntuar la credibilidad de una persona como decisión definitiva.
- Intentar identificar una fuente anónima.
- Contactar denunciados, autoridades o terceros automáticamente.
- Publicar, firmar o atribuir una investigación.
- Entrenarse con expedientes o conversaciones.

Mientras Impacta+ use un modelo por API, el contenido del reporte no se enviará
al proveedor. Solo podrán usarse funciones genéricas y búsquedas públicas sin
detalles del caso. La asistencia sobre expediente se activa con Qwen local y
consentimiento visible.

## Evidencia y verificación

Cada elemento se clasifica como:

- `UNVERIFIED_LEAD`
- `SOURCE_STATEMENT`
- `DOCUMENT`
- `FIELD_OBSERVATION`
- `PUBLIC_RECORD`
- `EXPERT_ANALYSIS`
- `CORROBORATED`
- `DISPUTED`
- `RETRACTED`

Se conserva origen, fecha, hash, custodio, transformaciones y relación con cada
afirmación. Un hash demuestra integridad desde un momento, no veracidad del
contenido.

La plataforma distinguirá claramente:

- Lo observado directamente.
- Lo afirmado por una fuente.
- Lo confirmado por otra evidencia.
- Lo que está en disputa.
- La interpretación editorial.

## Seguridad y represalias

Antes de asignar o publicar se evalúa riesgo:

- Identificación por detalles del relato.
- Metadatos de documentos e imágenes.
- Acceso al dispositivo o cuenta.
- Riesgo laboral, comunitario, legal, físico o psicológico.
- Exposición de menores, comunidades vulnerables o especies sensibles.
- Doxxing y campañas de hostigamiento.

Una persona puede detener el flujo y recibir una derivación humana. La
plataforma ofrecerá recursos de seguridad digital y recomendará asesoría legal o
especializada cuando el riesgo exceda sus capacidades.

## Marco chileno

La Ley 19.733 reconoce reserva de fuente a periodistas, directores, editores y
otras personas comprendidas por su actividad informativa, bajo condiciones que
requieren interpretación jurídica. Impacta+ no asumirá que crear un perfil de
“periodista ciudadano” concede automáticamente todas esas protecciones.

La publicación y protección de fuente tendrán revisión jurídica chilena antes de
producción. También se definirán director responsable, derecho de aclaración o
respuesta, tratamiento de datos y responsabilidades del medio si Impacta+ opera
un canal público periódico.

## Modelo conceptual

- `CitizenReporterProfile`
- `VerifiedJournalistCredential`
- `ProtectedReport`
- `ReportRecoveryReceipt`
- `InvestigationLead`
- `JournalistAssignment`
- `SourceIdentityVault`
- `EvidenceItem`
- `EvidenceClaimLink`
- `VerificationAction`
- `SafetyAssessment`
- `EditorialReview`
- `RightOfReplyRequest`
- `PublicationCandidate`
- `PublicInterestReport`
- `CorrectionRecord`

## Métricas responsables

- Reportes recibidos y respondidos, sin ranking de denunciantes.
- Tiempo hasta primera revisión humana.
- Casos derivados con consentimiento.
- Investigaciones con evidencia corroborada.
- Riesgos detectados antes de compartir o publicar.
- Correcciones y decisiones documentadas.
- Cobertura territorial y temas desatendidos.

No se medirán públicamente “acusaciones por persona” ni señales que faciliten
represalias o inferencia de identidad.

## Criterios de aceptación

- Una persona comprende el nivel de protección antes de escribir.
- El flujo funciona sin cuenta ni datos personales obligatorios.
- Periodistas acceden solo a casos asignados y material necesario.
- La identidad de fuente está separada del expediente investigativo.
- Qwen local ayuda a investigar sin decidir verdad ni publicar.
- Ningún contenido sensible llega al proveedor API o telemetría Sentinel.
- Toda publicación tiene revisión, evidencia, redacción de riesgos y correcciones.
- El lenguaje invita a participar sin prometer seguridad absoluta.

## Referencias iniciales

- CPJ Safety Kit: <https://cpj.org/safety-kit/>
- CPJ Digital Safety Kit: <https://cpj.org/2019/07/digital-safety-kit-journalists/>
- UNESCO, protección de fuentes: <https://www.unesco.org/en/articles/protecting-journalism-sources-digital-age>
- Ley chilena 19.733: <https://www.bcn.cl/leychile/Navegar?idNorma=186049>
- SecureDrop para fuentes: <https://docs.securedrop.org/en/stable/source/source.html>

