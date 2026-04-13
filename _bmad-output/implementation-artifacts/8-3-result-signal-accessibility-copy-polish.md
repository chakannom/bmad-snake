# Story 8.3: 결과/상태 신호 접근성 및 마이크로카피 보정

Status: done

## Story

As a 플레이어,
I want 결과/경고 상태가 텍스트와 시각 신호로 명확히 전달되고,
so that 실패/클리어/긴급상황에서 즉시 다음 행동을 선택할 수 있다.

## Acceptance Criteria

1. 경고/실패/클리어 상태가 색상 외 텍스트 신호로도 구분된다.
2. 결과 화면 액션 버튼 문구가 명확하고 일관된다.
3. 소형 화면에서 문구/버튼 겹침 없이 표시된다.

## Tasks / Subtasks

- [x] 상태 신호 문구/아이콘 규칙 통일
- [x] 결과 화면 CTA 카피 정렬
- [x] 모바일 접근성 레이아웃 검증

## Dev Notes

- `aria-live` 및 상태 텍스트 보조 신호 유지
- 결과 화면에서 Retry/Stage Select 액션 일관성 유지

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint`
- `npm run test`
- `npm run build`

### Completion Notes List

- 경고/실패/클리어 텍스트 신호 보강 완료
- 모바일에서 액션 버튼/문구 겹침 없는 배치 유지
- PC에서 `R` 키로 즉시 재시작 가능한 단축 입력 지원

### File List

- src/App.tsx
- src/App.css

### Change Log

- 2026-04-12: Story completed (result signals + accessibility copy polish)
- 2026-04-13: keyboard restart shortcut (`R`) 및 안내 문구 반영
