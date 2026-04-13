---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish]
date: 2026-04-13
inputDocuments:
  - /Users/chakannom/Development/workspace/bmad-snake/_bmad-output/brainstorming/brainstorming-session-2026-04-13-165227.md
workflowType: 'prd'
documentCounts:
  briefCount: 0
  researchCount: 0
  brainstormingCount: 1
  projectDocsCount: 0
classification:
  projectType: web_app
  domain: gaming
  complexity: medium
  projectContext: greenfield
---

# Product Requirements Document - bmad-snake

**Author:** Kai
**Date:** 2026-04-13

## Executive Summary

이 프로젝트는 TypeScript + Vite 기반의 웹 Snake 게임을 신규로 설계·구현하는 greenfield 프로젝트다.
핵심 목표는 단순 게임 제작을 넘어서 BMad-Method를 실제 산출물 중심으로 학습·적용할 수 있는 구조를 만드는 것이다.
주요 사용자 경험은 모바일 기준에서 시작하며, 사용자는 직관적인 터치 조작과 빠른 재시작 루프를 통해 짧은 세션에서도 반복 플레이 동기를 얻는다.
초기 범위는 모바일 우선 조작 체계, 20개 맵 progression, 일관된 다크 테마 UI, 기본 게임 상태 관리(idle/running/paused/gameover)를 포함한다.

### What Makes This Special

이 제품의 차별점은 고정된 단일 기능이 아니라, 개발 과정에서 실험·검증을 통해 차별점을 점진적으로 형성하는 전략에 있다.
첫 번째 차별 축은 모바일 터치 조작 품질(방향 버튼 + 중앙 비배치 재시작 버튼)이며, 두 번째 축은 20개 맵 난이도 곡선으로 구성된 progression 설계다.
세 번째 축은 Docusaurus Dark 감성의 디자인 시스템을 게임 UI에 이식해, 학습용 프로젝트임에도 일관된 제품 품질 기준을 유지하는 점이다.
결과적으로 이 프로젝트는 "플레이 가능한 게임"과 "재사용 가능한 BMAD 학습 자산"을 동시에 생산한다.

## Project Classification

- **Project Type:** Web App
- **Domain:** Gaming
- **Complexity:** Medium
- **Project Context:** Greenfield

## Success Criteria

### User Success

- 첫 플레이 3분 내 1판 완료율 70% 이상
- 성공 판정 기준: 신규 사용자가 별도 설명 없이 게임을 시작하고 1회 플레이를 정상 완료

### Business Success

- BMAD 학습 산출물 체인 완주율 80% 이상
- 측정 범위: 브레인스토밍 → PRD/GDD → 아키텍처/스토리까지 핵심 산출물 5종
- 측정 방법: 스프린트 종료 시점에 5종 중 4종 이상이 리뷰 승인 상태이면 달성으로 판정

### Technical Success

- 모바일 평균 FPS 55 이상
- 터치 입력 반응 시간 100ms 이하
- 치명 크래시율 1% 미만

### Measurable Outcomes

- 신규 사용자 테스트에서 3분 내 첫 판 완료율 70%+
- 대표 모바일 디바이스에서 평균 55fps+ 유지
- 입력 지연 100ms 이하 유지(터치 기준)
- 테스트 세션 기준 치명 크래시 1% 미만

### Success Criteria Traceability

| Success Criterion | Supporting Journeys | Supporting FR/NFR |
|---|---|---|
| 첫 플레이 3분 내 1판 완료율 70% 이상 | Journey 1, Journey 2 | FR1, FR4, FR5, FR9, FR15, FR18 |
| BMAD 학습 산출물 체인 완주율 80% 이상 | Journey 4 | FR23, FR24 |
| 모바일 평균 FPS 55 이상 | Journey 1, Journey 3 | NFR-Performance-1 |
| 터치 입력 반응 시간 100ms 이하 | Journey 1, Journey 2 | FR5, FR8, NFR-Performance-2 |
| 치명 크래시율 1% 미만 | Journey 2, Journey 4 | NFR-Reliability-1 |

## Product Scope

### MVP - Minimum Viable Product

- 모바일 우선 Snake 플레이 루프(시작/이동/충돌/재시작)
- 방향 버튼 기반 터치 조작
- 재시작 버튼 별도 배치(방향 버튼 중앙 금지)
- 20개 맵 데이터 구조 및 기본 진행 동선
- Docusaurus Dark 톤 기본 UI 토큰 적용

### Growth Features (Post-MVP)

- 맵 진행 저장
- 점수 기록 및 랭킹
- 게임 모드 확장(예: 속도 모드, 장애물 변형)
- 플레이 텔레메트리 기반 밸런싱

### Vision (Future)

- BMAD 학습용 레퍼런스 프로젝트 패키지화
- 아티팩트 자동 추적(요구사항↔스토리↔구현↔테스트 연결)
- 모바일/PC 동시 품질 기준 운영 가능한 구조로 확장

## User Journeys

### 1) 일반 플레이어 - Success Path

- 출근길에 3분 정도 짧게 플레이할 게임을 찾는다.
- 접속 후 즉시 시작 버튼을 누르고, 터치 방향키로 조작한다.
- 실수로 죽어도 재시작 버튼이 별도 위치에 있어 빠르게 재도전한다.
- 1판 완료 후 "짧지만 성취감 있다"는 인식을 갖고 다음 날 재방문한다.

### 2) 일반 플레이어 - Edge Case

- 한 손 조작 중 오입력이 발생해 조기 게임오버가 난다.
- 일시정지/재시작을 통해 흐름을 복구하고 다시 플레이한다.
- 입력 반응이 느리거나 프레임 드랍이 생기면 이탈 위험이 커진다.
- 복구 경로(즉시 재시작, 명확한 상태 표시)가 UX 핵심이 된다.

### 3) 고급 플레이어 - Progression Path

- 20개 맵 난이도 곡선을 목표로 반복 플레이한다.
- 맵 패턴을 학습하며 더 짧은 시간/더 높은 안정성으로 클리어를 노린다.
- 난이도 상승이 공정하다고 느끼면 장기 체류한다.
- 불합리한 맵 설계나 입력 지연은 즉시 불만 포인트가 된다.

### 4) 운영/콘텐츠 관리자 - Tuning Path

- 맵 난이도와 장애물 패턴을 테스트 결과 기반으로 조정한다.
- 특정 맵에서 실패율이 과도하면 밸런스 수정 기준을 적용한다.
- 업데이트 후 사용자 완료율/재플레이율 지표를 확인한다.
- 운영 목표는 "도전적이지만 포기하지 않는 곡선" 유지다.

### 5) QA/학습 사용자 - Validation Path

- BMAD 학습 목적으로 요구사항↔구현 일치 여부를 점검한다.
- 모바일 입력, FPS, 크래시율을 기준으로 품질을 검증한다.
- 시나리오 기반 테스트로 회귀를 잡고 재현 가능한 리포트를 남긴다.
- 결과적으로 게임 품질과 BMAD 학습 산출물을 동시에 확보한다.

### Journey Requirements Summary

- 즉시 플레이 진입, 빠른 재시작, 오입력 방지 UI
- 모바일 터치 조작 안정성(반응속도/버튼 배치)
- 20맵 progression 밸런싱 체계
- 상태 가시성(`idle/running/paused/gameover`)
- 운영/QA 관점의 측정 가능 지표(완료율, FPS, 입력지연, 크래시율)

## Domain-Specific Requirements

### Compliance & Regulatory
- 본 프로젝트는 규제 도메인(금융/의료 등)이 아니므로 필수 외부 규제 준수 항목은 없음
- 단, 접근성/기본 웹 표준 준수는 제품 품질 기준으로 유지

### Technical Constraints
- 터치 입력 신뢰성 최우선(오입력 최소화, 재시작 버튼 오배치 금지)
- 모바일 성능 기준: 평균 55fps 이상 유지
- 상태 전이 안정성: `idle/running/paused/gameover` 일관된 상태머신 관리

### Integration Requirements
- 초기 MVP는 외부 서비스 의존성 없이 동작하는 로컬 플레이 우선
- 향후 확장 시 맵/점수 저장 및 텔레메트리 수집 인터페이스를 추가할 수 있는 구조 권장

### Risk Mitigations
- 위험: 난이도 스파이크로 인한 이탈 → 완화: 20맵 progression 단계별 밸런싱 기준 적용
- 위험: 모바일 입력 불편으로 인한 이탈 → 완화: 44px+ 터치 버튼, 입력 지연 100ms 이하 목표
- 위험: 성능 저하 → 완화: 렌더 루프 단순화 및 디바이스별 성능 점검 체크리스트 운영

## Web App Specific Requirements

### Project-Type Overview
- 본 프로젝트는 SPA 기반 웹 게임으로 설계한다.
- 모바일 우선 UX를 기준으로, PC는 확장 화면/입력 지원으로 처리한다.
- 초기 릴리스는 로컬 플레이 중심이며, 외부 서비스 의존성은 최소화한다.

### Technical Architecture Considerations
- 클라이언트 구조: TypeScript + Vite 기반 단일 번들 앱
- 상태 관리: 게임 상태(`idle/running/paused/gameover`)와 UI 상태를 분리
- 렌더 루프: 성능 안정 우선(모바일 평균 55fps 이상 목표)
- 입력 계층: 터치/키보드 입력 처리 로직을 공통 인터페이스로 통합

### Browser Matrix
- 지원 브라우저: 최신 Chrome, Safari 중심
- 대응 범위: 최신 2개 버전 우선, 구형 브라우저는 비핵심 지원

### Responsive Design
- 모바일 우선 레이아웃(`Topbar -> Canvas -> Touch Controls`)
- PC에서는 캔버스 중심 구조를 유지하되 정보 패널 확장 가능
- 터치 버튼 44px+ 기준 유지, 재시작 버튼은 방향키 중앙 배치 금지

### Performance Targets
- 모바일 평균 FPS 55+
- 터치 입력 반응 100ms 이하
- 치명 크래시율 1% 미만

### SEO Strategy
- 게임 앱 특성상 SEO 우선순위는 낮음
- 최소 메타 정보/기본 공유 카드만 유지

### Accessibility Level
- 기본 접근성 수준 준수
- 명확한 포커스 표시, 충분한 색 대비, 버튼 레이블 제공

### Implementation Considerations
- 맵 20개는 데이터 기반 구조(`MapDefinition[]`)로 분리
- 밸런스 조정이 가능한 맵 파라미터 설계
- 향후 저장/랭킹/텔레메트리 연결 가능하도록 인터페이스 확장점 확보

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** 모바일 우선 조작 경험 검증형 MVP  
**Resource Requirements:** 최소 1~2인(개발 1, 선택적 QA/밸런싱 지원 1)

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- 일반 플레이어의 즉시 플레이/즉시 재시작 루프
- 기본 진행 플레이(맵 진입-클리어 시도-재도전)

**Must-Have Capabilities:**
- 모바일 터치 방향 입력
- 방향키 중앙 외 위치의 재시작 버튼
- 기본 Snake 루프(이동, 충돌, 게임오버, 재시작)
- 20개 맵 데이터 로딩 및 단계별 오픈(잠금/해금) progression
- 맵별 클리어 규칙(제한시간 내 목표 점수 달성)
- 다크 테마 UI 토큰 적용

### Post-MVP Features

**Phase 2 (Post-MVP):**
- 맵 진행 저장(지속 세션 복귀)
- 점수/랭킹
- 플레이 텔레메트리 기반 밸런싱

**Phase 3 (Expansion):**
- 확장 게임 모드
- BMAD 학습 패키지화
- 요구사항-구현-테스트 추적 고도화

### Risk Mitigation Strategy

**Technical Risks:** 모바일 입력 정확도/성능 저하를 우선 테스트하고 루프 단순화로 대응  
**Market Risks:** 첫 3분 완료율/재플레이율 중심으로 초기 재미 검증  
**Resource Risks:** MVP 범위를 엄격히 유지하고 성장 기능은 Phase 2로 이연

## Functional Requirements

### 게임 세션/상태 관리

- FR1: 플레이어는 새 게임 세션을 시작할 수 있다.
- FR2: 플레이어는 게임을 일시정지하고 재개할 수 있다.
- FR3: 시스템은 게임 상태(`idle/running/paused/gameover`)를 일관되게 전이·유지할 수 있다.
- FR4: 플레이어는 게임오버 이후 즉시 재시작할 수 있다.

### 입력(터치/키보드) 관리

- FR5: 플레이어는 모바일 터치 방향 버튼으로 이동 방향을 제어할 수 있다.
- FR6: 플레이어는 키보드 방향키로 이동 방향을 제어할 수 있다.
- FR7: 시스템은 유효하지 않은 역방향 입력을 차단할 수 있다.
- FR8: 시스템은 입력 우선순위를 관리하여 동시 입력 충돌을 방지할 수 있다.
- FR9: 시스템은 재시작 버튼을 방향키 중앙이 아닌 별도 위치에서 제공할 수 있다.

### 맵/진행 시스템

- FR10: 시스템은 20개 맵 정의를 로드할 수 있다.
- FR11: 플레이어는 선택된 맵에서 플레이를 시작할 수 있다.
- FR12: 시스템은 맵별 장애물 규칙을 적용할 수 있다.
- FR13: 시스템은 맵 진행 상태(현재 맵/클리어 여부)를 관리할 수 있다.
- FR14: 시스템은 난이도 progression 규칙에 따라 다음 맵 진입을 제공할 수 있다.
- FR25: 시스템은 각 맵에서 제한시간 내 목표 점수를 달성하면 해당 맵을 클리어로 판정할 수 있다.
- FR26: 시스템은 맵별 제한시간과 목표점수를 데이터로 관리하고 운영자가 조정할 수 있다.
- FR27: 시스템은 모바일 가독성과 조작성을 위해 기본 플레이 그리드 크기를 20x20으로 제공할 수 있다.
- FR28: 시스템은 1~20단계에서 장애물 배치가 중복되지 않는 고유 맵 구성을 제공할 수 있다.
- FR29: 시스템은 모바일 디바이스에서 조작 안정성을 위해 기본 게임 진행 속도를 PC 대비 소폭(약 10~15%) 낮춰 제공할 수 있다.

### 맵 클리어 목표 테이블 (MVP 밸런스 v1)

| 맵 | 제한시간(초) | 목표점수 |
|---|---:|---:|
| 01 | 100 | 5 |
| 02 | 100 | 6 |
| 03 | 98 | 6 |
| 04 | 98 | 7 |
| 05 | 95 | 7 |
| 06 | 95 | 8 |
| 07 | 92 | 8 |
| 08 | 92 | 9 |
| 09 | 89 | 9 |
| 10 | 89 | 10 |
| 11 | 86 | 10 |
| 12 | 86 | 11 |
| 13 | 82 | 12 |
| 14 | 82 | 13 |
| 15 | 78 | 14 |
| 16 | 78 | 15 |
| 17 | 74 | 16 |
| 18 | 70 | 17 |
| 19 | 66 | 18 |
| 20 | 62 | 19 |

_운영 규칙_: 클리어율이 과도하게 낮거나 높은 맵은 목표점수 ±1~2, 제한시간 ±5초 범위에서 단계적으로 조정한다.

### 점수/결과 피드백

- FR15: 시스템은 플레이 중 점수를 계산하고 표시할 수 있다.
- FR16: 시스템은 충돌/실패 이벤트 발생 후 300ms 이내에 시각 피드백 1종 이상(예: 깜빡임, 오버레이)과 텍스트 피드백(예: `Game Over`)을 표시할 수 있다.
- FR17: 시스템은 게임오버 상태에서 결과 정보를 표시할 수 있다.
- FR18: 시스템은 재시작 시 세션 점수를 초기화하고 새 라운드를 시작할 수 있다.

### 설정/접근성

- FR19: 플레이어는 설정 메뉴에서 최소 3개 설정 항목(사운드 on/off, 터치 버튼 크기 2단계 이상, 진동 on/off)에 접근하고 즉시 반영 결과를 확인할 수 있다.
- FR20: 시스템은 터치 방향 버튼의 최소 터치 영역을 44px x 44px 이상으로 제공하고, 모바일 테스트 세션에서 오입력률을 5% 이하로 유지할 수 있다.
- FR21: 시스템은 `idle/running/paused/gameover` 상태 각각에 대응하는 상태 표시 텍스트를 캔버스 상단에 표시하고, 상태 변경 후 100ms 이내에 업데이트할 수 있다.
- FR22: 시스템은 주요 인터랙션 요소(시작/일시정지/재시작/방향버튼)에 접근성 레이블을 제공하고, 키보드 포커스 이동이 논리 순서대로 동작할 수 있다.

### 운영/검증 지원(QA 관점)

- FR23: 시스템은 성능/입력 검증 시나리오 3종 이상(FPS 측정, 입력 지연 측정, 장시간 플레이 안정성)을 문서화하고, 각 시나리오에 통과 기준(FPS 55+, 입력 100ms 이하, 10분 무중단)을 포함할 수 있다.
- FR24: 시스템은 맵 밸런싱 검토를 위해 맵별 실패율, 평균 생존 시간, 평균 점수 데이터를 라운드 단위로 확인할 수 있다.

## Non-Functional Requirements

### Performance

- NFR-Performance-1: 대표 모바일 디바이스 3종에서 5분 플레이 기준 평균 55fps 이상을 유지해야 하며, 측정은 `requestAnimationFrame` 기반 프레임 카운터 로그로 수행한다.
- NFR-Performance-2: 사용자 터치 입력 반응 시간은 p95 기준 100ms 이하를 유지해야 하며, 측정은 입력 이벤트 타임스탬프와 실제 방향 반영 시점의 차이로 계산한다.
- NFR-Performance-3: 핵심 게임 루프(이동/충돌/재시작)는 30회 연속 반복 테스트에서 상태 전이 지연이 1프레임(약 16.7ms@60Hz)을 초과하지 않아야 한다.

### Reliability

- NFR-Reliability-1: 치명 크래시율은 내부 테스트 200세션 기준 1% 미만이어야 하며, 세션 로그로 측정한다.
- NFR-Reliability-2: 게임 상태 전이는 정의된 상태머신(`idle/running/paused/gameover`) 전이표 100%를 통과해야 하며, 자동 상태 전이 테스트로 검증한다.
- NFR-Reliability-3: 재시작 동작은 50회 반복 테스트에서 100% 세션 초기화(점수 0, 뱀 길이 초기값, 맵 시작 위치 재설정)를 보장해야 한다.

### Accessibility

- NFR-Accessibility-1: 터치 버튼은 최소 44px x 44px 이상 조작 가능한 영역을 제공해야 하며, 실측 CSS 픽셀 값으로 검증한다.
- NFR-Accessibility-2: 인터랙션 가능한 UI 요소는 접근성 레이블을 100% 제공하고, 키보드 포커스 인디케이터를 모든 포커스 가능 요소에 표시해야 한다.
- NFR-Accessibility-3: 핵심 UI 텍스트와 배경의 대비는 WCAG 2.1 AA 기준(일반 텍스트 4.5:1 이상)을 충족해야 한다.

### Security

- NFR-Security-1: MVP 범위에서는 민감 개인정보를 저장/처리하지 않아야 하며, 저장 데이터는 로컬 게임 설정값으로 제한한다.
- NFR-Security-2: 향후 저장/랭킹 확장 시에는 릴리스 전 데이터 분류, 보존 기간, 접근 제어 정책 문서를 반드시 작성해야 한다.
