import type { SnakeGameState } from '../game/engine'
import type { StageDefinition } from '../game/types'

export interface GhostFrame {
  t: number
  headX: number
  headY: number
}

export interface GhostReplayHook {
  onSessionStart: (stageId: string) => void
  onTick: (state: SnakeGameState) => void
  exportReplay: () => GhostFrame[]
}

export interface DailyChallengeHook {
  applyChallenge: (stage: StageDefinition, dateKey: string) => StageDefinition
}

export interface ThemeMapHook {
  getThemeClass: (stageId: string) => string
}

export function createGhostReplayHook(): GhostReplayHook {
  let frames: GhostFrame[] = []
  let elapsed = 0

  return {
    onSessionStart: () => {
      frames = []
      elapsed = 0
    },
    onTick: (state) => {
      elapsed += 1
      frames.push({
        t: elapsed,
        headX: state.snake[0].x,
        headY: state.snake[0].y,
      })
    },
    exportReplay: () => frames,
  }
}

export function createDailyChallengeHook(): DailyChallengeHook {
  return {
    applyChallenge: (stage, dateKey) => {
      const daySeed = Number(dateKey.slice(-2)) || 1
      const extraGoal = daySeed % 2
      const reducedTime = daySeed % 3 === 0 ? 2 : 0

      return {
        ...stage,
        goalFood: stage.goalFood + extraGoal,
        timeLimitSec: Math.max(10, stage.timeLimitSec - reducedTime),
      }
    },
  }
}

export function createThemeMapHook(): ThemeMapHook {
  return {
    getThemeClass: (stageId) => {
      const stageNumber = Number(stageId.split('-')[1] ?? '1')

      if (stageNumber <= 5) {
        return 'theme-citrus'
      }

      if (stageNumber <= 10) {
        return 'theme-forest'
      }

      if (stageNumber <= 15) {
        return 'theme-ocean'
      }

      return 'theme-volcano'
    },
  }
}
