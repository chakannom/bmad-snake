import { describe, expect, it } from 'vitest'
import { STAGES } from '../stage/catalog'
import {
  canPlayStage,
  initialProgress,
  unlockNextStage,
} from './storage'

describe('progress', () => {
  it('unlocks next stage after clear', () => {
    const next = unlockNextStage(initialProgress, STAGES[0].id)

    expect(next.unlockedStageIds).toContain(STAGES[1].id)
    expect(next.selectedStageId).toBe(STAGES[1].id)
  })

  it('can play only unlocked stages', () => {
    expect(canPlayStage(initialProgress, STAGES[0].id)).toBe(true)
    expect(canPlayStage(initialProgress, STAGES[2].id)).toBe(false)
  })
})
