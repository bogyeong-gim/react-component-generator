type GenerationEvent =
  | { type: 'delta'; text: string }
  | { type: 'complete'; code: string }
  | { type: 'error'; error: string };

export async function readGenerationStream(
  body: ReadableStream<Uint8Array>,
  onDelta: (text: string) => void,
): Promise<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let completedCode: string | null = null;

  const consumeLine = (line: string) => {
    if (!line.trim()) return;
    const event = JSON.parse(line) as GenerationEvent;
    if (event.type === 'delta') onDelta(event.text);
    if (event.type === 'complete') completedCode = event.code;
    if (event.type === 'error') throw new Error(event.error);
  };

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    lines.forEach(consumeLine);
    if (done) break;
  }

  consumeLine(buffer);
  if (completedCode === null) throw new Error('생성 스트림이 완료되지 않았습니다.');
  return completedCode;
}
