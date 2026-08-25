import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../../database/database.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CreateRoleAssignmentDto } from './dto/create-role-assignment.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VerifyCredentialDto } from './dto/verify-credential.dto';

@Injectable()
export class CommunityService {
  constructor(private readonly prisma: DatabaseService) {}

  getProfile(userId: string) {
    return this.prisma
      .$queryRaw<ProfileRow[]>(
        Prisma.sql`
      SELECT p.*, u.email
      FROM "PersonProfile" p
      JOIN "User" u ON u.id = p."userId"
      WHERE p."userId" = ${userId}
      LIMIT 1
    `,
      )
      .then((rows) => rows[0] ?? null);
  }

  async upsertProfile(userId: string, dto: UpdateProfileDto) {
    const current = await this.getProfile(userId);
    const profile = {
      firstName: dto.firstName ?? current?.firstName ?? null,
      lastName: dto.lastName ?? current?.lastName ?? null,
      displayName: dto.displayName ?? current?.displayName ?? null,
      bio: dto.bio ?? current?.bio ?? null,
      region: dto.region ?? current?.region ?? null,
      commune: dto.commune ?? current?.commune ?? null,
      website: dto.website ?? current?.website ?? null,
      visibility: dto.visibility ?? current?.visibility ?? 'PRIVATE',
    };

    return this.prisma
      .$queryRaw<ProfileRow[]>(
        Prisma.sql`
      INSERT INTO "PersonProfile"
        ("id", "userId", "firstName", "lastName", "displayName", "bio",
         "region", "commune", "website", "visibility", "createdAt", "updatedAt")
      VALUES (${randomUUID()}, ${userId}, ${profile.firstName},
        ${profile.lastName}, ${profile.displayName}, ${profile.bio},
        ${profile.region}, ${profile.commune}, ${profile.website},
        ${profile.visibility}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT ("userId") DO UPDATE SET
        "firstName" = EXCLUDED."firstName",
        "lastName" = EXCLUDED."lastName",
        "displayName" = EXCLUDED."displayName",
        "bio" = EXCLUDED."bio",
        "region" = EXCLUDED."region",
        "commune" = EXCLUDED."commune",
        "website" = EXCLUDED."website",
        "visibility" = EXCLUDED."visibility",
        "updatedAt" = CURRENT_TIMESTAMP
      RETURNING *
    `,
      )
      .then((rows) => rows[0]);
  }

  listDisciplines() {
    return this.prisma.$queryRaw<DisciplineRow[]>(Prisma.sql`
      SELECT "id", "code", "name", "description"
      FROM "Discipline"
      ORDER BY "name" ASC
    `);
  }

  listCredentials(userId: string) {
    return this.prisma.$queryRaw<CredentialRow[]>(Prisma.sql`
      SELECT c.*, d."code" AS "disciplineCode", d."name" AS "disciplineName"
      FROM "ProfessionalCredential" c
      JOIN "Discipline" d ON d."id" = c."disciplineId"
      WHERE c."userId" = ${userId}
      ORDER BY c."createdAt" DESC
    `);
  }

  async createCredential(userId: string, dto: CreateCredentialDto) {
    const discipline = await this.prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT "id" FROM "Discipline" WHERE "id" = ${dto.disciplineId} LIMIT 1
    `);
    if (!discipline[0]) throw new NotFoundException('Disciplina no encontrada');

    return this.prisma
      .$queryRaw<CredentialRow[]>(
        Prisma.sql`
      INSERT INTO "ProfessionalCredential"
        ("id", "userId", "disciplineId", "issuer", "credentialRef",
         "evidenceUrl", "status", "issuedAt", "expiresAt", "createdAt", "updatedAt")
      VALUES (${randomUUID()}, ${userId}, ${dto.disciplineId},
        ${dto.issuer ?? null}, ${dto.credentialRef ?? null},
        ${dto.evidenceUrl ?? null}, 'PENDING',
        ${dto.issuedAt ? new Date(dto.issuedAt) : null},
        ${dto.expiresAt ? new Date(dto.expiresAt) : null},
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `,
      )
      .then((rows) => rows[0]);
  }

  listRoleAssignments(userId: string, organizationId: string) {
    return this.prisma.$queryRaw<RoleAssignmentRow[]>(Prisma.sql`
      SELECT r.*, c."name" AS "collectiveName", c."slug" AS "collectiveSlug"
      FROM "RoleAssignment" r
      LEFT JOIN "TerritorialCollective" c ON c."id" = r."collectiveId"
      WHERE r."userId" = ${userId} AND r."organizationId" = ${organizationId}
      ORDER BY r."createdAt" DESC
    `);
  }

  async createRoleAssignment(
    grantedById: string,
    organizationId: string,
    dto: CreateRoleAssignmentDto,
  ) {
    const target = await this.prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT "id" FROM "User"
      WHERE "id" = ${dto.userId} AND "organizationId" = ${organizationId}
      LIMIT 1
    `);
    if (!target[0]) throw new NotFoundException('Usuario no encontrado');

    if (dto.collectiveId) {
      const collective = await this.prisma.$queryRaw<
        { id: string }[]
      >(Prisma.sql`
        SELECT "id" FROM "TerritorialCollective"
        WHERE "id" = ${dto.collectiveId} AND "status" = 'ACTIVE'
        LIMIT 1
      `);
      if (!collective[0]) {
        throw new NotFoundException('Colectivo territorial no encontrado');
      }
    }

    return this.prisma
      .$queryRaw<RoleAssignmentRow[]>(
        Prisma.sql`
      INSERT INTO "RoleAssignment"
        ("id", "userId", "organizationId", "collectiveId", "role", "scope",
         "status", "grantedById", "startsAt", "endsAt", "createdAt", "updatedAt")
      VALUES (${randomUUID()}, ${dto.userId}, ${organizationId},
        ${dto.collectiveId ?? null}, ${dto.role}, ${dto.scope ?? null}, 'ACTIVE',
        ${grantedById}, ${dto.startsAt ? new Date(dto.startsAt) : new Date()},
        ${dto.endsAt ? new Date(dto.endsAt) : null}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT ("userId", "organizationId", "role", "collectiveId")
      DO UPDATE SET
        "scope" = EXCLUDED."scope",
        "status" = 'ACTIVE',
        "grantedById" = EXCLUDED."grantedById",
        "startsAt" = EXCLUDED."startsAt",
        "endsAt" = EXCLUDED."endsAt",
        "updatedAt" = CURRENT_TIMESTAMP
      RETURNING *
    `,
      )
      .then((rows) => rows[0]);
  }

  async verifyCredential(
    reviewerId: string,
    organizationId: string,
    credentialId: string,
    dto: VerifyCredentialDto,
  ) {
    const credential = await this.prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT c."id"
      FROM "ProfessionalCredential" c
      JOIN "User" owner ON owner."id" = c."userId"
      WHERE c."id" = ${credentialId}
        AND owner."organizationId" = ${organizationId}
      LIMIT 1
    `);
    if (!credential[0]) throw new NotFoundException('Credencial no encontrada');

    return this.prisma
      .$queryRaw<CredentialRow[]>(
        Prisma.sql`
      UPDATE "ProfessionalCredential"
      SET "status" = ${dto.status},
          "verifiedAt" = CURRENT_TIMESTAMP,
          "verifiedById" = ${reviewerId},
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${credentialId}
      RETURNING *
    `,
      )
      .then((rows) => rows[0]);
  }
}

type ProfileRow = {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  bio: string | null;
  region: string | null;
  commune: string | null;
  website: string | null;
  visibility: string;
  email?: string;
};

type DisciplineRow = {
  id: string;
  code: string;
  name: string;
  description: string | null;
};

type CredentialRow = {
  id: string;
  userId: string;
  disciplineId: string;
  disciplineCode?: string;
  disciplineName?: string;
  status: string;
};

type RoleAssignmentRow = {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  status: string;
  collectiveName?: string;
  collectiveSlug?: string;
};
