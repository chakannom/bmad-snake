---
stepsCompleted: [1, 2, 3]
inputDocuments: []
session_topic: 'TypeScript + Vite 기반 웹 프로젝트에서 Docusaurus Dark 모드 느낌의 기본 스타일 설계'
session_goals: '색상/타이포/컴포넌트 스타일 가이드, 모바일+PC 레이아웃 시안 구조, 구현 체크리스트를 모두 도출'
selected_approach: 'ai-recommended'
techniques_used: ['SCAMPER Method', 'Cross-Pollination', 'Constraint Mapping']
ideas_generated:
  - 'SCAMPER ideas (#1-#35)'
  - 'Cross-Pollination ideas (#36-#45)'
  - 'Constraint set v1'
  - 'Style guide v1'
  - 'Layout spec v1'
  - 'Implementation order (8 steps)'
  - '20-map difficulty curve'
  - '20-map detailed grid/obstacle intent'
  - 'Mobile touch control + direction buttons + restart button placement requirement'
context_file: ''
---

# Brainstorming Session Results

**Facilitator:** {{user_name}}
**Date:** {{date}}

## Session Overview

**Topic:** TypeScript + Vite 기반 웹 프로젝트에서 Docusaurus Dark 모드 느낌의 기본 스타일 설계
**Goals:** 색상/타이포/컴포넌트 스타일 가이드, 모바일+PC 레이아웃 시안 구조, 구현 체크리스트를 모두 도출

### Session Setup

이번 세션은 단순 취향 수준이 아니라, 실제 구현 가능한 기준으로 정리한다.
결과물은 다음 3축을 동시에 만족해야 한다:
- 디자인 시스템 토큰(컬러, 타이포, 간격, 상태 색상)
- 화면 구조(데스크톱/모바일 공통 패턴 + Snake 게임 UI 배치)
- 즉시 적용 가능한 구현 순서(TypeScript + Vite 프로젝트 기준)

## Technique Selection

**Approach:** AI-Recommended Techniques
**Analysis Context:** TypeScript + Vite 기반, Docusaurus Dark 모드 느낌의 기본 스타일 설계

**Recommended Techniques:**
- **SCAMPER Method:** 기존 다크 테마 패턴을 변형/결합해 실전 토큰과 컴포넌트 스타일안 도출
- **Cross-Pollination:** 문서 사이트 다크 감성을 Snake 게임 UI 문맥으로 이식
- **Constraint Mapping:** 반응형/성능/접근성/구현 난이도 제약을 반영해 실행 체크리스트 수렴

## Technique Execution Log

### SCAMPER Results

**Substitute (#1-#5)**
- **#1 Dark Surface Stack:** `#1b1b1d / #242526 / #2b2d31` 레이어 분리
- **#2 Mint Primary Accent:** `#25c2a0` 중심 포인트, 상태별 최소 변형
- **#3 Soft Border Rhythm:** `#3b3d42` 기반 보더 리듬 강조
- **#4 Console-like Canvas Shell:** 캔버스 프레임을 별도 표면으로 분리
- **#5 Calm Typography Hierarchy:** 정보 우선 순위(본문/제목/점수) 대비 강화

**Combine (#6-#10)**
- **#6 Topbar + Score Chip 결합**
- **#7 Canvas + Panel Frame 결합**
- **#8 Touch D-pad + Desktop Hint 결합**
- **#9 Status Color + Gameplay State 결합**
- **#10 Spacing Scale + Grid Cell 결합**

**Adapt (#11-#15)**
- **#11 Docs Card -> Game HUD**
- **#12 Docs Alert -> Game State Banner**
- **#13 Docs Button System -> Control System**
- **#14 Docs Code Theme Contrast -> Board Contrast**
- **#15 Docs Layout Responsiveness -> Device-first Play Layout**

**Modify (#16-#20)**
- **#16 Softer Dark Depth**
- **#17 Accent Intensity Dial**
- **#18 Border-first Emphasis**
- **#19 Touch Control Massing (44px+ 터치 버튼)**
- **#20 Typography Compression (정보 중심 계층)**

**Put to other uses (#21-#25)**
- **#21 Settings Drawer 재활용**
- **#22 Leaderboard Modal 재활용**
- **#23 Onboarding Overlay 재활용**
- **#24 Pause Screen 재활용**
- **#25 Error/Offline State 재활용**

**Eliminate (#26-#30)**
- **#26 Hero 장식 제거**
- **#27 색상 수 축소 (핵심 토큰 중심)**
- **#28 그림자 레이어 최소화**
- **#29 HUD 정보 과밀 제거**
- **#30 버튼 변형 축소 (Primary/Secondary 중심)**

**Reverse (#31-#35)**
- **#31 Mobile-first 역설계**
- **#32 Canvas 중심 -> HUD 중심 역전**
- **#33 Theme-first -> State-first 역전**
- **#34 Desktop key input -> Touch input 역전**
- **#35 Aesthetic-first -> Performance-first 역전**

### Cross-Pollination Results (#36-#45)

- **#36 Navbar -> Game Topbar**
- **#37 Announcement Bar -> Streak Bar**
- **#38 Doc Sidebar -> Quick Settings Rail**
- **#39 Code Block -> Game Log Panel**
- **#40 Search Box -> Command Palette**
- **#41 Admonition -> Warning States**
- **#42 Pagination -> Restart Flow**
- **#43 TOC Highlight -> Direction Assist**
- **#44 Theme Toggle -> Contrast Toggle**
- **#45 Tabs -> Mode Switch**

## Constraint Mapping

### Final Constraint Set v1
1. 모바일 우선, PC 확장
2. 캔버스: 모바일 `80vw (max 420)`, PC `400~480`
3. 토큰 최소화: `bg/surface/border/text/primary/danger`
4. 상태 모델: `idle/running/paused/gameover`
5. 접근성: 버튼 `44px+`, 포커스 링, 대비 유지

### Implementation Priority
1. 모바일 스택 레이아웃 고정 (`Topbar -> Canvas -> Touch Controls`)
2. 터치 입력 품질 우선 구현
3. 상태 모델/HUD 연결
4. 다크 토큰 적용
5. PC 확장 레이아웃 적용
6. 접근성/대비 검증

## Deliverables (Draft)

### Style Guide v1
- **Color Tokens**
  - `--bg: #1b1b1d`
  - `--surface: #242526`
  - `--surface-alt: #2b2d31`
  - `--border: #3b3d42`
  - `--text: #f5f6f7`
  - `--text-muted: #c5c8cc`
  - `--primary: #25c2a0`
  - `--danger: #f85149`
- **Typography**
  - 기본: `Noto Sans KR, Pretendard, system-ui`
  - 제목: 600 / 본문: 400 / 점수: 700
- **Rhythm**
  - Radius: `8/12/16`
  - Spacing: `8/12/16/24`

### Layout Spec v1
- **공통:** Topbar + Board Shell + Controls
- **Desktop:** 중앙 컨테이너(최대폭 920), 상단 1줄, 보조 정보 영역 확장 가능
- **Tablet:** 1~2줄 유연 헤더, 캔버스 우선
- **Mobile:** 세로 스택, 터치 버튼 최소 44px, 간격 8px

### Implementation Order (8 steps)
1. Vite `vanilla-ts` 생성
2. `theme.css` 토큰/기본 규칙 정의
3. 기본 레이아웃 렌더
4. 엔진(`engine.ts`) 구성
5. 입력(`input.ts`) 통합
6. HUD/상태 연결
7. 반응형/접근성 보강
8. 확장 포인트(설정/랭킹/모드) 분리

## Map Planning

### 20-Map Difficulty Curve
1. 튜토리얼 오픈 필드
2. 넓은 필드 + 소수 장애물
3. 중앙 박스 1개
4. 좌우 벽 압박
5. 상하 좁은 통로
6. ㄱ자 코너 반복
7. 중앙 십자
8. 외곽 링 + 내부 공간
9. 대칭 기둥
10. 지그재그 입문
11. 이중 방 + 2게이트
12. S자 복도
13. 좁은 루프 2개
14. 다중 막대
15. 비대칭 구조
16. 좁은 외곽 순환로
17. 중앙 미로형
18. 복합 교차로
19. 긴 지그재그 고난도
20. 보스 맵(복합 장애물)

### 20-Map Detailed Spec (Grid/Obstacle Intent)
1. `20x20`, 장애물 없음, 조작 학습
2. `20x20`, 코너 4점 장애물, 기본 회피
3. `20x20`, 중앙 박스(8~11), 외곽 순환
4. `20x20`, 좌우 세로벽 일부, 압박 시작
5. `20x20`, 상하 긴 가로벽, 복도 이동
6. `20x20`, ㄱ자 벽 2세트, 코너 제어
7. `20x20`, 십자 벽 + 중앙 여유칸, 교차 판단
8. `20x20`, 외곽 링 + 게이트, 루프 통과
9. `20x20`, 대칭 기둥 패턴, 리듬 회피
10. `20x20`, 지그재그 라인, 경로 예측
11. `22x22`, 이중 방 + 게이트, 공간 전환
12. `22x22`, S자 벽 2줄, 연속 곡선 대응
13. `22x22`, 루프 2개 + 연결 통로, 루트 선택
14. `22x22`, 수직 막대 다수, 간극 통과
15. `22x22`, 비대칭 블록 클러스터, 패턴 붕괴 대응
16. `24x24`, 외곽 순환로 + 내부 장벽, 장거리 동선
17. `24x24`, 중앙 미로(분기/막다른길), 즉시 판단
18. `24x24`, 교차 복도 + 포켓, 고속 제어
19. `24x24`, 긴 지그재그 + 탈출구, 실수 허용도 낮음
20. `24x24`, 링+십자+막대 혼합, 최종 정밀 턴

## Additional Brainstorming Requirement (2026-04-13)

다음 항목을 **브레인스토밍 요구사항**으로 추가 기록:

1. 모바일 터치 컨트롤 기능 추가
2. 방향 버튼(UI) 추가
3. 재시작 버튼 추가
4. 재시작 버튼은 방향 버튼 **중앙이 아닌 위치**에 배치

### Placement Direction (Draft)
- 방향 버튼: 하단 D-pad 블록
- 재시작 버튼: 상단 HUD(점수/상태 영역) 또는 D-pad 외곽 별도 행
- 금지: D-pad 중앙 버튼 슬롯에 재시작 배치
