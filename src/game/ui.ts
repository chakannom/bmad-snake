import { CELL } from "./config";
import type { GameState } from "./state";
import type { Direction, Point, StageConfig } from "./types";

const COLORS = {
  board: "#1b1b1d",
  obstacle: "#4a4f58",
  food: "#f0b429",
  snakeHead: "#25c2a0",
  snakeBody: "#1fa588"
} as const;

export type GameUI = {
  canvas: HTMLCanvasElement;
  statusEl: HTMLSpanElement;
  directionButtons: HTMLButtonElement[];
  restartButton: HTMLButtonElement;
  updateHud: (state: GameState, stage: StageConfig, totalStages: number) => void;
  renderBoard: (state: GameState, stage: StageConfig) => void;
};

const drawCell = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  color: string
): void => {
  if (point.x < 0 || point.y < 0) return;
  ctx.fillStyle = color;
  ctx.fillRect(point.x * CELL, point.y * CELL, CELL - 1, CELL - 1);
};

export const mountGameUI = (
  app: HTMLDivElement,
  boardSize: number,
  totalStages: number
): GameUI => {
  app.innerHTML = `
    <main class="layout">
      <header>
        <h1>BMAD Snake</h1>
        <p>방향키/터치로 이동, 스페이스 또는 RESTART로 현재 스테이지 재시작</p>
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
      <canvas id="game" width="${boardSize * CELL}" height="${boardSize * CELL}"></canvas>
      <section class="touch-controls" aria-label="모바일 컨트롤">
        <button type="button" class="control-btn up" data-dir="up" aria-label="위">▲</button>
        <button type="button" class="control-btn left" data-dir="left" aria-label="왼쪽">◀</button>
        <button type="button" class="control-btn restart" id="restart-btn" aria-label="재시작">
          RESTART
        </button>
        <button type="button" class="control-btn right" data-dir="right" aria-label="오른쪽">▶</button>
        <button type="button" class="control-btn down" data-dir="down" aria-label="아래">▼</button>
      </section>
    </main>
  `;

  const canvas = document.querySelector<HTMLCanvasElement>("#game");
  const stageEl = document.querySelector<HTMLSpanElement>("#stage");
  const mapNameEl = document.querySelector<HTMLSpanElement>("#map-name");
  const scoreEl = document.querySelector<HTMLSpanElement>("#score");
  const totalScoreEl = document.querySelector<HTMLSpanElement>("#total-score");
  const timerEl = document.querySelector<HTMLSpanElement>("#timer");
  const speedEl = document.querySelector<HTMLSpanElement>("#speed");
  const statusEl = document.querySelector<HTMLSpanElement>("#status");
  const directionButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>(".control-btn[data-dir]")
  );
  const restartButton = document.querySelector<HTMLButtonElement>("#restart-btn");
  if (
    !canvas ||
    !stageEl ||
    !mapNameEl ||
    !scoreEl ||
    !totalScoreEl ||
    !timerEl ||
    !speedEl ||
    !statusEl ||
    !restartButton
  ) {
    throw new Error("UI init failed");
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const updateHud = (state: GameState, stage: StageConfig, totalStageCount: number): void => {
    stageEl.textContent = `스테이지: ${stage.level} / ${totalStageCount}`;
    mapNameEl.textContent = `맵: ${stage.mapName}`;
    scoreEl.textContent = `스테이지 점수: ${state.stageScore} / ${stage.targetScore}`;
    totalScoreEl.textContent = `누적 점수: ${state.totalScore}`;
    timerEl.textContent = `남은 시간: ${Math.max(0, Math.ceil(state.remainingMs / 1000))}초`;
    speedEl.textContent = `속도: ${state.currentTickMs}ms`;
  };

  const renderBoard = (state: GameState, stage: StageConfig): void => {
    ctx.fillStyle = COLORS.board;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stage.obstacles.forEach((obstacle) => {
      drawCell(ctx, obstacle, COLORS.obstacle);
    });

    drawCell(ctx, state.food, COLORS.food);

    state.snake.forEach((segment, index) => {
      drawCell(ctx, segment, index === 0 ? COLORS.snakeHead : COLORS.snakeBody);
    });
  };

  return {
    canvas,
    statusEl,
    directionButtons,
    restartButton,
    updateHud,
    renderBoard
  };
};

export const directionFromButton = (button: HTMLButtonElement): Direction | null => {
  const value = button.dataset.dir;
  if (value === "up" || value === "down" || value === "left" || value === "right") {
    return value;
  }
  return null;
};
