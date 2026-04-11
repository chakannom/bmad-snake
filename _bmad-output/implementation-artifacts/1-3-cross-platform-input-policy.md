# Story 1.3: 입력 컨트롤러(키보드/스와이프)와 정책 구현

Status: done

## Story

As a 플레이어,
I want PC에서는 키보드, 모바일에서는 스와이프로 조작하고,
so that 기기와 무관하게 동일한 플레이 경험을 얻을 수 있다.

## Acceptance Criteria

1. PC/모바일 환경에서 방향 입력이 일관되게 반영된다.
2. 즉시 역방향 방지 등 입력 오인식 완화 규칙이 적용된다.

## Tasks / Subtasks

- [x] Task 1 (AC: 1)
  - [x] 키보드 Arrow/WASD 방향 매핑 구현
  - [x] 플레이필드 스와이프 방향 인식 구현
- [x] Task 2 (AC: 2)
  - [x] 즉시 역방향 방지 정책 구현
  - [x] 입력 정책 단위 테스트 추가

## Dev Notes

- 입력 정책을 `inputPolicy.ts`에 분리해 규칙을 명시적으로 관리했다.
- 스와이프는 임계값 기반 + 주축 벡터 우선 방식으로 오인식을 줄였다.

### Project Structure Notes

- 입력 핸들링 로직은 `src/game`에 배치하고, `Playfield`는 터치 좌표 전달만 담당.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3]
- [Source: _bmad-output/planning-artifacts/architecture.md#Core Architectural Decisions]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint`
- `npm run test`
- `npm run build`

### Completion Notes List

- 크로스플랫폼 입력 정책 구현 완료
- 즉시 역방향 방지 규칙 적용 완료
- 입력 정책 테스트 통과

### File List

- src/App.tsx
- src/components/Playfield.tsx
- src/game/inputPolicy.ts
- src/game/inputPolicy.test.ts
- src/game/platform.ts

### Change Log

- 2026-04-12: CS → VS → DS → CR 사이클 완료 (1.3)
