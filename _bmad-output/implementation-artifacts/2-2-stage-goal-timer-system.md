# Story 2.2: 스테이지 목표 및 타이머 시스템 구현

Status: done

## Story

As a 플레이어,
I want 스테이지마다 제한 시간과 목표 수가 적용되고,
so that 공략형 플레이를 할 수 있다.

## Acceptance Criteria

1. 타이머가 감소하고 목표 먹이 수 달성 시 클리어 상태가 된다.
2. 시간 초과 시 실패 상태로 전환된다.

## Tasks / Subtasks

- [x] 엔진에 time limit / goal food 처리 반영
- [x] 시간 초과 상태 전이 구현
- [x] UI에 time left 및 goal 진행 표시

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Completion Notes List

- 목표 수/타이머를 엔진 상태와 HUD에서 동기화
- 시간 초과 실패 처리 추가

### File List

- src/game/engine.ts
- src/App.tsx

### Change Log

- 2026-04-12: Complete story 2.2
