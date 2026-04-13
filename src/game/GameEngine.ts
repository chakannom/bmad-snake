import type { Direction, GameState, MapDefinition, UiRefs } from '../types/game';
import { makeMap, TOTAL_MAPS } from '../maps/mapDefinitions';
import { nextUnlockedMap } from '../maps/unlockRules';
import { loadProgress, saveProgress } from '../storage/progressStore';
import type { Settings } from '../storage/settingsStore';
import { bindKeyboard } from '../input/KeyboardInput';
import { bindTouchDirections } from '../input/TouchInput';
import { isCollision } from './Collision';
import { Loop } from './Loop';
import { didEatFood, isClear } from './Scoring';
import { nextHead } from './Snake';
import { createInitialState, isOpposite, spawnFood } from './GameState';
import { syncHud } from '../ui/Hud';

const BASE_SPEED = 8;

export class GameEngine {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly loop: Loop;
  private readonly cleanups: Array<() => void> = [];

  private state: GameState;
  private map: MapDefinition;
  private selectedMapId = 1;
  private unlockedMap = 1;
  private clearedMaps = new Set<number>();
  private fps = 0;
  private frameCount = 0;
  private fpsWindowStart = performance.now();
  private inputLatencies: number[] = [];
  private queuedInputAt: number | null = null;
  private restartSelfTestPassed = false;

  constructor(
    private readonly root: HTMLElement,
    private readonly refs: UiRefs,
    private readonly settings: Settings,
    private readonly onSettingsChange: (settings: Settings) => void,
  ) {
    const progress = loadProgress(TOTAL_MAPS);
    this.unlockedMap = progress.unlockedMap;
    this.clearedMaps = new Set(progress.clearedMaps);

    this.map = makeMap(1);
    this.state = createInitialState(this.map);
    this.state.food = spawnFood(this.map, this.state.snake);

    this.ctx = refs.canvas.getContext('2d')!;

    this.loop = new Loop(
      () => 1000 / (BASE_SPEED + Math.floor((this.selectedMapId - 1) / 4)),
      (stepMs) => this.step(stepMs),
      () => this.render(),
    );

    this.bindControls();
    this.bindSettingsControls();
    this.applyTouchSize();
    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas);
    this.cleanups.push(() => window.removeEventListener('resize', this.resizeCanvas));

    this.resetToMap(1);
    this.restartSelfTestPassed = this.runRestartSelfTest();
    this.loop.start();
  }

  private readonly resizeCanvas = (): void => {
    const cssSize = Math.min(window.innerWidth - 24, 680);
    const size = Math.max(300, cssSize);
    const dpr = window.devicePixelRatio || 1;
    this.refs.canvas.style.width = `${size}px`;
    this.refs.canvas.style.height = `${size}px`;
    this.refs.canvas.width = Math.floor(size * dpr);
    this.refs.canvas.height = Math.floor(size * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.render();
  };

  private bindControls(): void {
    const startBtn = this.root.querySelector<HTMLButtonElement>('#start-btn')!;
    const pauseBtn = this.root.querySelector<HTMLButtonElement>('#pause-btn')!;
    const restartBtn = this.root.querySelector<HTMLButtonElement>('#restart-btn')!;
    const prevMapBtn = this.root.querySelector<HTMLButtonElement>('#prev-map')!;
    const nextMapBtn = this.root.querySelector<HTMLButtonElement>('#next-map')!;

    startBtn.addEventListener('click', () => {
      if (this.state.status === 'idle' || this.state.status === 'gameover' || this.state.status === 'clear') {
        this.startRound();
      }
      if (this.state.status === 'paused') {
        this.state.status = 'running';
        this.sync();
      }
    });

    pauseBtn.addEventListener('click', () => {
      if (this.state.status === 'running') {
        this.state.status = 'paused';
        this.sync();
      }
    });

    restartBtn.addEventListener('click', () => this.startRound());

    prevMapBtn.addEventListener('click', () => {
      this.resetToMap(Math.max(1, this.selectedMapId - 1));
    });

    nextMapBtn.addEventListener('click', () => {
      this.resetToMap(Math.min(this.unlockedMap, this.selectedMapId + 1));
    });

    this.cleanups.push(
      bindTouchDirections(this.root, (dir) => this.queueDirection(dir)),
      bindKeyboard(
        (dir) => this.queueDirection(dir),
        () => this.startRound(),
        () => {
          if (this.state.status === 'running') this.state.status = 'paused';
          else if (this.state.status === 'paused') this.state.status = 'running';
          this.sync();
        },
      ),
    );
  }

  private bindSettingsControls(): void {
    const soundEl = this.root.querySelector<HTMLInputElement>('#setting-sound');
    const hapticEl = this.root.querySelector<HTMLInputElement>('#setting-haptic');
    const touchSizeEl = this.root.querySelector<HTMLSelectElement>('#setting-touch-size');
    if (!soundEl || !hapticEl || !touchSizeEl) return;

    soundEl.checked = this.settings.soundEnabled;
    hapticEl.checked = this.settings.hapticEnabled;
    touchSizeEl.value = this.settings.touchSize;

    const apply = (): void => {
      this.settings.soundEnabled = soundEl.checked;
      this.settings.hapticEnabled = hapticEl.checked;
      this.settings.touchSize = touchSizeEl.value === 'lg' ? 'lg' : 'md';
      this.applyTouchSize();
      this.onSettingsChange(this.settings);
    };

    soundEl.addEventListener('change', apply);
    hapticEl.addEventListener('change', apply);
    touchSizeEl.addEventListener('change', apply);

    this.cleanups.push(() => {
      soundEl.removeEventListener('change', apply);
      hapticEl.removeEventListener('change', apply);
      touchSizeEl.removeEventListener('change', apply);
    });
  }

  private applyTouchSize(): void {
    this.root.classList.toggle('touch-lg', this.settings.touchSize === 'lg');
  }

  private queueDirection(next: Direction): void {
    if (!isOpposite(this.state.pendingDir, next)) {
      this.state.pendingDir = next;
      this.queuedInputAt = performance.now();
    }
  }

  private resetToMap(mapId: number): void {
    if (mapId > this.unlockedMap) return;
    this.selectedMapId = mapId;
    this.map = makeMap(mapId);
    this.state = createInitialState(this.map);
    this.state.food = spawnFood(this.map, this.state.snake);
    this.sync();
  }

  private startRound(): void {
    this.state = createInitialState(this.map);
    this.state.food = spawnFood(this.map, this.state.snake);
    this.state.status = 'running';
    this.sync();
  }

  private step(stepMs: number): void {
    if (this.state.status !== 'running') return;

    this.state.remainingSec -= stepMs / 1000;
    if (this.state.remainingSec <= 0) {
      this.state.remainingSec = 0;
      this.state.status = 'gameover';
      this.sync();
      return;
    }

    if (this.state.pendingDir !== this.state.dir && this.queuedInputAt !== null) {
      const latency = performance.now() - this.queuedInputAt;
      this.inputLatencies.push(latency);
      if (this.inputLatencies.length > 200) this.inputLatencies.shift();
      this.queuedInputAt = null;
    }
    this.state.dir = this.state.pendingDir;
    const next = nextHead(this.state.snake[0], this.state.dir);

    if (isCollision(next, this.map, this.state.snake)) {
      this.state.status = 'gameover';
      this.sync();
      return;
    }

    this.state.snake.unshift(next);
    if (didEatFood(next, this.state.food)) {
      this.state.score += 1;
      this.state.food = spawnFood(this.map, this.state.snake);

      if (isClear(this.state.score, this.map)) {
        this.state.status = 'clear';
        this.clearedMaps.add(this.selectedMapId);
        this.unlockedMap = nextUnlockedMap(this.unlockedMap, this.selectedMapId, TOTAL_MAPS);
        saveProgress({ unlockedMap: this.unlockedMap, clearedMaps: [...this.clearedMaps] });
        this.sync();
        return;
      }
    } else {
      this.state.snake.pop();
    }

    this.sync();
  }

  private sync(): void {
    syncHud(this.refs, {
      status: this.state.status,
      score: this.state.score,
      remainingSec: this.state.remainingSec,
      selectedMapId: this.selectedMapId,
      targetScore: this.map.targetScore,
      unlockedMap: this.unlockedMap,
      fps: this.fps,
      inputP95: this.getInputP95(),
      restartSelfTestPassed: this.restartSelfTestPassed,
    });
  }

  private render(): void {
    this.frameCount += 1;
    const now = performance.now();
    const span = now - this.fpsWindowStart;
    if (span >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / span);
      this.frameCount = 0;
      this.fpsWindowStart = now;
    }

    const width = this.refs.canvas.clientWidth;
    const height = this.refs.canvas.clientHeight;
    const cellW = width / this.map.width;
    const cellH = height / this.map.height;

    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = '#1b1b1d';
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.strokeStyle = '#2f3032';
    this.ctx.lineWidth = 1;

    for (let x = 0; x <= this.map.width; x++) {
      const px = x * cellW;
      this.ctx.beginPath();
      this.ctx.moveTo(px, 0);
      this.ctx.lineTo(px, height);
      this.ctx.stroke();
    }

    for (let y = 0; y <= this.map.height; y++) {
      const py = y * cellH;
      this.ctx.beginPath();
      this.ctx.moveTo(0, py);
      this.ctx.lineTo(width, py);
      this.ctx.stroke();
    }

    this.ctx.fillStyle = '#3a3b3c';
    for (const o of this.map.obstacles) {
      this.ctx.fillRect(o.x * cellW, o.y * cellH, cellW, cellH);
    }

    this.ctx.fillStyle = '#25c2a0';
    for (let i = this.state.snake.length - 1; i >= 0; i--) {
      const part = this.state.snake[i];
      const pad = i === 0 ? 1 : 2;
      this.ctx.fillRect(part.x * cellW + pad, part.y * cellH + pad, cellW - pad * 2, cellH - pad * 2);
    }

    this.ctx.fillStyle = '#ff6b6b';
    this.ctx.beginPath();
    this.ctx.arc(
      this.state.food.x * cellW + cellW / 2,
      this.state.food.y * cellH + cellH / 2,
      Math.min(cellW, cellH) * 0.32,
      0,
      Math.PI * 2,
    );
    this.ctx.fill();
  }

  private getInputP95(): number {
    if (this.inputLatencies.length === 0) return 0;
    const sorted = [...this.inputLatencies].sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95));
    return Math.round(sorted[idx]);
  }

  private runRestartSelfTest(): boolean {
    for (let i = 0; i < 50; i++) {
      const candidate = createInitialState(this.map);
      const valid =
        candidate.status === 'idle' &&
        candidate.score === 0 &&
        candidate.remainingSec === this.map.timeLimitSec &&
        candidate.snake.length === 3;
      if (!valid) return false;
    }
    return true;
  }

  dispose(): void {
    this.loop.stop();
    this.cleanups.forEach((fn) => fn());
  }
}
