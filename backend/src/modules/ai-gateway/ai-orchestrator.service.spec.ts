import { ContentIngressGuard } from '../ai-security/content-ingress-guard';
import { PrivacySanitizer } from '../ai-security/privacy-sanitizer';
import type { KnowledgeService } from '../knowledge/knowledge.service';
import type { AiGatewayClient } from './ai-provider';
import { AiOrchestratorService } from './ai-orchestrator.service';

describe('AiOrchestratorService', () => {
  const guard = new ContentIngressGuard(new PrivacySanitizer());
  const knowledge = {
    buildPublicContext: jest.fn().mockResolvedValue({
      text: '[1] Participación comunitaria\nPuedes participar como voluntario.',
      citations: [
        {
          chunkId: 'chunk-1',
          documentId: 'doc-1',
          title: 'Participación comunitaria',
          sourceUrl: 'https://impacta.pinguinoseguro.cl/participar',
          excerpt: 'Puedes participar como voluntario.',
          score: 0.8,
        },
      ],
      hasEvidence: true,
    }),
  } as unknown as KnowledgeService;

  it('answers only public content through the provider contract', async () => {
    const complete = jest.fn().mockResolvedValue({
      content: 'Puedes participar como voluntario.',
      provider: 'omniroute',
      model: 'auto',
    });
    const provider: AiGatewayClient = {
      complete,
    };
    const service = new AiOrchestratorService(provider, guard, knowledge);

    await expect(
      service.answerPublic({ prompt: '¿Cómo puedo participar?' }),
    ).resolves.toMatchObject({
      answer: 'Puedes participar como voluntario.',
      provider: 'omniroute',
      citations: expect.arrayContaining([
        expect.objectContaining({ title: 'Participación comunitaria' }),
      ]),
      assisted: true,
    });
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('does not send PII to the public gateway route', async () => {
    const complete = jest.fn();
    const provider: AiGatewayClient = { complete };
    const service = new AiOrchestratorService(provider, guard, knowledge);

    await expect(
      service.answerPublic({ prompt: 'Mi RUT es 12.345.678-5' }),
    ).rejects.toThrow('no pueden procesarse por esta ruta');
    expect(complete).not.toHaveBeenCalled();
  });
});
