"use client"

import { motion, AnimatePresence } from "framer-motion"
import projects from "../data/projects.json"
import { TextReveal } from "./ui/text-reveal"
import { MagneticEffect } from "./ui/magnetic-effect"
import { ArrowUpRight01Icon } from "hugeicons-react"
import { FadeIn } from "./ui/fade-in"
import { useState, useRef } from "react"

export function ProjectsSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 2
  const projectsRef = useRef<HTMLDivElement>(null)

  const totalPages = Math.ceil(projects.length / projectsPerPage)
  const indexOfLastProject = currentPage * projectsPerPage
  const indexOfFirstProject = indexOfLastProject - projectsPerPage
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject)

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    if (projectsRef.current) {
      window.scrollTo({
        top: projectsRef.current.offsetTop - 100,
        behavior: "smooth",
      })
    }
  }
  return (
    <section className="min-h-screen py-24 md:py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
    
        <div className="mb-32">
          <TextReveal 
            text="WORKS." 
            className="pb-8"
            textClassName="text-[12vw] md:text-[10rem] font-bold uppercase tracking-tighter leading-[0.8] bg-gradient-to-br from-gray-800 via-gray-400 to-gray-800 dark:from-gray-600 dark:via-gray-400 dark:to-gray-100 bg-clip-text text-transparent pb-4"
          />
          <div className="h-px w-full bg-border" />
        </div>


        <div ref={projectsRef} className="flex flex-col gap-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-32"
            >
              {currentProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="group py-12 border-b border-border hover:bg-secondary/5 transition-colors px-6 -mx-6 rounded-lg"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex flex-col gap-4 max-w-4xl">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">{project.category}</span>
                      </div>
                      
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="group/title inline-block">
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-tight bg-gradient-to-br from-gray-800 via-gray-400 to-gray-800 dark:from-gray-600 dark:via-gray-400 dark:to-gray-100 bg-clip-text text-transparent group-hover/title:opacity-70 transition-opacity">
                          {project.title}
                        </h2>
                      </a>
                      
                      <FadeIn delay={0.2}>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                          {project.description}
                        </p>
                      </FadeIn>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-6">
                       <FadeIn delay={0.3} className="flex flex-col items-start md:items-end gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        <span>{project.year}</span>
                      </FadeIn>
                      
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
                      >
                        <span>Visit Site</span>
                        <ArrowUpRight01Icon size={12} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
        </motion.div>
      </AnimatePresence>
    </div>

        {totalPages > 1 && (
          <div className="mt-32 flex items-center justify-center gap-8">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground hover:text-foreground disabled:opacity-20 transition-all"
            >
              Prev
            </button>
            
            <div className="flex items-center gap-4">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`text-sm font-mono transition-all ${
                    currentPage === i + 1 
                    ? "text-foreground font-bold scale-125" 
                    : "text-muted-foreground hover:text-foreground opacity-50"
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground hover:text-foreground disabled:opacity-20 transition-all"
            >
              Next
            </button>
          </div>
        )}


      
        <div className="mt-48 flex flex-col md:flex-row items-center justify-between gap-12 pt-12 border-t border-border">
          <a
            href="/"
            className="inline-flex items-center gap-4 text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-foreground transition-all duration-300 group"
          >
            <span className="w-8 h-px bg-muted-foreground group-hover:w-12 group-hover:bg-foreground transition-all duration-300" />
            Back to Home
          </a>

          <a href="/about">
            <MagneticEffect>
              <button className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300">
                <div className="flex items-center gap-2">
                  <span>Learn More About Me</span>
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
