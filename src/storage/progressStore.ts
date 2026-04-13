export type Progress = {
  stageIndex: number;
  unlockedMap: number;
  clearedMaps: number[];
  totalScore: number;
};

const KEY = 'bmad-snake-progress-v1';

export function loadProgress(): Progress | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    const clearedMaps = Array.isArray(parsed.clearedMaps)
      ? parsed.clearedMaps.filter((value): value is number => typeof value === 'number')
      : [];
    const unlockedMap = typeof parsed.unlockedMap === 'number' ? parsed.unlockedMap : null;

    // Backward compatibility:
    // - current: { stageIndex, unlockedMap, clearedMaps, totalScore }
    // - old v1: { stageIndex, totalScore }
    // - old v2: { unlockedMap, clearedMaps }
    const stageIndex =
      typeof parsed.stageIndex === 'number'
        ? parsed.stageIndex
        : unlockedMap ?? (clearedMaps.length ? Math.max(...clearedMaps) : 0);
    const totalScore = typeof parsed.totalScore === 'number' ? parsed.totalScore : 0;

    return {
      stageIndex,
      unlockedMap: unlockedMap ?? stageIndex,
      clearedMaps,
      totalScore,
    };
  } catch {
    return null;
  }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(KEY, JSON.stringify(progress));
}
