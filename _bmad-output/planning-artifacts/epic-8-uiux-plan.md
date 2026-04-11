# Epic 8 Implementation Plan - UI/UX Visual Alignment Refresh

## Current Status
- Epic status: done
- Completed date: 2026-04-12
- Completed stories: 8.1, 8.2, 8.3

## Goal
old v1 스타일 감성을 현재 앱 구조에 반영하되, 기존 게임 규칙/데이터/이벤트 흐름을 깨지 않고 UI 레이어만 안전하게 개편한다.

## Scope
- In scope: `src/index.css`, `src/App.css`, `src/App.tsx` UI 구조/카피/컨트롤 배치
- Out of scope: 게임 엔진 규칙, 스테이지 메타데이터, 분석 이벤트 스키마 변경

## Story Execution Order
1. Story 8.1 - 글로벌 시각 토큰/레이아웃 정렬
2. Story 8.2 - HUD/보드/터치컨트롤 컴팩트 UX
3. Story 8.3 - 결과/경고 접근성 및 카피 보정

## Definition of Done
- `npm run lint`, `npm run test`, `npm run build` 모두 통과
- 모바일 뷰(<=560px)에서 버튼/텍스트 겹침 없음
- 색상 외 상태 신호(텍스트/아이콘) 유지
- 기존 핵심 기능(시작/재시작/스테이지 선택/터치 조작) 동작 유지

## Risks & Mitigations
- Risk: 스타일 변경 중 기존 가독성 저하
  - Mitigation: HUD 대비 비율 유지, 상태 텍스트 보강
- Risk: 모바일 터치 UX 오동작
  - Mitigation: 실제 버튼 클릭 경로 + 스와이프 경로 둘 다 유지
- Risk: UI 변경으로 상태 전이 버튼 누락
  - Mitigation: idle/playing/failed/cleared 각 상태별 액션 체크리스트 검증

## Proposed Commit Strategy
- `feat: create epic 8 UI/UX refresh plan and backlog`
- `feat: complete epic 8 story 8.1 visual token alignment`
- `feat: complete epic 8 story 8.2 compact HUD and touch controls`
- `feat: complete epic 8 story 8.3 result accessibility and copy polish`
- `feat: complete epic 8 UI/UX visual alignment refresh`
