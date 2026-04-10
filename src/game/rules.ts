import {
  BOARD_SIZE,
  DEATH_PENALTY_RATIO,
  MIN_TICK_MS,
  SPEED_UP_PER_FOOD_MS,
  START_SNAKE
} from "./config";
import type { GameState } from "./state";
import type { Point, StageConfig } from "./types";
import { equal, pointKey, randomPoint } from "./utils";

export type StepOutcome = "running" | "death" | "timeout" | "stage-clear";

export type StepResult = {
  outcome: StepOutcome;
  speedChanged: boolean;
};

export const resetStageRun = (
  state: GameState,
  stage: StageConfig,
  initialTickMs: number = stage.tickMs
): void => {
  state.direction = "right";
  state.nextDirection = "right";
  state.snake = START_SNAKE.map((segment) => ({ ...segment }));
  state.isGameOver = false;
  state.isCleared = false;
  state.obstacleSet = new Set(stage.obstacles.map(pointKey));
  state.remainingMs = stage.timeLimitSec * 1000;
  state.currentTickMs = initialTickMs;
  spawnFood(state);
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

const movement: Record<"up" | "down" | "left" | "right", Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

export const stepGame = (state: GameState, stage: StageConfig): StepResult => {
  state.remainingMs -= stage.tickMs;
  if (state.remainingMs <= 0 && state.stageScore < stage.targetScore) {
    return { outcome: "timeout", speedChanged: false };
  }

  state.direction = state.nextDirection;
  const head = state.snake[0];
  const nextHead = {
    x: head.x + movement[state.direction].x,
    y: head.y + movement[state.direction].y
  };

  const outOfBounds =
    nextHead.x < 0 ||
    nextHead.y < 0 ||
    nextHead.x >= BOARD_SIZE ||
    nextHead.y >= BOARD_SIZE;
  const hitSelf = state.snake.some((segment) => equal(segment, nextHead));
  const hitObstacle = state.obstacleSet.has(pointKey(nextHead));
  if (outOfBounds || hitSelf || hitObstacle) {
    return { outcome: "death", speedChanged: false };
  }

  state.snake.unshift(nextHead);

  if (equal(nextHead, state.food)) {
    state.stageScore += 10;
    state.totalScore += 10;
    const prevTick = state.currentTickMs;
    state.currentTickMs = Math.max(MIN_TICK_MS, state.currentTickMs - SPEED_UP_PER_FOOD_MS);
    const speedChanged = state.currentTickMs !== prevTick;

    if (state.stageScore >= stage.targetScore) {
      return { outcome: "stage-clear", speedChanged };
    }
    spawnFood(state);
    return { outcome: "running", speedChanged };
  }

  state.snake.pop();
  return { outcome: "running", speedChanged: false };
};
