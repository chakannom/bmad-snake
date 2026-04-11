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
import { STAGES, getStageById } from './stage/catalog'
import {
  canPlayStage,
  loadProgress,
  saveProgress,
  unlockNextStage,
} from './progress/storage'
import type { Point } from './game/types'
import type { ProgressState } from './progress/types'
import './App.css'

const TICK_MS = 180

function App() {
  const [session, setSession] = useState(initialSessionState)
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const [game, setGame] = useState(() =>
    createInitialGame(getStageById(progress.selectedStageId)),
  )
  const touchStartRef = useRef<Point | null>(null)

  const selectedStage = getStageById(progress.selectedStageId)

  const platform = useMemo(
    () => (isLikelyMobile() ? '모바일/터치' : 'PC/키보드'),
    [],
  )

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

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
          setProgress((current) => unlockNextStage(current, selectedStage.id))
        }

        return next
      })
    }, TICK_MS)

    return () => window.clearInterval(interval)
  }, [selectedStage.id, session.mode])

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
    const stage = getStageById(progress.selectedStageId)
    setGame(createInitialGame(stage))
    setSession((prev) => startSession(prev))
  }

  const handleRestart = () => {
    const stage = getStageById(progress.selectedStageId)
    setGame(createInitialGame(stage))
    setSession((prev) => restartSession(prev))
  }

  const handleSelectStage = (stageId: string) => {
    setProgress((prev) => ({ ...prev, selectedStageId: stageId }))
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
          <p>
            {selectedStage.name} · Tier {selectedStage.tier} · Goal{' '}
            {selectedStage.goalFood} · {selectedStage.timeLimitSec}s
          </p>

          <div className="stage-grid">
            {STAGES.map((stage) => {
              const unlocked = canPlayStage(progress, stage.id)
              const selected = stage.id === progress.selectedStageId
              const className = unlocked
                ? selected
                  ? 'stage-button stage-button--selected'
                  : 'stage-button'
                : 'stage-button stage-button--locked'

              return (
                <button
                  key={stage.id}
                  className={className}
                  onClick={() => handleSelectStage(stage.id)}
                  disabled={!unlocked}
                >
                  <span>{stage.name}</span>
                  <small>T{stage.tier}</small>
                </button>
              )
            })}
          </div>

          <button className="cta" onClick={handleStart}>
            {session.mode === 'cleared' ? 'Next Run' : 'Start Session'}
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
              <strong>
                {Math.max(
                  0,
                  Math.ceil((game.timeLimitSec * 1000 - game.elapsedMs) / 1000),
                )}
                s
              </strong>
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
              Retry Stage
            </button>
            <button
              className="ghost"
              onClick={() => setSession((prev) => ({ ...prev, mode: 'idle' }))}
            >
              Stage Select
            </button>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
