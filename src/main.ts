import "./style.css";

import { BOARD_SIZE, DEATH_PENALTY_RATIO, TOTAL_STAGES } from "./game/config";
import { canTurn, isRestartKey, nextDirectionFromKey } from "./game/input";
import { applyDeathPenalty, resetStageRun, stepGame } from "./game/rules";
import { createInitialState } from "./game/state";
import { STAGES } from "./game/stages";
import { directionFromButton, mountGameUI } from "./game/ui";
import type { Direction } from "./game/types";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Cannot find #app");

const ui = mountGameUI(app, BOARD_SIZE, TOTAL_STAGES);
const state = createInitialState(STAGES[0].tickMs);

let timer: number | null = null;
type Difficulty = "easy" | "normal" | "hard";
type GamePhase = "ready" | "playing" | "paused" | "game-over" | "cleared";
const HIGH_SCORE_KEY = "bmad-snake-high-score";
const difficultyFactor: Record<Difficulty, number> = {
  easy: 1.2,
  normal: 1,
  hard: 0.85
};
const difficultyLabel: Record<Difficulty, string> = {
  easy: "Easy",
  normal: "Normal",
  hard: "Hard"
};

const loadHighScore = (): number => {
  const value = window.localStorage.getItem(HIGH_SCORE_KEY);
  if (!value) return 0;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

let highScore = loadHighScore();
let difficulty: Difficulty = "normal";
let phase: GamePhase = "ready";

const currentStage = () => STAGES[state.stageIndex];
const stageTickMs = (stageIndex: number): number =>
  Math.floor(STAGES[stageIndex].tickMs * difficultyFactor[difficulty]);

const updateHighScore = (): void => {
  if (state.totalScore <= highScore) return;
  highScore = state.totalScore;
  window.localStorage.setItem(HIGH_SCORE_KEY, String(highScore));
};

const renderAll = (): void => {
  updateHighScore();
  ui.updateHud(state, currentStage(), TOTAL_STAGES);
  ui.highScoreEl.textContent = `최고 점수: ${highScore}`;
  ui.renderBoard(state, currentStage());
};

const applyTimer = (): void => {
  if (timer) window.clearInterval(timer);
  timer = window.setInterval(step, state.currentTickMs);
};

const finish = (message: string): void => {
  phase = state.isCleared ? "cleared" : "game-over";
  state.isGameOver = phase === "game-over";
  if (timer) {
    window.clearInterval(timer);
    timer = null;
  }
  ui.statusEl.textContent = message;
  renderAll();
};

const resetCurrentStageRun = (statusMessage: string, startNow: boolean): void => {
  resetStageRun(state, currentStage(), stageTickMs(state.stageIndex));
  renderAll();
  ui.statusEl.textContent = statusMessage;
  if (startNow) {
    phase = "playing";
    applyTimer();
    return;
  }
  phase = "ready";
  if (timer) {
    window.clearInterval(timer);
    timer = null;
  }
};

const startStage = (nextStageIndex: number, resetTotalScore: boolean, startNow: boolean): void => {
  state.stageIndex = nextStageIndex;
  state.stageScore = 0;
  if (resetTotalScore) state.totalScore = 0;
  resetCurrentStageRun(
    startNow
      ? `상태: Stage ${currentStage().level} 진행중 (${difficultyLabel[difficulty]})`
      : `상태: Stage ${currentStage().level} 시작 대기 (${difficultyLabel[difficulty]})`,
    startNow
  );
};

const applyDirection = (next: Direction): void => {
  if (canTurn(state.direction, next)) {
    state.nextDirection = next;
  }
};

const handleDeath = (): void => {
  applyDeathPenalty(state);
  resetCurrentStageRun(
    `상태: 사망(점수 -${Math.round(DEATH_PENALTY_RATIO * 100)}%), Stage ${currentStage().level} 재도전`,
    true
  );
};

const step = (): void => {
  if (phase !== "playing") return;

  const result = stepGame(state, currentStage());
  if (result.speedChanged) {
    applyTimer();
  }

  if (result.outcome === "timeout") {
    finish("상태: 제한 시간 실패");
    return;
  }
  if (result.outcome === "death") {
    handleDeath();
    return;
  }
  if (result.outcome === "stage-clear") {
    if (state.stageIndex === TOTAL_STAGES - 1) {
      state.isCleared = true;
      finish("상태: 모든 스테이지 클리어");
      return;
    }
    startStage(state.stageIndex + 1, false, true);
    return;
  }

  renderAll();
};

const startOrResume = (): void => {
  if (phase === "playing") return;
  if (phase === "paused") {
    phase = "playing";
    ui.statusEl.textContent = `상태: Stage ${currentStage().level} 진행중 (${difficultyLabel[difficulty]})`;
    applyTimer();
    return;
  }
  if (phase === "game-over" || phase === "cleared") {
    startStage(0, true, true);
    return;
  }
  phase = "playing";
  ui.statusEl.textContent = `상태: Stage ${currentStage().level} 진행중 (${difficultyLabel[difficulty]})`;
  applyTimer();
};

const togglePause = (): void => {
  if (phase === "playing") {
    phase = "paused";
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
    ui.statusEl.textContent = "상태: 일시정지";
    return;
  }
  if (phase === "paused") {
    startOrResume();
  }
};

window.addEventListener("keydown", (event) => {
  if (isRestartKey(event.code)) {
    startStage(state.stageIndex, false, false);
    return;
  }

  const next = nextDirectionFromKey(event.code);
  if (!next) return;
  applyDirection(next);
});

ui.directionButtons.forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    const next = directionFromButton(button);
    if (!next) return;
    applyDirection(next);
  });
});

ui.restartButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  startStage(state.stageIndex, false, false);
});

ui.startButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  startOrResume();
});

ui.pauseButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  togglePause();
});

ui.difficultySelect.addEventListener("change", () => {
  const value = ui.difficultySelect.value;
  if (value !== "easy" && value !== "normal" && value !== "hard") return;
  difficulty = value;
  startStage(0, true, false);
});

let touchStartX: number | null = null;
let touchStartY: number | null = null;
const SWIPE_THRESHOLD = 20;

ui.canvas.addEventListener(
  "touchstart",
  (event) => {
    if (event.touches.length !== 1) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  },
  { passive: true }
);

ui.canvas.addEventListener(
  "touchend",
  (event) => {
    if (touchStartX === null || touchStartY === null) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    touchStartX = null;
    touchStartY = null;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (Math.max(absX, absY) < SWIPE_THRESHOLD) return;

    if (absX > absY) {
      applyDirection(dx > 0 ? "right" : "left");
      return;
    }
    applyDirection(dy > 0 ? "down" : "up");
  },
  { passive: true }
);

startStage(0, true, false);
