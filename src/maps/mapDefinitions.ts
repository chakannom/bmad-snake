import type { MapDefinition, Point } from '../types/game';

const GRID_SIZE = 24;

const TARGET_TABLE: Array<{ timeLimitSec: number; targetScore: number }> = [
  { timeLimitSec: 90, targetScore: 6 },
  { timeLimitSec: 90, targetScore: 7 },
  { timeLimitSec: 85, targetScore: 8 },
  { timeLimitSec: 85, targetScore: 9 },
  { timeLimitSec: 80, targetScore: 10 },
  { timeLimitSec: 80, targetScore: 11 },
  { timeLimitSec: 75, targetScore: 12 },
  { timeLimitSec: 75, targetScore: 13 },
  { timeLimitSec: 70, targetScore: 14 },
  { timeLimitSec: 70, targetScore: 15 },
  { timeLimitSec: 65, targetScore: 16 },
  { timeLimitSec: 65, targetScore: 17 },
  { timeLimitSec: 60, targetScore: 18 },
  { timeLimitSec: 60, targetScore: 19 },
  { timeLimitSec: 55, targetScore: 20 },
  { timeLimitSec: 55, targetScore: 22 },
  { timeLimitSec: 50, targetScore: 24 },
  { timeLimitSec: 50, targetScore: 26 },
  { timeLimitSec: 45, targetScore: 28 },
  { timeLimitSec: 45, targetScore: 30 },
];

function pointKey({ x, y }: Point): string {
  return `${x},${y}`;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const TOTAL_MAPS = 20;

export function makeMap(id: number): MapDefinition {
  const center = Math.floor(GRID_SIZE / 2);
  const obstacles: Point[] = [];
  const pattern = (id - 1) % 5;

  if (pattern === 0) {
    for (let y = 4; y < GRID_SIZE - 4; y += 2) {
      obstacles.push({ x: center - 4, y }, { x: center + 4, y });
    }
  }

  if (pattern === 1) {
    for (let x = 4; x < GRID_SIZE - 4; x++) {
      if (x % 3 !== 0) obstacles.push({ x, y: center - 5 }, { x, y: center + 5 });
    }
  }

  if (pattern === 2) {
    for (let i = 3; i < GRID_SIZE - 3; i++) {
      if (i % 4 !== 0) obstacles.push({ x: i, y: i }, { x: GRID_SIZE - 1 - i, y: i });
    }
  }

  if (pattern === 3) {
    for (let x = 2; x < GRID_SIZE - 2; x++) {
      if (x < center - 2 || x > center + 2) obstacles.push({ x, y: 2 }, { x, y: GRID_SIZE - 3 });
    }
    for (let y = 2; y < GRID_SIZE - 2; y++) {
      if (y < center - 2 || y > center + 2) obstacles.push({ x: 2, y }, { x: GRID_SIZE - 3, y });
    }
  }

  if (pattern === 4) {
    for (let i = 4; i < GRID_SIZE - 4; i += 2) {
      obstacles.push({ x: i, y: center }, { x: center, y: i });
    }
  }

  const unique = new Map<string, Point>();
  for (const p of obstacles) unique.set(pointKey(p), p);

  const levelScale = Math.floor((id - 1) / 5);
  for (let i = 0; i < levelScale * 4; i++) {
    const p = { x: randomInt(3, GRID_SIZE - 4), y: randomInt(3, GRID_SIZE - 4) };
    unique.set(pointKey(p), p);
  }

  const row = TARGET_TABLE[id - 1] ?? TARGET_TABLE[TARGET_TABLE.length - 1];
  return {
    id,
    width: GRID_SIZE,
    height: GRID_SIZE,
    timeLimitSec: row.timeLimitSec,
    targetScore: row.targetScore,
    obstacles: [...unique.values()],
  };
}
