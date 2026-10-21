import { Module } from '@nestjs/common';
import { ContentIngressGuard } from './content-ingress-guard';
import { PrivacySanitizer } from './privacy-sanitizer';

@Module({
  providers: [PrivacySanitizer, ContentIngressGuard],
  exports: [PrivacySanitizer, ContentIngressGuard],
})
export class AiSecurityModule {}
