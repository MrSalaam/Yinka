/**
 * The typing intro runs on timers, so heavy start-up work (building scroll animations, splitting text)
 * would freeze it for a moment and leave just a blinking cursor on screen. The page opens this gate when the
 * intro is over (or skipped); sections that build scroll animations wait for it.
 */
let open = false
const waiting: Array<() => void> = []

export function openIntroGate() {
  if (open) return
  open = true
  waiting.splice(0).forEach((fn) => fn())
}

/** Runs `setup` once the intro is over and returns a cleanup that is safe to call at any time. */
export function afterIntro(setup: () => (() => void) | void): () => void {
  let disposed = false
  let cleanup: (() => void) | void
  const run = () => {
    if (!disposed) cleanup = setup()
  }
  if (open) run()
  else waiting.push(run)
  return () => {
    disposed = true
    if (cleanup) cleanup()
  }
}
