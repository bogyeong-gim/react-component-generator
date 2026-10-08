import { useState, useCallback } from 'react';
import type { GeneratedComponent, Provider } from '../types';
import { readGenerationStream } from './stream';

interface UseComponentGeneratorReturn {
  components: GeneratedComponent[];
  isLoading: boolean;
  error: string | null;
  generate: (prompt: string, apiKey: string | undefined, provider: Provider) => Promise<void>;
  removeComponent: (id: string) => void;
  clearAll: () => void;
}

export function useComponentGenerator(): UseComponentGeneratorReturn {
  const [components, setComponents] = useState<GeneratedComponent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (prompt: string, apiKey: string | undefined, provider: Provider) => {
    setIsLoading(true);
    setError(null);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const pendingComponent: GeneratedComponent = {
      id,
      prompt,
      code: '',
      createdAt: new Date(),
      status: 'streaming',
    };
    setComponents((prev) => [pendingComponent, ...prev]);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, ...(apiKey && { apiKey }), provider }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate component');
      }

      if (!res.body) throw new Error('생성 스트림을 읽을 수 없습니다.');
      const code = await readGenerationStream(res.body, (text) => {
        setComponents((prev) => prev.map((component) =>
          component.id === id
            ? { ...component, code: component.code + text }
            : component,
        ));
      });
      setComponents((prev) => prev.map((component) =>
        component.id === id ? { ...component, code, status: 'complete' } : component,
      ));
    } catch (err) {
      setComponents((prev) => prev.filter((component) => component.id !== id));
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeComponent = useCallback((id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setComponents([]);
  }, []);

  return { components, isLoading, error, generate, removeComponent, clearAll };
}
