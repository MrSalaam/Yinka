"use client"

import { useEffect, useState } from "react"
import { SplittingText } from "./ui/splitting-text"
import { Download04Icon } from "hugeicons-react"
import { InfiniteMarquee } from "./wensity/infinite-marquee"
import companyData from "../data/companies.json"
import { site } from "../lib/site"

/* Minimal hero: one statement, a button, a quiet line of names that drifts sideways.
 * No blobs, no 3D. The only motion is the "Trusted by" line and the button's hover. */

// Repeated so one copy is always wider than its strip and the loop never shows a gap
const names = companyData.companies.map((c) => c.name)
const marqueeItems = [...names, ...names].map((name, i) => (
  <span key={`${name}-${i}`} className="whitespace-nowrap text-sm text-foreground/70">
    {name}
  </span>
))

const linkClass =
  "text-sm font-medium text-foreground underline decoration-foreground/30 underline-offset-[6px] transition-[text-decoration-color] duration-200 hover:decoration-foreground"

export function HeroSection() {
  // The entrance starts once the page is interactive, so it never plays while the browser is busy starting up
  const [go, setGo] = useState(false)
  // Once the entrance has finished the animated markup is swapped for plain text. Any later change to the
  // page structure (the scroll setup wraps sections in new elements) would otherwise replay the entrance.
  const [settled, setSettled] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setGo(true))
    const done = setTimeout(() => setSettled(true), 3300)
    return () => {
      cancelAnimationFrame(id)
      clearTimeout(done)
    }
  }, [])
  const enter = settled ? "" : "hero-in"

  return (
    <div data-go={go ? "" : undefined} className="relative min-h-screen w-full bg-white">
      <section id="home" className="relative flex min-h-screen flex-col justify-between px-6 pb-8 pt-32 lg:px-12">
        <h1 className="sr-only">
          Olayinka Salaam, website developer in Lagos, Nigeria. I build the whole thing: fast websites, solid APIs and the database underneath.
        </h1>

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground" aria-hidden="true">
            hey
          </p>

          <div aria-hidden="true">
            {/* Plain markup, no fade: it is the largest element on the first screen, so it must not wait for JavaScript */}
            <p className="max-w-[20ch] text-[clamp(2.2rem,5.6vw,5rem)] font-medium leading-[1.04] tracking-tighter text-foreground">
              {settled ? (
                "I build websites and web apps, end to end."
              ) : (
                <SplittingText text="I build websites and web apps, end to end." direction="bottom" trigger="view" stagger={18} duration={650} className="[--splitting-text-distance:0.5em]" />
              )}
            </p>

            {/* A correction: "fullstack developer" is crossed out and "web developer" is written over it, slanted */}
            <p style={{ "--d": "1500ms" } as React.CSSProperties} className={`${enter} relative mt-12 inline-block text-[clamp(1.1rem,2.6vw,1.75rem)] tracking-tight text-muted-foreground`}>
              <span className="font-medium text-foreground">
                Olayinka Salaam
              </span>{" "}
              <span className="relative ml-1 inline-block">
                <span className="relative">
                  fullstack developer
                  <span className="absolute left-[-2%] top-[56%] h-[2px] w-[104%] -rotate-[2deg] bg-foreground" />
                </span>
                <span className="absolute -top-[1.7em] left-[14%] -rotate-[7deg] whitespace-nowrap font-mono text-[0.72em] font-bold uppercase tracking-[0.12em] text-foreground">
                  web developer
                </span>
              </span>
            </p>
          </div>

          <div style={{ "--d": "1800ms" } as React.CSSProperties} className={`${enter} flex flex-wrap items-center gap-8`}>
            <a
              href="#works"
              className="group relative isolate inline-flex h-14 items-center overflow-hidden rounded-full border border-foreground bg-white pl-7 pr-2 text-sm font-medium"
            >
              {/* The fill grows out of the arrow disc: a big black circle that scales up from it */}
              <span
                aria-hidden="true"
                className="absolute left-[calc(100%-1.75rem)] top-1/2 z-0 -ml-60 -mt-60 h-[30rem] w-[30rem] scale-0 rounded-full bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-focus-visible:scale-100"
              />
              {/* Label rolls up as the copy underneath takes its place */}
              <span className="relative z-10 block h-5 overflow-hidden text-white mix-blend-difference">
                <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-5 group-focus-visible:-translate-y-5">
                  <span className="block h-5 leading-5">View work</span>
                  <span aria-hidden="true" className="block h-5 leading-5">
                    View work
                  </span>
                </span>
              </span>
              <span className="relative z-10 ml-6 grid h-10 w-10 place-items-center rounded-full border border-white/70 text-white mix-blend-difference">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
            <a href={site.cvUrl} download className={`${linkClass} group/cv inline-flex items-center gap-2`}>
              Download CV
              <Download04Icon size={16} className="transition-transform duration-300 group-hover/cv:translate-y-0.5" />
            </a>
          </div>
        </div>

        <div style={{ "--d": "2100ms" } as React.CSSProperties} className={`${enter} mx-auto flex w-full max-w-7xl items-center border-t border-border pt-5`}>
          <p className="shrink-0 pr-6 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{companyData.heading}</p>
          <div
            className="min-w-0 flex-1 overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)" }}
          >
            <InfiniteMarquee items={marqueeItems} speed={40} gap="gap-12" />
          </div>
        </div>
      </section>
    </div>
  )
}
