import type { Direction } from '../types/game';

export function bindTouchDirections(root: HTMLElement, onDirection: (dir: Direction) => void): () => void {
  const buttons = root.querySelectorAll<HTMLButtonElement>('[data-dir]');
  const cleanups: Array<() => void> = [];

  for (const btn of buttons) {
    const dir = btn.dataset.dir as Direction;
    const onPress = (ev: Event): void => {
      ev.preventDefault();
      onDirection(dir);
    };

    btn.addEventListener('pointerdown', onPress, { passive: false });
    btn.addEventListener('click', onPress);

    cleanups.push(() => {
      btn.removeEventListener('pointerdown', onPress);
      btn.removeEventListener('click', onPress);
    });
  }

  return () => cleanups.forEach((fn) => fn());
}
