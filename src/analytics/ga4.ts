declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function ensureGtagInitialized(measurementId: string): void {
  if (!window.dataLayer) {
    window.dataLayer = []
  }

  window.gtag = function gtag(...args: unknown[]): void {
    window.dataLayer.push(args)
  }

  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: true })
}

export function initGa4(measurementId: string | undefined): void {
  if (!measurementId) {
    return
  }

  if (document.querySelector(`script[data-ga4-id="${measurementId}"]`)) {
    return
  }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  script.dataset.ga4Id = measurementId
  document.head.append(script)

  ensureGtagInitialized(measurementId)
}
