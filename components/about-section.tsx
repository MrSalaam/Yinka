"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { staggerContainer, staggerItem } from "../hooks/use-scroll-animation"

export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null)

  return (
    <section id="about" className="py-24 scroll-mt-20" ref={containerRef}>
      <div className="section-title flex items-center gap-4 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap">
          <span className="font-mono text-primary mr-2">01.</span>
          About Me
        </h2>
        <div className="h-px bg-gradient-to-r from-border to-transparent flex-1 max-w-xs" />
      </div>

      <div className="grid lg:grid-cols-[3fr_2fr] gap-12 items-start">
        <div className="about-content space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Hello! I'm Yinka, a frontend developer who cares deeply about details. Specializing in the JavaScript ecosystem (React.js, Next.js). 
            I priortize accesibility and fluid UI mechanics to create products that do not just work well, but feel great to use.
            
          </p>
          <p>
            Fast-forward to today, I've worked {" "}
            <a href="#" className="text-primary hover:underline decoration-2 underline-offset-4 transition-all">
              for a startup
            </a>
            ,{" "}
            <a href="#" className="text-primary hover:underline decoration-2 underline-offset-4 transition-all">
              a designer
            </a>
            , and{" "}
            <a href="#" className="text-primary hover:underline decoration-2 underline-offset-4 transition-all">
              a government organization
            </a>
            . My main focus these days is building accessible, performant products and digital experiences at{" "}
            <a href="#" className="text-primary hover:underline decoration-2 underline-offset-4 transition-all">
              appropriate time
            </a>{" "}
            for a variety of clients.
          </p>
          <p>
            When i'm not coding, I am either gaminng, researching on latest design trends or sharing what i learn with others
          </p>
          <p>Here are a few technologies I've been working with recently:</p>

          <motion.ul
            className="grid grid-cols-2 gap-2 font-mono text-sm mt-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {["TypeScript", "React", "Next.js", "Chakra UI", "Tailwind CSS", "Framer Motion", "Shadcn UI", "TanStack Query"].map((tech) => (
              <motion.li
                key={tech}
                variants={staggerItem}
                className="tech-item flex items-center gap-2 hover:text-primary hover:translate-x-2 transition-all duration-300 cursor-default"
              >
                <span className="text-primary">▹</span>
                {tech}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div className="code-card relative group">
          <div className="relative rounded-xl overflow-hidden bg-card border border-border shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-shadow duration-500">
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400 hover:scale-110 transition-transform cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-yellow-400 hover:scale-110 transition-transform cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-green-400 hover:scale-110 transition-transform cursor-pointer" />
              </div>
              <span className="font-mono text-xs text-muted-foreground ml-2">about.tsx</span>
            </div>
            <div className="p-4 font-mono text-sm">
              <div className="flex gap-4">
                <div className="text-muted-foreground/40 select-none">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <div key={n}>{n}</div>
                  ))}
                </div>
                <div className="text-muted-foreground">
                  <div>
                    <span className="text-pink-500">const</span> <span className="text-blue-500">developer</span> ={" "}
                    {"{"}
                  </div>
                  <div className="pl-4">
                    <span className="text-primary">name</span>: <span className="text-green-600">"Yinka"</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-primary">role</span>: <span className="text-green-600">"Frontend Dev"</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-primary">location</span>:{" "}
                    <span className="text-green-600">"Lagos, Nigeria"</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-primary">coffee</span>: <span className="text-green-600">" Always"</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-primary">available</span>: <span className="text-blue-500">true</span>,
                  </div>
                  <div>{"}"}</div>
                  <div className="mt-2 text-muted-foreground/50">{"// Let's build something!"}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl -z-10 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-500" />
        </div>
      </div>
    </section>
  )
}
