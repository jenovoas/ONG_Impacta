import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import type { OAuthProfile, OAuthVerifier } from './oauth.types';

/**
 * Verifica Google ID tokens (JWT firmado por Google).
 *
 * El frontend usa @react-oauth/google (o gapi) para obtener el id_token y lo
 * manda al backend. Acá validamos firma + audience + issuer con la lib oficial.
 *
 * Config (env):
 *   GOOGLE_CLIENT_ID  → aud claim que esperamos en el ID token
 *   GOOGLE_CLIENT_SECRET (opcional, no se usa aquí pero se mantiene para futuro server-flow)
 */
@Injectable()
export class GoogleStrategy implements OAuthVerifier {
  readonly provider = 'google' as const;
  private readonly logger = new Logger(GoogleStrategy.name);
  private client: OAuth2Client | null = null;

  private getClient(): OAuth2Client {
    if (this.client) return this.client;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new UnauthorizedException(
        'Google OAuth no está configurado en el servidor (falta GOOGLE_CLIENT_ID)',
      );
    }
    this.client = new OAuth2Client(clientId);
    return this.client;
  }

  async verify(input: { idToken?: string }): Promise<OAuthProfile> {
    if (!input.idToken) {
      throw new UnauthorizedException('Google requiere idToken');
    }
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new UnauthorizedException('GOOGLE_CLIENT_ID no configurado');
    }

    let ticket;
    try {
      ticket = await this.getClient().verifyIdToken({
        idToken: input.idToken,
        audience: clientId,
      });
    } catch (err) {
      this.logger.warn(`Google verifyIdToken failed: ${(err as Error).message}`);
      throw new UnauthorizedException('Google idToken inválido o expirado');
    }

    const payload = ticket.getPayload();
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Google token sin sub/email');
    }

    return {
      provider: 'google',
      providerUserId: payload.sub,
      email: payload.email,
      name: payload.name ?? null,
      avatarUrl: payload.picture ?? null,
      emailVerified: payload.email_verified === true,
    };
  }
}
