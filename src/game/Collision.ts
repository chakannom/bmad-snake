import { BOARD_SIZE } from '../maps/mapDefinitions';
import type { GameState, Point } from '../types/game';
import { equal, pointKey } from './Snake';

export function isOutOfBounds(nextHead: Point): boolean {
  return nextHead.x < 0 || nextHead.y < 0 || nextHead.x >= BOARD_SIZE || nextHead.y >= BOARD_SIZE;
}

export function isSelfCollision(state: GameState, nextHead: Point): boolean {
  return state.snake.some((segment) => equal(segment, nextHead));
}

export function isObstacleCollision(state: GameState, nextHead: Point): boolean {
  return state.obstacleSet.has(pointKey(nextHead));
}
