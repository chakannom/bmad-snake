export type Progress = {
  stageIndex: number;
  totalScore: number;
};

const KEY = 'bmad-snake-progress-v1';

export function loadProgress(): Progress | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Progress;
    if (typeof parsed.stageIndex !== 'number' || typeof parsed.totalScore !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(KEY, JSON.stringify(progress));
}
