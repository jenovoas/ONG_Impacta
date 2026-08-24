/**
 * Resultado normalizado de verificar un token contra un provider OAuth.
 * El AuthService usa esto para hacer account-linking o crear user nuevo.
 */
export interface OAuthProfile {
  provider: 'google' | 'facebook' | 'github';
  providerUserId: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
}

export interface OAuthVerifier {
  readonly provider: 'google' | 'facebook' | 'github';
  /**
   * Verifica el token entregado por el provider y devuelve el perfil normalizado.
   * Lanza UnauthorizedException si el token es inválido, expirado, o no es
   * del provider esperado.
   */
  verify(input: { idToken?: string; accessToken?: string }): Promise<OAuthProfile>;
}
