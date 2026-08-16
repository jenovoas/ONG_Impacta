import { Module } from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { GoogleStrategy } from './google.strategy';
import { FacebookStrategy } from './facebook.strategy';
import { GithubStrategy } from './github.strategy';

@Module({
  providers: [OAuthService, GoogleStrategy, FacebookStrategy, GithubStrategy],
  exports: [OAuthService],
})
export class OAuthModule {}
