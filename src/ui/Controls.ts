import { CELL } from '../maps/mapDefinitions';
import type { Direction, GameState, Point, StageConfig } from '../types/game';

const COLORS = {
  board: '#1b1b1d',
  obstacle: '#4a4f58',
  food: '#f0b429',
  snakeHead: '#25c2a0',
  snakeBody: '#1fa588',
} as const;

export type GameUI = {
  canvas: HTMLCanvasElement;
  statusEl: HTMLSpanElement;
  directionButtons: HTMLButtonElement[];
  actionButton: HTMLButtonElement;
  pauseButton: HTMLButtonElement;
  mapPrevButton: HTMLButtonElement;
  mapNextButton: HTMLButtonElement;
  isDesktopMetrics: boolean;
  updateHud: (state: GameState, stage: StageConfig, totalStages: number) => void;
  updateMapButtons: (prevDisabled: boolean, nextDisabled: boolean) => void;
  updatePerfHud: (fps: number, inputP95Ms: number | null) => void;
  flashFailure: () => void;
  renderBoard: (state: GameState, stage: StageConfig) => void;
};

const drawCell = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  color: string,
): void => {
  if (point.x < 0 || point.y < 0) return;
  ctx.fillStyle = color;
  ctx.fillRect(point.x * CELL, point.y * CELL, CELL - 1, CELL - 1);
};

export const mountGameUI = (
  app: HTMLDivElement,
  boardSize: number,
  totalStages: number,
): GameUI => {
  app.innerHTML = `
    <main class="layout">
      <header>
        <h1>BMAD Snake</h1>
      </header>
      <section class="hud">
        <span id="stage">스테이지: 1 / ${totalStages}</span>
        <span id="map-name">맵: -</span>
      </section>
      <section class="hud">
        <span id="score">스테이지 점수: 0 / 0</span>
        <span id="total-score">누적 점수: 0</span>
      </section>
      <section class="hud">
        <span id="timer">남은 시간: 0초</span>
        <span id="speed">속도: 0ms</span>
        <span id="status">상태: 준비</span>
      </section>
      <section class="hud perf-hud" id="perf-hud">
        <span id="fps">FPS: -</span>
        <span id="input-p95">입력 p95: -</span>
      </section>
      <canvas id="game" width="${boardSize * CELL}" height="${boardSize * CELL}"></canvas>
      <section class="touch-controls" aria-label="모바일 컨트롤">
        <button type="button" class="control-btn action" id="action-btn" aria-label="시작">START</button>
        <button type="button" class="control-btn up" data-dir="up" aria-label="위">▲</button>
        <button type="button" class="control-btn pause" id="pause-btn" aria-label="일시정지">PAUSE</button>
        <button type="button" class="control-btn left" data-dir="left" aria-label="왼쪽">◀</button>
        <button type="button" class="control-btn right" data-dir="right" aria-label="오른쪽">▶</button>
        <button type="button" class="control-btn map-prev" id="map-prev-btn" aria-label="이전 맵">MAP◀</button>
        <button type="button" class="control-btn down" data-dir="down" aria-label="아래">▼</button>
        <button type="button" class="control-btn map-next" id="map-next-btn" aria-label="다음 맵">▶MAP</button>
      </section>
    </main>
  `;

  const canvas = document.querySelector<HTMLCanvasElement>('#game');
  const stageEl = document.querySelector<HTMLSpanElement>('#stage');
  const mapNameEl = document.querySelector<HTMLSpanElement>('#map-name');
  const scoreEl = document.querySelector<HTMLSpanElement>('#score');
  const totalScoreEl = document.querySelector<HTMLSpanElement>('#total-score');
  const timerEl = document.querySelector<HTMLSpanElement>('#timer');
  const speedEl = document.querySelector<HTMLSpanElement>('#speed');
  const statusEl = document.querySelector<HTMLSpanElement>('#status');
  const perfHudEl = document.querySelector<HTMLElement>('#perf-hud');
  const fpsEl = document.querySelector<HTMLSpanElement>('#fps');
  const inputP95El = document.querySelector<HTMLSpanElement>('#input-p95');
  const actionButton = document.querySelector<HTMLButtonElement>('#action-btn');
  const pauseButton = document.querySelector<HTMLButtonElement>('#pause-btn');
  const mapPrevButton = document.querySelector<HTMLButtonElement>('#map-prev-btn');
  const mapNextButton = document.querySelector<HTMLButtonElement>('#map-next-btn');
  const directionButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.control-btn[data-dir]'));

  if (
    !canvas ||
    !stageEl ||
    !mapNameEl ||
    !scoreEl ||
    !totalScoreEl ||
    !timerEl ||
    !speedEl ||
    !statusEl ||
    !perfHudEl ||
    !fpsEl ||
    !inputP95El ||
    !actionButton ||
    !pauseButton ||
    !mapPrevButton ||
    !mapNextButton
  ) {
    throw new Error('UI init failed');
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  const isDesktopMetrics = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  perfHudEl.style.display = isDesktopMetrics ? '' : 'none';

  const updateHud = (state: GameState, stage: StageConfig, totalStageCount: number): void => {
    stageEl.textContent = `스테이지: ${stage.level} / ${totalStageCount}`;
    mapNameEl.textContent = `맵: ${stage.mapName}`;
    scoreEl.textContent = `스테이지 점수: ${state.stageScore} / ${stage.targetScore}`;
    totalScoreEl.textContent = `누적 점수: ${state.totalScore}`;
    timerEl.textContent = `남은 시간: ${Math.max(0, Math.ceil(state.remainingMs / 1000))}초`;
    speedEl.textContent = `속도: ${state.currentTickMs}ms`;
    actionButton.textContent = state.hasStarted ? 'RESTART' : 'START';
    actionButton.setAttribute('aria-label', state.hasStarted ? '재시작' : '시작');
    pauseButton.textContent = state.isPaused ? 'RESUME' : 'PAUSE';
    pauseButton.setAttribute('aria-label', state.isPaused ? '재개' : '일시정지');
    pauseButton.disabled = !state.hasStarted || state.isGameOver || state.isCleared;
  };

  const updatePerfHud = (fps: number, inputP95Ms: number | null): void => {
    if (!isDesktopMetrics) return;
    fpsEl.textContent = `FPS: ${Math.round(fps)}`;
    inputP95El.textContent = inputP95Ms === null ? '입력 p95: -' : `입력 p95: ${Math.round(inputP95Ms)}ms`;
  };

  const updateMapButtons = (prevDisabled: boolean, nextDisabled: boolean): void => {
    mapPrevButton.disabled = prevDisabled;
    mapNextButton.disabled = nextDisabled;
  };

  const renderBoard = (state: GameState, stage: StageConfig): void => {
    ctx.fillStyle = COLORS.board;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stage.obstacles.forEach((obstacle) => drawCell(ctx, obstacle, COLORS.obstacle));
    drawCell(ctx, state.food, COLORS.food);
    state.snake.forEach((segment, index) => drawCell(ctx, segment, index === 0 ? COLORS.snakeHead : COLORS.snakeBody));
  };

  const flashFailure = (): void => {
    canvas.classList.remove('fail-flash');
    // Restart animation reliably when failures happen in quick succession.
    void canvas.offsetWidth;
    canvas.classList.add('fail-flash');
    window.setTimeout(() => canvas.classList.remove('fail-flash'), 220);
  };

  return {
    canvas,
    statusEl,
    directionButtons,
    actionButton,
    pauseButton,
    mapPrevButton,
    mapNextButton,
    isDesktopMetrics,
    updateHud,
    updateMapButtons,
    updatePerfHud,
    flashFailure,
    renderBoard,
  };
};

export const directionFromButton = (button: HTMLButtonElement): Direction | null => {
  const value = button.dataset.dir;
  if (value === 'up' || value === 'down' || value === 'left' || value === 'right') return value;
  return null;
};
