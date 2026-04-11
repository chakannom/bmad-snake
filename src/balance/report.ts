import type { SnakeEvent } from '../analytics/schema'

export interface BalanceReport {
  totalSessions: number
  avgPlayTimeMs: number
  platformBreakdown: Record<string, number>
  clearRate: number
}

export function buildBalanceReport(events: SnakeEvent[]): BalanceReport {
  const sessionEndEvents = events.filter((event) => event.name === 'snake_session_end')

  if (sessionEndEvents.length === 0) {
    return {
      totalSessions: 0,
      avgPlayTimeMs: 0,
      platformBreakdown: {},
      clearRate: 0,
    }
  }

  const elapsedTotal = sessionEndEvents.reduce(
    (sum, event) => sum + (event.payload.snake_elapsed_ms ?? 0),
    0,
  )

  const platformBreakdown: Record<string, number> = {}
  let clearCount = 0

  for (const event of sessionEndEvents) {
    const platform = event.payload.snake_platform ?? 'unknown'
    platformBreakdown[platform] = (platformBreakdown[platform] ?? 0) + 1

    if (event.payload.snake_result === 'clear') {
      clearCount += 1
    }
  }

  return {
    totalSessions: sessionEndEvents.length,
    avgPlayTimeMs: Math.round(elapsedTotal / sessionEndEvents.length),
    platformBreakdown,
    clearRate: Number((clearCount / sessionEndEvents.length).toFixed(2)),
  }
}
