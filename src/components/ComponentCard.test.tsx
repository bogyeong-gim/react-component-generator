import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { GeneratedComponent } from '../types';
import { ComponentCard } from './ComponentCard';

const component: GeneratedComponent = {
  id: 'streaming-component',
  prompt: '프로필 카드',
  code: 'const Profile = () => <div>작성 중',
  createdAt: new Date('2026-10-08T09:00:00+09:00'),
  status: 'streaming',
};

describe('ComponentCard', () => {
  it('생성 중에는 코드 탭을 보여주고 완료되면 미리보기 탭으로 전환한다', () => {
    const { rerender } = render(
      <ComponentCard
        component={component}
        onRemove={vi.fn()}
        onRegenerate={vi.fn()}
        isLoading
      />,
    );

    expect(screen.getByRole('button', { name: '코드' })).toHaveClass('tab--active');
    expect(screen.getByText('const Profile = () => <div>작성 중')).toBeInTheDocument();

    rerender(
      <ComponentCard
        component={{
          ...component,
          code: 'const Profile = () => <div>완료</div>; render(<Profile />);',
          status: 'complete',
        }}
        onRemove={vi.fn()}
        onRegenerate={vi.fn()}
        isLoading={false}
      />,
    );

    expect(screen.getByRole('button', { name: '미리보기' })).toHaveClass('tab--active');
  });
});
