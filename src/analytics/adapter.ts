import type { SnakeEvent } from './schema'

export interface AnalyticsAdapter {
  track: (event: SnakeEvent) => void
}

export const eventLog: SnakeEvent[] = []

export function createGa4Adapter(): AnalyticsAdapter {
  return {
    track: (event) => {
      eventLog.push(event)

      if (typeof window === 'undefined' || !window.gtag) {
        return
      }

      window.gtag('event', event.name, event.payload)
    },
  }
}
