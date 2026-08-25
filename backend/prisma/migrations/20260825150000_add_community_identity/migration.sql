-- F1: identidad comunitaria, disciplinas, credenciales y roles con alcance.

CREATE TABLE "PersonProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "displayName" TEXT,
    "bio" TEXT,
    "region" TEXT,
    "commune" TEXT,
    "website" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PersonProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Discipline" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Discipline_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProfessionalCredential" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "disciplineId" TEXT NOT NULL,
    "issuer" TEXT,
    "credentialRef" TEXT,
    "evidenceUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "issuedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "verifiedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProfessionalCredential_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TerritorialCollective" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "commune" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TerritorialCollective_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CollectiveMembership" (
    "id" TEXT NOT NULL,
    "collectiveId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PARTICIPANT',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CollectiveMembership_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RoleAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "collectiveId" TEXT,
    "role" TEXT NOT NULL,
    "scope" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "grantedById" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RoleAssignment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PersonProfile_userId_key" ON "PersonProfile"("userId");
CREATE UNIQUE INDEX "Discipline_code_key" ON "Discipline"("code");
CREATE INDEX "ProfessionalCredential_userId_status_idx" ON "ProfessionalCredential"("userId", "status");
CREATE INDEX "ProfessionalCredential_disciplineId_status_idx" ON "ProfessionalCredential"("disciplineId", "status");
CREATE UNIQUE INDEX "TerritorialCollective_slug_key" ON "TerritorialCollective"("slug");
CREATE UNIQUE INDEX "CollectiveMembership_collectiveId_userId_key" ON "CollectiveMembership"("collectiveId", "userId");
CREATE INDEX "CollectiveMembership_userId_status_idx" ON "CollectiveMembership"("userId", "status");
CREATE UNIQUE INDEX "RoleAssignment_userId_organizationId_role_collectiveId_key" ON "RoleAssignment"("userId", "organizationId", "role", "collectiveId");
CREATE INDEX "RoleAssignment_organizationId_status_idx" ON "RoleAssignment"("organizationId", "status");
CREATE INDEX "RoleAssignment_collectiveId_status_idx" ON "RoleAssignment"("collectiveId", "status");

INSERT INTO "Discipline" ("id", "code", "name", "description") VALUES
  ('00000000-0000-4000-8000-000000000001', 'ENVIRONMENTALIST', 'Ambientalista', 'Gestión y protección ambiental'),
  ('00000000-0000-4000-8000-000000000002', 'AGRONOMIST', 'Agrónomo/a', 'Ciencias agrarias y producción sostenible'),
  ('00000000-0000-4000-8000-000000000003', 'ECOLOGIST', 'Ecólogo/a', 'Ecología y funcionamiento de ecosistemas'),
  ('00000000-0000-4000-8000-000000000004', 'BIOLOGIST', 'Biólogo/a', 'Biología y biodiversidad'),
  ('00000000-0000-4000-8000-000000000005', 'JOURNALIST', 'Periodista', 'Investigación, verificación y edición periodística'),
  ('00000000-0000-4000-8000-000000000006', 'EDUCATOR', 'Educador/a', 'Educación ambiental y divulgación'),
  ('00000000-0000-4000-8000-000000000007', 'FORESTRY', 'Ingeniero/a forestal', 'Manejo y restauración de ecosistemas forestales'),
  ('00000000-0000-4000-8000-000000000008', 'DATA_SCIENCE', 'Ciencia de datos', 'Análisis, datos abiertos e investigación reproducible')
ON CONFLICT ("code") DO NOTHING;

ALTER TABLE "PersonProfile" ADD CONSTRAINT "PersonProfile_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProfessionalCredential" ADD CONSTRAINT "ProfessionalCredential_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProfessionalCredential" ADD CONSTRAINT "ProfessionalCredential_disciplineId_fkey"
  FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProfessionalCredential" ADD CONSTRAINT "ProfessionalCredential_verifiedById_fkey"
  FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CollectiveMembership" ADD CONSTRAINT "CollectiveMembership_collectiveId_fkey"
  FOREIGN KEY ("collectiveId") REFERENCES "TerritorialCollective"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectiveMembership" ADD CONSTRAINT "CollectiveMembership_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoleAssignment" ADD CONSTRAINT "RoleAssignment_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoleAssignment" ADD CONSTRAINT "RoleAssignment_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoleAssignment" ADD CONSTRAINT "RoleAssignment_collectiveId_fkey"
  FOREIGN KEY ("collectiveId") REFERENCES "TerritorialCollective"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RoleAssignment" ADD CONSTRAINT "RoleAssignment_grantedById_fkey"
  FOREIGN KEY ("grantedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
