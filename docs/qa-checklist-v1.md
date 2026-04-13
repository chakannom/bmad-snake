# Snake QA Checklist v1

## 1. Smoke
- [ ] 앱 로드 후 게임 화면/캔버스가 정상 표시된다.
- [ ] START 클릭 시 게임이 시작된다.
- [ ] RESTART 클릭 시 즉시 재시작된다.
- [ ] PAUSE/재개가 정상 동작한다.

## 2. Input
- [ ] PC Arrow 키 4방향 입력이 동작한다.
- [ ] 모바일 방향 버튼 터치 입력이 동작한다.
- [ ] 역방향 입력이 차단된다.
- [ ] 입력 p95가 PC 환경에서 HUD에 표시된다.

## 3. Rules
- [ ] 벽 충돌 시 gameover 처리된다.
- [ ] 장애물 충돌 시 gameover 처리된다.
- [ ] 자기 몸 충돌 시 gameover 처리된다.
- [ ] 제한시간 종료 시 gameover 처리된다.
- [ ] 목표점수 달성 시 cleared 처리된다.

## 4. Progression
- [ ] 맵 1~20이 존재한다.
- [ ] 클리어 시 다음 맵이 해금된다.
- [ ] 해금 정보가 새로고침 후에도 유지된다.
- [ ] `clearedMaps`가 저장/복원된다.

## 5. UI/UX
- [ ] START/RESTART 통합 버튼이 D-pad 상단 좌측(중앙 제외)에 배치된다.
- [ ] 터치 버튼 최소 44x44 이상이다.
- [ ] 다크 테마 색상 토큰이 일관된다.
- [ ] 상태/점수/타이머/맵/목표/해금 HUD가 갱신된다.

## 6. Performance/Runtime
- [ ] FPS가 PC 환경에서 HUD에 표시된다.
- [ ] 평균 FPS 55 이상(대표 디바이스 기준)이다.
- [ ] 재시작 self-test가 PASS로 표시된다.
- [ ] 10분 플레이 중 치명 오류가 없다.

## 7. Regression Quick Pass
- [ ] Map 이동(prev/next) 시 잠금 규칙이 유지된다.
- [ ] cleared/gameover 후 START/RESTART 동작이 깨지지 않는다.
- [ ] 브라우저 새로고침 후 게임이 정상 재초기화된다.
