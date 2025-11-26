"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Construction, Code2 } from "lucide-react"

export function ProjectsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="projects" className="py-24 scroll-mt-20" ref={ref}>
      <div className="section-title flex items-center gap-4 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap">
          <span className="font-mono text-primary mr-2">03.</span>
          Some Things I've Built
        </h2>
        <div className="h-px bg-gradient-to-r from-border to-transparent flex-1 max-w-xs" />
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-card border border-border rounded-xl p-12 text-center shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
              <div className="relative bg-background p-4 rounded-full border-2 border-primary/20 group-hover:border-primary transition-colors duration-300">
                <Construction className="w-12 h-12 text-primary" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">
                Projects Coming Soon
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                I'm currently working on projects that showcase my skills.
                Check back soon to see what I've been building!
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-mono text-primary/80 bg-primary/10 px-4 py-2 rounded-full">
              <Code2 className="w-4 h-4" />
              <span>Work in progress</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
