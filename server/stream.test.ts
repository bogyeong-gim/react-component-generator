import { describe, expect, it } from 'vitest';
import { extractProviderDelta } from './stream';

describe('extractProviderDelta', () => {
  it('Anthropic과 Google SSE payload에서 생성된 텍스트 조각을 추출한다', () => {
    expect(extractProviderDelta('anthropic', {
      type: 'content_block_delta',
      delta: { type: 'text_delta', text: 'const A' },
    })).toBe('const A');

    expect(extractProviderDelta('google', {
      candidates: [{ content: { parts: [{ text: ' = 1' }] } }],
    })).toBe(' = 1');
  });
});
