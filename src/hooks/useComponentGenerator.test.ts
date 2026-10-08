import { beforeEach, describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useComponentGenerator } from './useComponentGenerator';
import { STORAGE_KEYS } from '../utils/storage';

describe('useComponentGenerator persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('저장된 생성 컴포넌트를 Date 값으로 복원한다', () => {
    localStorage.setItem(
      STORAGE_KEYS.components,
      JSON.stringify([
        {
          id: 'saved-component',
          prompt: '프로필 카드',
          code: 'render(<div />);',
          createdAt: '2026-10-08T00:00:00.000Z',
        },
      ]),
    );

    const { result } = renderHook(() => useComponentGenerator());

    expect(result.current.components[0]).toMatchObject({ id: 'saved-component', prompt: '프로필 카드' });
    expect(result.current.components[0].createdAt).toBeInstanceOf(Date);
  });
});
