import type { Direction } from '../types/game';

export function bindSwipeInput(canvas: HTMLCanvasElement, applyDirection: (dir: Direction) => void): () => void {
  let touchStartX: number | null = null;
  let touchStartY: number | null = null;
  const SWIPE_THRESHOLD = 20;

  const onTouchStart = (event: TouchEvent): void => {
    if (event.touches.length !== 1) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  };

  const onTouchEnd = (event: TouchEvent): void => {
    if (touchStartX === null || touchStartY === null) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    touchStartX = null;
    touchStartY = null;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (Math.max(absX, absY) < SWIPE_THRESHOLD) return;

    if (absX > absY) {
      applyDirection(dx > 0 ? 'right' : 'left');
      return;
    }
    applyDirection(dy > 0 ? 'down' : 'up');
  };

  canvas.addEventListener('touchstart', onTouchStart, { passive: true });
  canvas.addEventListener('touchend', onTouchEnd, { passive: true });

  return () => {
    canvas.removeEventListener('touchstart', onTouchStart);
    canvas.removeEventListener('touchend', onTouchEnd);
  };
}
