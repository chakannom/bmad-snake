import { BOARD_SIZE } from '../maps/mapDefinitions';
import type { Direction, Point } from '../types/game';

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
  y: Math.floor(Math.random() * BOARD_SIZE),
});

export function moveHead(head: Point, direction: Direction): Point {
  if (direction === 'up') return { x: head.x, y: head.y - 1 };
  if (direction === 'down') return { x: head.x, y: head.y + 1 };
  if (direction === 'left') return { x: head.x - 1, y: head.y };
  return { x: head.x + 1, y: head.y };
}
