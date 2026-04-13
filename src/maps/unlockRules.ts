export function nextUnlockedMap(currentUnlocked: number, selectedMap: number, maxMaps: number): number {
  if (selectedMap === currentUnlocked && currentUnlocked < maxMaps) {
    return currentUnlocked + 1;
  }
  return currentUnlocked;
}
