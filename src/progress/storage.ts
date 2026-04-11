import { STAGES } from '../stage/catalog'
import type { ProgressState } from './types'

const STORAGE_KEY = 'bmad-snake.stage-progress'

export const initialProgress: ProgressState = {
  unlockedStageIds: [STAGES[0].id],
  selectedStageId: STAGES[0].id,
  clearedStageIds: [],
  bestTimeByStage: {},
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return initialProgress
    }

    const parsed = JSON.parse(raw) as ProgressState

    if (!parsed.unlockedStageIds?.length || !parsed.selectedStageId) {
      return initialProgress
    }

    return parsed
  } catch {
    return initialProgress
  }
}

export function saveProgress(progress: ProgressState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function unlockNextStage(progress: ProgressState, stageId: string): ProgressState {
  const currentIdx = STAGES.findIndex((stage) => stage.id === stageId)
  const nextStage = STAGES[currentIdx + 1]

  const unlockedStageIds = nextStage
    ? Array.from(new Set([...progress.unlockedStageIds, nextStage.id]))
    : progress.unlockedStageIds

  const clearedStageIds = Array.from(new Set([...progress.clearedStageIds, stageId]))

  return {
    ...progress,
    unlockedStageIds,
    clearedStageIds,
    selectedStageId: nextStage?.id ?? stageId,
  }
}

export function canPlayStage(progress: ProgressState, stageId: string): boolean {
  return progress.unlockedStageIds.includes(stageId)
}
