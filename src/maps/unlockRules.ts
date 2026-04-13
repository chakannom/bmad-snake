export function nextStageIndex(currentIndex: number, totalStages: number): number | null {
  if (currentIndex >= totalStages - 1) return null;
  return currentIndex + 1;
}
