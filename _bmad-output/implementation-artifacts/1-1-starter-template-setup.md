# Story 1.1: Starter Template 프로젝트 초기화

Status: done

## Story

As a 개발자,
I want Vite React TypeScript 스타터로 프로젝트를 초기화하고 기본 배포 설정을 준비하고,
so that 구현 에이전트들이 일관된 기반에서 개발을 시작할 수 있다.

## Acceptance Criteria

1. `react-ts` 템플릿으로 프로젝트가 초기화되고 `npm run dev`, `npm run build`가 정상 동작한다.
2. GitHub Pages 배포를 위한 `vite.config.ts`의 `base` 설정이 준비된다.
3. GitHub Actions 기반 Pages 배포 워크플로우 골격이 준비된다.

## Tasks / Subtasks

- [x] Task 1 (AC: 1)
  - [x] Vite + React + TypeScript 템플릿 생성
  - [x] 루트 의존성 설치 및 스크립트 실행 확인
- [x] Task 2 (AC: 2)
  - [x] `vite.config.ts` base를 `/bmad-snake/`로 설정
- [x] Task 3 (AC: 3)
  - [x] GitHub Pages 배포 workflow 추가

## Dev Notes

- 아키텍처 결정에 맞춰 `React + TypeScript + Vite` 조합을 사용했다.
- 배포는 `dist` 산출물 업로드 후 `deploy-pages` 액션으로 마무리한다.

### Project Structure Notes

- 기존 BMAD 산출물 디렉터리는 유지하고, 런타임 코드는 루트 `src/` 중심으로 배치했다.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#Selected Starter: Vite + React + TypeScript (`react-ts`)]
- [Source: _bmad-output/planning-artifacts/architecture.md#GitHub Pages Deployment Baseline]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm install`
- `npm run lint`
- `npm run test`
- `npm run build`

### Completion Notes List

- Vite React TS 프로젝트 초기화 완료
- GitHub Pages 배포 골격 구축 완료
- 코드 품질/빌드 검증 완료

### File List

- package.json
- package-lock.json
- vite.config.ts
- .github/workflows/deploy.yml

### Change Log

- 2026-04-12: CS → VS → DS → CR 사이클 완료 (1.1)
