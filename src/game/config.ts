import type { Point } from "./types";

export const BOARD_SIZE = 20;
export const CELL = 20;
export const TOTAL_STAGES = 20;
export const DEATH_PENALTY_RATIO = 0.3;
export const MIN_TICK_MS = 52;
export const SPEED_UP_PER_FOOD_MS = 2;

export const START_SNAKE: Point[] = [
  { x: 4, y: 10 },
  { x: 3, y: 10 },
  { x: 2, y: 10 }
];

