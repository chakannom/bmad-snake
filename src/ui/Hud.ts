import type { Status, UiRefs } from '../types/game';

export function syncHud(refs: UiRefs, state: {
  status: Status;
  score: number;
  remainingSec: number;
  selectedMapId: number;
  targetScore: number;
  unlockedMap: number;
  fps: number;
  inputP95: number;
  restartSelfTestPassed: boolean;
}): void {
  refs.statusEl.textContent = state.status;
  refs.scoreEl.textContent = String(state.score);
  refs.timerEl.textContent = String(Math.ceil(state.remainingSec));
  refs.mapEl.textContent = String(state.selectedMapId);
  refs.targetEl.textContent = String(state.targetScore);
  refs.unlockedEl.textContent = String(state.unlockedMap);
  refs.fpsEl.textContent = String(state.fps);
  refs.inputP95El.textContent = String(state.inputP95);
  refs.restartTestEl.textContent = state.restartSelfTestPassed ? 'PASS' : 'FAIL';

  if (state.status === 'idle') refs.overlayHintEl.textContent = `Map ${state.selectedMapId} 시작 준비`;
  if (state.status === 'running') refs.overlayHintEl.textContent = '';
  if (state.status === 'paused') refs.overlayHintEl.textContent = '일시정지';
  if (state.status === 'gameover') refs.overlayHintEl.textContent = '실패 - RESTART 또는 START';
  if (state.status === 'clear') refs.overlayHintEl.textContent = `클리어! ${state.targetScore}점 달성`;
}
