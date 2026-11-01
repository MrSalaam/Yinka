/**
 * Start-up helpers for the 3D scenes, so the page does not build six WebGL scenes
 * at load. That work happens when it is needed, not during the first paint.
 */

/** Resolves when `el` is within `margin` of the viewport (default: about a screen and a half away). */
export function whenNear(el: Element | null, margin = "150% 0px"): Promise<void> {
  return new Promise((resolve) => {
    if (!el || typeof IntersectionObserver === "undefined") return resolve()
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          resolve()
        }
      },
      { rootMargin: margin },
    )
    io.observe(el)
  })
}

/** Resolves when the browser is idle (or after `timeout` ms at the latest). */
export function whenIdle(timeout = 2500): Promise<void> {
  return new Promise((resolve) => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }
    if (w.requestIdleCallback) w.requestIdleCallback(() => resolve(), { timeout })
    else setTimeout(resolve, Math.min(timeout, 1200))
  })
}
