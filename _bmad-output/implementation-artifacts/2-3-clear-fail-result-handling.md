# Story 2.3: 결과 상태(클리어/실패) 처리 표준화

Status: done

## Story

As a 플레이어,
I want 클리어와 실패 결과가 명확히 구분되어 표시되고,
so that 다음 행동(다음 스테이지/재도전)을 즉시 결정할 수 있다.

## Acceptance Criteria

1. 결과 타입(clear/fail_collision/fail_timeout)이 정확히 매핑된다.
2. 결과 화면에서 즉시 다음 액션(재시작/신규 시작)을 제공한다.

## Tasks / Subtasks

- [x] clear/fail result mapping 구현
- [x] 실패 원인별 결과 화면 분기 구현
- [x] 재시작/신규 세션 액션 연결

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Completion Notes List

- 실패 원인(collision/timeout)과 클리어를 UI에 분리 표시
- 결과 화면 액션을 즉시 실행 가능하게 구성

### File List

- src/App.tsx
- src/game/engine.ts

### Change Log

- 2026-04-12: Complete story 2.3
