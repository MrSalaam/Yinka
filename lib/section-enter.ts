import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Each section arrives in its own way as it scrolls up into view: a different clip-path shape per section,
 * scrubbed with the scroll (so it also plays backwards). Clip-path rather than transforms, so the pinned
 * sections (Stack, Career) keep working.
 *   About   a curtain that opens from the middle
 *   Stack   a sheet that wipes up from the bottom
 *   Career  a circle that grows from the bottom centre
 *   Connect a sheet that wipes down from the top
 * (The hero already leaves by tipping away, which is Works' arrival.)
 */
const ENTRANCES: Array<{ id: string; from: string; to: string }> = [
  { id: "about", from: "inset(0% 50% 0% 50%)", to: "inset(0% 0% 0% 0%)" },
  { id: "stack", from: "inset(100% 0% 0% 0%)", to: "inset(0% 0% 0% 0%)" },
  { id: "career", from: "circle(0% at 50% 100%)", to: "circle(150% at 50% 100%)" },
  { id: "contact", from: "inset(0% 0% 100% 0%)", to: "inset(0% 0% 0% 0%)" },
]

export function setupSectionEntrances(): () => void {
  gsap.registerPlugin(ScrollTrigger)
  const ctx = gsap.context(() => {
    ENTRANCES.forEach(({ id, from, to }) => {
      const el = document.getElementById(id)
      if (!el) return
      gsap.fromTo(
        el,
        { clipPath: from },
        {
          clipPath: to,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 100%", end: "top 30%", scrub: true, invalidateOnRefresh: true },
        },
      )
    })
  })
  return () => ctx.revert()
}
