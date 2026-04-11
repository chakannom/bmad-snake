# bmad-snake

학습용 MVP Snake 웹게임 (TypeScript + Vite + React).

## Quick Start

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

## Scripts

```bash
npm run dev
npm run lint
npm run test
npm run build
npm run preview
```

## Environment

`.env` 파일에 GA4 ID를 넣으면 자동 초기화됩니다.

```bash
VITE_GA4_ID=G-XXXXXXXXXX
```

## Deploy

- `vite.config.ts`의 `base`는 GitHub Pages repo 경로(`/bmad-snake/`)로 설정됨
- `.github/workflows/deploy.yml`에서 `main` push 시 Pages 배포

## BMAD Artifacts

- 기획 문서: `_bmad-output/planning-artifacts/`
- 스토리/스프린트 상태: `_bmad-output/implementation-artifacts/`
