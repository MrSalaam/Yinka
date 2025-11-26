"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const skillCategories = [
  {
    title: "Languages",
    skills: ["TypeScript", "JavaScript", "HTML", "CSS"],
  },
  {
    title: "Frameworks & Libraries",
    skills: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS", "Framer Motion", "GSAP", "Shadcn UI", "Chakra UI", "TanStack Query"],
  },
  {
    title: "Tools & DevOps",
    skills: ["Git", "GitHub", "Vercel", "Figma", "VS Code"],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
}

export function SkillsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="skills" className="py-24 scroll-mt-20" ref={ref}>
      <div className="section-title flex items-center gap-4 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap">
          <span className="font-mono text-primary mr-2">04.</span>
          Skills & Expertise
        </h2>
        <div className="h-px bg-gradient-to-r from-border to-transparent flex-1 max-w-xs" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            transition={{ delay: categoryIndex * 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-foreground border-b-2 border-primary/30 pb-2 inline-block">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-3">
              {category.skills.map((skill) => (
                <motion.div
                  key={skill}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-mono text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors cursor-default shadow-sm hover:shadow-md"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-16 p-6 bg-card border border-border rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-500 group"
      >
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
      </motion.div>
    </section>
  )
}
