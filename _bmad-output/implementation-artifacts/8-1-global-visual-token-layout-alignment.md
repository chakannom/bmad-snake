# Story 8.1: 글로벌 시각 토큰 및 레이아웃 정렬

Status: done

## Story

As a 플레이어,
I want old v1 느낌의 배경/서페이스/타이포/카드 레이아웃으로 화면이 구성되고,
so that 게임의 몰입감과 시각 일관성을 즉시 느낄 수 있다.

## Acceptance Criteria

1. 루트 스타일 토큰이 old v1 비주얼 톤과 정렬된다.
2. 카드형 레이아웃이 데스크톱/모바일에서 안정적으로 표시된다.
3. 기존 기능 동작(세션/스테이지/결과)은 변경 없이 유지된다.

## Tasks / Subtasks

- [x] `src/index.css` 토큰/배경/타이포 정렬
- [x] `src/App.css` 레이아웃/패널/버튼 공통 스타일 정렬
- [x] 회귀 확인: start/retry/select 동작 확인

## Dev Notes

- 기능 로직 변경 없이 UI 레이어 중심으로 스타일 정렬
- old style.css 기반 색상/폭/카드 밀도 값 반영

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint`
- `npm run test`
- `npm run build`

### Completion Notes List

- 루트 배경/토큰/카드 컨테이너 폭을 old v1 톤에 맞춤
- 레이아웃 폭을 `min(92vw, 480px)`로 미세 조정

### File List

- src/index.css
- src/App.css

### Change Log

- 2026-04-12: Story completed (visual token + layout alignment)
