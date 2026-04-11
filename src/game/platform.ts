export function isLikelyMobile(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false
  const touchPoints = navigator.maxTouchPoints > 0

  return coarse || touchPoints
}
