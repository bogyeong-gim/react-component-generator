import { beforeEach, describe, expect, it } from 'vitest';
import { readStoredValue, writeStoredValue } from './storage';

describe('localStorage persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('저장한 값을 같은 키로 다시 읽는다', () => {
    writeStoredValue('test-key', { provider: 'google' });

    expect(readStoredValue('test-key', { provider: 'anthropic' })).toEqual({ provider: 'google' });
  });

  it('잘못된 JSON이면 기본값을 반환한다', () => {
    localStorage.setItem('test-key', '{invalid');

    expect(readStoredValue('test-key', [])).toEqual([]);
  });
});
