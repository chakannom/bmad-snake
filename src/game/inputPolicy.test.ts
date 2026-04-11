import { describe, expect, it } from 'vitest'
import {
  directionFromKeyboardKey,
  directionFromSwipe,
  isOppositeDirection,
  resolveNextDirection,
} from './inputPolicy'

describe('input policy', () => {
  it('immediate opposite direction is blocked', () => {
    expect(isOppositeDirection('up', 'down')).toBe(true)
    expect(resolveNextDirection('left', 'right')).toBe('left')
  })

  it('non-opposite direction is accepted', () => {
    expect(resolveNextDirection('left', 'up')).toBe('up')
  })

  it('maps keyboard keys to direction', () => {
    expect(directionFromKeyboardKey('ArrowUp')).toBe('up')
    expect(directionFromKeyboardKey('a')).toBe('left')
    expect(directionFromKeyboardKey('x')).toBeNull()
  })

  it('converts swipe vector to direction', () => {
    expect(directionFromSwipe({ x: 0, y: 0 }, { x: 40, y: 3 })).toBe('right')
    expect(directionFromSwipe({ x: 0, y: 0 }, { x: 4, y: 35 })).toBe('down')
    expect(directionFromSwipe({ x: 0, y: 0 }, { x: 5, y: 5 })).toBeNull()
  })
})
