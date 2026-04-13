# Story 1.4: PC 방향 조작 체감 개선(rAF 루프 + 틱 튜닝)

Status: done

## Story

As a PC 플레이어,
I want 방향 전환 입력이 끊기지 않고 즉각 반영되길 원하며,
so that 조작 체감이 부드럽고 예측 가능해진다.

## Acceptance Criteria

1. PC 환경에서 틱 반응성이 기존 대비 개선된다.
2. 타이머 기반 루프 지터로 인한 체감 끊김이 줄어든다.
3. 기존 게임 규칙/종료 처리/분석 이벤트 동작은 유지된다.

## Tasks / Subtasks

- [x] 루프를 `setInterval`에서 `requestAnimationFrame + accumulator` 방식으로 전환
- [x] 플랫폼별 틱 분리(PC `120ms`, 모바일 `180ms`)
- [x] 종료 이벤트 처리 시 전이 조건(playing -> failed/cleared) 기준으로 중복 방지
- [x] 회귀 검증 테스트 실행

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Completion Notes List

- PC에서 방향 전환 끊김 체감 원인으로 고정 `setInterval` 타이밍 지터를 확인
- 루프를 프레임 동기화 방식으로 교체하여 틱 소비를 안정화
- PC 전용 틱을 `120ms`로 조정해 조작 반응성을 강화
- `npm test` 실행 결과 전체 통과(7 files, 20 tests)

### File List

- src/App.tsx

### Change Log

- 2026-04-13: Complete story 1.4 (PC input responsiveness tuning)
