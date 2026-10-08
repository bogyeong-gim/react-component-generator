---
name: create-pr
description: Create a pull request through a delegated subagent when the user asks to open, create, or submit a PR. Choose a Korean or English template from the target repository context.
---

# Create Pull Request

사용자가 PR 생성 또는 제출을 요청할 때 사용한다. PR 생성과 원격 push는 반드시 **전용 서브에이전트**가 수행한다. 메인 에이전트는 준비·검증·결과 보고만 담당하며, 서브에이전트를 사용할 수 없으면 PR을 직접 만들지 않고 제한을 알린다.

## 준비

1. 현재 브랜치, 작업 트리, 원격 저장소, 기본 브랜치, 기존 PR 유무를 읽기 전용으로 확인한다.
2. 스테이징되지 않은 변경이 있으면 사용자 요청 및 저장소 규칙에 따라 먼저 커밋할 수 있는지 판단한다. 사용자 범위를 벗어난 변경은 PR에 포함하지 않는다.
3. 관련 테스트·린트를 실행하거나, 실행하지 못한 항목을 PR 검증 섹션에 명확히 남긴다.
4. 대상 저장소의 `.github/PULL_REQUEST_TEMPLATE*` 또는 `CONTRIBUTING` 지침이 있으면 그 형식을 우선한다.

## 템플릿 선택

사용자가 언어를 지정하면 그 선택을 따른다. 지정이 없으면 저장소의 README, CONTRIBUTING, 이슈·PR 양식, 최근 커밋 메시지의 주 언어로 판단한다.

- 해외 오픈소스 또는 영문 문서·협업이 주된 저장소: [영문 템플릿](references/pull-request-en.md)을 읽는다.
- 한국 프로젝트 또는 한국어 문서·협업이 주된 저장소: [한국어 템플릿](references/pull-request-ko.md)을 읽는다.
- 근거가 혼재하면 영문 템플릿을 사용하고, 선택 근거를 PR 본문에 한 줄로 덧붙이지 않는다.

## 서브에이전트 위임

PR 생성 전, 다음 정보를 포함한 작업을 **하나의 전용 서브에이전트**에 위임한다.

- 현재 브랜치와 대상 기본 브랜치
- 원격 저장소와 기존 PR 여부
- 포함할 커밋 및 변경 요약
- 실행한 검증 명령과 결과
- 선택한 언어와 템플릿의 절대 경로
- 저장소 고유 PR 형식 또는 기여 지침

서브에이전트는 다음만 수행한다.

1. 대상 브랜치를 원격에 push한다.
2. 선택된 템플릿을 실제 변경사항으로 채운다. 템플릿의 섹션을 비워두지 않고, 확인할 수 없는 내용은 추측하지 않는다.
3. 제목과 본문이 변경 범위와 일치하는 PR을 만든다.
4. 생성된 PR URL, 제목, base/head 브랜치, push·생성 결과를 반환한다.

## 완료 기준

- PR URL이 반환되고 base/head 브랜치 및 제목이 확인되어야 완료다.
- 이미 같은 head 브랜치의 열린 PR이 있으면 새 PR을 만들지 말고 해당 URL과 현재 상태를 반환한다.
- 인증, 권한, push, PR 생성 실패 시 실패 원인과 사용자가 해야 할 다음 조치만 보고한다. 다른 저장소·브랜치·계정으로 재시도하지 않는다.
