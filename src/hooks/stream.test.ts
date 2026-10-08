import { describe, expect, it, vi } from 'vitest';
import { readGenerationStream } from './stream';

describe('readGenerationStream', () => {
  it('청크 경계와 무관하게 NDJSON 생성 이벤트를 순서대로 전달한다', async () => {
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode('{"type":"delta","text":"const A"}\n{"type"'));
        controller.enqueue(encoder.encode(':"delta","text":" = 1"}\n{"type":"complete","code":"const A = 1"}\n'));
        controller.close();
      },
    });
    const onDelta = vi.fn();

    const code = await readGenerationStream(body, onDelta);

    expect(onDelta.mock.calls).toEqual([['const A'], [' = 1']]);
    expect(code).toBe('const A = 1');
  });
});
