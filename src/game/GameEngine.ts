import { DEATH_PENALTY_RATIO, BOARD_SIZE, START_SNAKE, STAGES, TOTAL_STAGES } from '../maps/mapDefinitions';
import { canTurn, isRestartKey, nextDirectionFromKey } from '../input/KeyboardInput';
import { bindSwipeInput } from '../input/TouchInput';
import { createInitialState } from './GameState';
import { applyDeathPenalty, resetStageRun, stepGame } from './Scoring';
import { directionFromButton, mountGameUI } from '../ui/Controls';
import { formatDeathStatus, formatRunningStatus } from '../ui/Hud';
import { nextStageIndex } from '../maps/unlockRules';
import { Loop } from './Loop';
import type { Direction } from '../types/game';

export class GameEngine {
  private readonly ui;
  private readonly state = createInitialState(STAGES[0].tickMs);
  private readonly loop = new Loop();
  private readonly cleanups: Array<() => void> = [];

  constructor(private readonly app: HTMLDivElement) {
    this.ui = mountGameUI(this.app, BOARD_SIZE, TOTAL_STAGES);

    const onKeyDown = (event: KeyboardEvent): void => {
      if (isRestartKey(event.code)) {
        this.startStage(this.state.stageIndex, false);
        return;
      }

      const next = nextDirectionFromKey(event.code);
      if (!next) return;
      this.applyDirection(next);
    };

    window.addEventListener('keydown', onKeyDown);
    this.cleanups.push(() => window.removeEventListener('keydown', onKeyDown));

    this.ui.directionButtons.forEach((button) => {
      const onDown = (event: PointerEvent): void => {
        event.preventDefault();
        const next = directionFromButton(button);
        if (!next) return;
        this.applyDirection(next);
      };
      button.addEventListener('pointerdown', onDown);
      this.cleanups.push(() => button.removeEventListener('pointerdown', onDown));
    });

    const onRestart = (event: PointerEvent): void => {
      event.preventDefault();
      this.startStage(this.state.stageIndex, false);
    };
    this.ui.restartButton.addEventListener('pointerdown', onRestart);
    this.cleanups.push(() => this.ui.restartButton.removeEventListener('pointerdown', onRestart));

    this.cleanups.push(bindSwipeInput(this.ui.canvas, (next) => this.applyDirection(next)));

    this.startStage(0, true);
  }

  private currentStage = () => STAGES[this.state.stageIndex];

  private renderAll(): void {
    this.ui.updateHud(this.state, this.currentStage(), TOTAL_STAGES);
    this.ui.renderBoard(this.state, this.currentStage());
  }

  private applyTimer(): void {
    this.loop.restart(this.step, this.state.currentTickMs);
  }

  private finish(message: string): void {
    this.state.isGameOver = true;
    this.loop.stop();
    this.ui.statusEl.textContent = message;
    this.renderAll();
  }

  private resetCurrentStageRun(statusMessage: string): void {
    resetStageRun(this.state, this.currentStage(), START_SNAKE);
    this.renderAll();
    this.ui.statusEl.textContent = statusMessage;
    this.applyTimer();
  }

  private startStage(nextStageIndex: number, resetTotalScore: boolean): void {
    this.state.stageIndex = nextStageIndex;
    this.state.stageScore = 0;
    if (resetTotalScore) this.state.totalScore = 0;
    this.resetCurrentStageRun(formatRunningStatus(this.currentStage().level));
  }

  private applyDirection(next: Direction): void {
    if (canTurn(this.state.direction, next)) {
      this.state.nextDirection = next;
      this.state.direction = next;
    }
  }

  private handleDeath(): void {
    applyDeathPenalty(this.state);
    this.resetCurrentStageRun(formatDeathStatus(Math.round(DEATH_PENALTY_RATIO * 100), this.currentStage().level));
  }

  private readonly step = (): void => {
    if (this.state.isGameOver || this.state.isCleared) return;

    const result = stepGame(this.state, this.currentStage());
    if (result.speedChanged) {
      this.applyTimer();
    }

    if (result.outcome === 'timeout') {
      this.finish('상태: 제한 시간 실패');
      return;
    }

    if (result.outcome === 'death') {
      this.handleDeath();
      return;
    }

    if (result.outcome === 'stage-clear') {
      const next = nextStageIndex(this.state.stageIndex, TOTAL_STAGES);
      if (next === null) {
        this.state.isCleared = true;
        this.finish('상태: 모든 스테이지 클리어');
        return;
      }

      this.startStage(next, false);
      return;
    }

    this.renderAll();
  };

  dispose(): void {
    this.loop.stop();
    this.cleanups.forEach((fn) => fn());
  }
}
