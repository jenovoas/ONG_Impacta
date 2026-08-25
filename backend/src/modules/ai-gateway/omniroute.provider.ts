import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import {
  AiCompletionRequest,
  AiCompletionResult,
  AiGatewayClient,
} from './ai-provider';

type OmniRouteResponse = {
  model?: string;
  choices?: Array<{ message?: { content?: string } }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
};

export type OmniRouteConfig = {
  baseUrl: string;
  apiKey?: string;
  defaultModel: string;
  timeoutMs: number;
};

@Injectable()
export class OmniRouteProvider implements AiGatewayClient {
  constructor(private readonly config: OmniRouteConfig) {}

  async complete(request: AiCompletionRequest): Promise<AiCompletionResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      const response = await fetch(this.endpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey
            ? { Authorization: `Bearer ${this.config.apiKey}` }
            : {}),
        },
        body: JSON.stringify({
          model: request.model ?? this.config.defaultModel,
          stream: false,
          temperature: request.temperature,
          max_tokens: request.maxTokens,
          messages: request.messages,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new ServiceUnavailableException('Gateway IA no disponible');
      }

      const payload = (await response.json()) as OmniRouteResponse;
      const content = sanitizeAssistantContent(
        payload.choices?.[0]?.message?.content,
      );
      if (!content) {
        throw new ServiceUnavailableException(
          'Gateway IA devolvió una respuesta vacía',
        );
      }

      return {
        content,
        provider: 'omniroute',
        model: payload.model ?? request.model ?? this.config.defaultModel,
        usage: payload.usage
          ? {
              inputTokens: payload.usage.prompt_tokens,
              outputTokens: payload.usage.completion_tokens,
              totalTokens: payload.usage.total_tokens,
            }
          : undefined,
      };
    } catch (error) {
      if (error instanceof ServiceUnavailableException) throw error;
      throw new ServiceUnavailableException('Gateway IA no disponible');
    } finally {
      clearTimeout(timeout);
    }
  }

  private endpoint(): string {
    return `${this.config.baseUrl.replace(/\/$/, '')}/chat/completions`;
  }
}

function sanitizeAssistantContent(content?: string): string | undefined {
  if (!content) return undefined;

  const withoutPrivateReasoning = content.replace(
    /<think\b[^>]*>[\s\S]*?<\/think>/gi,
    '',
  );
  const normalized = withoutPrivateReasoning.trim();
  return normalized || undefined;
}
