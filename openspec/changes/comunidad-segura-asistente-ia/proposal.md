# Proposal: Comunidad segura y asistente de IA

## Why

Impacta+ necesita reunir el conocimiento de visitantes, voluntarios, miembros,
profesionales y comunidades sin convertir un rol único en fuente de autoridad.
También requiere comunicación privada para coordinar trabajo y un canal
especializado para denuncias sensibles. A futuro, un asistente de IA podrá
facilitar educación y curación, pero solo sobre una base de permisos, fuentes y
seguridad ya establecida.

## What Changes

- Se separan identidad, participación, credenciales y permisos funcionales.
- Se incorporan aportes comunitarios con procedencia, consentimiento y revisión.
- Se crea mensajería interna privada con autorización por conversación.
- Se diseña un canal de denuncias aislado, con alias y casilla bidireccional.
- Se incorpora periodismo ciudadano conectado con periodistas profesionales
  verificados, investigación protegida y revisión editorial.
- Se define publicación redactada y revisada, nunca automática.
- Se inicia un asistente mediante una API desacoplada y se prepara la migración
  a Qwen3.8-27B local, con RAG, citas y fine-tuning LoRA condicionado a
  evaluaciones equivalentes.

## Capabilities

### New Capabilities

- `comunidad-conocimiento`: perfiles múltiples, participación, experiencia,
  credenciales y aportes comunitarios.
- `mensajeria-interna`: conversaciones privadas y acotadas por participación.
- `canal-denuncias`: recepción segura, alias, casilla anónima y derivación o
  publicación redactada.
- `periodismo-ciudadano`: reportes protegidos, asignación periodística,
  verificación de evidencia y publicación de interés público revisada.
- `asistente-ia`: asistencia educativa y operativa con permisos, fuentes y
  evaluación.

## Non-goals

- No prometer anonimato absoluto desde una aplicación web convencional.
- No atribuir publicación científica automática a profesionales o IA.
- No usar mensajería o denuncias como datos de entrenamiento por defecto.
- No inventar un protocolo criptográfico propio ni llamar E2EE al modo
  administrado por el servidor.
- No reemplazar a autoridades, universidades, plataformas científicas ni
  canales formales de denuncia.
- No desplegar el modelo ni cambiar infraestructura en esta propuesta.
- No crear subdominios.

## Impact

- **Dominio:** evolución gradual del usuario tenant hacia una identidad global
  con participaciones y permisos acotados.
- **Seguridad:** nuevas fronteras de confianza, claves y operadores separados
  para mensajería y denuncias.
- **Frontend:** perfiles, espacios comunitarios, bandeja privada y ruta segura en
  el mismo build React.
- **IA:** contrato interno de proveedor; inferencia externa por API al inicio y
  Qwen local aislado después, siempre expuesto únicamente mediante la API del
  dominio único y subordinado al backend de permisos.
- **Legal:** revisión chilena obligatoria antes de habilitar denuncias en
  producción.
