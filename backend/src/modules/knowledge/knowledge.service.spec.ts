import { KnowledgeService } from './knowledge.service';

describe('KnowledgeService', () => {
  it('does not query the database for an empty request', async () => {
    const queryRaw = jest.fn();
    const service = new KnowledgeService({ $queryRaw: queryRaw } as never);

    await expect(service.retrievePublic('   ')).resolves.toEqual([]);
    expect(queryRaw).not.toHaveBeenCalled();
  });

  it('returns only the citation fields needed by the public assistant', async () => {
    const queryRaw = jest.fn().mockResolvedValue([
      {
        chunk_id: 'chunk-1',
        document_id: 'doc-1',
        title: 'Bosque nativo',
        citation: 'Informe regional 2025',
        source_url: 'https://example.org/source',
        publisher: 'Institución científica',
        content: 'Fragmento respaldado.',
        score: 0.91,
      },
    ]);
    const service = new KnowledgeService({ $queryRaw: queryRaw } as never);

    await expect(service.retrievePublic('bosque nativo')).resolves.toEqual([
      {
        chunkId: 'chunk-1',
        documentId: 'doc-1',
        title: 'Bosque nativo',
        citation: 'Informe regional 2025',
        sourceUrl: 'https://example.org/source',
        publisher: 'Institución científica',
        excerpt: 'Fragmento respaldado.',
        score: 0.91,
      },
    ]);
  });

  it('builds a bounded public context with numbered citations', async () => {
    const queryRaw = jest.fn().mockResolvedValue([
      {
        chunk_id: 'chunk-1',
        document_id: 'doc-1',
        title: 'Especies locales',
        citation: 'Catálogo regional',
        source_url: null,
        publisher: null,
        content: 'Información publicada.',
        score: 0.7,
      },
    ]);
    const service = new KnowledgeService({ $queryRaw: queryRaw } as never);

    await expect(service.buildPublicContext('especies')).resolves.toMatchObject(
      {
        hasEvidence: true,
        text: '[1] Especies locales — Catálogo regional\nInformación publicada.',
        citations: [expect.objectContaining({ chunkId: 'chunk-1' })],
      },
    );
  });
});
