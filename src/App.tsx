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
import { createGa4Adapter } from './analytics/adapter'
import { eventLog } from './analytics/adapter'
import { STAGES, getStageById } from './stage/catalog'
import { buildBalanceReport } from './balance/report'
import { applyBalance, listBalancePatches } from './config/balance'
import { readLogs, writeLog } from './diagnostics/logger'
import {
  createDailyChallengeHook,
  createGhostReplayHook,
  createThemeMapHook,
} from './extensions/hooks'
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
  const analytics = useMemo(() => createGa4Adapter(), [])
  const ghostHook = useMemo(() => createGhostReplayHook(), [])
  const challengeHook = useMemo(() => createDailyChallengeHook(), [])
  const themeHook = useMemo(() => createThemeMapHook(), [])
  const [session, setSession] = useState(initialSessionState)
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const [game, setGame] = useState(() =>
    createInitialGame(getStageById(progress.selectedStageId)),
  )
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(true)
  const touchStartRef = useRef<Point | null>(null)

  const selectedStage = challengeHook.applyChallenge(
    applyBalance(getStageById(progress.selectedStageId)),
    new Date().toISOString().slice(0, 10),
  )
  const themeClass = themeHook.getThemeClass(selectedStage.id)
  const report = buildBalanceReport(eventLog)
  const recentLogs = readLogs().slice(-4)
  const ghostFrames = ghostHook.exportReplay().length
  const secondsLeft = Math.max(
    0,
    Math.ceil((game.timeLimitSec * 1000 - game.elapsedMs) / 1000),
  )
  const urgent = secondsLeft <= 7

  const platform = useMemo(
    () => (isLikelyMobile() ? '모바일/터치' : 'PC/키보드'),
    [],
  )
  const platformKey = platform.startsWith('모바일') ? 'mobile' : 'pc'

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
        ghostHook.onTick(next)

        if (next.mode === 'failed') {
          const failResult =
            next.reason === 'timeout' ? 'fail_timeout' : 'fail_collision'
          analytics.track({
            name: 'snake_session_end',
            payload: {
              snake_session_id: session.sessionId,
              snake_stage_id: selectedStage.id,
              snake_result: failResult,
              snake_elapsed_ms: next.elapsedMs,
              snake_platform: platformKey,
            },
          })
          analytics.track({
            name: 'snake_stage_fail',
            payload: {
              snake_session_id: session.sessionId,
              snake_stage_id: selectedStage.id,
              snake_result: failResult,
              snake_elapsed_ms: next.elapsedMs,
              snake_platform: platformKey,
            },
          })
          setSession((current) => ({
            ...current,
            mode: 'failed',
            endedReason: next.reason === 'timeout' ? 'timeout' : 'manual-fail',
          }))
        } else if (next.mode === 'cleared') {
          analytics.track({
            name: 'snake_session_end',
            payload: {
              snake_session_id: session.sessionId,
              snake_stage_id: selectedStage.id,
              snake_result: 'clear',
              snake_elapsed_ms: next.elapsedMs,
              snake_platform: platformKey,
            },
          })
          analytics.track({
            name: 'snake_stage_clear',
            payload: {
              snake_session_id: session.sessionId,
              snake_stage_id: selectedStage.id,
              snake_result: 'clear',
              snake_elapsed_ms: next.elapsedMs,
              snake_platform: platformKey,
            },
          })
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
  }, [
    analytics,
    ghostHook,
    platformKey,
    selectedStage.id,
    session.mode,
    session.sessionId,
  ])

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
    const stage = challengeHook.applyChallenge(
      applyBalance(getStageById(progress.selectedStageId)),
      new Date().toISOString().slice(0, 10),
    )
    const nextSession = startSession(session)
    ghostHook.onSessionStart(stage.id)
    setGame(createInitialGame(stage))
    setSession(nextSession)
    writeLog('info', 'SESSION_START', 'Session started', {
      sessionId: nextSession.sessionId,
      stageId: stage.id,
    })
    analytics.track({
      name: 'snake_session_start',
      payload: {
        snake_session_id: nextSession.sessionId,
        snake_stage_id: stage.id,
        snake_platform: platformKey,
      },
    })
    analytics.track({
      name: 'snake_stage_enter',
      payload: {
        snake_session_id: nextSession.sessionId,
        snake_stage_id: stage.id,
        snake_platform: platformKey,
      },
    })
  }

  const handleRestart = () => {
    const stage = challengeHook.applyChallenge(
      applyBalance(getStageById(progress.selectedStageId)),
      new Date().toISOString().slice(0, 10),
    )
    ghostHook.onSessionStart(stage.id)
    setGame(createInitialGame(stage))
    const nextSession = restartSession(session)
    setSession(nextSession)
    writeLog('info', 'STAGE_RETRY', 'Retry from failure screen', {
      sessionId: nextSession.sessionId,
      stageId: stage.id,
    })
    analytics.track({
      name: 'snake_stage_retry',
      payload: {
        snake_session_id: nextSession.sessionId,
        snake_stage_id: stage.id,
        snake_platform: platformKey,
      },
    })
    analytics.track({
      name: 'snake_session_start',
      payload: {
        snake_session_id: nextSession.sessionId,
        snake_stage_id: stage.id,
        snake_platform: platformKey,
      },
    })
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

  const handleDirectionInput = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (session.mode !== 'playing') {
      return
    }

    setSession((prev) => applyInputDirection(prev, direction, 'swipe'))
    setGame((prev) => updateDirection(prev, direction))
  }

  return (
    <main className={`shell ${themeClass}`}>
      <header className="panel panel--header">
        <p className="eyebrow">BMAD Snake MVP</p>
        <h1>Stage Timer Snake</h1>
        <p className="muted">
          플랫폼: {platform} · 세션 #{session.sessionId || '-'} · 상태:{' '}
          {session.mode}
        </p>
        <p className="muted">Theme: {themeClass} · Ghost Frames: {ghostFrames}</p>
      </header>

      {showPrivacyNotice ? (
        <section className="panel panel--privacy" role="note" aria-live="polite">
          <p>
            Privacy Notice: this MVP stores stage progress locally and logs
            anonymous gameplay events only. No personal identifiers are
            collected.
          </p>
          <button
            className="ghost"
            onClick={() => setShowPrivacyNotice(false)}
            aria-label="Hide privacy notice"
          >
            Dismiss
          </button>
        </section>
      ) : null}

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

          <div className="panel panel--report">
            <h3>Balance Snapshot</h3>
            <p>
              Sessions: {report.totalSessions} · Avg Play Time:{' '}
              {Math.round(report.avgPlayTimeMs / 1000)}s · Clear Rate:{' '}
              {Math.round(report.clearRate * 100)}%
            </p>
            <p>
              Tuned Stages: {Object.keys(listBalancePatches()).join(', ') || '-'}
            </p>
          </div>

          <button className="cta" onClick={handleStart}>
            {session.mode === 'cleared' ? 'Next Run' : 'Start Session'}
          </button>
        </section>
      )}

      {session.mode === 'playing' && (
        <>
          <section
            className={urgent ? 'panel panel--signal panel--signal-urgent' : 'panel panel--signal'}
            aria-live="polite"
          >
            <strong>{urgent ? 'TIME WARNING' : 'RUNNING'}</strong>
            <span>
              {urgent
                ? '⚠ Time is running out. Focus on short safe paths.'
                : '✓ Stage is active. Keep collecting food.'}
            </span>
          </section>

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
              <strong>{secondsLeft}s</strong>
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

          <section className="touch-controls" aria-label="touch controls">
            <button
              className="control-btn up"
              onClick={() => handleDirectionInput('up')}
              aria-label="move up"
            >
              ↑
            </button>
            <button
              className="control-btn left"
              onClick={() => handleDirectionInput('left')}
              aria-label="move left"
            >
              ←
            </button>
            <button
              className="control-btn right"
              onClick={() => handleDirectionInput('right')}
              aria-label="move right"
            >
              →
            </button>
            <button
              className="control-btn down"
              onClick={() => handleDirectionInput('down')}
              aria-label="move down"
            >
              ↓
            </button>
            <button className="control-btn restart" onClick={handleRestart}>
              Restart
            </button>
          </section>

          <section className="panel controls">
            <p>
              키보드: Arrow/WASD · 모바일: 스와이프 · 즉시 역방향 차단 ·
              상태신호: RUNNING / TIME WARNING
            </p>
          </section>

          <section className="panel">
            <h3>Diagnostics</h3>
            {recentLogs.length === 0 ? (
              <p>No logs yet.</p>
            ) : (
              <ul>
                {recentLogs.map((log) => (
                  <li key={`${log.ts}-${log.code}`}>
                    [{log.level}] {log.code} - {log.message}
                  </li>
                ))}
              </ul>
            )}
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
