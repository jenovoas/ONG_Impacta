import { Injectable } from '@nestjs/common';
import { PrivacySanitizer } from './privacy-sanitizer';
import { DataClass, IngressDecision, ProviderKind } from './security.types';

@Injectable()
export class ContentIngressGuard {
  private readonly injectionPatterns = [
    /ignore\s+(?:all\s+)?previous\s+instructions/i,
    /disregard\s+(?:all\s+)?system\s+messages/i,
    /reveal\s+(?:the\s+)?(?:system\s+prompt|secrets|credentials)/i,
    /(?:execute|run)\s+(?:this\s+)?(?:shell|bash|powershell|terminal)\s+command/i,
    /\b(?:tool_call|function_call|system_message)\s*[:{]/i,
  ];

  constructor(private readonly sanitizer: PrivacySanitizer) {}

  inspect(
    text: string,
    requestedClass: DataClass,
    provider: ProviderKind,
  ): IngressDecision {
    const sanitized = this.sanitizer.sanitize(text, requestedClass);
    const reasons: string[] = [];

    if (this.injectionPatterns.some((pattern) => pattern.test(text))) {
      reasons.push('PROMPT_INJECTION_PATTERN');
    }
    if (provider === 'EXTERNAL_API' && sanitized.dataClass !== 'PUBLIC') {
      reasons.push('NON_PUBLIC_DATA_EXTERNAL_PROVIDER');
    }

    return {
      allowed: reasons.length === 0,
      dataClass: sanitized.dataClass,
      reasons,
      sanitizedText: sanitized.text,
    };
  }
}
