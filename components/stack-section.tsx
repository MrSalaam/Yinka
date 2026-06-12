"use client"

import { motion } from "framer-motion"
import { TextReveal } from "./ui/text-reveal"
import { FadeIn } from "./ui/fade-in"

const stack = [
  {
    category: "Languages",
    level: "Core",
    tools: ["TypeScript", "JavaScript", "Node.js", "SQL"],
  },
  {
    category: "Frontend",
    level: "Primary",
    tools: ["Next.js", "React", "Framer Motion", "TanStack Query", "Zustand", "React Hook Form", "Zod", "Radix UI"],
  },
  {
    category: "Styling",
    level: "Primary",
    tools: ["Tailwind CSS", "Chakra UI", "shadcn/ui", "CSS Modules", "Styled Components"],
  },
  {
    category: "Backend & APIs",
    level: "Proficient",
    tools: ["REST APIs", "GraphQL", "Express.js", "Prisma", "Drizzle ORM", "Supabase", "Firebase", "PostgreSQL", "tRPC"],
  },
  {
    category: "Infrastructure",
    level: "Proficient",
    tools: ["Git", "GitHub Actions", "Vercel", "Docker", "Turborepo", "pnpm", "Webpack", "Vite"],
  },
  {
    category: "Design & Collaboration",
    level: "Daily",
    tools: ["Figma", "Storybook", "Notion", "Linear", "Jira"],
  },
]

export function StackSection() {
  return (
    <section className="min-h-screen py-24 md:py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">

        <div className="mb-32">
          <TextReveal
            text="STACK."
            className="pb-8"
            textClassName="text-[15vw] md:text-[12rem] font-bold uppercase tracking-tighter leading-[0.8] bg-gradient-to-br from-gray-800 via-gray-400 to-gray-800 dark:from-gray-600 dark:via-gray-400 dark:to-gray-100 bg-clip-text text-transparent pb-4"
          />
          <div className="h-px w-full bg-border" />
        </div>

        <FadeIn className="mb-20 max-w-2xl">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Tools and technologies I reach for to ship production-grade software — from pixel-perfect interfaces to scalable backend systems.
          </p>
        </FadeIn>

        <div className="flex flex-col divide-y divide-border">
          {stack.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 py-10 group"
            >
              {/* Left — category + level */}
              <div className="md:col-span-3 flex flex-col gap-1 pt-1">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-foreground">
                  {group.category}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                  {group.level}
                </span>
              </div>

              {/* Right — tool pills */}
              <div className="md:col-span-9 flex flex-wrap gap-2">
                {group.tools.map((tool, j) => (
                  <motion.span
                    key={tool}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 + j * 0.04, duration: 0.3 }}
                    className="px-4 py-2 border border-border rounded-full text-[10px] font-bold uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-200 cursor-default"
                  >
                    {tool}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
          <a
            href="/about"
            className="inline-flex items-center gap-4 text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-foreground transition-all duration-300 group"
          >
            <span className="w-8 h-px bg-muted-foreground group-hover:w-12 group-hover:bg-foreground transition-all duration-300" />
            Back to About
          </a>
          <a
            href="/experience"
            className="inline-flex items-center gap-4 text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-foreground transition-all duration-300 group"
          >
            View Career
            <span className="w-8 h-px bg-muted-foreground group-hover:w-12 group-hover:bg-foreground transition-all duration-300" />
          </a>
        </div>

      </div>
    </section>
  )
}
