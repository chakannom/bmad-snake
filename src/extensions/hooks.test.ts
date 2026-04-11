import { describe, expect, it } from 'vitest'
import { createInitialGame } from '../game/engine'
import type { StageDefinition } from '../game/types'
import {
  createDailyChallengeHook,
  createGhostReplayHook,
  createThemeMapHook,
} from './hooks'

const stage: StageDefinition = {
  id: 'stage-01',
  name: 'Stage 01',
  tier: 1,
  width: 14,
  height: 10,
  timeLimitSec: 30,
  goalFood: 4,
}

describe('extension hooks', () => {
  it('records ghost replay frames', () => {
    const ghost = createGhostReplayHook()
    ghost.onSessionStart('stage-01')
    ghost.onTick(createInitialGame(stage))

    expect(ghost.exportReplay().length).toBe(1)
  })

  it('applies daily challenge patch', () => {
    const challenge = createDailyChallengeHook()
    const patched = challenge.applyChallenge(stage, '2026-04-12')

    expect(patched.goalFood).toBeGreaterThanOrEqual(stage.goalFood)
  })

  it('maps theme class by stage range', () => {
    const theme = createThemeMapHook()
    expect(theme.getThemeClass('stage-03')).toBe('theme-citrus')
    expect(theme.getThemeClass('stage-17')).toBe('theme-volcano')
  })
})
