import type { UiRefs } from '../types/game';

export function createAppShell(root: HTMLElement): UiRefs {
  root.innerHTML = `
    <main class="app-shell">
      <header class="topbar">
        <div class="title-wrap">
          <h1>BMAD Snake</h1>
          <p>Canvas 2D / Mobile + PC</p>
        </div>
        <div class="meta">
          <div class="chip">상태 <strong id="status">idle</strong></div>
          <div class="chip">점수 <strong id="score">0</strong></div>
          <div class="chip">남은시간 <strong id="timer">0</strong>s</div>
          <div class="chip">맵 <strong id="map">1</strong></div>
          <div class="chip">목표 <strong id="target">0</strong></div>
          <div class="chip">해금 <strong id="unlocked">1</strong>/20</div>
          <div class="chip">FPS <strong id="fps">0</strong></div>
          <div class="chip">입력 p95 <strong id="input-p95">0</strong>ms</div>
          <div class="chip">재시작검증 <strong id="restart-test">-</strong></div>
        </div>
      </header>

      <section class="board-wrap">
        <canvas id="game-canvas" aria-label="Snake game board"></canvas>
        <div class="overlay-hint" id="overlay-hint">START로 시작하세요</div>
      </section>

      <section class="panel">
        <div class="map-row">
          <button id="prev-map" class="btn ghost">◀ MAP</button>
          <button id="start-btn" class="btn">START</button>
          <button id="pause-btn" class="btn ghost">PAUSE</button>
          <button id="next-map" class="btn ghost">MAP ▶</button>
        </div>

        <div class="settings-row">
          <label><input id="setting-sound" type="checkbox" /> Sound</label>
          <label><input id="setting-haptic" type="checkbox" /> Haptic</label>
          <label>
            Touch Size
            <select id="setting-touch-size">
              <option value="md">M</option>
              <option value="lg">L</option>
            </select>
          </label>
        </div>

        <div class="control-row">
          <div class="dpad" aria-label="direction controls">
            <button class="btn dir up" data-dir="up" aria-label="위">▲</button>
            <button class="btn dir left" data-dir="left" aria-label="왼쪽">◀</button>
            <button class="btn dir down" data-dir="down" aria-label="아래">▼</button>
            <button class="btn dir right" data-dir="right" aria-label="오른쪽">▶</button>
          </div>
          <div class="side-actions">
            <button id="restart-btn" class="btn danger" aria-label="재시작">RESTART</button>
          </div>
        </div>
      </section>
    </main>
  `;

  return {
    canvas: root.querySelector<HTMLCanvasElement>('#game-canvas')!,
    statusEl: root.querySelector('#status')!,
    scoreEl: root.querySelector('#score')!,
    timerEl: root.querySelector('#timer')!,
    mapEl: root.querySelector('#map')!,
    targetEl: root.querySelector('#target')!,
    unlockedEl: root.querySelector('#unlocked')!,
    fpsEl: root.querySelector('#fps')!,
    inputP95El: root.querySelector('#input-p95')!,
    restartTestEl: root.querySelector('#restart-test')!,
    overlayHintEl: root.querySelector('#overlay-hint')!,
  };
}
