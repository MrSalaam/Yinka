"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight01Icon } from "hugeicons-react"
import { GlossyButton } from "./ui/glossy-button"
import { TextReveal } from "./ui/text-reveal"
import { MagneticEffect } from "./ui/magnetic-effect"
import { FadeIn } from "./ui/fade-in"
import { RotatingText } from "./ui/rotating-text"
import { InfiniteMarquee } from "./wensity/infinite-marquee"
import companyData from "../data/companies.json"

const headline = "text-[8vw] sm:text-6xl lg:text-7xl xl:text-8xl uppercase font-bold tracking-tighter leading-[0.9] bg-gradient-to-br from-gray-800 via-gray-400 to-gray-800 dark:from-gray-600 dark:via-gray-400 dark:to-gray-100 bg-clip-text text-transparent"

// Greetings loop forever, starting close to home
const greetings = [
  { text: "Báwo ni", lang: "YO" },
  { text: "Ndewo", lang: "IG" },
  { text: "Sannu", lang: "HA" },
  { text: "Hola", lang: "ES" },
  { text: "Bonjour", lang: "FR" },
  { text: "こんにちは", lang: "JA" },
  { text: "Hello", lang: "EN" },
]

function GreetingLine({ ready }: { ready: boolean }) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const last = greetings.length - 1

  useEffect(() => {
    if (!ready) return
    if (reduced) {
      setIndex(last)
      return
    }
    // Keep cycling through the list for as long as the page is open
    const id = setInterval(() => setIndex((i) => (i + 1) % greetings.length), 1500)
    return () => clearInterval(id)
  }, [ready, reduced, last])

  const g = greetings[index]

  return (
    <div className="h-7 overflow-hidden" aria-hidden="true">
      <AnimatePresence mode="popLayout" initial={false}>
        {ready && (
          <motion.p
            key={index}
            aria-hidden="true"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 text-lg font-medium tracking-tight text-foreground"
          >
            <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
              {g.lang}
            </span>
            {g.text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// Finishes the sentence "I build ..."; the word rolls through these
const rotating = ["The Whole Thing.", "Fast Interfaces.", "Solid APIs."]

// Repeated so one copy is always wider than the screen and the loop never shows a gap
const names = companyData.companies.map((c) => c.name)
const marqueeItems = [...names, ...names].map((name, i) => (
  <span key={`${name}-${i}`} className="whitespace-nowrap text-sm font-bold uppercase tracking-[0.3em] text-foreground/60 md:text-base">
    {name}
  </span>
))

export function HeroSection({ ready = true }: { ready?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)

  // The blurred blobs and the marquee loop forever; stop them once the hero is off screen
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => el.classList.toggle("is-flying", !entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={rootRef}>
    <div className="relative isolate min-h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_70%_60%_at_20%_30%,rgba(0,0,0,0.05),transparent),radial-gradient(ellipse_60%_55%_at_80%_70%,rgba(0,0,0,0.06),transparent)]">
      <section id="home" className="relative flex min-h-screen flex-col justify-center px-6 pb-28 pt-28 lg:px-12">
        <h1 className="sr-only">Olayinka Salaam, website developer in Lagos, Nigeria. I build the whole thing: fast websites, solid APIs and the database underneath.</h1>
        <div className="mx-auto w-full max-w-7xl">
          {/* Left: positioning */}
          <div className="flex flex-col items-start gap-8">
            <GreetingLine ready={ready} />

            <div>
              <TextReveal text="I Build" textClassName={headline} className="max-w-none" />
              <FadeIn delay={0.3}>
                <div className="-mt-2 text-[8vw] font-bold uppercase leading-[0.9] tracking-tighter text-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
                  {/* Start rolling only once the loading screen is gone */}
                  {ready ? (
                    <RotatingText texts={rotating} duration={2200} />
                  ) : (
                    <span className="invisible">{rotating[0]}</span>
                  )}
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.5}>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                <span className="font-medium text-foreground">I&apos;m Olayinka Salaam, a website developer in Lagos.</span> I build websites and
                web apps, from the interface people touch to the APIs and database behind it, for teams anywhere.
              </p>
            </FadeIn>

            <FadeIn delay={0.7}>
              <div className="flex flex-col items-start gap-6 pt-2 sm:flex-row sm:items-center">
                <a href="#works">
                  <MagneticEffect>
                    <GlossyButton className="flex items-center gap-2">
                      <span>View My Work</span>
                      <ArrowUpRight01Icon size={18} />
                    </GlossyButton>
                  </MagneticEffect>
                </a>
                <a
                  href="#contact"
                  className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  Hire Me <ArrowUpRight01Icon size={14} />
                </a>
              </div>
            </FadeIn>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center border-t border-border">
          <p className="shrink-0 border-r border-border px-6 py-5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground lg:px-12">
            {companyData.heading}
          </p>
          <div className="min-w-0 flex-1 py-5">
            <InfiniteMarquee items={marqueeItems} speed={40} gap="gap-16" />
          </div>
        </div>
      </section>
    </div>
    </div>
  )
}
