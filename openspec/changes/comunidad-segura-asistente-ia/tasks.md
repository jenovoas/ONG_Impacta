# Tasks: Comunidad segura y asistente de IA

## 0. Gobierno y validación

- [ ] 0.1 Aprobar perfiles, roles funcionales y alcances.
- [ ] 0.2 Nombrar responsables comunitarios, científicos, de seguridad y legales.
- [ ] 0.3 Aprobar consentimiento, privacidad, retención y publicación redactada.
- [ ] 0.4 Realizar modelo de amenazas de mensajería y denuncias.
- [ ] 0.5 Obtener revisión jurídica chilena del canal de denuncias.

## 1. Identidad y comunidad

- [x] 1.1 Diseñar e implementar la primera rebanada de `PersonProfile`,
  `Discipline`, credenciales profesionales y asignaciones de roles.
- [x] 1.2 Implementar migración compatible que conserva
  `User.organizationId` y `User.role` como compatibilidad temporal.
- [ ] 1.3 Crear colectivo territorial piloto de Curanilahue sin una ONG ficticia.
- [ ] 1.4 Crear aportes y revisiones comunitarias con consentimiento.
- [ ] 1.5 Agregar e2e de múltiples participaciones, alcances y aislamiento tenant.

## 2. Mensajería interna

- [ ] 2.1 Diseñar conversaciones, participantes, mensajes, adjuntos y reportes.
- [ ] 2.2 Implementar autorización backend en lectura, envío, descarga y tiempo real.
- [ ] 2.3 Implementar cifrado en almacenamiento y gestión de claves.
- [ ] 2.4 Eliminar contenido sensible de logs, telemetría y notificaciones.
- [ ] 2.5 Probar enumeración, acceso cruzado, bloqueo, retención y adjuntos hostiles.
- [ ] 2.6 Implementar primero `PRIVATE_MANAGED` con cifrado por envolvente y
  separación de claves por conversación.
- [ ] 2.7 Evaluar MLS y bibliotecas auditadas para `CONFIDENTIAL_E2EE`, incluyendo
  multi-dispositivo, mensajes fuera de orden y rotación de membresía.
- [ ] 2.8 Diseñar `IntelligencePackage` cifrado con procedencia, destinatarios,
  restricciones, manifest y recibos.
- [ ] 2.9 Auditar nonce único, replay, forward secrecy, recuperación,
  revocación, metadatos y restauración.
- [ ] 2.10 Implementar participación opcional de Qwen local como miembro visible,
  con consentimiento total y rotación al retirarlo.

## 3. Canal de denuncias

- [ ] 3.1 Comparar integración GlobaLeaks con implementación propia.
- [ ] 3.2 Diseñar alias, recibo de recuperación y casilla bidireccional.
- [ ] 3.3 Separar datos, claves, receptores y permisos de administración general.
- [ ] 3.4 Diseñar saneamiento de metadatos, malware scanning y cadena de custodia.
- [ ] 3.5 Diseñar derivación a autoridades y publicación desde copia redactada.
- [ ] 3.6 Revisar y confirmar cambios de nginx/infra antes de aplicarlos.
- [ ] 3.7 Ejecutar auditoría, simulacro de incidente y piloto restringido.

## 3B. Periodismo ciudadano e investigación

- [ ] 3B.1 Diseñar perfiles `CITIZEN_REPORTER`, `INVESTIGATIVE_JOURNALIST`,
  `INVESTIGATIVE_EDITOR` y `SOURCE_PROTECTION_OFFICER` con alcances separados.
- [ ] 3B.2 Diseñar reporte protegido, recibo, lead, asignación, bóveda de
  identidad, evidencia, revisión, derecho de respuesta y corrección.
- [ ] 3B.3 Prototipar wizard accesible con una decisión principal por paso y
  lenguaje honesto sobre riesgos.
- [ ] 3B.4 Implementar acceso mínimo por asignación y separación criptográfica de
  identidad de fuente.
- [ ] 3B.5 Implementar copiloto de investigación solo con Qwen local para
  contenido sensible; la etapa API se limita a información pública.
- [ ] 3B.6 Obtener revisión jurídica chilena sobre fuente, medio, publicación,
  respuesta y responsabilidades.
- [ ] 3B.7 Ejecutar evaluación de seguridad digital, física, legal y psicológica
  con periodistas y organizaciones especializadas.

## 4. Asistente de IA — preparación

- [ ] 4.1 Congelar fuentes autorizadas y reglas de privacidad.
- [ ] 4.2 Crear evaluación retenida de al menos 100 casos.
- [ ] 4.3 Diseñar e implementar `AiProvider` para generación, streaming, salidas
  estructuradas, herramientas, embeddings, salud y metadatos.
- [ ] 4.3.1 Diseñar `ModelRegistry` con capacidades, clases de datos, versión,
  métricas y estados `CANDIDATE/SHADOW/ACTIVE/FALLBACK/RETIRED`.
- [ ] 4.3.2 Implementar router por tarea, privacidad y evaluación, más un modo
  degradado sin IA.
- [ ] 4.4 Diseñar índices público y tenant con pruebas contra fugas.
- [ ] 4.5 Implementar piloto API de solo lectura con citas y abstención, comenzando
  por recepción y conocimiento público.
- [ ] 4.6 Diseñar asistentes de contexto para recepción, educación, voluntariado,
  profesionales, edición y soporte.
- [ ] 4.7 Definir herramientas por contexto y excluir transiciones de aprobación,
  verificación, publicación, firma y cierre.
- [ ] 4.8 Diseñar memoria corta y retención mínima para recepción pública.
- [ ] 4.9 Diseñar escritura de borradores con confirmación, procedencia y auditoría.
- [ ] 4.10 Diseñar asistente de oportunidades, preparación institucional,
  colaboración y formulación junto al cambio `comunicacion-grants-reporting`.
- [ ] 4.11 Definir explicaciones de matching, incertidumbre y controles contra
  concentración o sesgo territorial.
- [ ] 4.12 Portar a TypeScript el patrón de defensa cognitiva de Sentinel con
  atribución, sin reutilizar reglas de dominio incompatibles.
- [ ] 4.13 Implementar `ContentIngressGuard`, `PrivacySanitizer`,
  `DataPolicyEngine`, `SafeContextBuilder`, `ToolPolicyGateway`, `OutputGuard` y
  `SafeTelemetryEmitter`.
- [ ] 4.14 Adaptar el corpus Sentinel y agregar RUT, PII, secretos, coordenadas,
  RAG injection, Unicode, cross-tenant y denuncias.
- [ ] 4.15 Prohibir bypass general del sanitizador en producción y separar logs,
  auditoría y datasets de evaluación.

## 5. Fine-tuning y producción futura

- [ ] 5.1 Medir Qwen3.8-27B base con la misma evaluación del proveedor API y
  confirmar si existe una brecha que justifica entrenamiento.
- [ ] 5.2 Preparar 300–500 ejemplos SFT versionados, licenciados y revisados.
- [ ] 5.3 Entrenar LoRA/QLoRA y evaluar checkpoints, costo y seguridad.
- [ ] 5.4 Realizar revisión científica, comunitaria y red-team.
- [ ] 5.5 Desplegar gradualmente en inferencia aislada, con rollback.
- [ ] 5.6 Evaluar por separado recepción, educación, voluntariado, trabajo
  profesional y edición.
- [ ] 5.7 Migrar de API a Qwen local por configuración, con despliegue gradual y
  rollback, sin cambios de frontend.
- [ ] 5.8 Versionar prompts, datasets, adaptadores y evaluaciones en formatos
  portables que no dependan del proveedor.

## 6. Verificación integral

- [ ] 6.1 E2E de separación entre organizaciones y colectivos.
- [ ] 6.2 E2E de autorización de conversaciones y archivos.
- [ ] 6.3 Pruebas de no registro de secretos, cuerpos y metadatos prohibidos.
- [ ] 6.4 Pruebas de acceso administrativo denegado a denuncias.
- [ ] 6.5 Pruebas de cero fuga de tenant y coordenadas por el asistente.
- [ ] 6.6 Revisión de accesibilidad y lenguaje honesto sobre privacidad y anonimato.
- [ ] 6.7 E2E de asignación periodística, identidad reservada, revisión editorial,
  publicación redactada y corrección.
- [ ] 6.8 Pruebas de que prompts, respuestas, documentos y parámetros no aparecen
  en telemetría ni errores entregados al cliente.
