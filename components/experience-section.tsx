"use client"

import { useState } from "react"
import experiences from "../data/experience.json"

/* Career, minimal: a directory. The companies are listed as large names; pointing at one (or tabbing to it) dims the
 * others and shows its year, role, place and a line about it in a panel beside the list. The first job is selected
 * to start with. On a phone the details sit under each name instead. No scroll animation, no 3D. */

type Job = { company: string; role: string; period: string; location?: string; description: string }

const JOBS = experiences as Job[]

const place = (s?: string) => (s ? s.toLowerCase().replace(/(^|[\s,])\S/g, (m) => m.toUpperCase()) : "")

export function ExperienceSection() {
  const [active, setActive] = useState(0)
  const job = JOBS[active]

  return (
    <section id="career" className="relative bg-white px-6 py-28 lg:px-12 lg:py-40">
      <h2 className="sr-only">Career and work experience</h2>
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 border-b border-border pb-5">
          <p aria-hidden="true" className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Career
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr] md:gap-16">
          <ol>
            {JOBS.map((j, i) => {
              const on = i === active
              return (
                <li key={`${j.company}-${j.period}`}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className={`group flex w-full items-baseline gap-5 border-b border-border py-5 text-left transition-opacity duration-300 md:py-6 ${on ? "opacity-100" : "opacity-35 hover:opacity-70"}`}
                  >
                    <span
                      className={`text-[clamp(1.6rem,3.6vw,3.25rem)] font-medium leading-[1.05] tracking-tighter text-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? "md:translate-x-2" : ""}`}
                    >
                      {j.company}
                    </span>
                  </button>

                  {/* Phone: the details open under the name that is selected */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-5">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                          {j.period} · {j.role}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{j.description}</p>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>

          {/* Desktop: one panel that follows the selection */}
          <div className="relative hidden md:block">
            <div className="sticky top-32" aria-live="polite">
              <div key={active} className="animate-[career-in_450ms_cubic-bezier(0.22,1,0.36,1)_both]">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{job.period}</p>
                <p className="mt-4 text-2xl font-medium tracking-tight text-foreground">{job.role}</p>
                {job.location && <p className="mt-1 text-sm text-muted-foreground">{place(job.location)}</p>}
                <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-foreground">{job.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes career-in { from { opacity: 0; transform: translateY(8px); } }
        @media (prefers-reduced-motion: reduce) { [class*="career-in"] { animation: none !important; } }`}</style>
    </section>
  )
}
