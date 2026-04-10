# BMAD Architecture

## Runtime
- `Vite + TypeScript`
- 브라우저 `Canvas 2D`

## Modules (초기)
- `src/main.ts`: 게임 루프 오케스트레이션, 입력 바인딩
- `src/game/input.ts`: 키보드 방향 입력 규칙
- `src/game/ui.ts`: HUD/캔버스/모바일 터치 컨트롤 마운트
- `src/style.css`: 화면 레이아웃/테마

## Stage Model
- `StageConfig`: `level`, `mapName`, `targetScore`, `timeLimitSec`, `tickMs`, `obstacles`
- `TOTAL_STAGES = 20`
- `STAGES`: 1~20 레벨 설정(목표 점수/시간/속도/장애물)

## Core Rules
- 제한 시간 내 `stageScore >= targetScore`이면 다음 스테이지 진입
- 실패 조건: 시간 초과 또는 벽/몸통/장애물 충돌
- 마지막(20) 스테이지 목표 달성 시 전체 클리어
- 먹이 스폰 시 뱀/장애물 좌표 제외
- 충돌 사망 시: 현재 스테이지 유지, 스테이지/누적 점수 30% 차감, `tickMs` 기본값으로 리셋
- 입력 채널: 키보드, 모바일 D-pad 버튼, 캔버스 스와이프

## Next Split Plan
- `engine/`: 로직(상태 전이, 충돌/스코어 판정)
- `ui/`: 렌더/DOM
- `input/`: 키보드 입력 처리
- `stage/`: StageConfig 및 맵 생성기
