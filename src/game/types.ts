export type Point = { x: number; y: number };
export type Direction = "up" | "down" | "left" | "right";

export type StageConfig = {
  level: number;
  mapName: string;
  targetScore: number;
  timeLimitSec: number;
  tickMs: number;
  obstacles: Point[];
};

