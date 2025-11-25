"use client"

import { useState, useRef } from "react"
import { cn } from "../lib/utils"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const experiences = [
  {
    company: "MIC",
    role: " Frontend Developer Intern",
    period: "March - September 2025",
    description: [
      "Developed a responsive and user-friendly website for the company, using HTML and CSS",
      "Collaborated with the design team to implement pixel-perfect, accessible interfaces",
      "Assited my felllow interns and conduct code reviews to maintain code quality",
      
    ],
    technologies: ["HTML", "CSS", "JavaScript"],
  },
  {
    company: "S.A Ayilara",
    role: "Frontend Developer",
    period: "2025",
    description: [
      "Designed and Developed a portfoolio website for MR Sodiq Ayilara",
      "Implemented Shadcn UI",
      "Reduced bundle size by 35% through code splitting and lazy lading",
      "Responsive across all devices",
    ],
    technologies: ["React", "TailwindCSS", "TypeScript", "Shadcn UI"],
  },
  {
    company: "Learnille",
    role: "Frontend Developer",
    period: "2025 - Present",
    description: [
      "Working on admin dashboard",
      
    ],
    technologies: ["TypeScript", "React", "Tanstack Query", "Chakra UI", "Figma"],
  },
]

export function ExperienceSection() {
  const [activeTab, setActiveTab] = useState(0)
  const containerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Scroll reveal
      gsap.from(".section-title", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })

      gsap.from(".experience-content", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      })
    },
    { scope: containerRef },
  )

  // Animate content when tab changes
  useGSAP(
    () => {
      if (!contentRef.current) return

      const tl = gsap.timeline()

      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      )
        .fromTo(
          ".job-item",
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" },
          "-=0.2"
        )
        .fromTo(
          ".tech-tag",
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.3, stagger: 0.03, ease: "back.out(1.5)" },
          "-=0.2"
        )
    },
    { scope: containerRef, dependencies: [activeTab] },
  )

  return (
    <section id="experience" className="py-24 scroll-mt-20" ref={containerRef}>
      <div className="section-title flex items-center gap-4 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap">
          <span className="font-mono text-primary mr-2">02.</span>
          Where I've Worked
        </h2>
        <div className="h-px bg-gradient-to-r from-border to-transparent flex-1 max-w-xs" />
      </div>

      <div className="experience-content flex flex-col md:flex-row gap-4 md:gap-8">
        <div className="flex md:flex-col overflow-x-auto md:overflow-visible border-b md:border-b-0 md:border-l-2 border-border h-fit">
          {experiences.map((exp, index) => (
            <button
              key={exp.company}
              onClick={() => setActiveTab(index)}
              className={cn(
                "px-4 py-3 text-sm font-mono text-left whitespace-nowrap transition-all duration-300 relative",
                "hover:bg-primary/5 hover:text-primary",
                activeTab === index ? "text-primary bg-primary/5" : "text-muted-foreground",
              )}
            >
              {activeTab === index && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 md:w-0.5 md:h-full md:top-0 bg-primary" />
              )}
              {exp.company}
            </button>
          ))}
        </div>

        <div className="py-2 md:py-0 min-h-[320px] flex-1" ref={contentRef}>
          <h3 className="text-xl font-semibold text-foreground">
            {experiences[activeTab].role} <span className="text-primary">@ {experiences[activeTab].company}</span>
          </h3>
          <p className="font-mono text-sm text-muted-foreground mt-1 mb-6">{experiences[activeTab].period}</p>
          <ul className="space-y-3">
            {experiences[activeTab].description.map((item, index) => (
              <li key={index} className="job-item flex gap-3 text-muted-foreground leading-relaxed">
                <span className="text-primary mt-1.5 flex-shrink-0">▹</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 mt-6">
            {experiences[activeTab].technologies.map((tech) => (
              <span
                key={tech}
                className="tech-tag px-3 py-1 text-xs font-mono bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
