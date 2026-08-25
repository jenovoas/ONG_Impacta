import { Module } from '@nestjs/common';
import { AiSecurityModule } from '../ai-security/ai-security.module';
import { ContentIngressGuard } from '../ai-security/content-ingress-guard';
import { AiGatewayController } from './ai-gateway.controller';
import { AiOrchestratorService } from './ai-orchestrator.service';
import type { AiGatewayClient } from './ai-provider';
import { OmniRouteProvider } from './omniroute.provider';

export const AI_PROVIDER = Symbol('AI_PROVIDER');

@Module({
  imports: [AiSecurityModule],
  controllers: [AiGatewayController],
  providers: [
    {
      provide: AI_PROVIDER,
      useFactory: () =>
        new OmniRouteProvider({
          baseUrl:
            process.env.OMNIROUTE_BASE_URL ?? 'http://127.0.0.1:20128/v1',
          apiKey: process.env.OMNIROUTE_API_KEY,
          defaultModel: process.env.OMNIROUTE_MODEL ?? 'auto',
          timeoutMs: Number(process.env.OMNIROUTE_TIMEOUT_MS ?? 30_000),
        }),
    },
    {
      provide: AiOrchestratorService,
      useFactory: (
        provider: AiGatewayClient,
        ingressGuard: ContentIngressGuard,
      ) => new AiOrchestratorService(provider, ingressGuard),
      inject: [AI_PROVIDER, ContentIngressGuard],
    },
  ],
  exports: [AI_PROVIDER, AiOrchestratorService],
})
export class AiGatewayModule {}
