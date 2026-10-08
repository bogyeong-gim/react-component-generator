---
name: commit
description: Analyze repository changes and create convention-compliant Korean Git commits immediately when the user asks to commit, save changes, or create a commit.
---

# Commit

변경사항을 논리적인 커밋으로 안전하게 저장한다. 사용자가 `커밋`, `커밋해줘`, `변경사항 저장`처럼 Git 커밋을 요청할 때 사용한다.

## 절차

1. 먼저 읽기 전용으로 현재 상태를 확인한다.
   - `git status --short`
   - `git diff` 및 `git diff --staged`
   - 필요하면 관련 파일과 기존 커밋 메시지 형식도 확인한다.
2. 변경사항을 목적과 영향 범위에 따라 논리적 단위로 나눈다. 서로 독립적으로 되돌리거나 리뷰할 수 있는 변경은 같은 커밋으로 묶지 않는다.
3. 각 단위에 한국어 Conventional Commit 메시지를 제안한다.
   - 형식: `feat: 요약`, `fix: 요약`, `refactor: 요약`, `chore: 요약`
   - 필요하면 `docs`, `test`, `style`도 사용한다.
   - 요약은 변경의 결과를 명확한 한국어로 쓴다.
4. 분석한 단위별로 적절한 한국어 메시지를 작성하고 바로 커밋한다. 별도의 승인 단계는 거치지 않는다.
5. 각 커밋에는 해당 단위의 파일만 명시적으로 스테이징한다. 기존 스테이징 변경이나 비관련 변경은 포함하지 않는다.
6. 완료 후 `git status --short`로 결과를 확인하고, 생성된 커밋 해시와 메시지, 남은 변경사항을 간단히 보고한다.

## 안전 기준

- 변경사항이 없으면 커밋을 만들지 말고 상태만 알린다.
- diff에서 민감 정보, 생성물, 대규모 의도 불명 변경을 발견하면 커밋하지 말고 사용자에게 알린다.
- `git add .`, `git add -A`는 사용하지 않는다. 커밋 단위에 포함한 파일 경로만 명시적으로 스테이징한다.
- amend, force push, reset, rebase, 원격 push는 이 스킬의 범위가 아니다. 사용자가 별도로 요청한 경우에만 다룬다.
