# Story 8.2: HUD/보드/컨트롤 컴팩트 UX 정렬

Status: done

## Story

As a 플레이어,
I want HUD 정보와 보드, 터치 컨트롤이 old v1의 정보 밀도에 맞게 정렬되고,
so that 특히 모바일에서 빠르게 상태를 읽고 조작할 수 있다.

## Acceptance Criteria

1. HUD(방향/목표/남은시간)가 compact format으로 우선 노출된다.
2. 보드와 컨트롤 간 간격/크기가 모바일에서 조작 가능 수준을 유지한다.
3. 터치 버튼 그리드와 스와이프 입력이 함께 정상 동작한다.

## Tasks / Subtasks

- [x] HUD 행/폰트/정보 우선순위 재배치
- [x] `touch-controls` 버튼 배치/터치 영역 검증
- [x] 모바일 브레이크포인트(<=560px) 최적화

## Dev Notes

- HUD 가독성을 유지하면서 old v1 밀도(컴팩트 패널)로 조정
- 터치버튼 그리드와 스와이프 입력 경로를 동시에 유지

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint`
- `npm run test`
- `npm run build`

### Completion Notes List

- HUD/보드/버튼 간 간격 및 글자 크기 미세 조정 완료
- 모바일 coarse pointer에서 터치 컨트롤 표시 검증

### File List

- src/App.tsx
- src/App.css

### Change Log

- 2026-04-12: Story completed (compact HUD + board + touch controls)
