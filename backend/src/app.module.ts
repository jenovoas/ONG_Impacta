import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { UsersModule } from './modules/users/users.module';
import { MembersModule } from './modules/members/members.module';
import { DonationsModule } from './modules/donations/donations.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { SpeciesModule } from './modules/species/species.module';
import { MissionsModule } from './modules/missions/missions.module';
import { DemoRequestsModule } from './modules/demo-requests/demo-requests.module';
import { LoggerModule } from 'nestjs-pino';

const isDevelopment = process.env.NODE_ENV !== 'production';
const lokiHost = process.env.LOKI_HOST?.trim();
const lokiUsername = process.env.LOKI_USERNAME?.trim();
const lokiPassword = process.env.LOKI_PASSWORD;

if ((lokiUsername || lokiPassword) && !lokiHost) {
  throw new Error('LOKI_HOST es requerido cuando se configuran credenciales de Loki.');
}
if (Boolean(lokiUsername) !== Boolean(lokiPassword)) {
  throw new Error('LOKI_USERNAME y LOKI_PASSWORD deben configurarse juntos.');
}

const logTransport = isDevelopment
  ? {
      target: 'pino-pretty',
      options: { singleLine: true },
    }
  : lokiHost
    ? {
        targets: [
          { target: 'pino/file', options: { destination: 1 } },
          {
            target: 'pino-loki',
            options: {
              host: lokiHost,
              labels: { application: 'impacta-backend', environment: process.env.NODE_ENV ?? 'production' },
              silenceErrors: true,
              ...(lokiUsername && lokiPassword ? { basicAuth: { username: lokiUsername, password: lokiPassword } } : {}),
            },
          },
        ],
      }
    : undefined;

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? (isDevelopment ? 'debug' : 'info'),
        ...(logTransport && { transport: logTransport }),
        redact: ['req.headers.authorization', 'req.headers.cookie'],
        serializers: {
          req: (request) => ({ id: request.id, method: request.method, url: request.url }),
          res: (response) => ({ statusCode: response.statusCode }),
        },
      },
    }),
    DatabaseModule,
    AuthModule,
    OrganizationsModule,
    UsersModule,
    MembersModule,
    DonationsModule,
    CampaignsModule,
    SpeciesModule,
    MissionsModule,
    DemoRequestsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes('*');
  }
}
