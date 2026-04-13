import type { MapDefinition, Point } from '../types/game';
import { pointKey } from './GameState';

export function isCollision(next: Point, map: MapDefinition, snake: Point[]): boolean {
  if (next.x < 0 || next.x >= map.width || next.y < 0 || next.y >= map.height) return true;
  const obstacleSet = new Set(map.obstacles.map(pointKey));
  if (obstacleSet.has(pointKey(next))) return true;
  return snake.some((part) => part.x === next.x && part.y === next.y);
}
