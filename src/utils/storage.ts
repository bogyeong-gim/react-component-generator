export const STORAGE_KEYS = {
  apiKey: 'rcg:api-key',
  provider: 'rcg:provider',
  promptHistory: 'rcg:prompt-history',
  components: 'rcg:components',
} as const;

export function readStoredValue<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : (JSON.parse(value) as T);
  } catch {
    return fallback;
  }
}

export function writeStoredValue<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장소를 사용할 수 없는 환경에서는 현재 세션 상태를 유지한다.
  }
}
