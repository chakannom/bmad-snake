import "./style.css";

import { BOARD_SIZE, DEATH_PENALTY_RATIO, TOTAL_STAGES } from "./game/config";
import { canTurn, isRestartKey, nextDirectionFromKey } from "./game/input";
import { applyDeathPenalty, resetStageRun, stepGame } from "./game/rules";
import { createInitialState } from "./game/state";
import { STAGES } from "./game/stages";
import { mountGameUI } from "./game/ui";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Cannot find #app");

const ui = mountGameUI(app, BOARD_SIZE, TOTAL_STAGES);
const state = createInitialState(STAGES[0].tickMs);

let timer: number | null = null;

const currentStage = () => STAGES[state.stageIndex];

const renderAll = (): void => {
  ui.updateHud(state, currentStage(), TOTAL_STAGES);
  ui.renderBoard(state, currentStage());
};

const applyTimer = (): void => {
  if (timer) window.clearInterval(timer);
  timer = window.setInterval(step, state.currentTickMs);
};

const finish = (message: string): void => {
  state.isGameOver = true;
  if (timer) {
    window.clearInterval(timer);
    timer = null;
  }
  ui.statusEl.textContent = message;
  renderAll();
};

const resetCurrentStageRun = (statusMessage: string): void => {
  resetStageRun(state, currentStage());
  renderAll();
  ui.statusEl.textContent = statusMessage;
  applyTimer();
};

const startStage = (nextStageIndex: number, resetTotalScore: boolean): void => {
  state.stageIndex = nextStageIndex;
  state.stageScore = 0;
  if (resetTotalScore) state.totalScore = 0;
  resetCurrentStageRun(`상태: Stage ${currentStage().level} 진행중`);
};

const handleDeath = (): void => {
  applyDeathPenalty(state);
  resetCurrentStageRun(
    `상태: 사망(점수 -${Math.round(DEATH_PENALTY_RATIO * 100)}%), Stage ${currentStage().level} 재도전`
  );
};

const step = (): void => {
  if (state.isGameOver || state.isCleared) return;

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
    startStage(state.stageIndex + 1, false);
    return;
  }

  renderAll();
};

window.addEventListener("keydown", (event) => {
  if (isRestartKey(event.code)) {
    startStage(state.stageIndex, false);
    return;
  }

  const next = nextDirectionFromKey(event.code);
  if (!next) return;
  if (canTurn(state.direction, next)) {
    state.nextDirection = next;
  }
});

startStage(0, true);

