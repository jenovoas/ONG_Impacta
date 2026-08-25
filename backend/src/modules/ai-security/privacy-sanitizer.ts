import { Injectable } from '@nestjs/common';
import { DataClass, RedactionKind, SanitizationResult } from './security.types';

type Rule = {
  kind: RedactionKind;
  pattern: RegExp;
  replacement: string;
};

@Injectable()
export class PrivacySanitizer {
  private readonly rules: Rule[] = [
    {
      kind: 'TOKEN',
      pattern: /\bBearer\s+[A-Za-z0-9._~+/=-]+\b/gi,
      replacement: '[REDACTED_TOKEN]',
    },
    {
      kind: 'TOKEN',
      pattern: /\b(?:eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9._-]+)\b/g,
      replacement: '[REDACTED_TOKEN]',
    },
    {
      kind: 'SECRET',
      pattern:
        /\b(?:api[_-]?key|secret|password|passwd|private[_-]?key)\s*[:=]\s*[^\s,;]+/gi,
      replacement: '[REDACTED_SECRET]',
    },
    {
      kind: 'RUT',
      pattern: /\b\d{1,2}(?:\.\d{3}){2}-[\dkK]\b|\b\d{7,8}-[\dkK]\b/g,
      replacement: '[REDACTED_RUT]',
    },
    {
      kind: 'EMAIL',
      pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      replacement: '[REDACTED_EMAIL]',
    },
    {
      kind: 'PHONE',
      pattern: /(?<!\d)(?:\+?56\s?)?9\s?\d{4}\s?\d{4}(?!\d)/g,
      replacement: '[REDACTED_PHONE]',
    },
    {
      kind: 'COORDINATE',
      pattern:
        /\b(?:lat(?:itude)?\s*[:=]\s*-?\d{1,3}(?:\.\d+)?\s*[,;]\s*(?:lng|lon|longitude)\s*[:=]\s*-?\d{1,3}(?:\.\d+)?|coordinates?\s*[:=]\s*-?\d{1,3}(?:\.\d+)?\s*,\s*-?\d{1,3}(?:\.\d+)?)\b/gi,
      replacement: '[REDACTED_COORDINATE]',
    },
  ];

  sanitize(
    text: string,
    requestedClass: DataClass = 'PUBLIC',
  ): SanitizationResult {
    let sanitized = text;
    const redactions = new Set<RedactionKind>();

    for (const rule of this.rules) {
      rule.pattern.lastIndex = 0;
      if (rule.pattern.test(sanitized)) {
        redactions.add(rule.kind);
        rule.pattern.lastIndex = 0;
        sanitized = sanitized.replace(rule.pattern, rule.replacement);
      }
    }

    const dataClass = this.inferClass(requestedClass, redactions);
    return {
      text: sanitized,
      dataClass,
      redactions: [...redactions],
      changed: sanitized !== text,
    };
  }

  private inferClass(
    requestedClass: DataClass,
    redactions: Set<RedactionKind>,
  ): DataClass {
    if (requestedClass === 'SENSITIVE' || redactions.has('RUT')) {
      return 'SENSITIVE';
    }
    if (
      requestedClass === 'PRIVATE' ||
      redactions.has('TOKEN') ||
      redactions.has('SECRET')
    ) {
      return 'PRIVATE';
    }
    if (requestedClass === 'TENANT' || redactions.size > 0) {
      return 'TENANT';
    }
    return 'PUBLIC';
  }
}
