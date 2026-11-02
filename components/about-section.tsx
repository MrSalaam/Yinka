"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { traveller } from "@/lib/traveller-store"

/* ────────────────────────────────────────────────────────────────────────────
 * About: one long sentence that reads itself as you scroll.
 *
 * The section is pinned and the paragraph starts ghosted. Scrolling "inks" it in
 * word by word, and small stickers pop onto the line at the moments they matter.
 * Underneath, a row of facts counts up with the reading. The last stretch tips the
 * whole section away into Stack, as before. Plain GSAP and DOM, nothing heavy.
 * ──────────────────────────────────────────────────────────────────────────── */

type Token = { w: string; chip?: string; strong?: boolean }

// "chip" tokens render a sticker after the word
const TOKENS: Token[] = [
  { w: "I'm", strong: true },
  { w: "Olayinka", strong: true },
  { w: "Salaam,", strong: true },
  { w: "a", strong: true },
  { w: "website", strong: true },
  { w: "developer", strong: true },
  { w: "in", strong: true },
  { w: "Lagos.", chip: "Lagos, NG", strong: true },
  { w: "I" },
  { w: "build" },
  { w: "the" },
  { w: "whole" },
  { w: "thing:" },
  { w: "the" },
  { w: "interface" },
  { w: "people" },
  { w: "touch,", chip: "Next.js" },
  { w: "the" },
  { w: "APIs" },
  { w: "that" },
  { w: "hold" },
  { w: "up,", chip: "Node.js" },
  { w: "and" },
  { w: "the" },
  { w: "database" },
  { w: "underneath.", chip: "PostgreSQL" },
  { w: "I've" },
  { w: "shipped" },
  { w: "for" },
  { w: "real" },
  { w: "estate,", chip: "Real estate" },
  { w: "edtech" },
  { w: "and" },
  { w: "e-commerce" },
  { w: "startups,", chip: "Edtech" },
  { w: "from" },
  { w: "the" },
  { w: "first" },
  { w: "wireframe" },
  { w: "to" },
  { w: "production,", chip: "Shipped" },
  { w: "with" },
  { w: "teams" },
  { w: "anywhere." },
  { w: "Let's", strong: true },
  { w: "make", strong: true },
  { w: "something.", strong: true, chip: "Say hi" },
]

const FACTS = [
  { label: "Based in", value: "Lagos, Nigeria" },
  { label: "Builds", value: "Web apps & APIs" },
  { label: "Works with", value: "Teams anywhere" },
]

// Timeline: the paragraph inks in, a short rest, then the section tips away into Stack
const READ = 6
const REST = 0.8
const STORY = READ + REST
const PER_SCREEN = 0.45 // timeline units per screen of scrolling (the same for story and fly-out)
const FLIGHT = 1 / PER_SCREEN // the fly-out is exactly one screen of scrolling
const TOTAL = STORY + FLIGHT

function Paragraph() {
  return (
    <p className="max-w-[1100px] text-[clamp(1.35rem,4.6vw,3.3rem)] font-bold leading-[1.12] tracking-tighter">
      {TOKENS.map((t, i) => (
        <span key={i}>
          <span data-w data-strong={t.strong ? "" : undefined} className="inline-block text-foreground">
            {t.w}
          </span>
          {t.chip && (
            <span
              data-chip
              aria-hidden="true"
              className="mx-[0.25em] inline-block -translate-y-[0.12em] rounded-full border border-foreground bg-white px-[0.5em] py-[0.08em] align-middle font-mono text-[0.2em] font-medium uppercase tracking-[0.18em] text-foreground"
            >
              {t.chip}
            </span>
          )}{" "}
        </span>
      ))}
    </p>
  )
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    if (reduced || !sectionRef.current) return
    gsap.registerPlugin(ScrollTrigger)
    const section = sectionRef.current

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-w]", section)
      const chips = gsap.utils.toArray<HTMLElement>("[data-chip]", section)
      const facts = gsap.utils.toArray<HTMLElement>("[data-fact]", section)
      const bar = section.querySelector<HTMLElement>("[data-progress]")
      const count = section.querySelector<HTMLElement>("[data-count]")
      const per = READ / words.length

      // Everything starts ghosted
      gsap.set(words, { opacity: 0.12 })
      gsap.set(chips, { scale: 0, rotate: -12, opacity: 0 })
      gsap.set(facts, { y: 24, opacity: 0 })

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${TOTAL * PER_SCREEN * window.innerHeight}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            traveller.aboutP = self.progress
            const read = Math.min(1, (self.progress * TOTAL) / READ)
            if (bar) bar.style.transform = `scaleX(${read})`
            if (count) count.textContent = String(Math.round(read * 100)).padStart(3, "0")
          },
        },
      })

      // Each word inks in on its turn; the word just read is a touch lifted
      words.forEach((w, i) => {
        tl.to(w, { opacity: 1, duration: per * 2.2 }, i * per)
      })
      // Stickers pop on right after the word they belong to
      TOKENS.forEach((t, i) => {
        if (!t.chip) return
        const chip = words[i].nextElementSibling as HTMLElement | null
        if (chip) tl.to(chip, { scale: 1, rotate: (i % 2 ? 1 : -1) * 3, opacity: 1, duration: 0.35, ease: "back.out(2.4)" }, i * per + per)
      })
      // The facts rise in as the reading passes the middle
      tl.to(facts, { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }, READ * 0.55)

      // The last screen of scrolling: the whole section tips away to the top-left,
      // and Stack (pulled up one screen in SectionStack) rises underneath as it goes.
      tl.to(section, { y: () => -window.innerHeight * 1.15, rotate: -25, scale: 0.94, transformOrigin: "0% 100%", ease: "none", duration: FLIGHT }, STORY)
    }, section)

    return () => ctx.revert()
  }, [reduced])

  /* Reduced motion: no pin, no ink-in. The same paragraph, fully visible. */
  if (reduced) {
    return (
      <section id="about" className="bg-[#ecebe7] px-6 py-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">About</h2>
          <p className="max-w-4xl text-[clamp(1.6rem,4vw,3.2rem)] font-bold leading-[1.1] tracking-tighter">
            {TOKENS.map((t) => t.w).join(" ")}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="about" ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden bg-[#ecebe7]">
      <h2 className="sr-only">About Olayinka Salaam</h2>

      <div className="absolute inset-0 flex flex-col justify-center px-6 pb-40 pt-28 md:px-16 md:pb-36 lg:px-24">
        <div className="mx-auto w-full max-w-[1400px]">
          <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-px w-10 bg-foreground/40" />
            About
          </p>
          <Paragraph />
        </div>
      </div>

      {/* Facts, rising in as the reading goes on */}
      <div className="pointer-events-none absolute inset-x-6 bottom-20 md:inset-x-16 lg:inset-x-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-3 border-t border-foreground/15 pt-5 sm:grid-cols-3">
          {FACTS.map((f) => (
            <div key={f.label} data-fact>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{f.label}</p>
              <p className="mt-1 text-base font-bold tracking-tight md:text-xl">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reading progress */}
      <div className="pointer-events-none absolute inset-x-6 bottom-8 flex items-center gap-4 md:inset-x-16 lg:inset-x-24">
        <div className="h-px flex-1 bg-foreground/15">
          <div data-progress className="h-full origin-left bg-foreground" style={{ transform: "scaleX(0)" }} />
        </div>
        <span data-count className="font-mono text-[11px] tabular-nums text-muted-foreground" aria-hidden="true">
          000
        </span>
      </div>
    </section>
  )
}
