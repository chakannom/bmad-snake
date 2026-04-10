import { BOARD_SIZE } from "./config";
import type { Point } from "./types";

export const pointKey = (point: Point): string => `${point.x},${point.y}`;
export const equal = (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y;

export const makeRng = (seed: number): (() => number) => {
  let value = seed >>> 0;
  return () => {
    value = (1664525 * value + 1013904223) >>> 0;
    return value / 0x100000000;
  };
};

export const randomPoint = (): Point => ({
  x: Math.floor(Math.random() * BOARD_SIZE),
  y: Math.floor(Math.random() * BOARD_SIZE)
});

