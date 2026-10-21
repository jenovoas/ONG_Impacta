import {
  Controller,
  Post,
  Body,
  Req,
  UnauthorizedException,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { OAuthService } from './oauth/oauth.service';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshDto } from './dto/refresh.dto';
import { OAuthLoginDto, OAuthRegisterDto } from './dto/oauth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly oauth: OAuthService,
    private readonly authService: AuthService,
  ) {}

  // ====================================================================
  // Local (email + password)
  // ====================================================================

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } }) // 10 attempts/min por IP
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
      loginDto.orgSlug,
    );
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.authService.login(user, this.ctx(req));
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60_000 } }) // 5 registros/min por IP
  async register(@Body() dto: RegisterDto, @Req() req: Request) {
    return this.authService.register(dto, this.ctx(req));
  }

  // ====================================================================
  // Refresh + logout
  // ====================================================================

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto, @Req() req: Request) {
    return this.authService.refreshTokens(dto.refreshToken, this.ctx(req));
  }

  /**
   * Logout revoca el refresh token entregado. Si el client solo quería "salir",
   * puede llamar a este endpoint con el refresh_token actual; el access_token
   * queda válido hasta su expiración natural (15min) pero no se puede refrescar.
   * Para forzar logout inmediato del access, considerar blacklist en Redis después.
   */
  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() dto: RefreshDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @Get('me')
  getProfile(@Req() req: Request) {
    return (req as any).user;
  }

  // ====================================================================
  // OAuth
  // ====================================================================

  @Public()
  @Post('oauth/login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 15, ttl: 60_000 } })
  async oauthLogin(@Body() dto: OAuthLoginDto, @Req() req: Request) {
    return this.authService.loginWithOAuth(dto, this.ctx(req));
  }

  @Public()
  @Post('oauth/register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async oauthRegister(@Body() dto: OAuthRegisterDto, @Req() req: Request) {
    return this.authService.registerWithOAuth(dto, this.ctx(req));
  }

  /**
   * Devuelve qué providers OAuth están configurados en el server.
   * El frontend usa esto para deshabilitar botones (ej. si GOOGLE_CLIENT_ID
   * no está seteado en el server, ocultar "Continuar con Google").
   */
  @Public()
  @Get('oauth/providers')
  listProviders() {
    return {
      google: { configured: this.oauth.isProviderConfigured('google') },
      facebook: { configured: this.oauth.isProviderConfigured('facebook') },
      github: { configured: this.oauth.isProviderConfigured('github') },
    };
  }

  // ====================================================================
  // helpers
  // ====================================================================

  private ctx(req: Request) {
    return {
      userAgent: (req.headers['user-agent'] as string) ?? undefined,
      ipAddress: req.ip ?? undefined,
    };
  }
}
