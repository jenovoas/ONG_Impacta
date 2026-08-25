import { ContentIngressGuard } from '../ai-security/content-ingress-guard';
import { PrivacySanitizer } from '../ai-security/privacy-sanitizer';
import type { AiGatewayClient } from './ai-provider';
import { AiOrchestratorService } from './ai-orchestrator.service';

describe('AiOrchestratorService', () => {
  const guard = new ContentIngressGuard(new PrivacySanitizer());

  it('answers only public content through the provider contract', async () => {
    const complete = jest.fn().mockResolvedValue({
      content: 'Puedes participar como voluntario.',
      provider: 'omniroute',
      model: 'auto',
    });
    const provider: AiGatewayClient = {
      complete,
    };
    const service = new AiOrchestratorService(provider, guard);

    await expect(
      service.answerPublic({ prompt: '¿Cómo puedo participar?' }),
    ).resolves.toMatchObject({
      answer: 'Puedes participar como voluntario.',
      provider: 'omniroute',
      assisted: true,
    });
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('does not send PII to the public gateway route', async () => {
    const complete = jest.fn();
    const provider: AiGatewayClient = { complete };
    const service = new AiOrchestratorService(provider, guard);

    await expect(
      service.answerPublic({ prompt: 'Mi RUT es 12.345.678-5' }),
    ).rejects.toThrow('no pueden procesarse por esta ruta');
    expect(complete).not.toHaveBeenCalled();
  });
});
