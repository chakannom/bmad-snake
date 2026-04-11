import { useEffect, useMemo, useRef, useState } from 'react'
import { Playfield } from './components/Playfield'
import {
  directionFromKeyboardKey,
  directionFromSwipe,
} from './game/inputPolicy'
import { isLikelyMobile } from './game/platform'
import {
  applyInputDirection,
  initialSessionState,
  restartSession,
  startSession,
} from './game/sessionMachine'
import { createInitialGame, tick, updateDirection } from './game/engine'
import type { Point, StageDefinition } from './game/types'
import './App.css'

const TICK_MS = 180

const DEMO_STAGE: StageDefinition = {
  id: 'stage-01',
  name: 'Stage 01',
  tier: 1,
  width: 14,
  height: 10,
  timeLimitSec: 30,
  goalFood: 5,
}

function App() {
  const [session, setSession] = useState(initialSessionState)
  const [game, setGame] = useState(() => createInitialGame(DEMO_STAGE))
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
      setGame((prev) => {
        const next = tick(prev, TICK_MS)

        if (next.mode === 'failed') {
          setSession((current) => ({
            ...current,
            mode: 'failed',
            endedReason: next.reason === 'timeout' ? 'timeout' : 'manual-fail',
          }))
        } else if (next.mode === 'cleared') {
          setSession((current) => ({
            ...current,
            mode: 'cleared',
            endedReason: 'none',
          }))
        }

        return next
      })
    }, TICK_MS)

    return () => window.clearInterval(interval)
  }, [session.mode])

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
      setGame((prev) => updateDirection(prev, candidate))
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [session.mode])

  const handleStart = () => {
    setGame(createInitialGame(DEMO_STAGE))
    setSession((prev) => startSession(prev))
  }

  const handleRestart = () => {
    setGame(createInitialGame(DEMO_STAGE))
    setSession((prev) => restartSession(prev))
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
    setGame((prev) => updateDirection(prev, candidate))
  }

  return (
    <main className="shell">
      <header className="panel panel--header">
        <p className="eyebrow">BMAD Snake MVP</p>
        <h1>Stage Timer Snake</h1>
        <p className="muted">
          플랫폼: {platform} · 세션 #{session.sessionId || '-'} · 상태:{' '}
          {session.mode}
        </p>
      </header>

      {(session.mode === 'idle' || session.mode === 'cleared') && (
        <section className="panel panel--centered">
          {session.mode === 'cleared' ? <h2>Stage Cleared</h2> : null}
          <p>{DEMO_STAGE.name} · Goal {DEMO_STAGE.goalFood} · {DEMO_STAGE.timeLimitSec}s</p>
          <button className="cta" onClick={handleStart}>
            {session.mode === 'cleared' ? 'Play Again' : 'Start Session'}
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
              <span>Food</span>
              <strong>
                {game.foodEaten}/{game.goalFood}
              </strong>
            </div>
            <div>
              <span>Time Left</span>
              <strong>{Math.max(0, Math.ceil((game.timeLimitSec * 1000 - game.elapsedMs) / 1000))}s</strong>
            </div>
          </section>

          <Playfield
            cols={game.cols}
            rows={game.rows}
            snake={game.snake}
            food={game.food}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />

          <section className="panel controls">
            <p>키보드: Arrow/WASD · 모바일: 스와이프 · 즉시 역방향 차단</p>
          </section>
        </>
      )}

      {session.mode === 'failed' && (
        <section className="panel panel--centered">
          <h2>{game.reason === 'timeout' ? 'Time Over' : 'Collision Fail'}</h2>
          <p>실패 후 즉시 재시작할 수 있습니다.</p>
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
