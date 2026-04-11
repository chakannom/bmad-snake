import { describe, expect, it } from 'vitest'
import {
  createInitialGame,
  spawnFood,
  tick,
  updateDirection,
  type SnakeGameState,
} from './engine'
import type { StageDefinition } from './types'

const stage: StageDefinition = {
  id: 'stage-01',
  name: 'Stage 01',
  tier: 1,
  width: 12,
  height: 10,
  timeLimitSec: 30,
  goalFood: 2,
}

function withState(overrides: Partial<SnakeGameState>): SnakeGameState {
  return {
    ...createInitialGame(stage),
    ...overrides,
  }
}

describe('snake engine', () => {
  it('creates initial state in playing mode', () => {
    const initial = createInitialGame(stage)

    expect(initial.mode).toBe('playing')
    expect(initial.goalFood).toBe(2)
  })

  it('blocks opposite direction updates', () => {
    const initial = createInitialGame(stage)
    const next = updateDirection(initial, 'left')

    expect(next.direction).toBe('right')
  })

  it('fails on wall collision', () => {
    const state = withState({
      snake: [{ x: 11, y: 4 }],
      direction: 'right',
    })

    const next = tick(state, 100)

    expect(next.mode).toBe('failed')
    expect(next.reason).toBe('collision')
  })

  it('fails on timeout', () => {
    const state = withState({ elapsedMs: 29_950, timeLimitSec: 30 })

    const next = tick(state, 100)

    expect(next.mode).toBe('failed')
    expect(next.reason).toBe('timeout')
  })

  it('clears stage when goal is met', () => {
    const state = withState({
      goalFood: 1,
      snake: [{ x: 4, y: 4 }],
      direction: 'right',
      food: { x: 5, y: 4 },
      foodEaten: 0,
    })

    const next = tick(state, 100)

    expect(next.mode).toBe('cleared')
    expect(next.reason).toBe('cleared')
  })

  it('spawns food in non-occupied cell', () => {
    const food = spawnFood(
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
      3,
      1,
      () => 0,
    )

    expect(food).toEqual({ x: 2, y: 0 })
  })
})
