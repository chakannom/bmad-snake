import { START_SNAKE } from "./config";
import type { Direction, Point } from "./types";

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

export const createInitialState = (initialTickMs: number): GameState => ({
  snake: START_SNAKE.map((segment) => ({ ...segment })),
  direction: "right",
  nextDirection: "right",
  food: { x: 10, y: 10 },
  stageIndex: 0,
  stageScore: 0,
  totalScore: 0,
  remainingMs: 0,
  isGameOver: false,
  isCleared: false,
  obstacleSet: new Set<string>(),
  currentTickMs: initialTickMs
});

