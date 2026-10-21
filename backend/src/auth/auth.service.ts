import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { OAuthService } from './oauth/oauth.service';
import { RegisterDto } from './dto/register.dto';
import { OAuthLoginDto, OAuthRegisterDto } from './dto/oauth.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

/**
 * AuthService — orquesta todo el ciclo de vida de autenticación:
 *   - Login con email/password (multi-tenant por orgSlug)
 *   - Register self-service (crea Organization trial + User admin)
 *   - Refresh tokens db-backed (rotación NO; revoke explícito en logout)
 *   - OAuth login/register (Google, Facebook, GitHub) con account linking por email
 *
 * Tokens:
 *   - access:  JWT 15min, claims { sub, email, orgId, role }
 *   - refresh: random 32 bytes (base64url), SHA-256 hash persisted en DB,
 *              expira a 30 días. Permite revocación inmediata en logout.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private static readonly REFRESH_TTL_DAYS = 30;
  private static readonly ACCESS_TTL_SECONDS = 60 * 15; // 15min

  constructor(
    private readonly database: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly oauthService: OAuthService,
  ) {}

  // ====================================================================
  // Local (email + password)
  // ====================================================================

  async validateUser(
    email: string,
    pass: string,
    orgSlug: string,
  ): Promise<any> {
    const user = await this.database.user.findFirst({
      where: {
        email,
        organization: { slug: orgSlug },
      },
      include: { organization: true },
    });

    if (!user || !user.passwordHash) return null;
    if (!(await bcrypt.compare(pass, user.passwordHash))) return null;
    if (!user.isActive) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: any, ctx?: { userAgent?: string; ipAddress?: string }) {
    return this.issueTokensForUser(user, ctx);
  }

  async register(
    dto: RegisterDto,
    ctx?: { userAgent?: string; ipAddress?: string },
  ) {
    const slug = dto.orgSlug ?? this.slugify(dto.orgName);

    // 1) Verificar que el slug no exista
    const existingOrg = await this.database.organization.findUnique({
      where: { slug },
    });
    if (existingOrg) {
      throw new ConflictException(`El slug "${slug}" ya está en uso`);
    }

    // 2) Verificar email no usado en NINGUNA org (cada email debe ser único por org,
    //    pero para register fresh asumimos email global unique en el form)
    const emailTaken = await this.database.user.findFirst({
      where: { email: dto.email },
    });
    if (emailTaken) {
      throw new ConflictException(`El email "${dto.email}" ya está registrado`);
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    // 3) Crear org + user admin en una transacción
    const org = await this.database.organization.create({
      data: {
        name: dto.orgName,
        slug,
        plan: 'FREE',
        users: {
          create: {
            email: dto.email,
            passwordHash,
            role: 'ADMIN',
            isActive: true,
            emailVerified: false,
          },
        },
      },
      include: { users: true },
    });

    const user = org.users[0];
    const tokens = await this.generateTokenPair(
      { id: user.id, email: user.email, orgId: org.id, role: user.role },
      ctx,
    );

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: org.id,
        organization: {
          id: org.id,
          name: org.name,
          slug: org.slug,
          plan: org.plan,
        },
      },
    };
  }

  // ====================================================================
  // Refresh + logout
  // ====================================================================

  async refreshTokens(
    refreshToken: string,
    ctx?: { userAgent?: string; ipAddress?: string },
  ) {
    if (!refreshToken || refreshToken.length < 20) {
      throw new UnauthorizedException('Refresh token inválido');
    }
    const tokenHash = this.hashToken(refreshToken);

    const stored = await this.database.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { include: { organization: true } } },
    });

    if (!stored) throw new UnauthorizedException('Refresh token no encontrado');
    if (stored.revokedAt)
      throw new UnauthorizedException('Refresh token revocado');
    if (stored.expiresAt < new Date())
      throw new UnauthorizedException('Refresh token expirado');
    if (!stored.user.isActive) throw new UnauthorizedException('User inactivo');

    // Atomic rotation: revoca el refresh usado (anti-replay) y emite un par nuevo.
    // Un refresh_token puede usarse UNA sola vez (mitigates theft reuse).
    const tokens = await this.generateTokenPair(
      {
        id: stored.user.id,
        email: stored.user.email,
        orgId: stored.user.organizationId,
        role: stored.user.role,
      },
      ctx,
    );

    await this.database.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return {
      ...tokens,
      user: {
        id: stored.user.id,
        email: stored.user.email,
        role: stored.user.role,
        organizationId: stored.user.organizationId,
        organization: {
          id: stored.user.organization.id,
          name: stored.user.organization.name,
          slug: stored.user.organization.slug,
          plan: stored.user.organization.plan,
        },
      },
    };
  }

  async logout(refreshToken: string): Promise<{ revoked: boolean }> {
    if (!refreshToken) return { revoked: false };
    const tokenHash = this.hashToken(refreshToken);
    try {
      await this.database.refreshToken.update({
        where: { tokenHash },
        data: { revokedAt: new Date() },
      });
      return { revoked: true };
    } catch {
      // Token no estaba en DB; considerarlo "best effort" logout.
      return { revoked: false };
    }
  }

  // ====================================================================
  // OAuth
  // ====================================================================

  async loginWithOAuth(
    dto: OAuthLoginDto,
    ctx?: { userAgent?: string; ipAddress?: string },
  ) {
    const profile = await this.oauthService.verify(dto.provider, {
      idToken: dto.idToken,
      accessToken: dto.accessToken,
    });

    if (!profile.email) {
      throw new BadRequestException(
        `El provider ${dto.provider} no entregó un email. No se puede hacer login sin email.`,
      );
    }

    // 1) Buscar OAuthAccount directo
    let oauth = await this.database.oAuthAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider: profile.provider,
          providerUserId: profile.providerUserId,
        },
      },
      include: { user: { include: { organization: true } } },
    });

    // 2) Auto-link por email si no hay match directo
    if (!oauth && dto.linkIfEmailExists !== false) {
      const existingUser = await this.database.user.findFirst({
        where: { email: profile.email },
        include: { organization: true },
      });
      if (existingUser) {
        oauth = await this.database.oAuthAccount.create({
          data: {
            userId: existingUser.id,
            provider: profile.provider,
            providerUserId: profile.providerUserId,
            providerEmail: profile.email,
          },
          include: { user: { include: { organization: true } } },
        });
      }
    }

    if (!oauth) {
      throw new UnauthorizedException({
        message: 'No existe un usuario para este email. Regístrate primero.',
        error: 'USER_NOT_FOUND',
        email: profile.email,
      });
    }

    if (!oauth.user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Marcar email verificado si el provider lo confirmó
    if (profile.emailVerified && !oauth.user.emailVerified) {
      await this.database.user.update({
        where: { id: oauth.user.id },
        data: { emailVerified: true },
      });
    }

    return this.issueTokensForUser(oauth.user, ctx);
  }

  async registerWithOAuth(
    dto: OAuthRegisterDto,
    ctx?: { userAgent?: string; ipAddress?: string },
  ) {
    const profile = await this.oauthService.verify(dto.provider, {
      idToken: dto.idToken,
      accessToken: dto.accessToken,
    });

    if (!profile.email) {
      throw new BadRequestException(
        `El provider ${dto.provider} no entregó un email. No se puede registrar.`,
      );
    }

    // ¿Ya existe un user con ese email en CUALQUIER org?
    const existing = await this.database.user.findFirst({
      where: { email: profile.email },
    });
    if (existing) {
      throw new ConflictException(
        `El email "${profile.email}" ya está registrado. Usa /auth/oauth/login con link=true.`,
      );
    }

    // ¿Ya hay OAuthAccount con este provider+id? (raro, pero defensivo)
    const dupOAuth = await this.database.oAuthAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider: profile.provider,
          providerUserId: profile.providerUserId,
        },
      },
    });
    if (dupOAuth) {
      throw new ConflictException(
        `Este perfil de ${dto.provider} ya está vinculado a otro usuario`,
      );
    }

    const slug = dto.orgSlug ?? this.slugify(dto.orgName);
    const existingOrg = await this.database.organization.findUnique({
      where: { slug },
    });
    if (existingOrg) {
      throw new ConflictException(`El slug "${slug}" ya está en uso`);
    }

    // firstName/lastName: el modelo User actual no los tiene. Si se agregan
    // después, derivarlos acá desde profile.name.

    // Crear org + user + OAuthAccount en pasos separados para evitar el lío
    // de Prisma con includes anidados sobre un modelo recién creado.
    const org = await this.database.organization.create({
      data: {
        name: dto.orgName,
        slug,
        plan: 'FREE',
        users: {
          create: {
            email: profile.email,
            // passwordHash omitido: user OAuth-only (campo nullable)
            role: 'ADMIN',
            isActive: true,
            emailVerified: profile.emailVerified,
            avatarUrl: profile.avatarUrl,
          },
        },
      },
      include: { users: true },
    });

    const user = org.users[0];

    // Vincular OAuthAccount al user recién creado
    await this.database.oAuthAccount.create({
      data: {
        userId: user.id,
        provider: profile.provider,
        providerUserId: profile.providerUserId,
        providerEmail: profile.email,
      },
    });

    // Refetch user con la org populada para issueTokensForUser
    const fullUser = await this.database.user.findUnique({
      where: { id: user.id },
      include: { organization: true },
    });
    return this.issueTokensForUser(fullUser!, ctx, fullUser!.organization);
  }

  // ====================================================================
  // Helpers
  // ====================================================================

  private async issueTokensForUser(user: any, ctx?: any, orgOverride?: any) {
    const org = orgOverride ?? user.organization;
    return this.generateTokenPair(
      {
        id: user.id,
        email: user.email,
        orgId: user.organizationId,
        role: user.role,
      },
      ctx,
    ).then((tokens) => ({
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        organization: org
          ? { id: org.id, name: org.name, slug: org.slug, plan: org.plan }
          : undefined,
      },
    }));
  }

  private async generateTokenPair(
    claims: { id: string; email: string; orgId: string; role: string },
    ctx?: { userAgent?: string; ipAddress?: string },
  ) {
    const access_token = await this.jwtService.signAsync(
      {
        sub: claims.id,
        email: claims.email,
        orgId: claims.orgId,
        role: claims.role,
      },
      { expiresIn: AuthService.ACCESS_TTL_SECONDS },
    );

    const refresh_token = crypto.randomBytes(32).toString('base64url');
    const tokenHash = this.hashToken(refresh_token);
    const expiresAt = new Date(
      Date.now() + AuthService.REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000,
    );

    await this.database.refreshToken.create({
      data: {
        userId: claims.id,
        tokenHash,
        expiresAt,
        userAgent: ctx?.userAgent ?? null,
        ipAddress: ctx?.ipAddress ?? null,
      },
    });

    return {
      access_token,
      refresh_token,
      access_token_expires_in: AuthService.ACCESS_TTL_SECONDS,
      refresh_token_expires_in: AuthService.REFRESH_TTL_DAYS * 24 * 60 * 60,
    };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private slugify(text: string): string {
    return (
      text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // strip accents
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || `org-${Date.now().toString(36)}`
    );
  }
}
