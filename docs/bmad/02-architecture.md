# BMAD Architecture

## Runtime
- `Vite + TypeScript`
- 브라우저 `Canvas 2D`

## Modules (초기)
- `src/main.ts`: 게임 루프, 입력, 렌더, 상태 관리
- `src/style.css`: 화면 레이아웃/테마

## Next Split Plan
- `engine/`: 로직(상태 전이)
- `ui/`: 렌더/DOM
- `input/`: 키보드 입력 처리

