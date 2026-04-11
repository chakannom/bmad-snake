export type Direction = 'up' | 'down' | 'left' | 'right'

export type InputSource = 'none' | 'keyboard' | 'swipe'

export type SessionEndReason = 'none' | 'manual-fail' | 'timeout'

export type GameMode = 'idle' | 'playing' | 'failed'

export interface Point {
  x: number
  y: number
}

export interface SessionState {
  mode: GameMode
  sessionId: number
  startedAtMs: number | null
  endedReason: SessionEndReason
  direction: Direction
  inputSource: InputSource
}
