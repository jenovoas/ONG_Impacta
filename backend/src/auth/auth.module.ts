import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OAuthModule } from './oauth/oauth.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    OAuthModule,
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,  // 60s window
        limit: 30,    // 30 req/min por IP (overridable con @Throttle en endpoints sensibles)
      },
    ]),
    JwtModule.registerAsync({
      useFactory: () => ({
        // En producción JWT_SECRET debe venir de env; si NODE_ENV=production
        // y no hay secret, AuthService.validateStrictSecret() en main.ts aborta el boot.
        secret: process.env.JWT_SECRET || 'super-secret-key-123-change-me-in-production',
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    // JwtAuthGuard aplica a TODA la app por default; @Public() lo bypassea.
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // ThrottlerGuard aplica rate limit global; @Throttle permite override.
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
