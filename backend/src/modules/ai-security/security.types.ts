export type DataClass = 'PUBLIC' | 'TENANT' | 'PRIVATE' | 'SENSITIVE';

export type ProviderKind = 'EXTERNAL_API' | 'LOCAL_SENTINEL';

export type RedactionKind =
  | 'EMAIL'
  | 'PHONE'
  | 'RUT'
  | 'TOKEN'
  | 'SECRET'
  | 'COORDINATE';

export interface SanitizationResult {
  text: string;
  dataClass: DataClass;
  redactions: RedactionKind[];
  changed: boolean;
}

export interface IngressDecision {
  allowed: boolean;
  dataClass: DataClass;
  reasons: string[];
  sanitizedText: string;
}

export interface SafeTelemetryEvent {
  eventId: string;
  eventType: string;
  provider: ProviderKind;
  dataClass: DataClass;
  contentFingerprint: string;
  inputLength: number;
  outputLength?: number;
  redactionCount: number;
  blocked: boolean;
  reasons: string[];
  createdAt: string;
}
