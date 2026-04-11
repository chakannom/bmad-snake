# Story 1.2: 세션 시작/재시작 기본 흐름 구현

Status: done

## Story

As a 플레이어,
I want 메인 화면에서 즉시 세션을 시작하고 실패 후 바로 재시작하고,
so that 대기 없이 연속 플레이할 수 있다.

## Acceptance Criteria

1. 메인 화면에서 시작 액션 시 즉시 플레이 상태로 전환된다.
2. 실패 상태에서 재시작 액션 시 새 세션이 즉시 시작된다.

## Tasks / Subtasks

- [x] Task 1 (AC: 1)
  - [x] idle → playing 전환이 즉시 일어나는 세션 상태 머신 구현
  - [x] 시작 시 세션 ID 증가 및 초기 플레이 좌표 리셋
- [x] Task 2 (AC: 2)
  - [x] failed 상태 및 재시작 흐름 구현
  - [x] 재시작 시 새 세션 ID 발급 및 상태 초기화

## Dev Notes

- `sessionMachine`을 pure function 형태로 분리해 이후 Epic 2 게임 엔진과 쉽게 결합 가능하게 설계했다.
- 화면 전환은 `App.tsx`에서 상태 기반 조건 렌더링으로 처리했다.

### Project Structure Notes

- 상태 전환 규칙은 `src/game/sessionMachine.ts`에 집중하고, UI는 `src/App.tsx`에서 소비만 하도록 분리.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run test`
- `npm run build`

### Completion Notes List

- 세션 시작/실패/재시작 상태 전이 구현
- 실패 후 즉시 재시작 UX 구현
- 세션 머신 단위 테스트 추가

### File List

- src/App.tsx
- src/game/sessionMachine.ts
- src/game/sessionMachine.test.ts
- src/game/types.ts

### Change Log

- 2026-04-12: CS → VS → DS → CR 사이클 완료 (1.2)
