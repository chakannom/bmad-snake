import { DEATH_PENALTY_RATIO, BOARD_SIZE, START_SNAKE, STAGES, TOTAL_STAGES } from '../maps/mapDefinitions';
import { canTurn, isPauseKey, isRestartKey, nextDirectionFromKey } from '../input/KeyboardInput';
import { bindSwipeInput } from '../input/TouchInput';
import { createInitialState } from './GameState';
import { applyDeathPenalty, resetStageRun, stepGame } from './Scoring';
import { directionFromButton, mountGameUI } from '../ui/Controls';
import { formatDeathStatus, formatPausedStatus, formatRunningStatus } from '../ui/Hud';
import { nextStageIndex } from '../maps/unlockRules';
import { Loop } from './Loop';
import { loadProgress, saveProgress } from '../storage/progressStore';
import type { Direction, StageConfig } from '../types/game';

export class GameEngine {
  private readonly ui;
  private readonly state = createInitialState(STAGES[0].tickMs);
  private readonly stages: StageConfig[];
  private readonly loop = new Loop();
  private readonly cleanups: Array<() => void> = [];
  private perfRafId: number | null = null;
  private perfFrameCount = 0;
  private perfLastSampleMs = performance.now();
  private perfLastMobileLogMs = performance.now();
  private currentFps = 0;
  private readonly inputLatencySamples: number[] = [];
  private readonly maxInputSamples = 120;
  private pendingInputTimestampMs: number | null = null;
  private unlockedStageIndex = 0;
  private readonly clearedStageSet = new Set<number>();

  constructor(private readonly app: HTMLDivElement) {
    this.ui = mountGameUI(this.app, BOARD_SIZE, TOTAL_STAGES);
    const mobileSpeedFactor = this.ui.isDesktopMetrics ? 1 : 1.12;
    this.stages = STAGES.map((stage) => ({
      ...stage,
      tickMs: Math.round(stage.tickMs * mobileSpeedFactor),
    }));
    this.hydrateProgress();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (isRestartKey(event.code)) {
        this.handleAction();
        return;
      }
      if (isPauseKey(event.code)) {
        this.togglePause();
        return;
      }

      const next = nextDirectionFromKey(event.code);
      if (!next) return;
      this.applyDirection(next, event.timeStamp);
    };

    window.addEventListener('keydown', onKeyDown);
    this.cleanups.push(() => window.removeEventListener('keydown', onKeyDown));

    this.ui.directionButtons.forEach((button) => {
      const onDown = (event: PointerEvent): void => {
        event.preventDefault();
        const next = directionFromButton(button);
        if (!next) return;
        this.applyDirection(next, event.timeStamp);
      };
      button.addEventListener('pointerdown', onDown);
      this.cleanups.push(() => button.removeEventListener('pointerdown', onDown));
    });

    const onAction = (event: PointerEvent): void => {
      event.preventDefault();
      this.handleAction();
    };
    this.ui.actionButton.addEventListener('pointerdown', onAction);
    this.cleanups.push(() => this.ui.actionButton.removeEventListener('pointerdown', onAction));

    const onPause = (event: PointerEvent): void => {
      event.preventDefault();
      this.togglePause();
    };
    this.ui.pauseButton.addEventListener('pointerdown', onPause);
    this.cleanups.push(() => this.ui.pauseButton.removeEventListener('pointerdown', onPause));

    const onMapPrev = (event: PointerEvent): void => {
      event.preventDefault();
      this.moveMap(-1);
    };
    this.ui.mapPrevButton.addEventListener('pointerdown', onMapPrev);
    this.cleanups.push(() => this.ui.mapPrevButton.removeEventListener('pointerdown', onMapPrev));

    const onMapNext = (event: PointerEvent): void => {
      event.preventDefault();
      this.moveMap(1);
    };
    this.ui.mapNextButton.addEventListener('pointerdown', onMapNext);
    this.cleanups.push(() => this.ui.mapNextButton.removeEventListener('pointerdown', onMapNext));

    this.cleanups.push(bindSwipeInput(this.ui.canvas, (next, eventTimeStamp) => this.applyDirection(next, eventTimeStamp)));
    this.startPerfMonitor();
    this.prepareStage(this.state.stageIndex, false);
  }

  private currentStage = () => this.stages[this.state.stageIndex];

  private renderAll(): void {
    this.ui.updateHud(this.state, this.currentStage(), TOTAL_STAGES);
    this.ui.updateMapButtons(
      this.state.hasStarted || this.state.stageIndex <= 0,
      this.state.hasStarted || this.state.stageIndex >= this.unlockedStageIndex,
    );
    if (this.ui.isDesktopMetrics) {
      this.ui.updatePerfHud(this.currentFps, this.inputP95());
    }
    this.ui.renderBoard(this.state, this.currentStage());
  }

  private hydrateProgress(): void {
    const progress = loadProgress();
    if (!progress) return;

    const clampIndex = (value: number): number => Math.max(0, Math.min(TOTAL_STAGES - 1, Math.floor(value)));

    this.unlockedStageIndex = clampIndex(progress.unlockedMap);
    this.state.stageIndex = Math.min(clampIndex(progress.stageIndex), this.unlockedStageIndex);
    this.state.totalScore = Math.max(0, Math.floor(progress.totalScore));

    progress.clearedMaps
      .map(clampIndex)
      .filter((index) => index <= this.unlockedStageIndex)
      .forEach((index) => this.clearedStageSet.add(index));
  }

  private persistProgress(): void {
    saveProgress({
      stageIndex: this.state.stageIndex,
      unlockedMap: this.unlockedStageIndex,
      clearedMaps: Array.from(this.clearedStageSet).sort((a, b) => a - b),
      totalScore: this.state.totalScore,
    });
  }

  private startPerfMonitor(): void {
    this.perfLastSampleMs = performance.now();
    this.perfLastMobileLogMs = this.perfLastSampleMs;
    const tick = (now: number): void => {
      this.perfFrameCount += 1;
      const elapsed = now - this.perfLastSampleMs;
      if (elapsed >= 500) {
        this.currentFps = (this.perfFrameCount * 1000) / elapsed;
        this.perfFrameCount = 0;
        this.perfLastSampleMs = now;
        const p95 = this.inputP95();
        this.ui.updatePerfHud(this.currentFps, p95);
        if (!this.ui.isDesktopMetrics && now - this.perfLastMobileLogMs >= 5000) {
          const p95Text = p95 === null ? '-' : `${Math.round(p95)}ms`;
          console.debug(`[perf/mobile] fps=${Math.round(this.currentFps)}, inputP95=${p95Text}`);
          this.perfLastMobileLogMs = now;
        }
      }
      this.perfRafId = window.requestAnimationFrame(tick);
    };
    this.perfRafId = window.requestAnimationFrame(tick);
  }

  private recordInputLatency(eventTimeStamp: number): void {
    const latencyMs = performance.now() - eventTimeStamp;
    if (!Number.isFinite(latencyMs) || latencyMs < 0) return;
    this.inputLatencySamples.push(latencyMs);
    if (this.inputLatencySamples.length > this.maxInputSamples) {
      this.inputLatencySamples.shift();
    }
  }

  private inputP95(): number | null {
    if (this.inputLatencySamples.length === 0) return null;
    const sorted = [...this.inputLatencySamples].sort((a, b) => a - b);
    const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1);
    return sorted[index];
  }

  private applyTimer(): void {
    this.loop.restart(this.step, this.state.currentTickMs);
  }

  private finish(message: string): void {
    this.state.isGameOver = true;
    this.loop.stop();
    this.persistProgress();
    this.ui.statusEl.textContent = message;
    this.renderAll();
  }

  private resetCurrentStageRun(statusMessage: string): void {
    this.pendingInputTimestampMs = null;
    resetStageRun(this.state, this.currentStage(), START_SNAKE);
    this.persistProgress();
    this.renderAll();
    this.ui.statusEl.textContent = statusMessage;
    this.applyTimer();
  }

  private startStage(nextStageIndex: number, resetTotalScore: boolean): void {
    this.state.stageIndex = nextStageIndex;
    this.state.stageScore = 0;
    if (resetTotalScore) this.state.totalScore = 0;
    this.state.hasStarted = true;
    this.resetCurrentStageRun(formatRunningStatus(this.currentStage().level));
  }

  private prepareStage(nextStageIndex: number, resetTotalScore: boolean): void {
    this.state.stageIndex = nextStageIndex;
    this.state.stageScore = 0;
    if (resetTotalScore) this.state.totalScore = 0;
    this.state.hasStarted = false;
    this.pendingInputTimestampMs = null;
    resetStageRun(this.state, this.currentStage(), START_SNAKE);
    this.loop.stop();
    this.persistProgress();
    this.renderAll();
    this.ui.statusEl.textContent = `상태: Stage ${this.currentStage().level} 준비 (START)`;
  }

  private handleAction(): void {
    if (!this.state.hasStarted) {
      this.startStage(this.state.stageIndex, false);
      return;
    }
    this.startStage(this.state.stageIndex, false);
  }

  private applyDirection(next: Direction, eventTimeStamp: number): void {
    if (!canTurn(this.state.direction, next)) return;
    if (this.state.nextDirection === next) return;
    this.state.nextDirection = next;
    this.pendingInputTimestampMs = eventTimeStamp;
  }

  private applyPendingDirection(): void {
    if (this.state.direction === this.state.nextDirection) return;
    this.state.direction = this.state.nextDirection;
    if (this.pendingInputTimestampMs !== null) {
      this.recordInputLatency(this.pendingInputTimestampMs);
      this.pendingInputTimestampMs = null;
    }
  }

  private moveMap(delta: -1 | 1): void {
    if (this.state.hasStarted) return;
    const nextIndex = this.state.stageIndex + delta;
    if (nextIndex < 0 || nextIndex > this.unlockedStageIndex) return;
    this.prepareStage(nextIndex, false);
  }

  private togglePause(): void {
    if (!this.state.hasStarted || this.state.isGameOver || this.state.isCleared) return;

    this.state.isPaused = !this.state.isPaused;
    if (this.state.isPaused) {
      this.loop.stop();
      this.ui.statusEl.textContent = formatPausedStatus(this.currentStage().level);
      this.renderAll();
      return;
    }

    this.ui.statusEl.textContent = formatRunningStatus(this.currentStage().level);
    this.renderAll();
    this.applyTimer();
  }

  private handleDeath(): void {
    applyDeathPenalty(this.state);
    this.ui.flashFailure();
    this.resetCurrentStageRun(formatDeathStatus(Math.round(DEATH_PENALTY_RATIO * 100), this.currentStage().level));
  }

  private readonly step = (): void => {
    if (this.state.isGameOver || this.state.isCleared || this.state.isPaused) return;

    this.applyPendingDirection();
    const result = stepGame(this.state, this.currentStage());
    if (result.speedChanged) {
      this.applyTimer();
    }

    if (result.outcome === 'timeout') {
      this.ui.flashFailure();
      this.finish('상태: 제한 시간 실패');
      return;
    }

    if (result.outcome === 'death') {
      this.handleDeath();
      return;
    }

    if (result.outcome === 'stage-clear') {
      const cleared = this.state.stageIndex;
      this.clearedStageSet.add(cleared);
      this.unlockedStageIndex = Math.min(TOTAL_STAGES - 1, Math.max(this.unlockedStageIndex, cleared + 1));

      const next = nextStageIndex(this.state.stageIndex, TOTAL_STAGES);
      if (next === null) {
        this.state.isCleared = true;
        this.finish('상태: 모든 스테이지 클리어');
        return;
      }

      this.prepareStage(next, false);
      return;
    }

    this.renderAll();
  };

  dispose(): void {
    this.loop.stop();
    if (this.perfRafId !== null) {
      window.cancelAnimationFrame(this.perfRafId);
      this.perfRafId = null;
    }
    this.cleanups.forEach((fn) => fn());
  }
}
