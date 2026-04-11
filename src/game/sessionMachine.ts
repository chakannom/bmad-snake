import { resolveNextDirection } from './inputPolicy'
import type { Direction, InputSource, SessionEndReason, SessionState } from './types'

const INITIAL_DIRECTION: Direction = 'right'

export const initialSessionState: SessionState = {
  mode: 'idle',
  sessionId: 0,
  startedAtMs: null,
  endedReason: 'none',
  direction: INITIAL_DIRECTION,
  inputSource: 'none',
}

export function startSession(prev: SessionState, nowMs = Date.now()): SessionState {
  return {
    mode: 'playing',
    sessionId: prev.sessionId + 1,
    startedAtMs: nowMs,
    endedReason: 'none',
    direction: INITIAL_DIRECTION,
    inputSource: 'none',
  }
}

export function restartSession(prev: SessionState, nowMs = Date.now()): SessionState {
  return startSession(prev, nowMs)
}

export function failSession(
  prev: SessionState,
  reason: SessionEndReason = 'manual-fail',
): SessionState {
  return {
    ...prev,
    mode: 'failed',
    endedReason: reason,
  }
}

export function applyInputDirection(
  prev: SessionState,
  candidate: Direction,
  source: InputSource,
): SessionState {
  if (prev.mode !== 'playing') {
    return prev
  }

  return {
    ...prev,
    direction: resolveNextDirection(prev.direction, candidate),
    inputSource: source,
  }
}
