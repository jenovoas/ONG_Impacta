import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { GoogleStrategy } from './google.strategy';
import { FacebookStrategy } from './facebook.strategy';
import { GithubStrategy } from './github.strategy';
import type { OAuthProfile, OAuthVerifier } from './oauth.types';
import type { OAuthProvider } from '../dto/oauth.dto';

/**
 * Despacha la verificación al provider correcto.
 * Un provider no configurado (ej. falta GOOGLE_CLIENT_ID) responde 401, no 500,
 * para que el frontend sepa que ese botón debe estar deshabilitado.
 */
@Injectable()
export class OAuthService {
  private readonly logger = new Logger(OAuthService.name);
  private readonly verifiers: Record<OAuthProvider, OAuthVerifier>;

  constructor(
    private readonly google: GoogleStrategy,
    private readonly facebook: FacebookStrategy,
    private readonly github: GithubStrategy,
  ) {
    this.verifiers = {
      google: this.google,
      facebook: this.facebook,
      github: this.github,
    };
  }

  async verify(provider: OAuthProvider, input: { idToken?: string; accessToken?: string }): Promise<OAuthProfile> {
    const v = this.verifiers[provider];
    if (!v) {
      throw new UnauthorizedException(`Provider OAuth no soportado: ${provider}`);
    }
    try {
      return await v.verify(input);
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      this.logger.error(`OAuth verify failed for ${provider}: ${(err as Error).message}`);
      throw new UnauthorizedException(`No se pudo verificar el token de ${provider}`);
    }
  }

  /**
   * Devuelve true si el provider tiene la config mínima para funcionar.
   * El frontend puede usar esto (vía endpoint /auth/oauth/providers)
   * para deshabilitar botones que no van a funcionar.
   */
  isProviderConfigured(provider: OAuthProvider): boolean {
    switch (provider) {
      case 'google':
        // GoogleStrategy hace verifyIdToken con GOOGLE_CLIENT_ID. Sin él falla.
        return !!process.env.GOOGLE_CLIENT_ID;
      case 'facebook':
        // FacebookStrategy usa app_id + app_secret como credenciales del servidor
        // en el debug_token call. Ambos requeridos.
        return !!process.env.FACEBOOK_APP_ID && !!process.env.FACEBOOK_APP_SECRET;
      case 'github':
        // GithubStrategy usa Basic auth con client_id:client_secret para /user.
        // Ambos requeridos (client_id solo o secret solo no alcanzan).
        return !!process.env.GITHUB_CLIENT_ID && !!process.env.GITHUB_CLIENT_SECRET;
      default:
        return false;
    }
  }
}
