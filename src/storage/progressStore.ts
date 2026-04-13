const STORAGE_KEY = 'bmad-snake-progress-v1';

export type ProgressState = {
  unlockedMap: number;
  clearedMaps: number[];
};

export function loadProgress(maxMaps: number): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { unlockedMap: 1, clearedMaps: [] };

    const parsed = JSON.parse(raw) as { unlockedMap?: number; clearedMaps?: number[] };
    const unlocked = Math.min(maxMaps, Math.max(1, parsed.unlockedMap ?? 1));
    const clearedMaps = Array.isArray(parsed.clearedMaps)
      ? parsed.clearedMaps.filter((v) => Number.isInteger(v) && v >= 1 && v <= maxMaps)
      : [];

    return { unlockedMap: unlocked, clearedMaps };
  } catch {
    return { unlockedMap: 1, clearedMaps: [] };
  }
}

export function saveProgress(progress: ProgressState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
