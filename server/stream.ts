export type Provider = 'anthropic' | 'google';

export function extractProviderDelta(provider: Provider, payload: unknown): string {
  if (!payload || typeof payload !== 'object') return '';

  if (provider === 'anthropic') {
    const event = payload as { type?: string; delta?: { type?: string; text?: string } };
    return event.type === 'content_block_delta' && event.delta?.type === 'text_delta'
      ? event.delta.text ?? ''
      : '';
  }

  const event = payload as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }>;
  };
  if (event.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
    throw new Error('생성된 코드가 너무 길어 잘렸습니다. 더 간단한 컴포넌트를 요청해주세요.');
  }
  return event.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? '';
}

export async function* readProviderStream(
  provider: Provider,
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const event of events) {
      for (const line of event.split('\n')) {
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (!data || data === '[DONE]') continue;
        const delta = extractProviderDelta(provider, JSON.parse(data));
        if (delta) yield delta;
      }
    }

    if (done) break;
  }
}
