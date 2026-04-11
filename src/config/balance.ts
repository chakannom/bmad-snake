import type { StageDefinition } from '../game/types'

interface BalancePatch {
  timeLimitSec?: number
  goalFood?: number
}

const stageBalancePatch: Record<string, BalancePatch> = {
  'stage-01': { timeLimitSec: 50, goalFood: 3 },
  'stage-02': { timeLimitSec: 48 },
}

export function applyBalance(stage: StageDefinition): StageDefinition {
  const patch = stageBalancePatch[stage.id]

  if (!patch) {
    return stage
  }

  return {
    ...stage,
    ...patch,
  }
}

export function listBalancePatches(): Record<string, BalancePatch> {
  return stageBalancePatch
}
