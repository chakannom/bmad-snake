import type { StageDefinition } from '../game/types'

const stageMatrix = [
  { tier: 1, time: 45, goal: 3 },
  { tier: 1, time: 45, goal: 4 },
  { tier: 1, time: 40, goal: 4 },
  { tier: 1, time: 40, goal: 5 },
  { tier: 1, time: 35, goal: 5 },
  { tier: 2, time: 35, goal: 6 },
  { tier: 2, time: 34, goal: 6 },
  { tier: 2, time: 33, goal: 7 },
  { tier: 2, time: 32, goal: 7 },
  { tier: 2, time: 30, goal: 8 },
  { tier: 3, time: 30, goal: 8 },
  { tier: 3, time: 29, goal: 9 },
  { tier: 3, time: 28, goal: 9 },
  { tier: 3, time: 27, goal: 10 },
  { tier: 3, time: 26, goal: 10 },
  { tier: 4, time: 25, goal: 11 },
  { tier: 4, time: 24, goal: 11 },
  { tier: 4, time: 23, goal: 12 },
  { tier: 4, time: 22, goal: 12 },
  { tier: 4, time: 20, goal: 13 },
]

export const STAGES: StageDefinition[] = stageMatrix.map((entry, index) => ({
  id: `stage-${String(index + 1).padStart(2, '0')}`,
  name: `Stage ${String(index + 1).padStart(2, '0')}`,
  tier: entry.tier,
  width: 14,
  height: 10,
  timeLimitSec: entry.time,
  goalFood: entry.goal,
}))

export function getStageById(stageId: string): StageDefinition {
  const found = STAGES.find((stage) => stage.id === stageId)

  if (!found) {
    return STAGES[0]
  }

  return found
}
