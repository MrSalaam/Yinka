"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const skillCategories = [
  {
    title: "Languages",
    skills: [
      { name: "TypeScript", level: 95 },
      { name: "JavaScript", level: 95 },
      { name: "HTML/CSS", level: 90 },
      { name: "Python", level: 70 },
    ],
  },
  {
    title: "Frameworks",
    skills: [
      { name: "React", level: 95 },
      { name: "Next.js", level: 90 },
      { name: "Node.js", level: 80 },
      { name: "Express", level: 75 },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "Git", level: 90 },
      { name: "Figma", level: 85 },
      { name: "Docker", level: 70 },
      { name: "AWS", level: 65 },
    ],
  },
]

function SkillBar({ name, level }: { name: string; level: number }) {
  const barRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        barRef.current,
        { width: "0%" },
        {
          width: `${level}%`,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: barRef.current,
            start: "top 90%",
          },
        },
      )
    },
    { scope: barRef },
  )

  return (
    <div className="space-y-2 group">
      <div className="flex justify-between text-sm">
        <span className="text-foreground group-hover:text-primary transition-colors">{name}</span>
        <span className="font-mono text-primary">{level}%</span>
      </div>
      <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
        <div
          ref={barRef}
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
        >
          <div className="absolute inset-0 animate-shimmer" />
        </div>
      </div>
    </div>
  )
}

export function SkillsSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // Section Title
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

      // Skill Categories
      gsap.from(".skill-category", {
        scrollTrigger: {
          trigger: ".skills-grid",
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      })

      // Terminal Card
      gsap.from(".terminal-card", {
        scrollTrigger: {
          trigger: ".terminal-card",
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
    },
    { scope: containerRef },
  )

  return (
    <section id="skills" className="py-24 scroll-mt-20" ref={containerRef}>
      <div className="section-title flex items-center gap-4 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap">
          <span className="font-mono text-primary mr-2">04.</span>
          Skills & Expertise
        </h2>
        <div className="h-px bg-gradient-to-r from-border to-transparent flex-1 max-w-xs" />
      </div>

      <div className="skills-grid grid md:grid-cols-3 gap-8">
        {skillCategories.map((category) => (
          <div key={category.title} className="skill-category space-y-6">
            <h3 className="text-lg font-semibold text-foreground border-b-2 border-primary/30 pb-2 hover:border-primary transition-colors">
              {category.title}
            </h3>
            <div className="space-y-5">
              {category.skills.map((skill) => (
                <SkillBar key={skill.name} name={skill.name} level={skill.level} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="terminal-card mt-16 p-6 bg-card border border-border rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="font-mono text-xs text-muted-foreground">terminal</span>
        </div>
        <div className="font-mono text-sm space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-primary">$</span>
            <span className="text-foreground">npx create-next-app@latest my-project</span>
          </div>
          <div className="text-green-600">✓ Creating a new Next.js app...</div>
          <div className="text-green-600">✓ Installing dependencies...</div>
          <div className="text-green-600">✓ Initializing project...</div>
          <div className="flex items-center gap-2">
            <span className="text-primary">$</span>
            <span className="text-foreground">cd my-project && npm run dev</span>
          </div>
          <div className="text-foreground">
            Ready - started server on <span className="text-primary font-semibold">http://localhost:3000</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">$</span>
            <span className="animate-pulse text-primary">▊</span>
          </div>
        </div>
      </div>
    </section>
  )
}
