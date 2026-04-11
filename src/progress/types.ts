export interface ProgressState {
  unlockedStageIds: string[]
  selectedStageId: string
  clearedStageIds: string[]
  bestTimeByStage: Record<string, number>
}
