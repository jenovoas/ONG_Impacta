export type AiMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type AiCompletionRequest = {
  messages: AiMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
};

export type AiCompletionResult = {
  content: string;
  provider: string;
  model: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
};

export interface AiGatewayClient {
  complete(request: AiCompletionRequest): Promise<AiCompletionResult>;
}

/** Compatibility name for provider-specific implementations. */
export type AiProvider = AiGatewayClient;
