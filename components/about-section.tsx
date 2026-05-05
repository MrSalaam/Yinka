"use client"
import { ArrowUpRight01Icon } from "hugeicons-react"
import { TextReveal } from "./ui/text-reveal"
import { MagneticEffect } from "./ui/magnetic-effect"
import { FadeIn } from "./ui/fade-in"

export function AboutSection() {
  return (
    <section className="min-h-screen py-24 md:py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-32">
          <TextReveal 
            text="ABOUT." 
            className="pb-8"
            textClassName="text-[15vw] md:text-[12rem] font-bold uppercase tracking-tighter leading-[0.8] bg-gradient-to-br from-gray-800 via-gray-400 to-gray-800 dark:from-gray-600 dark:via-gray-400 dark:to-gray-100 bg-clip-text text-transparent pb-4"
          />
          <div className="h-px w-full bg-border" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          <FadeIn className="lg:col-span-8">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-12">
              Building digital products that balance <span className="text-muted-foreground italic font-serif">aesthetic rigor</span> with technical excellence.
            </h2>
            
            <div className="flex flex-col gap-8 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              <p>
                I am Olayinka Salaam, a Senior Frontend Architect specializing in the construction of pristine user interfaces and high-performance web systems. My approach is rooted in the belief that software should be as beautiful on the inside as it is on the outside.
              </p>
              <p>
                With a deep focus on the React ecosystem, I have collaborated with forward-thinking startups and established organizations to engineer accessible, performant, and enduring digital experiences.
              </p>
            </div>
          </FadeIn>

          <div className="lg:col-span-4 flex flex-col gap-16">
            <FadeIn delay={0.2} className="space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground border-b border-border pb-4">
                Specialization
              </h3>
              <ul className="flex flex-col gap-3 font-mono text-xs uppercase tracking-widest text-foreground">
                <li>System Architecture</li>
                <li>Frontend Engineering</li>
                <li>Interface Design</li>
                <li>Design Systems</li>
              </ul>
            </FadeIn>

            <FadeIn delay={0.3} className="space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground border-b border-border pb-4">
                Technical Stack
              </h3>
              <ul className="flex flex-col gap-3 font-mono text-xs uppercase tracking-widest text-foreground">
                <li>TypeScript / JavaScript</li>
                <li>Next.js / React</li>
                <li>Tailwind CSS</li>
                <li>Framer Motion</li>
                <li>TanStack Query</li>
                <li>shadcn/ui</li>
                <li>Chakra UI</li>
              </ul>
            </FadeIn>

           
          </div>
        </div>

        <div className="mt-48 flex flex-col md:flex-row items-center justify-between gap-12 pt-12 border-t border-border">
          <a
            href="/projects"
            className="inline-flex items-center gap-4 text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-foreground transition-all duration-300 group"
          >
            <span className="w-8 h-px bg-muted-foreground group-hover:w-12 group-hover:bg-foreground transition-all duration-300" />
            Back to Exhibition
          </a>
          <a href="/experience">
            <MagneticEffect>
              <button className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300">
                <div className="flex items-center gap-2">
                  <span>View My Experience</span>
                  <ArrowUpRight01Icon size={16} />
                </div>
              </button>
            </MagneticEffect>
          </a>
        </div>
      </div>
    </section>
  )
}
