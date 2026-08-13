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

@Module({
  imports: [
    DatabaseModule, 
    AuthModule, 
    OrganizationsModule, UsersModule, MembersModule, DonationsModule, CampaignsModule, SpeciesModule, MissionsModule
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
