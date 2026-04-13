import type { Direction } from '../types/game';

const opposite: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

const directionByKey: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

export const isRestartKey = (code: string): boolean => code === 'Space';
export const isPauseKey = (code: string): boolean => code === 'KeyP';

export const nextDirectionFromKey = (code: string): Direction | null => {
  return directionByKey[code] ?? null;
};

export const canTurn = (current: Direction, next: Direction): boolean => {
  return opposite[current] !== next;
};
