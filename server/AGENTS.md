# Server Module Instructions

## Module Context

이 디렉터리는 Bun API와 제공자별 모델 호출을 처리하고, 응답을 `react-live`에서 실행 가능한 코드로 정규화한다. 순수 변환과 모델 폴백은 API 진입점에서 분리되어 있다.

## Tech Stack & Constraints

- Bun의 `Bun.serve`와 내장 `fetch`를 사용한다. 새 HTTP 클라이언트를 추가하지 않는다.
- 생성 모델에 전달하는 규칙은 plain JavaScript, import 없음, inline style, 마지막 `render(...)` 호출을 유지해야 한다. 근거: [index.ts](./index.ts#L7-L20).

## Implementation Patterns

- 마크다운 펜스 제거 후 `render(...)` 호출을 보완하는 순서를 유지한다: `ensureRenderCall(stripCodeFences(text))`. 근거: [index.ts](./index.ts#L188), [generator.ts](./generator.ts#L5-L23).
- Google 제공자는 `withModelFallback`에 모델별 요청 함수를 전달한다. 개별 모델 실패를 이 함수 밖에서 중단하지 않는다. 근거: [index.ts](./index.ts#L98-L135), [fallback.ts](./fallback.ts#L3-L20).
- API 키는 `resolveApiKey`를 통해 요청 키 또는 환경변수에서만 결정한다. `GET /api/config`에는 boolean 상태만 유지한다. 근거: [index.ts](./index.ts#L59-L65), [index.ts](./index.ts#L147-L172).

## Testing Strategy

- 정규화 변경: `bunx vitest run server/generator.test.ts`
- 폴백 변경: `bunx vitest run server/fallback.test.ts`
- 두 영역을 함께 바꾸거나 API 흐름을 건드릴 때: `bun run test`

## Local Golden Rules

- `MAX_TOKENS`, 503, 429은 각각 사용자에게 방향을 주는 오류 응답으로 변환된다. 이 상태별 분기를 일반 500 오류로 합치지 않는다. 근거: [index.ts](./index.ts#L122-L125), [index.ts](./index.ts#L194-L210).
- `OPTIONS` 응답과 모든 API 응답의 CORS 헤더를 유지한다. 근거: [index.ts](./index.ts#L51-L55), [index.ts](./index.ts#L141-L156), [index.ts](./index.ts#L190-L210).
