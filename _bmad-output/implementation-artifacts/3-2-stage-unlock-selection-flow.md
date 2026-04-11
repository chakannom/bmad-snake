# Story 3.2: 스테이지 해금/선택 흐름 구현

Status: done

## Tasks / Subtasks

- [x] 클리어 시 다음 스테이지 해금
- [x] 해금된 스테이지만 선택 가능
- [x] 스테이지 선택 UI 제공

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Completion Notes List

- 클리어 시 `unlockNextStage`로 자동 해금
- 선택 화면에서 locked stage 비활성화

### File List

- src/App.tsx
- src/progress/storage.ts

### Change Log

- 2026-04-12: Complete story 3.2
