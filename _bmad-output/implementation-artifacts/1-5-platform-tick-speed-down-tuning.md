# Story 1.5: 플랫폼별 뱀 이동 속도 하향 튜닝

Status: done

## Story

As a 플레이어,
I want PC/모바일에서 뱀 이동 속도가 기존보다 조금 느리게 조정되길 원하며,
so that 방향 전환 판단 여유가 늘고 조작 난이도가 완화된다.

## Requirements Analysis

- 변경 요청
  - PC 틱: `120ms -> 180ms`
  - 모바일 틱: `180ms -> 220ms`
- 영향 범위
  - 게임 루프의 틱 소비 주기(`tickMs`) 결정 상수
  - 게임 규칙 자체(충돌/성장/클리어 판정)에는 변경 없음
- 리스크
  - 틱이 느려지면서 동일 제한시간 대비 이동 횟수가 줄어 체감 난이도/템포가 낮아질 수 있음

## Acceptance Criteria

1. PC 틱이 `180ms`로 동작한다.
2. 모바일 틱이 `220ms`로 동작한다.
3. 테스트가 기존과 동일하게 통과한다.

## Tasks / Subtasks

- [x] 플랫폼별 틱 상수 값 조정
- [x] 코드 회귀 테스트 실행
- [x] BMAD 구현 기록 및 스프린트 상태 반영

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Completion Notes List

- `src/App.tsx`의 플랫폼별 틱 상수를 요청값으로 수정
- 게임 루프 구조(`requestAnimationFrame + accumulator`)는 유지
- `npm test` 통과로 회귀 없음 확인

### File List

- src/App.tsx

### Change Log

- 2026-04-13: Complete story 1.5 (platform tick speed down tuning)
