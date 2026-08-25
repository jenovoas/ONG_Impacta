import { OmniRouteProvider } from './omniroute.provider';

describe('OmniRouteProvider', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('calls the OpenAI-compatible chat endpoint and returns canonical metadata', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        model: 'auto-selected-model',
        choices: [{ message: { content: 'Respuesta pública' } }],
        usage: { prompt_tokens: 3, completion_tokens: 5, total_tokens: 8 },
      }),
    }) as typeof fetch;

    const provider = new OmniRouteProvider({
      baseUrl: 'http://127.0.0.1:20128/v1/',
      apiKey: 'test-key',
      defaultModel: 'auto',
      timeoutMs: 1000,
    });

    await expect(
      provider.complete({ messages: [{ role: 'user', content: 'Hola' }] }),
    ).resolves.toEqual({
      content: 'Respuesta pública',
      provider: 'omniroute',
      model: 'auto-selected-model',
      usage: { inputTokens: 3, outputTokens: 5, totalTokens: 8 },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:20128/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer test-key' }),
      }),
    );
  });

  it('hides upstream errors behind a stable availability error', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as typeof fetch;
    const provider = new OmniRouteProvider({
      baseUrl: 'http://127.0.0.1:20128/v1',
      defaultModel: 'auto',
      timeoutMs: 1000,
    });

    await expect(
      provider.complete({ messages: [{ role: 'user', content: 'Hola' }] }),
    ).rejects.toThrow('Gateway IA no disponible');
  });

  it('does not expose private reasoning blocks from the upstream model', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: '<think>razonamiento interno</think>Respuesta pública',
            },
          },
        ],
      }),
    }) as typeof fetch;

    const provider = new OmniRouteProvider({
      baseUrl: 'http://127.0.0.1:20128/v1',
      defaultModel: 'auto',
      timeoutMs: 1000,
    });

    await expect(
      provider.complete({ messages: [{ role: 'user', content: 'Hola' }] }),
    ).resolves.toMatchObject({ content: 'Respuesta pública' });
  });
});
