# Tasks: Runtime de Impacta+ sobre Sentinel

## 0. Baseline

- [x] 0.1 Confirmar servicios Sentinel e Impacta+ activos en `fenix`.
- [ ] 0.2 Definir perfil mínimo de conformidad para desarrollo, staging y producción.
- [ ] 0.3 Acordar responsables y procedimiento de mantenimiento Sentinel.

## 1. Contratos

- [ ] 1.1 Diseñar `SentinelManagedNode` y estados de conformidad.
- [ ] 1.2 Diseñar `SentinelHostAdapter` de salud y emisión de eventos.
- [ ] 1.3 Diseñar `ImpactaSecurityEvent` sin contenido sensible.
- [ ] 1.4 Versionar políticas y capacidades del nodo.

## 2. Defensa y telemetría

- [x] 2.1 Implementar la primera capa `ContentIngressGuard` y
  `PrivacySanitizer`; queda pendiente conectarla al adaptador de eventos del host.
- [x] 2.2 Implementar `SafeTelemetryEmitter` con huella HMAC y metadatos
  mínimos; no conserva payload.
- [x] 2.3 Probar ausencia de prompts, mensajes, documentos, PII y coordenadas
  en la telemetría y el borde de ingreso.
- [ ] 2.4 Separar logs operativos, auditoría de seguridad y datasets.

## 3. Degradación

- [ ] 3.1 Implementar circuit breaker de Cortex.
- [ ] 3.2 Desactivar herramientas IA privilegiadas en estado degradado.
- [ ] 3.3 Mantener landing, búsqueda y derivación humana cuando sea seguro.
- [ ] 3.4 Alertar `NON_COMPLIANT` sin almacenar payloads fallidos.

## 4. Qwen local futuro

- [ ] 4.1 Crear usuario y servicio de inferencia aislados en un nodo Sentinel.
- [ ] 4.2 Restringir red, filesystem, secretos y recursos GPU.
- [ ] 4.3 Conectar únicamente mediante `AiProvider` y backend.
- [ ] 4.4 Verificar que Sentinel observe métricas sin plaintext.

## 5. Operación

- [ ] 5.1 Agregar preflight Sentinel al deploy después de aprobación de infra.
- [ ] 5.2 Agregar verificaciones post-deploy y canarios de privacidad.
- [ ] 5.3 Documentar rollback independiente de Impacta+, Sentinel y modelo.
- [ ] 5.4 Ejecutar simulacro de caída de Cortex y Qwen.
