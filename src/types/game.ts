export type Point = { x: number; y: number };
export type Direction = 'up' | 'down' | 'left' | 'right';

export type StageConfig = {
  level: number;
  mapName: string;
  targetScore: number;
  timeLimitSec: number;
  tickMs: number;
  obstacles: Point[];
};

export type GameState = {
  snake: Point[];
  direction: Direction;
  nextDirection: Direction;
  food: Point;
  stageIndex: number;
  stageScore: number;
  totalScore: number;
  remainingMs: number;
  isGameOver: boolean;
  isCleared: boolean;
  obstacleSet: Set<string>;
  currentTickMs: number;
};

export type GameStatus = 'ready' | 'running' | 'gameover' | 'cleared';
