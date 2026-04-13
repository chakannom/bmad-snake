import {
  BOARD_SIZE,
  DEATH_PENALTY_RATIO,
  MIN_TICK_MS,
  SPEED_UP_PER_FOOD_MS,
} from '../maps/mapDefinitions';
import type { GameState, Point, StageConfig } from '../types/game';
import { equal, pointKey, randomPoint } from './Snake';
import { isObstacleCollision, isOutOfBounds, isSelfCollision } from './Collision';

export type StepOutcome = 'running' | 'death' | 'timeout' | 'stage-clear';

export type StepResult = {
  outcome: StepOutcome;
  speedChanged: boolean;
};

export const applyDeathPenalty = (state: GameState): void => {
  state.stageScore = Math.max(0, Math.floor(state.stageScore * (1 - DEATH_PENALTY_RATIO)));
  state.totalScore = Math.max(0, Math.floor(state.totalScore * (1 - DEATH_PENALTY_RATIO)));
};

export const spawnFood = (state: GameState): void => {
  const forbidden = new Set<string>([...state.obstacleSet, ...state.snake.map(pointKey)]);
  const freeCellCount = BOARD_SIZE * BOARD_SIZE - forbidden.size;
  if (freeCellCount <= 0) {
    state.food = { x: -1, y: -1 };
    return;
  }

  let next = randomPoint();
  while (forbidden.has(pointKey(next))) {
    next = randomPoint();
  }
  state.food = next;
};

export const resetStageRun = (state: GameState, stage: StageConfig, startSnake: Point[]): void => {
  state.direction = 'right';
  state.nextDirection = 'right';
  state.snake = startSnake.map((segment) => ({ ...segment }));
  state.isGameOver = false;
  state.isCleared = false;
  state.isPaused = false;
  state.obstacleSet = new Set(stage.obstacles.map(pointKey));
  state.remainingMs = stage.timeLimitSec * 1000;
  state.currentTickMs = stage.tickMs;
  spawnFood(state);
};

export const stepGame = (state: GameState, stage: StageConfig): StepResult => {
  state.remainingMs -= state.currentTickMs;
  if (state.remainingMs <= 0 && state.stageScore < stage.targetScore) {
    return { outcome: 'timeout', speedChanged: false };
  }

  const head = state.snake[0];
  const nextHead: Point =
    state.direction === 'up'
      ? { x: head.x, y: head.y - 1 }
      : state.direction === 'down'
        ? { x: head.x, y: head.y + 1 }
        : state.direction === 'left'
          ? { x: head.x - 1, y: head.y }
          : { x: head.x + 1, y: head.y };

  if (isOutOfBounds(nextHead) || isSelfCollision(state, nextHead) || isObstacleCollision(state, nextHead)) {
    return { outcome: 'death', speedChanged: false };
  }

  state.snake.unshift(nextHead);

  if (equal(nextHead, state.food)) {
    state.stageScore += 10;
    state.totalScore += 10;
    const prevTick = state.currentTickMs;
    state.currentTickMs = Math.max(MIN_TICK_MS, state.currentTickMs - SPEED_UP_PER_FOOD_MS);
    const speedChanged = state.currentTickMs !== prevTick;

    if (state.stageScore >= stage.targetScore) {
      return { outcome: 'stage-clear', speedChanged };
    }

    spawnFood(state);
    return { outcome: 'running', speedChanged };
  }

  state.snake.pop();
  return { outcome: 'running', speedChanged: false };
};
