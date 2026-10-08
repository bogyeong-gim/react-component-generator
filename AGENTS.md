# Project Instructions

## Operational Commands

- 패키지 관리자와 런타임은 Bun을 사용한다. npm, yarn, pnpm으로 lockfile이나 의존성을 변경하지 않는다.
- 개발 서버: `bun run dev`
- API 서버만 실행: `bun run server`
- 프로덕션 빌드: `bun run build`
- 린트: `bun run lint`
- 전체 테스트: `bun run test`

## TDD Rule

**이 규칙은 Rigid — 상황에 맞게 변형하지 마라.**

이 섹션은 전역 기본값이다. 하위 디렉터리의 `AGENTS.md`에 별도 TDD 규칙이 있으면 **하위 규칙을 우선** 적용한다.

### 적용 기준

- **반드시 적용:** 비즈니스 로직, API, 유틸리티, 버그 수정.
- **불필요:** 타입 정의, 설정 파일, 순수 UI, SQL.

### RED-GREEN-REFACTOR

1. **RED:** 하나의 동작에 하나의 테스트만 작성한다. 반드시 실행해 실패를 확인하고, 실패 이유가 **기능 미구현**임을 확인한다.
2. **GREEN:** 테스트를 통과시키는 최소 코드만 작성한다. **YAGNI**를 지키고, 신규 테스트와 기존 테스트가 모두 통과하는지 확인한다.
3. **REFACTOR:** 중복 제거, 이름 개선, 헬퍼 추출만 한다. green 상태를 유지하며 새 동작을 추가하지 않는다.
4. **반복:** 다음 동작에 대한 RED로 돌아간다.

### 삭제 강제 규칙

- 테스트보다 프로덕션 코드를 먼저 작성했다면 해당 코드를 **삭제**하고 RED부터 다시 시작한다.
- 나중에 참고하려고 남겨두는 것도 **금지**한다.

### 변명 차단

| 변명 | 반론 |
| --- | --- |
| 너무 단순해서 테스트 불필요 | 단순한 동작도 회귀할 수 있으므로 가장 작은 테스트로 먼저 고정한다. |
| 나중에 추가하겠다 | 테스트 없는 변경은 완료가 아니다. 지금 RED부터 시작한다. |
| 시간이 없다 | TDD는 재작업과 디버깅 시간을 줄이는 작업이다. 범위를 줄여서라도 적용한다. |
| 삭제하면 낭비 | 검증되지 않은 구현을 남기는 비용이 더 크다. 삭제 후 테스트로 필요한 동작만 다시 만든다. |
| 프로토타입이다 | 프로토타입의 로직·API·유틸·버그 수정에도 적용한다. 순수 UI와 설정만 예외다. |

## Golden Rules

- 생성되는 미리보기 코드는 `react-live`의 `noInline` 실행 방식이므로 마지막에 `render(<Component />)` 호출이 있어야 한다. 서버 프롬프트의 제약과 정규화 순서를 유지한다. 근거: [server/index.ts](./server/index.ts#L10-L20), [server/index.ts](./server/index.ts#L188), [src/components/LivePreview.tsx](./src/components/LivePreview.tsx#L14-L19).
- API 키는 서버 환경변수 또는 요청에만 존재해야 하며, `/api/config` 응답에는 키 존재 여부만 반환한다. 실제 키 값을 클라이언트 상태, 응답, 로그에 노출하지 않는다. 근거: [server/index.ts](./server/index.ts#L59-L65), [server/index.ts](./server/index.ts#L147-L156), [src/App.tsx](./src/App.tsx#L24-L38).
- Google 모델 폴백은 선언된 순서대로 첫 성공 결과를 반환하고, 모두 실패하면 마지막 오류를 유지한다. 폴백을 제거하거나 오류를 삼키지 않는다. 근거: [server/fallback.ts](./server/fallback.ts#L3-L20), [server/index.ts](./server/index.ts#L4-L5), [server/index.ts](./server/index.ts#L134-L135).
- 생성 코드 정규화와 폴백 로직은 단위 테스트 경계다. 해당 동작을 변경하면 `server/generator.test.ts`, `server/fallback.test.ts`를 함께 갱신하거나 실행한다. 근거: [server/generator.test.ts](./server/generator.test.ts#L4-L38), [server/fallback.test.ts](./server/fallback.test.ts#L4-L36).

## Project Context

프롬프트를 바탕으로 React UI를 생성하고, 브라우저에서 즉시 실행·검토할 수 있는 워크벤치다.

Stack: React 19, TypeScript, Vite, Bun, react-live, Vitest, ESLint.

## Standards & References

- TypeScript와 기존 상대 경로 import 스타일을 따른다. 생성 대상 컴포넌트의 JavaScript 제약은 `server/AGENTS.md`를 따른다.
- 커밋 메시지는 한국어 Conventional Commit 형식(`feat:`, `fix:`, `refactor:`, `chore:`)을 사용한다.
- 코드와 이 문서의 규칙이 어긋나면 근거를 확인하고 규칙 업데이트를 제안한다.

## Context Map

- **[Bun API, 모델 호출, 코드 정규화](./server/AGENTS.md)** — 제공자 호출 또는 생성 코드 처리 변경 시.
- **[React UI, 요청 상태, 실행 미리보기](./src/AGENTS.md)** — 화면, 훅, 컴포넌트 변경 시.
