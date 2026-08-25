# Impacta+ — Perfiles, participación y conocimiento comunitario

## Propósito

Permitir que visitantes, voluntarios, miembros, profesionales y personas con
conocimiento local aporten a un acervo comunal sin confundir identidad,
pertenencia a una ONG, credenciales profesionales ni permisos editoriales.

Una persona puede participar de varias formas simultáneamente. Ser agrónoma no
implica pertenecer a una ONG; ser voluntario no habilita a publicar una ficha
científica; y el conocimiento territorial no debe quedar subordinado a un
título universitario.

## Decisión de arquitectura

El campo único `User.role` actual no será el modelo final de autorización. La
evolución separará cuatro conceptos:

1. **Identidad global:** cuenta y perfil de la persona.
2. **Participación:** relación con una organización, colectivo, proyecto o
   territorio.
3. **Experiencia y credenciales:** áreas de conocimiento declaradas o
   verificadas.
4. **Permisos funcionales:** acciones concretas autorizadas dentro de un
   alcance.

```text
Cuenta global
├── Perfil personal
├── Participaciones
│   ├── Organización A: miembro + coordinador de misión
│   └── Colectivo territorial: voluntario
├── Experiencia
│   ├── conocimiento local del humedal
│   └── agronomía (credencial verificada)
└── Permisos acotados
    ├── aportar observaciones
    └── revisar contenido de flora
```

## Perfiles de participación

| Perfil | Puede hacer inicialmente | No obtiene automáticamente |
|---|---|---|
| Visitante | Consultar contenido público | Mensajería, aportes o datos privados |
| Participante registrado | Mantener perfil y solicitar participación | Acceso a una ONG |
| Voluntario | Participar en misiones y aportar evidencias autorizadas | Publicación científica |
| Miembro de organización | Acceder a funciones asignadas por su ONG | Acceso a otras organizaciones |
| Persona con conocimiento comunitario | Aportar saber territorial con consentimiento y procedencia | Validación académica automática |
| Estudiante o investigador | Proponer evidencia y referencias | Aprobación final automática |
| Profesional | Declarar especialidades y solicitar verificación | Permisos editoriales por el solo título |
| Periodista ciudadano | Crear reportes protegidos y aportar evidencia | Acceso a otros casos o publicación directa |
| Periodista profesional verificado | Investigar casos asignados y contrastar fuentes | Acceso global a reportes o identidad reservada |

Los perfiles no son mutuamente excluyentes.

## Roles funcionales

- `FIELD_CONTRIBUTOR`: aporta observaciones y evidencia de terreno.
- `KNOWLEDGE_CONTRIBUTOR`: propone conocimiento local o bibliográfico.
- `CATALOG_CURATOR`: mantiene estructura y borradores del catálogo.
- `SCIENTIFIC_REVIEWER`: revisa afirmaciones dentro de especialidades y
  territorios asignados.
- `COMMUNITY_REVIEWER`: revisa contexto territorial y conocimiento local.
- `EDUCATION_EDITOR`: adapta contenido validado a lenguaje educativo.
- `CITIZEN_REPORTER`: aporta reportes y evidencia con identidad elegida.
- `INVESTIGATIVE_JOURNALIST`: investiga expedientes expresamente asignados.
- `INVESTIGATIVE_EDITOR`: coordina revisión y propone decisiones editoriales.
- `SOURCE_PROTECTION_OFFICER`: gestiona accesos excepcionales a identidades.
- `MISSION_COORDINATOR`: coordina trabajo de campo.
- `MODERATOR`: atiende convivencia y contenido reportado.
- `PUBLISHER`: autoriza publicación dentro de un alcance.
- `ORG_ADMIN`: administra una organización, no todo el sistema.
- `SYSTEM_ADMIN`: administra la plataforma, sin acceso automático al contenido
  confidencial de denuncias.

Los permisos deben ser asignaciones con alcance, por ejemplo:
`SCIENTIFIC_REVIEWER` para flora de la provincia de Arauco dentro del catálogo,
no un privilegio global ilimitado.

El perfil de periodista ciudadano no es una credencial profesional. El modelo de
investigación, protección de fuentes y publicación está definido en
`docs/MODELO_PERIODISMO_CIUDADANO_INVESTIGACION.md`.

## Modelo conceptual

- `Account`: autenticación global.
- `PersonProfile`: nombre visible, biografía, pronombres y preferencias.
- `OrganizationMembership`: relación de una cuenta con una ONG y su estado.
- `MemberAccountLink`: vínculo opcional con el registro administrativo
  `Member` existente.
- `TerritorialCollective`: espacio comunitario de una comuna o territorio, sin
  convertirlo en una organización ficticia.
- `CollectiveMembership`: participación de una persona en ese colectivo.
- `Discipline`: taxonomía controlada de disciplinas y oficios.
- `Expertise`: experiencia declarada, trayectoria local o área de práctica.
- `ProfessionalCredential`: antecedente verificable cuando corresponda.
- `RoleAssignment`: permiso, alcance, otorgante, vigencia y motivo.
- `CommunitySubmission`: aporte al acervo comunal.
- `ContributionReview`: revisión, decisión y trazabilidad del aporte.

## Credenciales y confianza

Estados propuestos para una credencial:

- `SELF_DECLARED`
- `PENDING`
- `VERIFIED`
- `REJECTED`
- `EXPIRED`
- `REVOKED`

La verificación debe guardar quién verificó, con qué evidencia y cuándo vence.
Los documentos privados no se harán públicos; el perfil solo mostrará el tipo de
credencial y su estado cuando la persona lo autorice.

"Ambientalista" puede describir experiencia, activismo u oficio y no siempre
una credencial universitaria. El sistema debe reconocer tanto conocimiento
profesional como comunitario, mostrando claramente su procedencia.

## Flujo de contribución

```text
Persona aporta
      ↓
Borrador con procedencia, consentimiento y alcance territorial
      ↓
Revisión comunitaria y/o científica según el tipo de afirmación
      ↓
Correcciones y decisión registrada
      ↓
Publicación, rechazo fundamentado o conservación privada
```

Un aporte comunal no se transforma automáticamente en observación de una ONG.
`OrganizationObservation` permanece bajo propiedad tenant; `CommunitySubmission`
pertenece al colectivo territorial y tiene su propio consentimiento de uso.

## Conocimiento comunitario y consentimiento

Todo aporte debe indicar:

- Persona o alias de atribución, si desea aparecer públicamente.
- Territorio y fecha del conocimiento u observación.
- Tipo de evidencia y nivel de certeza.
- Permiso para publicar, compartir con instituciones o usar en educación.
- Restricciones culturales, territoriales o de ubicación sensible.
- Historial de revisiones y transformaciones editoriales.

El retiro de consentimiento detiene usos futuros cuando legal y técnicamente sea
posible, sin alterar registros de auditoría mínimos ni publicaciones externas ya
transferidas bajo una licencia acordada.

## Criterios de aceptación

- Una cuenta puede tener múltiples participaciones y especialidades.
- Ningún perfil profesional concede publicación automática.
- Los permisos están acotados por organización, colectivo, proyecto, territorio
  o disciplina.
- El conocimiento comunitario conserva procedencia y consentimiento.
- Los aportes comunales y las observaciones tenant no se mezclan.
- El sistema puede explicar por qué una persona tiene cada permiso.
