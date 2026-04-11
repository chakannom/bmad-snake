import { describe, expect, it } from 'vitest'
import { buildBalanceReport } from './report'

describe('balance report', () => {
  it('aggregates session metrics', () => {
    const report = buildBalanceReport([
      {
        name: 'snake_session_end',
        payload: {
          snake_session_id: 1,
          snake_result: 'clear',
          snake_elapsed_ms: 10000,
          snake_platform: 'pc',
        },
      },
      {
        name: 'snake_session_end',
        payload: {
          snake_session_id: 2,
          snake_result: 'fail_collision',
          snake_elapsed_ms: 6000,
          snake_platform: 'mobile',
        },
      },
    ])

    expect(report.totalSessions).toBe(2)
    expect(report.avgPlayTimeMs).toBe(8000)
    expect(report.platformBreakdown.pc).toBe(1)
    expect(report.clearRate).toBe(0.5)
  })
})
