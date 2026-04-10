# BMAD Snake

BMAD(Brief, Metrics, Assumptions, Delivery) 흐름으로 작은 게임을 빠르게 검증하기 위한 스네이크 프로젝트입니다.

## 시작하기
```bash
npm install
npm run dev
```

## 스크립트
- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run preview`: 빌드 결과 미리보기
- `npm run check`: 타입 체크

## BMAD 문서
- `docs/bmad/01-brief.md`
- `docs/bmad/02-architecture.md`
- `docs/bmad/03-backlog.md`
- `docs/bmad/04-decision-log.md`

## 현재 MVP 기능
- 방향키 이동
- 모바일 터치 컨트롤(D-pad 버튼, 스와이프)
- 먹이 섭취 시 성장/점수 증가
- 벽/몸통/장애물 충돌 시 실패
- 20개 스테이지 맵 진행
- 제한 시간 내 목표 점수 달성 시 다음 스테이지 자동 진입
- 사망 시 현재 스테이지 유지, 스테이지/누적 점수 30% 차감, 속도 초기화
- 스페이스바로 현재 스테이지 재시작
