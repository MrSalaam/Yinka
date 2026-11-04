"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { afterIntro } from "@/lib/intro-gate"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { traveller } from "@/lib/traveller-store"
import { SplitText } from "gsap/SplitText"
import { TextReveal } from "./ui/text-reveal"

/* ────────────────────────────────────────────────────────────────────────────
 * Stack: a pinned horizontal scroll. Scrolling down slides the track sideways
 * through one full-screen panel per group. On arrival each panel plays a text
 * sequence: the name wipes in, a rule draws, and the tools reveal letter by
 * letter. Panels fade as they leave, and the intro blurs in word by word.
 * ──────────────────────────────────────────────────────────────────────────── */

type Group = { name: string; tools: string[] }

const GROUPS: Group[] = [
  { name: "Languages", tools: ["TypeScript", "JavaScript", "Node.js", "SQL"] },
  {
    name: "Frontend",
    tools: [
      "Next.js",
      "React",
      "Framer Motion",
      "GSAP",
      "Three.js",
      "Lenis",
      "TanStack Query",
      "Zustand",
      "React Hook Form",
      "Zod",
      "Radix UI",
      "Recharts",
    ],
  },
  { name: "Styling", tools: ["Tailwind CSS", "Chakra UI", "shadcn/ui", "CSS Modules", "Styled Components"] },
  {
    name: "Backend & APIs",
    tools: ["REST APIs", "GraphQL", "Express.js", "Prisma", "Drizzle ORM", "Supabase", "Firebase", "PostgreSQL", "tRPC"],
  },
  { name: "Infrastructure", tools: ["Git", "GitHub Actions", "Vercel", "Docker", "Turborepo", "pnpm", "Webpack", "Vite"] },
  { name: "Design & Collaboration", tools: ["Figma", "Storybook", "Notion", "Linear", "Jira"] },
]

const longestWord = (s: string) => Math.max(...s.split(" ").map((w) => w.length))


function GroupPanel({ group, animated }: { group: Group; animated: boolean }) {
  // Long lists run in two columns, at a slightly smaller size, so they fit the screen
  const twoColumns = group.tools.length > 9

  return (
    <div
      data-panel
      className={`flex shrink-0 flex-col justify-end gap-5 px-6 pb-24 pt-24 md:flex-row md:items-center md:justify-center md:gap-16 md:px-16 md:pb-0 md:pt-0 lg:px-24 ${
        animated ? "h-[100svh] w-screen" : "min-h-[70vh] w-full border-t border-border py-20"
      }`}
    >
      {/* Giant group name */}
      <div className="md:w-[46%]">
        <h3
          data-name
          // Size from the longest word so it always fits its column (clipped gradient text can't overflow)
          style={{ fontSize: `clamp(2.25rem, min(8vw, ${(56 / longestWord(group.name)).toFixed(2)}vw), 8rem)` }}
          className="bg-gradient-to-br from-gray-800 via-gray-400 to-gray-800 bg-clip-text font-bold uppercase leading-[0.88] tracking-tighter text-transparent dark:from-gray-600 dark:via-gray-400 dark:to-gray-100"
        >
          {group.name}
        </h3>
        <div data-rule className="mt-6 h-px w-28 origin-left bg-foreground/40" />
      </div>

      {/* Tools */}
      <ul
        className={`group/list flex-none gap-x-8 md:flex-1 md:gap-x-10 ${
          twoColumns ? "columns-2" : group.tools.length > 5 ? "columns-2 md:columns-1 md:flex md:flex-col md:gap-1" : "flex flex-col gap-1"
        }`}
      >
        {group.tools.map((tool) => (
          <li key={tool} className="break-inside-avoid overflow-hidden py-[1px] md:py-[2px]">
            <span
              data-tool
              className={`block cursor-default text-[clamp(1.05rem,4.8vw,1.5rem)] font-bold leading-[1.15] tracking-tighter transition-[opacity,transform] duration-150 group-hover/list:opacity-30 hover:!opacity-100 hover:translate-x-2 ${
                twoColumns ? "md:text-[clamp(1.25rem,2.5vw,2.4rem)]" : "md:text-[clamp(1.4rem,3.2vw,3rem)]"
              }`}
            >
              {tool}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function StackSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    if (reduced || !sectionRef.current || !trackRef.current) return
    gsap.registerPlugin(ScrollTrigger, SplitText)
    const section = sectionRef.current
    const track = trackRef.current

    return afterIntro(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", track)
      const bar = section.querySelector<HTMLElement>("[data-progress]")
      const travel = () => track.scrollWidth - window.innerWidth

      // Everything per panel (name drift, fade-out, the text arriving) is worked out from the slide's
      // progress in this one function, so the section needs two scroll triggers, not twenty.
      let apply: (progress: number) => void = () => {}

      // The pinned sideways slide
      gsap.to(track, {
        x: () => -travel(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(travel() * 0.45, window.innerHeight * 4.2)}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            traveller.stackP = self.progress
            if (bar) bar.style.transform = `scaleX(${self.progress})`
            apply(self.progress)
          },
          onRefresh: (self) => apply(self.progress),
        },
      })

      // Intro: the sentence blurs in word by word, the arrow nudges forward
      const introText = section.querySelector<HTMLElement>("[data-intro-text]")
      if (introText) {
        const words = SplitText.create(introText, { type: "words", aria: "none" })
        gsap.from(words.words, {
          autoAlpha: 0,
          y: 24,
          filter: "blur(10px)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: { trigger: section, start: "top 60%", once: true },
        })
      }
      const arrow = section.querySelector<HTMLElement>("[data-arrow]")
      if (arrow) gsap.to(arrow, { x: 10, duration: 0.8, repeat: -1, yoyo: true, ease: "sine.inOut" })

      const groups = panels.slice(1).map((panel) => {
        const name = panel.querySelector("[data-name]")
        const rule = panel.querySelector("[data-rule]")
        const tools = gsap.utils.toArray<HTMLElement>("[data-tool]", panel)

        // On arrival: the text sequence (played and reversed by apply, below).
        // It is built the first time the panel is reached, so the page does not split
        // every tool name into letters at load.
        let arrive: gsap.core.Timeline | null = null
        const build = () => {
          const toolSplits = tools.map((t) => SplitText.create(t, { type: "chars", aria: "none" }))
          const tl = gsap.timeline({ paused: true })
          tl.fromTo(
            name,
            { clipPath: "inset(0 0 100% 0)", yPercent: 30, skewY: 6 },
            { clipPath: "inset(0 0 0% 0)", yPercent: 0, skewY: 0, duration: 0.9, ease: "power4.out" },
            0.05,
          ).fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.inOut" }, 0.3)
          toolSplits.forEach((split, i) => {
            tl.from(split.chars, { yPercent: 115, rotate: 6, duration: 0.6, ease: "power3.out", stagger: 0.02 }, 0.3 + i * 0.06)
          })
          return tl
        }
        // Hidden until it plays, so nothing flashes before the sequence is built
        gsap.set([name, rule], { autoAlpha: 0 })

        return {
          play: () => {
            if (!arrive) {
              gsap.set([name, rule], { autoAlpha: 1 })
              arrive = build()
            }
            arrive.play()
          },
          reverse: () => arrive?.reverse(),
          arrived: false,
          setNameX: gsap.quickSetter(name as Element, "x", "px") as (v: number) => void,
          setOpacity: gsap.quickSetter(panel, "opacity") as (v: number) => void,
        }
      })

      apply = (progress: number) => {
        const vw = window.innerWidth
        const x = -progress * travel() // the track's position (the slide has a linear ease)
        groups.forEach((g, i) => {
          const left = (i + 1) * vw + x // this panel's left edge, in the viewport
          // The name drifts at its own speed against the slide
          g.setNameX(160 - 320 * Math.min(1, Math.max(0, (vw - left) / (2 * vw))))
          // The whole panel fades as it leaves
          g.setOpacity(1 - 0.9 * Math.min(1, Math.max(0, -left / vw)))
          // The text writes itself in as the panel arrives, and reverses if you scroll back
          const arrived = left < 0.7 * vw
          if (arrived !== g.arrived) {
            g.arrived = arrived
            if (arrived) g.play()
            else g.reverse()
          }
        })
      }
      apply(0)
    }, section)

    return () => ctx.revert()
    })
  }, [reduced])

  /* Reduced motion: no pin, no sideways slide. Panels simply stack. */
  if (reduced) {
    return (
      <section id="stack" className="border-t border-border">
        <div className="px-6 pb-4 pt-24 md:px-16 lg:px-24">
          <h2 className="text-[15vw] font-bold uppercase leading-[0.8] tracking-tighter md:text-[12rem]">Stack.</h2>
        </div>
        {GROUPS.map((g) => (
          <GroupPanel key={g.name} group={g} animated={false} />
        ))}
      </section>
    )
  }

  return (
    <section id="stack" ref={sectionRef} className="relative h-screen w-full overflow-hidden border-t border-border">
      <h2 className="sr-only">Tech stack: the languages, frameworks and tools I use</h2>
      <div ref={trackRef} className="relative z-10 flex h-full w-max will-change-transform">
        {/* Intro panel */}
        <div data-panel className="flex h-screen w-screen shrink-0 flex-col justify-center px-6 md:px-16 lg:px-24">
          <TextReveal
            text="STACK."
            className="pb-6"
            textClassName="text-[22vw] md:text-[16rem] font-bold uppercase tracking-tighter leading-[0.8] bg-gradient-to-br from-gray-800 via-gray-400 to-gray-800 dark:from-gray-600 dark:via-gray-400 dark:to-gray-100 bg-clip-text text-transparent pb-4"
          />
          <p data-intro-text className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Everything I reach for, group by group. Keep scrolling, it moves sideways.
          </p>
          <p className="mt-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Scroll <span data-arrow>→</span>
          </p>
        </div>

        {GROUPS.map((g) => (
          <GroupPanel key={g.name} group={g} animated />
        ))}
      </div>

      {/* Counter + progress */}
      <div className="pointer-events-none absolute inset-x-6 bottom-8 flex items-center gap-4 md:inset-x-16 lg:inset-x-24">
        <div className="h-px flex-1 bg-border">
          <div data-progress className="h-full origin-left bg-foreground" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  )
}
