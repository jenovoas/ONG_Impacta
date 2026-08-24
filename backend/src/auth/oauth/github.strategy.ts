import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import axios from 'axios';
import type { OAuthProfile, OAuthVerifier } from './oauth.types';

/**
 * Verifica GitHub access tokens contra la REST API v3.
 *
 * El frontend usa el GitHub OAuth flow (web) o @octokit/auth-oauth-device en
 * mobile para obtener un access_token. El backend lo valida contra /user.
 *
 * Si el user tiene email privado, /user.email viene null y necesitamos
 * pegarle a /user/emails (requiere scope user:email).
 *
 * Config (env): ninguno (GitHub no requiere aud check para access tokens de OAuth App).
 */
@Injectable()
export class GithubStrategy implements OAuthVerifier {
  readonly provider = 'github' as const;
  private readonly logger = new Logger(GithubStrategy.name);

  async verify(input: { accessToken?: string }): Promise<OAuthProfile> {
    if (!input.accessToken) {
      throw new UnauthorizedException('GitHub requiere accessToken');
    }

    const headers = {
      Authorization: `Bearer ${input.accessToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'impacta-backend',
    };

    // 1) /user
    let userRes;
    try {
      userRes = await axios.get('https://api.github.com/user', { headers, timeout: 10_000 });
    } catch (err) {
      this.logger.warn(`GitHub /user failed: ${(err as Error).message}`);
      throw new UnauthorizedException('GitHub accessToken inválido o expirado');
    }

    const user = userRes.data;
    if (!user?.id) {
      throw new UnauthorizedException('GitHub /user sin id');
    }

    let email: string | null = user.email ?? null;
    let emailVerified = !!user.email; // GitHub marca como verificado el primary email del /user/emails

    // 2) Si email es null (privado), buscar en /user/emails
    if (!email) {
      try {
        const emailsRes = await axios.get('https://api.github.com/user/emails', {
          headers, timeout: 10_000,
        });
        const primary = Array.isArray(emailsRes.data)
          ? emailsRes.data.find((e: any) => e.primary && e.verified)
          : null;
        if (primary) {
          email = primary.email;
          emailVerified = true;
        }
      } catch (err) {
        this.logger.debug(`GitHub /user/emails failed (non-fatal): ${(err as Error).message}`);
      }
    }

    return {
      provider: 'github',
      providerUserId: String(user.id),
      email,
      name: user.name ?? user.login ?? null,
      avatarUrl: user.avatar_url ?? null,
      emailVerified,
    };
  }
}
