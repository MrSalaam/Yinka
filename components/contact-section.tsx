"use client"

import { TextReveal } from "./ui/text-reveal"
import { FadeIn } from "./ui/fade-in"

export function ContactSection() {
  return (
    <section className="min-h-screen py-24 md:py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-32">
          <TextReveal 
            text="CONNECT." 
            className="pb-8"
            textClassName="text-[12vw] md:text-[10rem] font-bold uppercase tracking-tighter leading-[0.8] bg-gradient-to-br from-gray-800 via-gray-400 to-gray-800 dark:from-gray-600 dark:via-gray-400 dark:to-gray-100 bg-clip-text text-transparent pb-4"
          />
          <div className="h-px w-full bg-border" />
        </div>

        <div className="flex flex-col gap-24">
          <FadeIn className="space-y-12">
            <h2 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-tight max-w-5xl">
              Have a vision? <br />
              <span className="text-muted-foreground italic font-serif">Let's build it together.</span>
            </h2>
            
            <div className="flex flex-col gap-4">
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Inquiries</span>
               <a 
                href="mailto:olayinkasalaam.dev@gmail.com" 
                className="text-2xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground hover:text-muted-foreground transition-colors duration-300 break-all"
               >
                 olayinkasalaam.dev@gmail.com
               </a>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-24 border-t border-border">
            <FadeIn delay={0.2} className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Social</h3>
              <ul className="flex flex-col gap-2 text-xs uppercase tracking-widest font-bold">
                <li><a href="https://linkedin.com/in/olayinka-salaam" target="_blank" rel="noreferrer" className="hover:text-muted-foreground transition-colors">LinkedIn</a></li>
                <li><a href="https://x.com/OlayinkaSZN" target="_blank" rel="noreferrer" className="hover:text-muted-foreground transition-colors">Twitter (X)</a></li>
                <li><a href="https://github.com/MrSalaam" target="_blank" rel="noreferrer" className="hover:text-muted-foreground transition-colors">GitHub</a></li>
              </ul>
            </FadeIn>

            <FadeIn delay={0.3} className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Location</h3>
              <p className="text-xs uppercase tracking-widest font-bold">Lagos, Nigeria <br /> Available Globally</p>
            </FadeIn>

            <FadeIn delay={0.4} className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Timezone</h3>
              <p className="text-xs uppercase tracking-widest font-bold">GMT +1</p>
            </FadeIn>
          </div>
        </div>

        <div className="mt-48">
          <a
            href="/experience"
            className="inline-flex items-center gap-4 text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-foreground transition-all duration-300 group"
          >
            <span className="w-8 h-px bg-muted-foreground group-hover:w-12 group-hover:bg-foreground transition-all duration-300" />
            Back to Career
          </a>
        </div>
      </div>
    </section>
  )
}
