/**
 * Scroll progress reported by each section, read by the shared 3D layer
 * (components/traveller-canvas.tsx) to decide where the chrome drop is and
 * what it looks like. Plain mutable object: it is written from ScrollTrigger
 * callbacks and read once per frame, so it must not cause React renders.
 */
export const traveller = {
  /** 0 until the loading screen is gone, then 1 */
  ready: 0,
  /** Hero flying out into Works, 0..1 */
  heroFly: 0,
  /** About's whole pinned sequence, 0..1 (the last stretch is its fly-out into Stack) */
  aboutP: 0,
  /** Stack's sideways slide, 0..1 */
  stackP: 0,
  /** Career rising into view after Stack, 0..1 */
  careerIn: 0,
}
