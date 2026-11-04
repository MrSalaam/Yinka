"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowUpRight01Icon } from "hugeicons-react"
import { afterIntro } from "@/lib/intro-gate"
import { site } from "@/lib/site"

/* Connect, minimal: one question, one big email, a few quiet links. GSAP does one small thing: the two lines of the
 * question rise out of their masks when the section comes into view. */

const EMAIL = "olayinkasalaam.dev@gmail.com"

const LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/in/olayinka-salaam" },
  { label: "GitHub", href: "https://github.com/MrSalaam" },
  { label: "X", href: "https://x.com/yinka_tsx" },
  { label: "CV", href: site.cvUrl },
]

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    gsap.registerPlugin(ScrollTrigger)

    return afterIntro(() => {
      const ctx = gsap.context(() => {
        const lines = gsap.utils.toArray<HTMLElement>("[data-line]", section)
        gsap.set(lines, { yPercent: 105 })
        gsap.to(lines, {
          yPercent: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.12,
          scrollTrigger: { trigger: section, start: "top 55%", once: true },
        })
      }, section)
      return () => ctx.revert()
    })
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked: the email is still a link */
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="relative bg-white px-6 pb-10 pt-28 lg:px-12 lg:pt-40">
      <div className="mx-auto max-w-7xl">
        <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Connect</p>

        <h2 className="text-[clamp(2.4rem,7vw,6.5rem)] font-medium leading-[1.02] tracking-tighter text-foreground">
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-line className="block">
              Have a project
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-line className="block text-muted-foreground">
              in mind?
            </span>
          </span>
        </h2>

        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-5">
          <a
            href={`mailto:${EMAIL}`}
            className="group inline-flex items-center gap-3 text-[clamp(1.1rem,2.6vw,2rem)] font-medium tracking-tight text-foreground underline decoration-foreground/25 underline-offset-[10px] transition-[text-decoration-color] duration-300 hover:decoration-foreground"
          >
            {EMAIL}
            <ArrowUpRight01Icon size={26} className="shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
          <button
            type="button"
            onClick={copy}
            aria-live="polite"
            className="h-10 rounded-full border border-foreground/30 px-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors duration-200 hover:border-foreground"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <ul className="mt-20 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground underline decoration-transparent underline-offset-[6px] transition-[color,text-decoration-color] duration-200 hover:text-foreground hover:decoration-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
