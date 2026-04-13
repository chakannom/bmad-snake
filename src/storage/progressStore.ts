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

    if (typeof parsed.stageIndex !== 'number' || typeof parsed.totalScore !== 'number') return null;

    // Backward compatibility: old shape had only { stageIndex, totalScore }.
    const unlockedMap = typeof parsed.unlockedMap === 'number' ? parsed.unlockedMap : parsed.stageIndex;
    const clearedMaps = Array.isArray(parsed.clearedMaps)
      ? parsed.clearedMaps.filter((value): value is number => typeof value === 'number')
      : [];

    return {
      stageIndex: parsed.stageIndex,
      unlockedMap,
      clearedMaps,
      totalScore: parsed.totalScore,
    };
  } catch {
    return null;
  }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(KEY, JSON.stringify(progress));
}
