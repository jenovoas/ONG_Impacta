import {
  IsString,
  IsIn,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export const SUPPORTED_OAUTH_PROVIDERS = [
  'google',
  'facebook',
  'github',
] as const;
export type OAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

/**
 * Login con un provider OAuth. El frontend obtiene el token del provider
 * (idToken para Google, accessToken para Facebook/GitHub) y lo manda al backend.
 * Si el user no existe, devuelve 404 con error="USER_NOT_FOUND" para que el
 * frontend redirija al flujo de registro.
 */
export class OAuthLoginDto {
  @IsString()
  @IsIn(SUPPORTED_OAUTH_PROVIDERS as unknown as string[])
  provider: OAuthProvider;

  /** Google: id_token del ID token (validamos firma con google-auth-library) */
  @IsOptional()
  @IsString()
  idToken?: string;

  /** Facebook / GitHub: access token entregado por el SDK del frontend */
  @IsOptional()
  @IsString()
  accessToken?: string;

  /**
   * Si el user con este email ya existe, vincular la OAuthAccount a su user.
   * Default: true (auto-link).
   */
  @IsOptional()
  linkIfEmailExists?: boolean;
}

/**
 * Registro + login con un provider OAuth. Crea Organization trial + User admin.
 */
export class OAuthRegisterDto extends OAuthLoginDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  orgName: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  @Matches(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, {
    message:
      'orgSlug debe ser lowercase, alfanumérico y puede contener guiones',
  })
  orgSlug?: string;
}
