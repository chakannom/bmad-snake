import { describe, expect, it } from 'vitest'
import {
  applyInputDirection,
  failSession,
  initialSessionState,
  restartSession,
  startSession,
} from './sessionMachine'

describe('session machine', () => {
  it('starts session immediately', () => {
    const next = startSession(initialSessionState, 1000)

    expect(next.mode).toBe('playing')
    expect(next.sessionId).toBe(1)
    expect(next.startedAtMs).toBe(1000)
  })

  it('fails and restarts session with new id', () => {
    const started = startSession(initialSessionState, 1000)
    const failed = failSession(started, 'manual-fail')
    const restarted = restartSession(failed, 2000)

    expect(failed.mode).toBe('failed')
    expect(restarted.mode).toBe('playing')
    expect(restarted.sessionId).toBe(2)
  })

  it('accepts valid direction and rejects opposite input', () => {
    const started = startSession(initialSessionState)
    const leftInput = applyInputDirection(started, 'left', 'keyboard')

    expect(leftInput.direction).toBe('right')

    const upInput = applyInputDirection(started, 'up', 'keyboard')
    expect(upInput.direction).toBe('up')
  })
})
