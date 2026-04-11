import type { Direction, Point } from './types'

const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  s: 'down',
  S: 'down',
  a: 'left',
  A: 'left',
  d: 'right',
  D: 'right',
}

export function isOppositeDirection(current: Direction, next: Direction): boolean {
  return OPPOSITE[current] === next
}

export function resolveNextDirection(current: Direction, candidate: Direction): Direction {
  if (isOppositeDirection(current, candidate)) {
    return current
  }

  return candidate
}

export function directionFromKeyboardKey(key: string): Direction | null {
  return KEY_TO_DIRECTION[key] ?? null
}

export function directionFromSwipe(
  start: Point,
  end: Point,
  threshold = 24,
): Direction | null {
  const deltaX = end.x - start.x
  const deltaY = end.y - start.y

  if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
    return null
  }

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? 'right' : 'left'
  }

  return deltaY > 0 ? 'down' : 'up'
}
