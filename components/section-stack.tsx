"use client"

import { Children, useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { traveller } from "@/lib/traveller-store"

/**
 * Section-to-section transition: when you reach the bottom of a panel it pins,
 * then flies out to the top-left while the next panel rises from underneath.
 *
 * `flyOut[i]` says whether panel i should use the transition. Panels that run
 * their own pinned scroll (e.g. the Works deck) should be `false`.
 */
export function SectionStack({
  children,
  flyOut,
  pullUp = [],
}: {
  children: React.ReactNode
  flyOut: boolean[]
  /**
   * `pullUp[i]` slides panel i up under the one before it by one screen.
   * For a panel that flies out from inside its own pin (About): the next
   * panel rises beneath it during that last screen of scrolling.
   */
  pullUp?: boolean[]
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const panels = Children.toArray(children)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const els = gsap.utils.toArray<HTMLElement>(rootRef.current?.children ?? [])

      els.forEach((panel, i) => {
        if (!flyOut[i] || i === els.length - 1) return

        gsap
          .timeline({
            scrollTrigger: {
              trigger: panel,
              // Pin once the bottom of the panel reaches the bottom of the screen
              start: "bottom bottom",
              end: () => `+=${window.innerHeight}`,
              pin: true,
              pinSpacing: false, // the next panel scrolls up underneath instead
              scrub: true,
              invalidateOnRefresh: true,
              // Freeze the panel's own animations (blobs, marquee) once it starts
              // flying out: repainting them every frame is what makes it stutter
              onUpdate: (self) => {
                panel.classList.toggle("is-flying", self.progress > 0)
                if (i === 0) traveller.heroFly = self.progress
              },
            },
          })
          .to(panel, {
            y: () => -window.innerHeight * 1.15,
            rotate: -25,
            scale: 0.94,
            transformOrigin: "0% 100%",
            ease: "none",
            force3D: true,
          })
      })

      // Pins must be ordered top-to-bottom; the Works deck registered its own
      // trigger earlier, so re-sort and recalculate.
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    })

    return () => mm.revert()
  }, [flyOut])

  return (
    <div ref={rootRef}>
      {panels.map((child, i) => (
        // Earlier panels sit above later ones so they can fly off and reveal the next
        <div
          key={i}
          // A panel that the next one rises up under must be see-through, or it hides it
          className={`relative ${pullUp[i + 1] ? "" : "bg-background"} ${flyOut[i] ? "will-change-transform" : ""}`}
          style={{ zIndex: panels.length - i, marginTop: pullUp[i] ? "-100vh" : undefined }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
