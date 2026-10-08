# Frontend Module Instructions

## Module Context

이 디렉터리는 생성 요청의 입력·상태·결과를 관리하고, 반환된 코드를 `react-live`로 브라우저 안에서 실행한다. API 호출과 UI 렌더링은 `useComponentGenerator` 훅을 통해 연결한다.

## Tech Stack & Constraints

- React 19와 TypeScript를 사용한다.
- 미리보기는 `LiveProvider`의 `noInline` 모드로 실행한다. 서버가 보장하는 `render(...)` 호출을 우회하는 별도 실행 방식으로 바꾸지 않는다. 근거: [components/LivePreview.tsx](./components/LivePreview.tsx#L14-L19).

## Implementation Patterns

- 생성 요청은 `/api/generate`에 JSON으로 보내며, API 키는 값이 있을 때만 payload에 포함한다. 근거: [hooks/useComponentGenerator.ts](./hooks/useComponentGenerator.ts#L18-L33).
- 제공자 변경 시 입력한 API 키를 초기화한다. 이 동작을 제거하지 않는다. 근거: [App.tsx](./App.tsx#L41-L44).
- 프롬프트 제출은 빈 문자열과 로딩 중복 요청을 막고, Cmd/Ctrl+Enter도 폼 제출과 같은 경로를 사용한다. 근거: [components/PromptInput.tsx](./components/PromptInput.tsx#L20-L24), [components/PromptInput.tsx](./components/PromptInput.tsx#L44-L47).

## Testing Strategy

- 프롬프트 입력·제출·로딩 상태 변경: `bunx vitest run src/components/PromptInput.test.tsx`
- UI 상태 또는 요청 흐름 변경: `bun run test`

## Local Golden Rules

- API 키가 없을 때는 UI와 서버가 모두 생성 요청을 방어한다. 클라이언트의 선행 검사를 제거하지 않는다. 근거: [App.tsx](./App.tsx#L33-L38), [server/index.ts](../server/index.ts#L167-L180).
- 생성 요청 중에는 `isLoading` 상태를 `finally`에서 반드시 해제하고, 성공 결과는 최신 항목이 먼저 오도록 목록 앞에 추가한다. 근거: [hooks/useComponentGenerator.ts](./hooks/useComponentGenerator.ts#L18-L48).
