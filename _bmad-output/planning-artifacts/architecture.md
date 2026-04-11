---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/product-brief-bmad-snake.md"
  - "_bmad-output/planning-artifacts/product-brief-bmad-snake-distillate.md"
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-04-12'
project_name: 'bmad-snake'
user_name: 'Kai'
date: '2026-04-11T18:01:18Z'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
현재 PRD에는 총 40개의 기능 요구사항(FR1~FR40)이 정의되어 있으며, 게임 세션/접근, 코어 게임플레이, 스테이지 진행, 크로스플랫폼 입력, HUD 피드백, 텔레메트리, 운영 튜닝, 데이터/프라이버시, Post-MVP 확장 훅까지 포함한다.  
아키텍처 관점에서 핵심은 "즉시 플레이 가능한 브라우저 게임 루프"와 "측정 가능한 운영 피드백 루프"를 동시에 만족시키는 구조다.

**Non-Functional Requirements:**
NFR은 성능, 신뢰성, 보안/프라이버시, 접근성, 호환성 중심으로 정의되어 있다(NFR1~NFR15).  
특히 입력 반응성, 끊김 없는 루프, 모바일 저사양 대응, 이벤트 누락 방지, 브라우저 호환성 요구가 구조적 의사결정에 직접 영향을 준다.

**Scale & Complexity:**
프로젝트는 학습용 데모이지만, PC/모바일 동시 지원과 20맵 진행 구조, 텔레메트리 기반 밸런싱을 포함해 단순 토이 수준을 넘어선다.

- Primary domain: 브라우저 기반 캐주얼 게임 웹앱
- Complexity level: medium
- Estimated architectural components: 7
  (게임 루프/상태 관리/입력 처리/스테이지·맵 관리/UI-HUD/텔레메트리/운영 튜닝 인터페이스)

### Technical Constraints & Dependencies

- MVP는 실시간 백엔드 의존 없이 클라이언트 중심 동작을 우선한다.
- 저장 전략은 로컬 우선이며, 서버 동기화는 후속 단계로 둔다.
- 반응형 UI 및 입력(키보드/스와이프) 일관성이 필수다.
- 이벤트 스키마(세션 시작/종료, 도달/완료, 재시작)는 조기 고정이 필요하다.
- 필수 외부 연동은 없고, 분석/오류로깅 도구는 선택적 연동으로 고려한다.

### Cross-Cutting Concerns Identified

- 입력 정확도/지연 제어(모바일 오인식 포함)
- 게임 상태 일관성(탭 전환/복귀 포함)
- 텔레메트리 신뢰성(누락/해석 불일치 방지)
- 접근성 최소 기준(가독성, 상태 전달)
- 브라우저 호환성과 성능 예산 관리
- 밸런싱 운영 루프(지표 기반 난이도/시간 조정)

## Starter Template Evaluation

### Primary Technology Domain

브라우저 기반 게임 웹앱(`web_app`)이며, 빠른 학습형 MVP를 위해 최소 의존성 + 즉시 실행 가능한 프론트엔드 스타터가 적합하다.

### Starter Options Considered

1. Vite `vanilla-ts`
- 장점: 가장 가벼움, 초기 부트스트랩 속도 빠름
- 단점: 화면 상태/구조가 커질수록 코드 조직 비용 증가

2. Vite `react-ts`
- 장점: 화면/상태/HUD 구성과 확장(고스트 리플레이, 일일 챌린지) 대비가 좋음
- 단점: vanilla 대비 의존성/추상화 증가

3. Vite `react-swc-ts` 계열
- 장점: 개발 체감 속도 우수
- 단점: 빠른 학습형 MVP에서 필수 이점은 제한적

### Selected Starter: Vite + React + TypeScript (`react-ts`)

**Rationale for Selection:**
- 사용자 선호(TypeScript + Vite)와 일치
- 현재 범위(스테이지/HUD/입력/상태 관리)에 필요한 구조화 이점 확보
- 학습용 MVP 단계에서 과도한 복잡도 없이 확장 여지 유지
- GitHub Pages 배포와 궁합이 좋고 공식 배포 가이드가 명확함

**Initialization Command:**

```bash
npm create vite@latest bmad-snake-game -- --template react-ts
cd bmad-snake-game
npm install
npm run dev
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript 기반 프론트엔드 코드베이스
- Node.js 최신 LTS(공식 Vite 요구사항 충족) 전제

**Styling Solution:**
- 기본 CSS + 컴포넌트 단위 스타일링부터 시작
- MVP에서는 UI 프레임워크 도입을 지양해 속도 우선

**Build Tooling:**
- Vite 번들링/개발 서버 표준 구성
- 정적 빌드 결과물(`dist`) 중심 GitHub Pages 배포

**Testing Framework:**
- 스타터 기본에는 테스트 러너가 포함되지 않음
- Step 4 이후 아키텍처 결정에서 Vitest/Playwright 도입 여부 확정

**Code Organization:**
- React 컴포넌트 구조 기반
- 게임 루프/입력/상태/렌더를 분리 가능한 기본 구조 확보

**Development Experience:**
- 빠른 HMR, TypeScript 체크, 단순한 npm 워크플로우
- 학습용 MVP에 적합한 낮은 설정 부담

### GitHub Pages Deployment Baseline

- `vite.config.ts`에서 `base` 설정:
  - 유저/조직 루트 페이지면 `'/'`
  - 저장소 페이지면 `'/<repo>/'`
- 배포 소스는 GitHub Pages에서 **GitHub Actions** 사용(공식 Vite 가이드 권장)

### GA4 Baseline

- GA4 측정 ID(`G-...`)를 사용해 Google tag(`gtag.js`)를 웹앱에 삽입
- MVP에서는 페이지뷰 + 핵심 게임 이벤트(세션 시작/종료, 스테이지 완료/실패, 재시작)만 우선 계측

## Core Architectural Decisions

### Decision Priority Analysis
- **Critical**
  - 런타임/툴체인 버전 고정
  - 게임 상태 관리 패턴
  - 입력 처리 정책(키보드/스와이프)
  - 배포/환경 전략(GitHub Pages)
  - 이벤트 스키마 고정(GA4 연동 포함)
- **Important**
  - 테스트 전략(Vitest/Playwright 도입 범위)
  - 로컬 저장 전략(진행 상태/설정)
- **Deferred**
  - 서버 백엔드/DB, 인증, 멀티플레이, 랭킹

### Data Architecture
- MVP 데이터 저장: **클라이언트 로컬 저장(localStorage)**
- 데이터 모델: `stageProgress`, `settings`, `lastSessionSummary`
- 검증: 런타임 검증 스키마(가벼운 schema validator) 적용
- 캐시: 브라우저 기본 캐시 + 정적 에셋 fingerprint

### Authentication & Security
- MVP 인증: **없음(익명 플레이)**
- 개인정보: 수집 최소화, PII 미저장
- 보안 기본선:
  - 입력 데이터 sanitize
  - 의존성 취약점 정기 점검
  - GA4 이벤트에 식별 정보 제외

### API & Communication Patterns
- MVP 백엔드 API: **없음**
- 내부 인터페이스:
  - 게임 엔진 ↔ UI 사이 event-driven contract
  - analytics adapter 통해 이벤트 전송 추상화
- 에러 처리:
  - UI-safe fallback + 세션 재시작 가능 상태 보장

### Frontend Architecture
- 프레임워크: **React + TypeScript + Vite**
- 구조: feature-first
  - `core/game-engine`
  - `features/stage`
  - `features/input`
  - `features/hud`
  - `features/analytics`
- 상태 전략:
  - 게임 루프 핵심 상태는 단일 게임 스토어(또는 reducer)
  - UI 파생 상태는 컴포넌트 지역 상태 우선
- 라우팅:
  - 최소 라우팅(홈/플레이/결과)만 유지
- 성능:
  - 렌더 사이클 최소화
  - 입력 핸들러 경량화
  - 타이머/루프 일관성 우선

### Infrastructure & Deployment
- 배포: **GitHub Pages + GitHub Actions**
- 환경:
  - `VITE_GA4_ID` 등 빌드타임 환경변수 사용
- 관측:
  - GA4 핵심 이벤트만 우선 도입
- 확장:
  - 서버 필요 시 adapter 유지한 채 backend 추가 가능 구조

### Version Verification (Web-checked)
- Node.js: LTS 라인 사용 권장 (예: `v24.14.1 LTS`)
- Vite: latest `7.1.4`
- React: latest `19.1.1`
- TypeScript: latest tag `5.8.3`
- Vitest: latest `3.2.4`
- Playwright Test: latest `1.55.0`

### Decision Impact Analysis
- **Implementation Sequence**
  1. 프로젝트 초기화(Vite React TS)
  2. 게임 엔진/상태/입력 계약 구현
  3. HUD/스테이지/진행 저장
  4. GA4 이벤트 계측
  5. 테스트/배포 자동화
- **Cross-Component Dependencies**
  - 입력 정책 ↔ 게임 루프 안정성
  - 이벤트 스키마 ↔ 운영 밸런싱 가능성
  - 배포 base 설정 ↔ 라우팅/에셋 로딩

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined
- Critical conflict points: 6개
  - 네이밍, 디렉토리 구조, API/이벤트 포맷, 상태 업데이트, 에러 처리, 분석 이벤트 스키마

### Naming Patterns

**Database/Local Data Naming**
- localStorage key: kebab-case
  - 예: `bmad-snake.stage-progress`, `bmad-snake.settings`
- 내부 모델 필드: camelCase
  - 예: `currentStage`, `bestSessionTimeSec`

**API/Telemetry Naming**
- GA4 이벤트명: snake_* snake_stage_* 접두 통일
  - 예: `snake_session_start`, `snake_stage_clear`
- 이벤트 파라미터: snake_ 접두 + snake_case
  - 예: `snake_stage_id`, `snake_result`

**Code Naming**
- React 컴포넌트: PascalCase (`GameHUD.tsx`)
- 훅: camelCase + `use` prefix (`useGameLoop.ts`)
- 유틸/서비스 파일: kebab-case (`analytics-adapter.ts`)
- 상수: UPPER_SNAKE_CASE

### Structure Patterns

**Project Organization (feature-first)**
- `src/core/game-engine`
- `src/features/input`
- `src/features/stage`
- `src/features/hud`
- `src/features/analytics`
- `src/shared/{types,utils,constants}`

**Tests**
- 단위 테스트: 대상 파일 옆 `*.test.ts`
- E2E: `e2e/` 루트 분리
- 테스트 데이터: `tests/fixtures` 공용 사용

### Format Patterns

**Game Events Contract**
- 공통 이벤트 구조:
  - `eventName`, `timestamp`, `sessionId`, `platform`, `payload`
- 결과 타입 값 고정:
  - `clear | fail_collision | fail_timeout | abandon_inactive`

**Error Object Format**
- 앱 내부 에러 객체:
  - `{ code: string, message: string, context?: Record<string, unknown> }`
- 사용자 메시지와 로그 메시지 분리

### Communication Patterns

**Engine ↔ UI**
- UI는 엔진 상태를 직접 mutate 금지
- 엔진 명령은 command 함수로만 호출
  - 예: `startSession`, `restartStage`, `pauseSession`, `resumeSession`

**State Management**
- 핵심 게임 상태는 단일 reducer/store
- 상태 업데이트는 action 기반
- 파생값(예: 남은 시간 표시 문자열)은 selector에서 계산

### Process Patterns

**Error Handling**
- recoverable 에러: 토스트/배너 + 즉시 재시작 경로 제공
- non-recoverable 에러: 안전 종료 + 세션 실패 이벤트 기록
- 콘솔 로그 레벨: `debug/info/warn/error` 통일

**Loading/Transition**
- 전환 상태는 `idle/loading/running/ended`
- 화면 전환 중 입력 잠금 규칙 명시
- 탭 비활성 30초 정책은 세션 종료로 통일

### Enforcement Guidelines
- 모든 에이전트 MUST:
  - 정해진 디렉토리/네이밍 규칙 준수
  - 이벤트 스키마 변경 시 PRD/Architecture 동시 업데이트
  - 엔진 상태 직접 변경 금지(reducer/command 경유)
- 검증:
  - ESLint + TypeScript + 테스트에서 규칙 위반 차단
  - PR 리뷰 체크리스트에 패턴 준수 항목 포함

### Pattern Examples

**Good**
- `snake_stage_clear` + `snake_stage_id=3`
- `GameHUD.tsx`, `useInputController.ts`, `analytics-adapter.ts`
- `dispatch({ type: 'STAGE_RESTARTED' })`

**Anti-Patterns**
- `stageClear`, `clearStage`, `Stage_Cleared` 혼용
- 엔진 상태 객체 직접 수정
- 이벤트마다 다른 파라미터 이름 사용 (`stageId`/`stage_id` 혼재)

## Project Structure & Boundaries

### Complete Project Directory Structure
```text
bmad-snake-game/
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── index.html
├── .gitignore
├── .env.example
├── .env.local            # local only, git ignore
├── .eslintrc.cjs
├── .prettierrc
├── .prettierignore
├── public/
│   ├── favicon.svg
│   └── icons/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy-pages.yml
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── app/
│   │   ├── router.tsx
│   │   ├── providers/
│   │   └── layout/
│   ├── core/
│   │   └── game-engine/
│   │       ├── engine.ts
│   │       ├── loop.ts
│   │       ├── collision.ts
│   │       ├── rules.ts
│   │       └── types.ts
│   ├── features/
│   │   ├── stage/
│   │   │   ├── stage-config.ts
│   │   │   ├── progression-store.ts
│   │   │   └── stage-select/
│   │   ├── input/
│   │   │   ├── keyboard-controller.ts
│   │   │   ├── swipe-controller.ts
│   │   │   └── input-policy.ts
│   │   ├── hud/
│   │   │   ├── GameHUD.tsx
│   │   │   ├── TimerBar.tsx
│   │   │   └── GoalStatus.tsx
│   │   ├── analytics/
│   │   │   ├── analytics-adapter.ts
│   │   │   ├── ga4-client.ts
│   │   │   └── events.ts
│   │   ├── session/
│   │   │   ├── session-manager.ts
│   │   │   └── inactivity-policy.ts
│   │   └── results/
│   │       ├── result-mapper.ts
│   │       └── ResultScreen.tsx
│   ├── shared/
│   │   ├── constants/
│   │   ├── types/
│   │   ├── utils/
│   │   └── storage/
│   │       ├── local-storage.ts
│   │       └── schemas.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── tokens.css
│   └── test/
│       ├── fixtures/
│       └── setup.ts
├── e2e/
│   ├── smoke.spec.ts
│   ├── gameplay.spec.ts
│   └── mobile-input.spec.ts
└── docs/
    └── architecture/
        ├── decisions.md
        └── event-schema.md
```

### Architectural Boundaries
- **API Boundaries**
  - MVP 외부 API 없음
  - `features/analytics`만 GA4 외부 경계 보유
- **Component Boundaries**
  - `core/game-engine`은 UI 프레임워크에 의존하지 않음
  - `features/*`는 엔진/공용 유틸을 조합해 화면 기능 구성
- **Service Boundaries**
  - `analytics-adapter`가 외부 분석 SDK를 캡슐화
  - `storage/*`가 로컬 저장 접근 단일화
- **Data Boundaries**
  - 런타임 게임 상태(메모리) vs 영속 상태(localStorage) 분리
  - 이벤트 payload는 `features/analytics/events.ts` 스키마로 고정

### Requirements to Structure Mapping
- **Feature Mapping**
  - 게임 루프/충돌/규칙(FR5~FR11) -> `core/game-engine/*`
  - 스테이지/해금(FR12~FR16) -> `features/stage/*`
  - 입력(FR17~FR20) -> `features/input/*`
  - HUD/결과(FR21~FR25) -> `features/hud/*`, `features/results/*`
  - 텔레메트리(FR26~FR30) -> `features/analytics/*`
  - 운영 튜닝(FR31~FR34) -> `features/stage/stage-config.ts`, `docs/architecture/event-schema.md`
- **Cross-Cutting Concerns**
  - NFR 성능/호환성 -> `core/game-engine/*`, `styles/*`, `e2e/*`
  - NFR 프라이버시 -> `features/analytics/*`, `shared/storage/*`

### Integration Points
- **Internal Communication**
  - UI -> session-manager -> engine command 호출
  - engine state -> selectors -> HUD 렌더링
  - session/result 변화 -> analytics adapter 이벤트 전송
- **External Integrations**
  - GA4 gtag.js (측정 ID 환경변수 기반)
  - GitHub Actions deploy workflow
- **Data Flow**
  - 입력 -> 엔진 업데이트 -> 상태 렌더 -> 이벤트 기록 -> 필요 상태 저장

### File Organization Patterns
- **Configuration Files**
  - 루트에 빌드/린트/포맷/환경 설정 집중
- **Source Organization**
  - `core`(프레임워크 비의존 로직) + `features`(기능) + `shared`(공용)
- **Test Organization**
  - 단위 테스트 co-located, E2E 별도 `e2e/`
- **Asset Organization**
  - 정적 자산 `public/`, 스타일 토큰 `src/styles/tokens.css`

### Development Workflow Integration
- **Development**
  - `npm run dev`로 Vite HMR
- **Build**
  - `npm run build` -> `dist/`
- **Deployment**
  - GitHub Actions가 `dist`를 GitHub Pages에 게시
  - `vite.config.ts`의 `base`는 repo path 기준으로 설정

## Architecture Validation Results

### Coherence Validation ✅
**Decision Compatibility**
- `React + TypeScript + Vite + GitHub Pages` 조합은 충돌 없이 동작 가능한 표준 구성이다.
- 익명 플레이(MVP)와 로컬 저장 전략이 현재 범위(FR/NFR)와 일치한다.
- GA4 어댑터 분리 전략이 외부 의존점 단일화에 기여한다.

**Pattern Consistency**
- 네이밍/포맷/상태 업데이트/에러 처리 규칙이 명시되어 에이전트 간 구현 편차를 줄일 수 있다.
- 이벤트 스키마 고정 원칙이 분석/운영 루프 일관성을 보장한다.

**Structure Alignment**
- `core`/`features`/`shared` 경계가 FR 카테고리와 잘 매핑된다.
- 테스트 구조(co-located unit + `e2e/`)가 품질 목표와 부합한다.

### Requirements Coverage Validation ✅
**Functional Requirements Coverage**
- FR1~FR40 전 범위를 아키텍처 구성요소에 매핑 완료.
- 특히 입력/스테이지/HUD/텔레메트리/운영 튜닝 경로가 명확하다.

**Non-Functional Requirements Coverage**
- 성능: 게임 루프/입력/렌더 경로 분리로 대응 가능
- 신뢰성: 세션 이벤트/복구 정책 구조화
- 프라이버시: PII 최소 수집 및 로컬 저장 범위 제한
- 접근성/호환성: UI 계층 및 브라우저 매트릭스 반영

### Implementation Readiness Validation ✅
**Decision Completeness**
- 핵심 결정(스택, 저장, 이벤트, 배포) 문서화 완료
- 구현 규칙(패턴)과 구조(트리)가 함께 제공됨

**Structure Completeness**
- 루트 설정/소스/테스트/배포 워크플로우까지 포함한 구현 가능한 트리 확보
- 모듈 경계 및 통신 지점이 구체적으로 정의됨

**Pattern Completeness**
- 충돌 가능 영역(이름/포맷/프로세스) 대부분 커버됨
- 에이전트 구현 시 필수 준수 규칙이 명시됨

### Gap Analysis Results
**Critical Gaps**
- 없음 (현재 MVP 구현 시작 가능)

**Important Gaps**
- GA4 이벤트 파라미터 상세 스키마 문서(`docs/architecture/event-schema.md`)를 실제로 작성해야 함
- 상태 저장 스키마 버전 정책(마이그레이션 방식)을 1차 정의하면 안전성 상승

**Nice-to-Have**
- ADR(Architecture Decision Record) 파일 분리 운영
- 컴포넌트 경계 테스트 가이드 문서 추가

### Architecture Readiness Assessment
- **Overall Status:** READY FOR IMPLEMENTATION
- **Confidence:** High
- **Key Strengths:**
  - 요구사항-구조 매핑 명확
  - 패턴/경계 규칙 구체적
  - 배포/관측 경로 실무적으로 단순
- **Future Enhancements:**
  - 백엔드/리더보드 확장 시 data boundary 재설계
  - 고스트 리플레이 도입 시 기록 저장 전략 확장

### Implementation Handoff
- AI Agent는 Architecture 문서의 패턴/경계 규칙을 우선 준수
- 이벤트 스키마 변경 시 PRD/Architecture 동시 업데이트
- 첫 구현 우선순위:
  1. Vite React TS 초기화
  2. 게임 엔진/입력/세션 최소 루프
  3. HUD + 스테이지 진행
  4. GA4 핵심 이벤트
  5. GitHub Pages 배포 자동화
