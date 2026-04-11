---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/architecture.md"
  - "_bmad-output/planning-artifacts/product-brief-bmad-snake.md"
  - "_bmad-output/planning-artifacts/product-brief-bmad-snake-distillate.md"
---

# bmad-snake - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for bmad-snake, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: 사용자는 브라우저에서 설치/가입 없이 게임을 시작할 수 있다.
FR2: 사용자는 메인 진입점에서 즉시 새 세션을 시작할 수 있다.
FR3: 시스템은 사용자 첫 입력 시 세션 시작을 기록할 수 있다.
FR4: 시스템은 게임오버, 클리어 종료, 비활성 종료를 구분해 세션 종료를 기록할 수 있다.
FR5: 사용자는 Snake를 방향 입력으로 조작할 수 있다.
FR6: 시스템은 뱀 이동, 충돌, 먹이 획득 규칙을 일관되게 적용할 수 있다.
FR7: 시스템은 스테이지별 제한 시간을 적용할 수 있다.
FR8: 시스템은 스테이지별 목표 먹이 수를 적용할 수 있다.
FR9: 시스템은 제한 시간 내 목표 달성 시 스테이지 클리어를 처리할 수 있다.
FR10: 시스템은 충돌 또는 시간 초과 시 실패를 처리할 수 있다.
FR11: 사용자는 실패 후 즉시 재시작할 수 있다.
FR12: 시스템은 총 20개 스테이지를 제공할 수 있다.
FR13: 시스템은 스테이지를 4개 티어 난이도 구조로 관리할 수 있다.
FR14: 시스템은 클리어 결과에 따라 다음 스테이지를 해금할 수 있다.
FR15: 사용자는 현재 도달 가능한 스테이지를 확인하고 선택할 수 있다.
FR16: 시스템은 스테이지별 진행 상태를 유지할 수 있다.
FR17: 사용자는 PC 환경에서 키보드 입력으로 플레이할 수 있다.
FR18: 사용자는 모바일 환경에서 스와이프 입력으로 플레이할 수 있다.
FR19: 시스템은 입력 오인식 완화를 위한 입력 처리 정책을 적용할 수 있다.
FR20: 시스템은 모바일/PC에서 동일한 핵심 게임 규칙을 제공할 수 있다.
FR21: 시스템은 플레이 중 남은 시간 정보를 표시할 수 있다.
FR22: 시스템은 플레이 중 목표 진행 상태를 표시할 수 있다.
FR23: 시스템은 플레이 중 핵심 상태 변화를 명확히 전달할 수 있다.
FR24: 시스템은 스테이지 클리어 및 실패 결과를 사용자에게 명확히 전달할 수 있다.
FR25: 시스템은 작은 화면에서도 핵심 플레이 정보를 우선 표시할 수 있다.
FR26: 시스템은 세션별 플레이 시간을 수집할 수 있다.
FR27: 시스템은 스테이지 진입/완료/실패 이벤트를 수집할 수 있다.
FR28: 시스템은 실패 후 재시작 이벤트를 수집할 수 있다.
FR29: 시스템은 플랫폼(PC/모바일) 기준으로 지표를 분리 집계할 수 있다.
FR30: 시스템은 평균 플레이 시간을 산출할 수 있다.
FR31: 운영자는 스테이지 난이도 파라미터를 조정할 수 있다.
FR32: 운영자는 스테이지 제한 시간을 조정할 수 있다.
FR33: 운영자는 지표를 기반으로 밸런스 조정 결정을 내릴 수 있다.
FR34: 시스템은 운영자가 문제 상황을 진단할 수 있도록 플레이/이벤트 기록을 제공할 수 있다.
FR35: 시스템은 MVP 범위에서 로컬 기반으로 사용자 진행 상태를 저장할 수 있다.
FR36: 시스템은 분석 이벤트 수집 시 개인정보를 최소화할 수 있다.
FR37: 시스템은 필요 시 데이터 저장/수집 고지 정보를 제공할 수 있다.
FR38: 시스템은 향후 고스트 리플레이 기능이 추가될 수 있도록 플레이 기록 확장 여지를 둘 수 있다.
FR39: 시스템은 향후 일일 챌린지 규칙을 적용할 수 있도록 스테이지 규칙 확장 여지를 둘 수 있다.
FR40: 시스템은 향후 테마 맵 확장을 수용할 수 있다.

### NonFunctional Requirements

NFR1: 게임 플레이 중 사용자 입력부터 방향 반영까지의 지연은 사용자가 즉시 반응으로 인지할 수 있는 수준이어야 한다.
NFR2: 일반 플레이 상황에서 게임 루프는 시각적으로 끊김 없는 상태를 유지해야 한다.
NFR3: 스테이지 시작, 재시작, 결과 전환은 플레이 흐름을 방해하지 않는 짧은 대기 시간 내에 완료되어야 한다.
NFR4: 저사양 모바일 환경에서도 코어 루프(이동, 충돌, 타이머)는 기능 저하 없이 동작해야 한다.
NFR5: 세션 시작/종료, 스테이지 진입/완료/실패, 재시작 이벤트는 누락 없이 기록되어야 한다.
NFR6: 브라우저 탭 전환 또는 일시 중단 이후 복귀 시 게임 상태는 정의된 정책(재개/종료)에 따라 일관되게 처리되어야 한다.
NFR7: 예기치 않은 오류 발생 시 사용자는 현재 세션 실패를 인지하고 즉시 재시작할 수 있어야 한다.
NFR8: MVP에서 수집하는 데이터는 플레이 분석에 필요한 최소 범위로 제한되어야 한다.
NFR9: 분석 이벤트에는 개인 식별이 가능한 정보가 포함되지 않아야 한다.
NFR10: 로컬 저장 데이터는 게임 진행에 필요한 범위로 제한되어야 하며, 민감정보를 저장하지 않아야 한다.
NFR11: HUD의 핵심 텍스트/상태 정보는 다양한 화면 크기에서 읽을 수 있는 대비와 크기를 유지해야 한다.
NFR12: 시간 임박, 실패, 클리어 상태는 색상 외 추가 시각 신호로 구분되어야 한다.
NFR13: 주요 플레이 기능은 터치/키보드 각각에서 단일 입력 방식으로 수행 가능해야 한다.
NFR14: MVP는 최신 주요 브라우저(Desktop: Chrome/Safari/Edge, Mobile: iOS Safari/Android Chrome 최근 2개 메이저 버전)에서 동일한 핵심 게임 규칙을 제공해야 한다.
NFR15: 지원 대상 브라우저에서 레이아웃 깨짐 없이 플레이 가능한 반응형 화면을 제공해야 한다.

### Additional Requirements

- Starter template는 `Vite + React + TypeScript (react-ts)`를 사용한다.
- 초기화 명령은 `npm create vite@latest ... --template react-ts` 표준을 따른다.
- 배포는 GitHub Pages + GitHub Actions를 기준으로 한다.
- 환경 변수는 `VITE_` 접두를 사용하며 GA4 측정 ID(`VITE_GA4_ID`)를 포함한다.
- MVP 데이터 저장은 localStorage 기반으로 시작한다.
- 이벤트 스키마는 세션/스테이지/결과 이벤트로 고정하고 변경 시 문서를 동기화한다.
- 네이밍/포맷/상태관리 패턴은 Architecture 문서 규칙을 준수한다.
- 테스트는 단위(co-located) + E2E(`e2e/`) 구조를 사용한다.

### UX Design Requirements

- UX Design 문서는 현재 없음 (PRD/Architecture의 UI 요구를 기준으로 스토리 구성)

### FR Coverage Map

FR1: Epic 1 - 브라우저 진입 및 즉시 시작
FR2: Epic 1 - 메인 진입점에서 세션 시작
FR3: Epic 5 - 세션 시작 이벤트 계측
FR4: Epic 5 - 세션 종료 유형 계측
FR5: Epic 2 - Snake 입력 조작
FR6: Epic 2 - 이동/충돌/먹이 규칙 적용
FR7: Epic 2 - 스테이지 제한 시간 적용
FR8: Epic 2 - 스테이지 목표 먹이 수 적용
FR9: Epic 2 - 제한 시간 내 클리어 처리
FR10: Epic 2 - 충돌/시간초과 실패 처리
FR11: Epic 1 - 실패 후 즉시 재시작
FR12: Epic 3 - 20개 스테이지 제공
FR13: Epic 3 - 4개 티어 난이도 관리
FR14: Epic 3 - 다음 스테이지 해금
FR15: Epic 3 - 도달 가능 스테이지 확인/선택
FR16: Epic 3 - 스테이지 진행 상태 유지
FR17: Epic 1 - PC 키보드 입력 지원
FR18: Epic 1 - 모바일 스와이프 입력 지원
FR19: Epic 1 - 입력 오인식 완화 정책
FR20: Epic 1 - PC/모바일 규칙 일관성
FR21: Epic 4 - 남은 시간 HUD 표시
FR22: Epic 4 - 목표 진행 HUD 표시
FR23: Epic 4 - 핵심 상태 변화 전달
FR24: Epic 4 - 클리어/실패 결과 전달
FR25: Epic 4 - 소형 화면 핵심 정보 우선 표시
FR26: Epic 5 - 세션별 플레이 시간 수집
FR27: Epic 5 - 스테이지 진입/완료/실패 이벤트 수집
FR28: Epic 5 - 재시작 이벤트 수집
FR29: Epic 5 - 플랫폼별 지표 분리 집계
FR30: Epic 5 - 평균 플레이 시간 산출
FR31: Epic 6 - 난이도 파라미터 조정
FR32: Epic 6 - 스테이지 제한시간 조정
FR33: Epic 6 - 지표 기반 밸런스 조정
FR34: Epic 6 - 운영 진단용 기록 제공
FR35: Epic 3 - 로컬 진행 상태 저장
FR36: Epic 5 - 개인정보 최소 수집
FR37: Epic 5 - 데이터 저장/수집 고지 제공
FR38: Epic 7 - 고스트 리플레이 확장 훅
FR39: Epic 7 - 일일 챌린지 확장 훅
FR40: Epic 7 - 테마 맵 확장 수용

## Epic List

### Epic 1: Instant Play & Cross-Platform Session Foundation
사용자가 설치/가입 없이 PC/모바일에서 즉시 시작하고 실패 후 재도전할 수 있는 플레이 세션 기반을 제공한다.
**FRs covered:** FR1, FR2, FR11, FR17, FR18, FR19, FR20

### Epic 2: Core Snake Loop with Stage Win/Loss Rules
사용자가 제한 시간과 목표가 있는 스테이지를 플레이하고 성공/실패를 명확히 경험할 수 있는 핵심 게임 루프를 완성한다.
**FRs covered:** FR5, FR6, FR7, FR8, FR9, FR10

### Epic 3: Stage Progression & Persistent Campaign
사용자가 20개 맵을 티어별로 공략하고 진행 상황을 유지하는 캠페인 구조를 제공한다.
**FRs covered:** FR12, FR13, FR14, FR15, FR16, FR35

### Epic 4: Gameplay Feedback & Accessible HUD
사용자가 플레이 중 필요한 핵심 정보를 즉시 이해할 수 있도록 HUD/결과 피드백을 제공한다.
**FRs covered:** FR21, FR22, FR23, FR24, FR25

### Epic 5: Telemetry & Privacy-Safe Measurement
운영자가 KPI를 측정할 수 있도록 세션/스테이지 이벤트를 수집하고 프라이버시 기준을 충족한다.
**FRs covered:** FR3, FR4, FR26, FR27, FR28, FR29, FR30, FR36, FR37

### Epic 6: Balance Tuning & Operational Diagnostics
운영자가 난이도/시간을 조정하고 이슈를 진단할 수 있는 운영 루프를 제공한다.
**FRs covered:** FR31, FR32, FR33, FR34

### Epic 7: Post-MVP Extension Hooks
고스트 리플레이/일일 챌린지/테마맵을 후속 단계에서 추가할 수 있는 확장 지점을 준비한다.
**FRs covered:** FR38, FR39, FR40

### Epic 8: UI/UX Visual Alignment Refresh (old v1 style)
기존 기능을 유지하면서 old v1의 다크 카드형 비주얼과 모바일 조작 경험으로 UI/UX를 재정렬한다.
**FRs covered:** FR18, FR19, FR21, FR22, FR23, FR24, FR25

## Epic 1: Instant Play & Cross-Platform Session Foundation

사용자가 설치/가입 없이 PC/모바일에서 즉시 시작하고 실패 후 재도전할 수 있는 플레이 세션 기반을 제공한다.

### Story 1.1: Starter Template 프로젝트 초기화

As a 개발자,
I want Vite React TypeScript 스타터로 프로젝트를 초기화하고 기본 배포 설정을 준비하고,
So that 구현 에이전트들이 일관된 기반에서 개발을 시작할 수 있다.

**Acceptance Criteria:**

**Given** 빈 리포지토리가 있고 starter 결정이 완료되었을 때
**When** `react-ts` 템플릿으로 프로젝트를 생성하고 기본 스크립트를 실행하면
**Then** 개발 서버와 프로덕션 빌드가 정상 동작한다
**And** GitHub Pages 배포를 위한 `vite base` 및 워크플로 기본 골격이 준비된다

### Story 1.2: 세션 시작/재시작 기본 흐름 구현

As a 플레이어,
I want 메인 화면에서 즉시 세션을 시작하고 실패 후 바로 재시작하고,
So that 대기 없이 연속 플레이할 수 있다.

**Acceptance Criteria:**

**Given** 메인 화면이 열려 있을 때
**When** 사용자가 시작 액션을 수행하면
**Then** 즉시 플레이 상태로 전환된다
**And** 실패 상태에서 재시작 액션 시 새 세션이 즉시 시작된다

### Story 1.3: 입력 컨트롤러(키보드/스와이프)와 정책 구현

As a 플레이어,
I want PC에서는 키보드, 모바일에서는 스와이프로 조작하고,
So that 기기와 무관하게 동일한 플레이 경험을 얻을 수 있다.

**Acceptance Criteria:**

**Given** PC 또는 모바일 환경에서 플레이 중일 때
**When** 사용자가 방향 입력을 수행하면
**Then** 입력 정책에 맞게 방향이 반영된다
**And** 오인식 완화 규칙(예: 즉시 역방향 방지)이 일관되게 적용된다

## Epic 2: Core Snake Loop with Stage Win/Loss Rules

사용자가 제한 시간과 목표가 있는 스테이지를 플레이하고 성공/실패를 명확히 경험할 수 있는 핵심 게임 루프를 완성한다.

### Story 2.1: Snake 엔진 기본 규칙(이동/충돌/먹이) 구현

As a 플레이어,
I want 뱀이 규칙대로 이동하고 충돌/먹이 획득이 처리되며,
So that 게임 플레이가 예측 가능하고 공정하게 동작한다.

**Acceptance Criteria:**

**Given** 플레이 세션이 시작된 상태에서
**When** 틱이 진행되고 입력이 반영되면
**Then** 뱀 위치와 길이가 규칙대로 업데이트된다
**And** 벽/몸통 충돌 시 실패 상태로 전환된다

### Story 2.2: 스테이지 목표 및 타이머 시스템 구현

As a 플레이어,
I want 스테이지마다 제한 시간과 목표 수가 적용되고,
So that 공략형 플레이를 할 수 있다.

**Acceptance Criteria:**

**Given** 특정 스테이지가 시작되면
**When** 타이머가 감소하고 목표 먹이 수를 달성하면
**Then** 클리어 상태로 전환된다
**And** 시간 초과 시 실패 상태로 전환된다

### Story 2.3: 결과 상태(클리어/실패) 처리 표준화

As a 플레이어,
I want 클리어와 실패 결과가 명확히 구분되어 표시되고,
So that 다음 행동(다음 스테이지/재도전)을 즉시 결정할 수 있다.

**Acceptance Criteria:**

**Given** 플레이가 종료되면
**When** 종료 원인이 결정되면
**Then** 결과 타입(clear/fail_collision/fail_timeout)이 정확히 매핑된다
**And** 결과 화면에서 다음 가능한 액션이 제공된다

## Epic 3: Stage Progression & Persistent Campaign

사용자가 20개 맵을 티어별로 공략하고 진행 상황을 유지하는 캠페인 구조를 제공한다.

### Story 3.1: 20맵/4티어 스테이지 메타데이터 구성

As a 플레이어,
I want 20개 스테이지가 난이도 티어로 구성되어 제공되고,
So that 점진적으로 도전 난이도를 경험할 수 있다.

**Acceptance Criteria:**

**Given** 게임이 초기화되면
**When** 스테이지 목록을 조회하면
**Then** 20개 맵 메타데이터가 일관된 구조로 로드된다
**And** 티어 정보가 각 스테이지에 매핑된다

### Story 3.2: 스테이지 해금/선택 흐름 구현

As a 플레이어,
I want 클리어한 스테이지 다음 맵이 해금되고,
So that 캠페인을 순차적으로 진행할 수 있다.

**Acceptance Criteria:**

**Given** 플레이어가 스테이지를 클리어하면
**When** 진행 상태를 갱신하면
**Then** 다음 스테이지가 해금된다
**And** 플레이어는 해금된 스테이지만 선택 가능하다

### Story 3.3: 진행 상태 로컬 저장/복원 구현

As a 플레이어,
I want 내 진행 상태가 로컬에 저장되고 다음 접속 때 복원되며,
So that 중단한 지점에서 계속 플레이할 수 있다.

**Acceptance Criteria:**

**Given** 진행 상태가 변경되면
**When** 세션이 종료되거나 새로고침되면
**Then** 진행 상태가 로컬 저장소에 기록된다
**And** 재접속 시 동일한 진행 상태가 복원된다

## Epic 4: Gameplay Feedback & Accessible HUD

사용자가 플레이 중 필요한 핵심 정보를 즉시 이해할 수 있도록 HUD/결과 피드백을 제공한다.

### Story 4.1: 플레이 HUD(시간/목표/핵심 상태) 구현

As a 플레이어,
I want 플레이 중 남은 시간과 목표 진행을 한눈에 보고,
So that 의사결정을 빠르게 할 수 있다.

**Acceptance Criteria:**

**Given** 플레이 중일 때
**When** 상태가 변하면
**Then** HUD의 시간/목표 정보가 즉시 갱신된다
**And** 상태 변화가 시각적으로 인지 가능하게 표시된다

### Story 4.2: 결과 화면과 재도전/다음 스테이지 액션 구현

As a 플레이어,
I want 결과 화면에서 재도전 또는 다음 진행을 선택하고,
So that 플레이 흐름이 끊기지 않는다.

**Acceptance Criteria:**

**Given** 클리어 또는 실패가 발생하면
**When** 결과 화면이 표시되면
**Then** 가능한 액션(재시작/다음 스테이지)이 제공된다
**And** 선택한 액션이 즉시 실행된다

### Story 4.3: 반응형/접근성 HUD 기준 충족

As a 플레이어,
I want 작은 화면에서도 핵심 정보가 읽기 쉽고 상태가 명확하게 구분되며,
So that 모바일에서도 불편 없이 플레이할 수 있다.

**Acceptance Criteria:**

**Given** 다양한 화면 크기에서
**When** HUD가 렌더링되면
**Then** 핵심 텍스트 대비와 가독성이 유지된다
**And** 시간 임박/실패/클리어 상태는 색상 외 시각 신호로 구분된다

## Epic 5: Telemetry & Privacy-Safe Measurement

운영자가 KPI를 측정할 수 있도록 세션/스테이지 이벤트를 수집하고 프라이버시 기준을 충족한다.

### Story 5.1: 이벤트 스키마와 analytics adapter 구현

As a 운영자,
I want 세션/스테이지/결과 이벤트가 표준 스키마로 수집되고,
So that 데이터 해석 일관성을 확보할 수 있다.

**Acceptance Criteria:**

**Given** 플레이 세션이 진행되면
**When** 주요 상태 전환이 발생하면
**Then** 정의된 이벤트명/파라미터 스키마로 이벤트가 생성된다
**And** adapter 계층을 통해 외부 분석 도구로 전달된다

### Story 5.2: GA4 연동 및 핵심 KPI 이벤트 계측

As a 운영자,
I want GA4에서 세션 길이와 스테이지 진행 이벤트를 확인하고,
So that 평균 플레이 시간 KPI를 측정할 수 있다.

**Acceptance Criteria:**

**Given** GA4 측정 ID가 설정되어 있을 때
**When** 플레이어가 세션 시작/종료/스테이지 진행/재시작을 수행하면
**Then** 해당 이벤트가 GA4에 기록된다
**And** 플랫폼 구분 파라미터가 포함된다

### Story 5.3: 프라이버시 최소수집 및 고지 처리

As a 제품 관리자,
I want 분석 데이터가 개인정보 없이 최소 범위로 수집되고,
So that 정책 및 사용자 신뢰 기준을 충족할 수 있다.

**Acceptance Criteria:**

**Given** 이벤트를 수집할 때
**When** 이벤트 payload를 구성하면
**Then** 개인식별정보는 포함되지 않는다
**And** 데이터 저장/수집 고지 정보가 접근 가능하다

## Epic 6: Balance Tuning & Operational Diagnostics

운영자가 난이도/시간을 조정하고 이슈를 진단할 수 있는 운영 루프를 제공한다.

### Story 6.1: 난이도/타이머 파라미터 외부화

As a 운영자,
I want 스테이지 난이도와 제한시간을 코드 핵심 로직과 분리해 조정하고,
So that 밸런싱 실험을 빠르게 반복할 수 있다.

**Acceptance Criteria:**

**Given** 스테이지 설정 파일이 있을 때
**When** 운영자가 난이도/시간 파라미터를 변경하면
**Then** 다음 실행부터 설정이 반영된다
**And** 엔진 로직 수정 없이 튜닝 가능하다

### Story 6.2: KPI 관찰 기반 밸런스 의사결정 리포트

As a 운영자,
I want 스테이지 도달률/완료율/재시작률을 근거로 조정 후보를 확인하고,
So that 체계적으로 밸런스를 개선할 수 있다.

**Acceptance Criteria:**

**Given** 이벤트 데이터가 축적되면
**When** 운영 진단 정보를 조회하면
**Then** 주요 지표가 스테이지 단위로 요약된다
**And** 조정 후보(난이도 완화/강화)가 식별 가능하다

### Story 6.3: 문제 재현/진단용 로그 기준 정립

As a 테스터,
I want 입력/세션/결과 관련 진단 로그를 일관된 형식으로 확인하고,
So that 이슈를 빠르게 재현하고 원인을 좁힐 수 있다.

**Acceptance Criteria:**

**Given** 오류나 이상 동작이 발생하면
**When** 로그를 확인하면
**Then** 세션ID/이벤트흐름/결과코드가 일관되게 기록된다
**And** 재현 조건을 추적할 수 있다

## Epic 7: Post-MVP Extension Hooks

고스트 리플레이/일일 챌린지/테마맵을 후속 단계에서 추가할 수 있는 확장 지점을 준비한다.

### Story 7.1: 고스트 리플레이 확장 훅 정의

As a 개발자,
I want 플레이 기록 데이터를 확장 가능한 형태로 저장할 수 있고,
So that V2에서 고스트 리플레이를 쉽게 추가할 수 있다.

**Acceptance Criteria:**

**Given** 플레이 세션이 종료되면
**When** 기록 데이터를 저장하면
**Then** 경로/입력/결과를 확장 가능한 스키마로 보관할 수 있다
**And** 현재 MVP 기능과 충돌하지 않는다

### Story 7.2: 일일 챌린지 규칙 확장 훅 정의

As a 개발자,
I want 스테이지 규칙을 주입 가능한 구조로 유지하고,
So that 후속으로 일일 챌린지 룰셋을 도입할 수 있다.

**Acceptance Criteria:**

**Given** 스테이지 로딩 시점에
**When** 규칙 설정을 적용하면
**Then** 기본 룰과 확장 룰을 동일 인터페이스로 처리할 수 있다
**And** 기존 캠페인 플레이가 유지된다

### Story 7.3: 테마 맵 자산 확장 구조 정의

As a 개발자,
I want 맵/시각 자산을 테마 단위로 분리해 관리하고,
So that 테마 맵 팩을 후속 릴리스로 추가할 수 있다.

**Acceptance Criteria:**

**Given** 테마 자산 디렉토리 구조가 정의되면
**When** 맵/시각 자산을 로드하면
**Then** 기본 테마와 확장 테마를 동일 계약으로 처리할 수 있다
**And** 기존 플레이 흐름에 영향 없이 교체 가능하다

## Epic 8: UI/UX Visual Alignment Refresh (old v1 style)

기존 기능/규칙을 유지하면서 old v1 `style.css`의 비주얼 언어(다크 서페이스, 컴팩트 HUD, 모바일 터치 그리드)를 현재 앱 구조에 일관되게 반영한다.

### Story 8.1: 글로벌 시각 토큰 및 레이아웃 정렬

As a 플레이어,
I want old v1 느낌의 배경/서페이스/타이포/카드 레이아웃으로 화면이 구성되고,
So that 게임의 몰입감과 시각 일관성을 즉시 느낄 수 있다.

**Acceptance Criteria:**

**Given** 앱이 로드되면
**When** 루트/레이아웃 스타일이 적용되면
**Then** 다크 톤 배경과 카드형 컨테이너가 old v1 스타일과 유사하게 표시된다
**And** 기존 기능 동작(세션/스테이지/결과)은 변경 없이 유지된다

### Story 8.2: HUD/보드/컨트롤 컴팩트 UX 정렬

As a 플레이어,
I want HUD 정보와 보드, 터치 컨트롤이 old v1의 정보 밀도에 맞게 정렬되고,
So that 특히 모바일에서 빠르게 상태를 읽고 조작할 수 있다.

**Acceptance Criteria:**

**Given** 플레이 중일 때
**When** HUD와 컨트롤이 렌더링되면
**Then** 핵심 정보(방향/목표/남은시간)가 컴팩트하게 우선 노출된다
**And** 모바일 환경에서 터치 버튼 그리드가 의도대로 동작한다

### Story 8.3: 결과/상태 신호 접근성 및 마이크로카피 보정

As a 플레이어,
I want 결과/경고 상태가 텍스트와 시각 신호로 명확히 전달되고,
So that 실패/클리어/긴급상황에서 즉시 다음 행동을 선택할 수 있다.

**Acceptance Criteria:**

**Given** 플레이 상태가 전환되면
**When** 경고/실패/클리어 UI가 표시되면
**Then** 색상 외 텍스트 신호와 행동 버튼이 함께 제공된다
**And** 작은 화면에서도 문구/버튼이 겹치지 않고 읽기 가능하다
