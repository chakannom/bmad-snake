import type { Direction } from '../types/game';

export function bindKeyboard(onDirection: (dir: Direction) => void, onRestart: () => void, onTogglePause: () => void): () => void {
  const onKeyDown = (ev: KeyboardEvent): void => {
    if (ev.key === 'ArrowUp') onDirection('up');
    if (ev.key === 'ArrowDown') onDirection('down');
    if (ev.key === 'ArrowLeft') onDirection('left');
    if (ev.key === 'ArrowRight') onDirection('right');
    if (ev.key.toLowerCase() === 'r') onRestart();
    if (ev.key === ' ') {
      ev.preventDefault();
      onTogglePause();
    }
  };

  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}
