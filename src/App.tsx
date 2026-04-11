import { useEffect, useMemo, useRef, useState } from 'react'
import { Playfield } from './components/Playfield'
import {
  directionFromKeyboardKey,
  directionFromSwipe,
} from './game/inputPolicy'
import { isLikelyMobile } from './game/platform'
import {
  applyInputDirection,
  failSession,
  initialSessionState,
  restartSession,
  startSession,
} from './game/sessionMachine'
import type { Point } from './game/types'
import './App.css'

const BOARD_COLS = 14
const BOARD_ROWS = 10
const TICK_MS = 180

function App() {
  const [session, setSession] = useState(initialSessionState)
  const [head, setHead] = useState<Point>({ x: 4, y: 4 })
  const [elapsedMs, setElapsedMs] = useState(0)
  const touchStartRef = useRef<Point | null>(null)

  const platform = useMemo(
    () => (isLikelyMobile() ? '모바일/터치' : 'PC/키보드'),
    [],
  )

  useEffect(() => {
    if (session.mode !== 'playing') {
      return undefined
    }

    const interval = window.setInterval(() => {
      setHead((prev) => {
        if (session.direction === 'up') {
          return { ...prev, y: (prev.y - 1 + BOARD_ROWS) % BOARD_ROWS }
        }

        if (session.direction === 'down') {
          return { ...prev, y: (prev.y + 1) % BOARD_ROWS }
        }

        if (session.direction === 'left') {
          return { ...prev, x: (prev.x - 1 + BOARD_COLS) % BOARD_COLS }
        }

        return { ...prev, x: (prev.x + 1) % BOARD_COLS }
      })

      if (session.startedAtMs) {
        setElapsedMs(Date.now() - session.startedAtMs)
      }
    }, TICK_MS)

    return () => window.clearInterval(interval)
  }, [session.direction, session.mode, session.startedAtMs])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (session.mode !== 'playing') {
        return
      }

      const candidate = directionFromKeyboardKey(event.key)

      if (!candidate) {
        return
      }

      event.preventDefault()
      setSession((prev) => applyInputDirection(prev, candidate, 'keyboard'))
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [session.mode])

  const handleStart = () => {
    setHead({ x: 4, y: 4 })
    setElapsedMs(0)
    setSession((prev) => startSession(prev))
  }

  const handleRestart = () => {
    setHead({ x: 4, y: 4 })
    setElapsedMs(0)
    setSession((prev) => restartSession(prev))
  }

  const handleFail = () => {
    setSession((prev) => failSession(prev, 'manual-fail'))
  }

  const handleTouchStart = (x: number, y: number) => {
    touchStartRef.current = { x, y }
  }

  const handleTouchEnd = (x: number, y: number) => {
    if (session.mode !== 'playing' || !touchStartRef.current) {
      return
    }

    const candidate = directionFromSwipe(touchStartRef.current, { x, y })

    if (!candidate) {
      return
    }

    setSession((prev) => applyInputDirection(prev, candidate, 'swipe'))
  }

  return (
    <main className="shell">
      <header className="panel panel--header">
        <p className="eyebrow">BMAD Snake MVP</p>
        <h1>Instant Stage Playground</h1>
        <p className="muted">
          플랫폼: {platform} · 세션 #{session.sessionId || '-'} · 상태:{' '}
          {session.mode}
        </p>
      </header>

      {session.mode === 'idle' && (
        <section className="panel panel--centered">
          <p>준비되면 바로 시작하세요. 1클릭으로 세션이 열립니다.</p>
          <button className="cta" onClick={handleStart}>
            Start Session
          </button>
        </section>
      )}

      {session.mode === 'playing' && (
        <>
          <section className="panel stats">
            <div>
              <span>Direction</span>
              <strong>{session.direction}</strong>
            </div>
            <div>
              <span>Input Source</span>
              <strong>{session.inputSource}</strong>
            </div>
            <div>
              <span>Elapsed</span>
              <strong>{(elapsedMs / 1000).toFixed(1)}s</strong>
            </div>
          </section>

          <Playfield
            cols={BOARD_COLS}
            rows={BOARD_ROWS}
            head={head}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />

          <section className="panel controls">
            <p>
              키보드: Arrow / WASD · 모바일: 스와이프 · 즉시 역방향은
              차단됩니다.
            </p>
            <button className="ghost" onClick={handleFail}>
              Force Fail
            </button>
          </section>
        </>
      )}

      {session.mode === 'failed' && (
        <section className="panel panel--centered">
          <h2>Session Failed</h2>
          <p>실패 후 즉시 재시작으로 다음 플레이를 시작할 수 있습니다.</p>
          <div className="row">
            <button className="cta" onClick={handleRestart}>
              Restart
            </button>
            <button className="ghost" onClick={handleStart}>
              New Session
            </button>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
