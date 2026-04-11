# Story 2.1: Snake 엔진 기본 규칙(이동/충돌/먹이) 구현

Status: done

## Story

As a 플레이어,
I want 뱀이 규칙대로 이동하고 충돌/먹이 획득이 처리되며,
so that 게임 플레이가 예측 가능하고 공정하게 동작한다.

## Acceptance Criteria

1. 틱 진행과 입력 반영 시 뱀 위치/길이가 규칙대로 업데이트된다.
2. 벽/몸통 충돌 시 실패 상태로 전환된다.

## Tasks / Subtasks

- [x] Game engine 상태/틱 순수 함수 구현
- [x] 먹이 스폰/성장 로직 구현
- [x] 충돌 실패 규칙 구현
- [x] 엔진 단위 테스트 작성

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Completion Notes List

- `src/game/engine.ts`에 핵심 규칙 구현
- 충돌/먹이/성장 테스트 통과

### File List

- src/game/engine.ts
- src/game/engine.test.ts

### Change Log

- 2026-04-12: Complete story 2.1
