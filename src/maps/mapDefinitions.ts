import type { Point, StageConfig } from '../types/game';

export const BOARD_SIZE = 20;
export const CELL = 20;
export const TOTAL_STAGES = 20;
export const DEATH_PENALTY_RATIO = 0.3;
export const MIN_TICK_MS = 52;
export const SPEED_UP_PER_FOOD_MS = 2;

export const START_SNAKE: Point[] = [
  { x: 4, y: 10 },
  { x: 3, y: 10 },
  { x: 2, y: 10 },
];

function pointKey(point: Point): string {
  return `${point.x},${point.y}`;
}

function makeRng(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value = (1664525 * value + 1013904223) >>> 0;
    return value / 0x100000000;
  };
}

const reservedStartSet = (): Set<string> => {
  const reserved = new Set<string>();
  START_SNAKE.forEach((segment) => reserved.add(pointKey(segment)));
  for (let x = 0; x <= 6; x += 1) {
    for (let y = 8; y <= 12; y += 1) {
      reserved.add(`${x},${y}`);
    }
  }
  return reserved;
};

const createObstacles = (level: number): Point[] => {
  const obstacleSet = new Set<string>();
  const reserved = reservedStartSet();

  const add = (x: number, y: number): void => {
    if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) return;
    const key = `${x},${y}`;
    if (reserved.has(key)) return;
    obstacleSet.add(key);
  };

  const addVertical = (x: number, fromY: number, toY: number, gapY: number): void => {
    for (let y = fromY; y <= toY; y += 1) {
      if (y === gapY) continue;
      add(x, y);
    }
  };

  const addHorizontal = (y: number, fromX: number, toX: number, gapX: number): void => {
    for (let x = fromX; x <= toX; x += 1) {
      if (x === gapX) continue;
      add(x, y);
    }
  };

  if (level >= 2) addVertical(10, 2, 17, 10);
  if (level >= 3) addHorizontal(10, 5, 17, 13);
  if (level >= 4) addVertical(14, 3, 16, 8);
  if (level >= 5) addHorizontal(6, 5, 18, 11);
  if (level >= 6) addVertical(7, 2, 15, 12);
  if (level >= 7) addHorizontal(14, 6, 18, 9);
  if (level >= 8) addVertical(16, 2, 17, 6);
  if (level >= 9) addHorizontal(3, 7, 18, 15);
  if (level >= 10) addVertical(12, 2, 17, 5);
  if (level >= 11) addHorizontal(16, 6, 18, 8);
  if (level >= 12) addVertical(18, 1, 18, 11);
  if (level >= 13) addHorizontal(8, 6, 19, 17);
  if (level >= 14) addVertical(9, 1, 17, 14);
  if (level >= 15) addHorizontal(12, 7, 19, 10);
  if (level >= 16) addVertical(15, 1, 18, 13);
  if (level >= 17) addHorizontal(5, 8, 19, 18);
  if (level >= 18) addVertical(11, 1, 18, 4);
  if (level >= 19) addHorizontal(17, 7, 19, 16);
  if (level >= 20) addVertical(17, 1, 18, 9);

  const rng = makeRng(level * 97 + 11);
  const randomBlocks = level * 2;
  let placed = 0;
  let attempts = 0;
  while (placed < randomBlocks && attempts < 5000) {
    attempts += 1;
    const x = Math.floor(rng() * BOARD_SIZE);
    const y = Math.floor(rng() * BOARD_SIZE);
    const key = `${x},${y}`;
    if (reserved.has(key) || obstacleSet.has(key)) continue;
    obstacleSet.add(key);
    placed += 1;
  }

  return Array.from(obstacleSet).map((key) => {
    const [x, y] = key.split(',').map(Number);
    return { x, y };
  });
};

export const STAGES: StageConfig[] = Array.from({ length: TOTAL_STAGES }, (_, index) => {
  const level = index + 1;
  return {
    level,
    mapName: `Map-${String(level).padStart(2, '0')}`,
    targetScore: 40 + level * 10,
    timeLimitSec: Math.max(18, 34 - Math.floor(level / 2)),
    tickMs: Math.max(70, 125 - level * 2),
    obstacles: createObstacles(level),
  };
});
