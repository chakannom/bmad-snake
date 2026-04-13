export type Status = 'idle' | 'running' | 'paused' | 'gameover' | 'clear';
export type Direction = 'up' | 'down' | 'left' | 'right';

export type Point = { x: number; y: number };

export type MapDefinition = {
  id: number;
  width: number;
  height: number;
  timeLimitSec: number;
  targetScore: number;
  obstacles: Point[];
};

export type GameState = {
  status: Status;
  snake: Point[];
  food: Point;
  dir: Direction;
  pendingDir: Direction;
  score: number;
  remainingSec: number;
};

export type UiRefs = {
  canvas: HTMLCanvasElement;
  statusEl: HTMLElement;
  scoreEl: HTMLElement;
  timerEl: HTMLElement;
  mapEl: HTMLElement;
  targetEl: HTMLElement;
  unlockedEl: HTMLElement;
  fpsEl: HTMLElement;
  inputP95El: HTMLElement;
  restartTestEl: HTMLElement;
  overlayHintEl: HTMLElement;
};
