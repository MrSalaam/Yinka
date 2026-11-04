"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { afterIntro } from "@/lib/intro-gate"

/* Footer, minimal: a thin bar, and the name set enormous in the palest grey across the bottom, like a watermark.
 * It rises into place once as the footer comes into view. */
export function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    if (!footer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    gsap.registerPlugin(ScrollTrigger)

    return afterIntro(() => {
      const ctx = gsap.context(() => {
        const mark = footer.querySelector("[data-mark]")
        gsap.set(mark, { yPercent: 45, opacity: 0 })
        gsap.to(mark, {
          yPercent: 0,
          opacity: 1,
          duration: 1.3,
          ease: "power4.out",
          scrollTrigger: { trigger: footer, start: "top 85%", once: true },
        })
      }, footer)
      return () => ctx.revert()
    })
  }, [])

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-white px-6 pt-4 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 border-t border-border pt-5 text-sm text-muted-foreground sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Olayinka Salaam</p>
        <p>Website developer, Lagos</p>
        <a href="#home" className="underline decoration-transparent underline-offset-[6px] transition-[color,text-decoration-color] duration-200 hover:text-foreground hover:decoration-foreground">
          Back to top
        </a>
      </div>

      {/* The watermark: sized to the width of the page, set in the palest grey, and cropped by the bottom edge */}
      <div role="img" aria-label="Olayinka Salaam" className="mx-auto mt-10 max-w-[100vw] overflow-hidden pb-[0.06em]">
        <p
          data-mark
          aria-hidden="true"
          className="whitespace-nowrap text-center text-[clamp(3rem,12.4vw,17rem)] font-bold leading-[0.82] tracking-tighter text-[#f0f0ee]"
        >
          Olayinka Salaam
        </p>
      </div>
    </footer>
  )
}
