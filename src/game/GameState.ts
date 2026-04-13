import type { Direction, GameState, MapDefinition, Point } from '../types/game';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pointKey({ x, y }: Point): string {
  return `${x},${y}`;
}

export function createSeedSnake(map: MapDefinition): Point[] {
  const center = Math.floor(map.width / 2);
  return [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ];
}

export function createInitialState(map: MapDefinition): GameState {
  const snake = createSeedSnake(map);
  return {
    status: 'idle',
    snake,
    food: { x: 0, y: 0 },
    dir: 'right',
    pendingDir: 'right',
    score: 0,
    remainingSec: map.timeLimitSec,
  };
}

export function spawnFood(map: MapDefinition, snake: Point[]): Point {
  const obstacleSet = new Set(map.obstacles.map(pointKey));
  const occupied = new Set<string>([...snake.map(pointKey), ...obstacleSet]);
  let next: Point = { x: 1, y: 1 };
  do {
    next = {
      x: randomInt(0, map.width - 1),
      y: randomInt(0, map.height - 1),
    };
  } while (occupied.has(pointKey(next)));

  return next;
}

export function isOpposite(a: Direction, b: Direction): boolean {
  return (
    (a === 'up' && b === 'down') ||
    (a === 'down' && b === 'up') ||
    (a === 'left' && b === 'right') ||
    (a === 'right' && b === 'left')
  );
}
