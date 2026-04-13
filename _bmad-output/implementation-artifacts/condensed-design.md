# Condensed Design - bmad-snake (Web Canvas)

## 1) 목표와 범위
- 목표: TypeScript + Vite 기반 Canvas 2D Snake 게임 MVP 구현
- 핵심 범위: 모바일 터치 조작 + PC 키보드 조작, 20개 맵, 단계별 해금, 제한시간 내 목표점수 클리어, START/RESTART 통합 버튼(방향패드 상단 좌측, 중앙 금지)
- 비범위(MVP 제외): 온라인 랭킹, 계정, 서버 동기화

## 2) 런타임 아키텍처
- 단일 SPA (Vite)
- 렌더링: HTML5 Canvas 2D
- 루프: requestAnimationFrame 기반 고정 틱(게임 업데이트) + 가변 렌더
- 상태관리: 단일 GameStore(경량 커스텀 상태)

레이어:
1. Core: game rules, collision, scoring, timer
2. Map: map definitions, obstacle grid, unlock progression
3. Input: keyboard + touch(d-pad)
4. UI: HUD, state labels, start/restart + pause buttons
5. Persistence: localStorage (진행도)

## 3) 폴더/모듈 구조(제안)
- src/main.ts
- src/game/GameEngine.ts
- src/game/GameState.ts
- src/game/Loop.ts
- src/game/Snake.ts
- src/game/Collision.ts
- src/game/Scoring.ts
- src/maps/mapDefinitions.ts
- src/maps/unlockRules.ts
- src/input/KeyboardInput.ts
- src/input/TouchInput.ts
- src/ui/Hud.ts
- src/ui/Controls.ts
- src/ui/Theme.ts
- src/storage/progressStore.ts
- src/types/game.ts

## 4) 핵심 데이터 모델
- GameStatus: `ready | running | paused | gameover | cleared`
- Direction: `up | down | left | right`
- StageConfig:
  - level: number (1~20)
  - mapName: string
  - obstacles: Array<{x:number,y:number}>
  - timeLimitSec: number
  - targetScore: number
  - tickMs: number
- Progress:
  - unlockedMap: number
  - clearedMaps: number[]

## 5) 게임 규칙
- 맵 시작 시 타이머 시작
- 제한시간 내 목표점수 도달 시 `cleared`
- 벽/장애물/자기몸 충돌 시 `gameover`
- `cleared` 시 다음 맵 해금(최대 20)
- 역방향 입력 금지

## 6) 입력/컨트롤 설계
- PC: Arrow keys
- 모바일: 4방향 터치 버튼
- START/RESTART 통합 버튼: 방향패드 상단 좌측
- 버튼 최소 터치영역: 44x44 px

## 7) UI/테마 설계 (Docusaurus Dark 느낌)
- 배경: `#1b1b1d`
- 표면: `#242526`
- 경계: `#3a3b3c`
- 텍스트: `#f5f6f7`
- 보조 텍스트: `#b8babd`
- 강조: `#25c2a0`
- 경고/실패: `#ff6b6b`

HUD:
- 상단: 현재 맵, 점수, 남은 시간, 상태(running/paused/...)
- 성능 HUD(FPS, 입력 p95): PC 환경에서만 표시
- 하단: 모바일 방향버튼 + START/RESTART(상단 좌측), PAUSE/RESUME(상단 우측)
- 모바일 컴팩트 레이아웃: `main(.layout)` 패딩/간격/폰트/버튼 높이를 축소해 전체 레이어 높이를 줄임

## 8) 성능/품질 기준(구현 체크포인트)
- 모바일 평균 55fps 이상
- 입력 지연 p95 100ms 이하
- FPS/입력 p95 HUD 노출은 PC 전용
- 재시작 50회 반복 시 100% 초기화 성공
- 상태 전이(`ready/running/paused/gameover/cleared`) 테스트 통과

## 9) 구현 순서(압축)
1. Vite + Canvas 부트스트랩
2. GameState/Loop/Snake 이동·충돌
3. 점수/타이머/cleared 판정
4. 맵 로딩 + 20맵 + 해금 규칙
5. 터치 컨트롤 + 키보드 통합
6. HUD/버튼 배치 + 다크 테마
7. localStorage 진행도 저장
8. 성능/입력/상태 전이 점검

## 10) 구현 시작 기준 (Go)
다음 항목이 확정되어 구현 착수 가능:
- 요구사항: PRD Pass
- 설계: 본 축약 설계 승인
- 우선순위: MVP 범위 고정

현재 상태: **구현 시작 가능 (GO)**
