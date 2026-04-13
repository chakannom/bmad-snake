import type { MapDefinition, Point } from '../types/game';

export function didEatFood(head: Point, food: Point): boolean {
  return head.x === food.x && head.y === food.y;
}

export function isClear(score: number, map: MapDefinition): boolean {
  return score >= map.targetScore;
}
