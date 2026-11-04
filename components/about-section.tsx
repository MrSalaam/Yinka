"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { afterIntro } from "@/lib/intro-gate"


const PARAGRAPH =
  "I'm Olayinka Salaam, a website developer in Lagos. I build the whole thing: the interface people touch, the APIs that hold up, and the database underneath. I've shipped for real estate, edtech and e-commerce startups, from the first wireframe to production, with teams anywhere."

const FACTS = [
  { label: "Based in", value: "Lagos, Nigeria" },
  { label: "Builds", value: "Web apps and APIs" },
  { label: "Works with", value: "Teams anywhere" },
]

/** Your photo: save it as public/about.jpg. Until the file exists nothing is shown. */
function Portrait() {
  const [missing, setMissing] = useState(false)
  const ref = useRef<HTMLImageElement>(null)
  // The browser may have failed the request before React attached onError, so check once on mount
  useEffect(() => {
    const img = ref.current
    if (img && img.complete && img.naturalWidth === 0) setMissing(true)
  }, [])
  if (missing) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src="/about.jpg"
      alt="Olayinka Salaam"
      loading="lazy"
      decoding="async"
      onError={() => setMissing(true)}
      className="mt-8 hidden aspect-[4/5] w-full max-w-[12rem] rounded-2xl bg-[#f1f1ef] object-cover md:block"
    />
  )
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    gsap.registerPlugin(ScrollTrigger)

    return afterIntro(() => {
      const ctx = gsap.context(() => {
        const words = gsap.utils.toArray<HTMLElement>("[data-w]", section)
        const text = section.querySelector("[data-text]")
        gsap.set(words, { opacity: 0.18 })
        // One scrubbed tween across all words: they ink in as the paragraph climbs from the bottom to the middle of the screen
        gsap.to(words, {
          opacity: 1,
          ease: "none",
          stagger: 0.5,
          scrollTrigger: { trigger: text, start: "top 85%", end: "bottom 55%", scrub: true },
        })
      }, section)
      return () => ctx.revert()
    })
  }, [])

  return (
    <section id="about" ref={sectionRef} className="relative bg-white px-6 py-28 lg:px-12 lg:py-40">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[12rem_1fr] md:gap-16">
        <div>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground md:pt-3">About</h2>
          <Portrait />
        </div>

        <div>
          <p data-text className="max-w-[34ch] text-[clamp(1.6rem,3.6vw,3.25rem)] font-medium leading-[1.14] tracking-tighter text-foreground sm:max-w-[40ch]">
            {PARAGRAPH.split(" ").map((w, i) => (
              <span key={i}>
                <span data-w>{w}</span>{" "}
              </span>
            ))}
          </p>

          <dl className="mt-16 grid gap-6 border-t border-border pt-6 sm:grid-cols-3">
            {FACTS.map((f) => (
              <div key={f.label}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{f.label}</dt>
                <dd className="mt-1 text-base font-medium tracking-tight text-foreground md:text-lg">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
