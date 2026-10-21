import { Injectable } from '@nestjs/common';
import { createHmac, randomUUID } from 'crypto';
import { DataClass, ProviderKind, SafeTelemetryEvent } from './security.types';

@Injectable()
export class SafeTelemetryEmitter {
  constructor(private readonly hmacKey: string) {
    if (!hmacKey) {
      throw new Error('SafeTelemetryEmitter requiere una clave HMAC explícita');
    }
  }

  createEvent(input: {
    eventType: string;
    provider: ProviderKind;
    dataClass: DataClass;
    content: string;
    outputLength?: number;
    redactionCount?: number;
    blocked: boolean;
    reasons?: string[];
  }): SafeTelemetryEvent {
    return {
      eventId: randomUUID(),
      eventType: input.eventType,
      provider: input.provider,
      dataClass: input.dataClass,
      contentFingerprint: createHmac('sha256', this.hmacKey)
        .update(input.content)
        .digest('hex'),
      inputLength: input.content.length,
      outputLength: input.outputLength,
      redactionCount: input.redactionCount ?? 0,
      blocked: input.blocked,
      reasons: [...(input.reasons ?? [])],
      createdAt: new Date().toISOString(),
    };
  }
}
