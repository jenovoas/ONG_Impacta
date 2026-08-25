import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ContentIngressGuard } from '../ai-security/content-ingress-guard';
import type { AiGatewayClient } from './ai-provider';
import { PublicAssistantDto } from './dto/public-assistant.dto';

@Injectable()
export class AiOrchestratorService {
  constructor(
    private readonly provider: AiGatewayClient,
    private readonly ingressGuard: ContentIngressGuard,
  ) {}

  async answerPublic(dto: PublicAssistantDto) {
    const decision = this.ingressGuard.inspect(
      dto.prompt,
      'PUBLIC',
      'EXTERNAL_API',
    );
    if (!decision.allowed) {
      throw new BadRequestException(
        'La consulta contiene datos que no pueden procesarse por esta ruta',
      );
    }

    try {
      const result = await this.provider.complete({
        model: dto.model,
        messages: [
          {
            role: 'system',
            content:
              'Eres el asistente público de Impacta+. Responde en español, usa lenguaje claro, reconoce incertidumbre y no inventes datos. No puedes publicar, firmar ni ejecutar acciones.',
          },
          { role: 'user', content: decision.sanitizedText },
        ],
      });

      return {
        answer: result.content,
        provider: result.provider,
        model: result.model,
        usage: result.usage,
        assisted: true,
      };
    } catch (error) {
      if (error instanceof ServiceUnavailableException) throw error;
      throw new ServiceUnavailableException(
        'Asistente temporalmente no disponible',
      );
    }
  }
}
