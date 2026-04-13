import { START_SNAKE } from '../maps/mapDefinitions';
import type { GameState } from '../types/game';

export const createInitialState = (initialTickMs: number): GameState => ({
  snake: START_SNAKE.map((segment) => ({ ...segment })),
  direction: 'right',
  nextDirection: 'right',
  food: { x: 10, y: 10 },
  stageIndex: 0,
  stageScore: 0,
  totalScore: 0,
  remainingMs: 0,
  isGameOver: false,
  isCleared: false,
  isPaused: false,
  hasStarted: false,
  obstacleSet: new Set<string>(),
  currentTickMs: initialTickMs,
});
