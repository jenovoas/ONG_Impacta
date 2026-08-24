import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import axios from 'axios';
import type { OAuthProfile, OAuthVerifier } from './oauth.types';

/**
 * Verifica Facebook access tokens contra la Graph API.
 *
 * El frontend usa Facebook SDK (fb.login) o el JS SDK para obtener un
 * accessToken de corta duración. El backend lo valida contra /me.
 *
 * Config (env):
 *   FACEBOOK_APP_ID     → esperado en ?app_id del debug_token (opcional pero recomendado)
 *   FACEBOOK_APP_SECRET → no se usa aquí directamente, pero debe estar en el flujo
 *                         client-side de Facebook Login si querés tokens de larga duración.
 */
@Injectable()
export class FacebookStrategy implements OAuthVerifier {
  readonly provider = 'facebook' as const;
  private readonly logger = new Logger(FacebookStrategy.name);

  async verify(input: { accessToken?: string }): Promise<OAuthProfile> {
    if (!input.accessToken) {
      throw new UnauthorizedException('Facebook requiere accessToken');
    }

    // 1) Pedir perfil a /me. Si falla, el token es inválido.
    let meRes;
    try {
      meRes = await axios.get('https://graph.facebook.com/v19.0/me', {
        params: {
          access_token: input.accessToken,
          fields: 'id,name,email,picture.type(large)',
        },
        timeout: 10_000,
      });
    } catch (err) {
      this.logger.warn(`Facebook /me failed: ${(err as Error).message}`);
      throw new UnauthorizedException('Facebook accessToken inválido o expirado');
    }

    const me = meRes.data;
    if (!me?.id) {
      throw new UnauthorizedException('Facebook /me sin id');
    }

    // Email es opcional en Facebook. Si falta, el user debe completar signup manual.
    let emailVerified = false;
    if (me.email) {
      // 2) Si tenemos app_id configurado, debug_token confirma que el app validó el email.
      const appId = process.env.FACEBOOK_APP_ID;
      if (appId && process.env.FACEBOOK_APP_SECRET) {
        try {
          const debugRes = await axios.get('https://graph.facebook.com/v19.0/debug_token', {
            params: {
              input_token: input.accessToken,
              access_token: `${appId}|${process.env.FACEBOOK_APP_SECRET}`,
            },
            timeout: 10_000,
          });
          const data = debugRes.data?.data;
          if (data?.app_id === appId && data?.is_valid) {
            // Facebook marca el email como verificado si el user lo confirmó.
            // Si no, no asumimos.
            emailVerified = !!data.email_confirmed_at;
          }
        } catch (err) {
          this.logger.debug(`Facebook debug_token failed (non-fatal): ${(err as Error).message}`);
        }
      }
    }

    return {
      provider: 'facebook',
      providerUserId: me.id,
      email: me.email ?? null,
      name: me.name ?? null,
      avatarUrl: me.picture?.data?.url ?? null,
      emailVerified,
    };
  }
}
