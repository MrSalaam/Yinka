"use client"

import { motion } from "framer-motion"
import { GlossyButton } from "./ui/glossy-button"
import experiences from "../data/experience.json"
import { TextReveal } from "./ui/text-reveal"
import { MagneticEffect } from "./ui/magnetic-effect"
import { ArrowUpRight01Icon } from "hugeicons-react"
import { FadeIn } from "./ui/fade-in"

export function ExperienceSection() {
  return (
    <section className="min-h-screen py-24 md:py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        {/* Massive Section Title */}
        <div className="mb-32">
          <TextReveal 
            text="CAREER." 
            className="pb-8"
            textClassName="text-[12vw] md:text-[10rem] font-bold uppercase tracking-tighter leading-[0.8] bg-gradient-to-br from-gray-800 via-gray-400 to-gray-800 dark:from-gray-600 dark:via-gray-400 dark:to-gray-100 bg-clip-text text-transparent pb-4"
          />
          <div className="h-px w-full bg-border" />
        </div>

        {/* Timeline List */}
        <div className="flex flex-col">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative grid grid-cols-1 md:grid-cols-12 py-16 border-b border-border hover:bg-secondary/10 transition-colors duration-500 px-4 md:px-8 -mx-4 md:-mx-8 rounded-xl"
            >
              {/* Period */}
              <div className="md:col-span-3 mb-4 md:mb-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground group-hover:text-foreground transition-colors">
                  {exp.period}
                </span>
              </div>

              {/* Company & Role */}
              <div className="md:col-span-5 flex flex-col gap-2">
                <FadeIn delay={0.1}>
                  <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-foreground">
                    {exp.company}
                  </h2>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                    {exp.role}
                  </span>
                </FadeIn>
              </div>

              {/* Description */}
              <FadeIn delay={0.3} className="md:col-span-4 mt-6 md:mt-0">
                <p className="text-sm md:text-base leading-relaxed text-muted-foreground max-w-sm">
                  {exp.description}
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-border group-hover:bg-foreground rounded-full transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                    {exp.location}
                  </span>
                </div>
              </FadeIn>
            </motion.div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-48 flex flex-col md:flex-row items-center justify-between gap-12 pt-12 border-t border-border">
          <a
            href="/about"
            className="inline-flex items-center gap-4 text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-foreground transition-all duration-300 group"
          >
            <span className="w-8 h-px bg-muted-foreground group-hover:w-12 group-hover:bg-foreground transition-all duration-300" />
            Back to Profile
          </a>

          <a href="/contact">
            <MagneticEffect>
              <button className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300">
                <div className="flex items-center gap-2">
                  <span>Discuss a Project</span>
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
