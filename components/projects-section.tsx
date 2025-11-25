"use client"

import { useRef } from "react"
import { ExternalLink, Github, Folder } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const featuredProjects = [
  {
    title: "Spotify Profile",
    description:
      "A web app for visualizing personalized Spotify data. View your top artists, top tracks, recently played tracks, and detailed audio information about each track. Create and save new playlists of recommended tracks based on your existing playlists and more.",
    image: "/spotify-music-dashboard-light-theme.jpg",
    technologies: ["React", "Styled Components", "Express", "Spotify API"],
    github: "https://github.com",
    external: "https://spotify.com",
  },
  {
    title: "AI Code Assistant",
    description:
      "An intelligent coding assistant that helps developers write better code faster. Features include code completion, bug detection, refactoring suggestions, and natural language to code conversion. Built with modern LLM technology.",
    image: "/ai-coding-assistant-interface-clean-light.jpg",
    technologies: ["Next.js", "TypeScript", "OpenAI", "Tailwind CSS"],
    github: "https://github.com",
    external: "https://example.com",
  },
  {
    title: "Collaborative Canvas",
    description:
      "A real-time collaborative drawing application where multiple users can create and edit designs together. Features include layers, shapes, text, and image uploads with instant synchronization across all connected clients.",
    image: "/collaborative-drawing-canvas-app-modern-light.jpg",
    technologies: ["React", "WebSocket", "Canvas API", "Node.js"],
    github: "https://github.com",
    external: "https://example.com",
  },
]

const otherProjects = [
  {
    title: "Weather Dashboard",
    description: "A clean weather application with beautiful visualizations and 7-day forecasts.",
    technologies: ["React", "Chart.js", "Weather API"],
    github: "https://github.com",
    external: "https://example.com",
  },
  {
    title: "Task Manager CLI",
    description: "A command-line task management tool with cloud sync and team collaboration features.",
    technologies: ["Node.js", "MongoDB", "Commander.js"],
    github: "https://github.com",
  },
  {
    title: "Portfolio Generator",
    description: "Generate beautiful portfolio websites from a simple JSON configuration file.",
    technologies: ["Next.js", "MDX", "Tailwind"],
    github: "https://github.com",
    external: "https://example.com",
  },
  {
    title: "E-commerce Starter",
    description: "A full-featured e-commerce starter template with Stripe integration.",
    technologies: ["Next.js", "Stripe", "Prisma"],
    github: "https://github.com",
  },
  {
    title: "Chrome Extension Kit",
    description: "A starter kit for building Chrome extensions with React and TypeScript.",
    technologies: ["React", "TypeScript", "Chrome API"],
    github: "https://github.com",
    external: "https://example.com",
  },
  {
    title: "Markdown Editor",
    description: "A minimal markdown editor with live preview and export functionality.",
    technologies: ["React", "Marked", "CodeMirror"],
    github: "https://github.com",
    external: "https://example.com",
  },
]

export function ProjectsSection() {
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

      // Featured Projects
      const projects = gsap.utils.toArray<HTMLElement>(".featured-project")
      projects.forEach((project, i) => {
        gsap.from(project, {
          scrollTrigger: {
            trigger: project,
            start: "top 85%",
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        })
      })

      // Other Projects Title
      gsap.from(".other-projects-title", {
        scrollTrigger: {
          trigger: ".other-projects-grid",
          start: "top 85%",
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      })

      // Other Projects Grid
      gsap.from(".other-project-card", {
        scrollTrigger: {
          trigger: ".other-projects-grid",
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      })

      // Hover effects for other project cards
      const cards = gsap.utils.toArray<HTMLElement>(".other-project-card")
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -10, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", duration: 0.3, ease: "power2.out" })
          gsap.to(card.querySelector(".folder-icon"), { scale: 1.1, color: "hsl(var(--primary))", duration: 0.3 })
          gsap.to(card.querySelector(".project-title"), { color: "hsl(var(--primary))", duration: 0.3 })
        })
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", duration: 0.3, ease: "power2.out" })
          gsap.to(card.querySelector(".folder-icon"), { scale: 1, color: "hsl(var(--primary))", duration: 0.3 })
          gsap.to(card.querySelector(".project-title"), { color: "hsl(var(--foreground))", duration: 0.3 })
        })
      })
    },
    { scope: containerRef },
  )

  return (
    <section id="projects" className="py-24 scroll-mt-20" ref={containerRef}>
      <div className="section-title flex items-center gap-4 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap">
          <span className="font-mono text-primary mr-2">03.</span>
          Some Things I've Built
        </h2>
        <div className="h-px bg-gradient-to-r from-border to-transparent flex-1 max-w-xs" />
      </div>

      <div className="space-y-32">
        {featuredProjects.map((project, index) => (
          <div
            key={project.title}
            className={`featured-project relative grid md:grid-cols-12 gap-4 items-center ${index % 2 === 0 ? "" : "md:text-right"}`}
          >
            <div className={`md:col-span-7 ${index % 2 === 0 ? "md:col-start-1" : "md:col-start-6"} relative group`}>
              <a href={project.external} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative overflow-hidden rounded-xl bg-primary/5 shadow-lg transition-all duration-500">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-auto opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              </a>
            </div>

            <div
              className={`md:col-span-6 md:row-start-1 ${index % 2 === 0 ? "md:col-start-6 md:text-right" : "md:col-start-1 md:text-left"
                } relative z-10`}
            >
              <p className="font-mono text-sm text-primary mb-2">Featured Project</p>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                <a
                  href={project.external}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors duration-300"
                >
                  {project.title}
                </a>
              </h3>
              <div className="bg-card p-6 rounded-xl shadow-xl border border-border mb-4 hover:shadow-2xl hover:border-primary/30 transition-all duration-300">
                <p className="text-muted-foreground leading-relaxed">{project.description}</p>
              </div>
              <ul
                className={`flex flex-wrap gap-3 font-mono text-sm text-muted-foreground mb-4 ${index % 2 === 0 ? "md:justify-end" : ""
                  }`}
              >
                {project.technologies.map((tech) => (
                  <li key={tech} className="hover:text-primary transition-colors">
                    {tech}
                  </li>
                ))}
              </ul>
              <div className={`flex gap-4 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary hover:scale-110 transition-all duration-300"
                    aria-label="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {project.external && (
                  <a
                    href={project.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary hover:scale-110 transition-all duration-300"
                    aria-label="External Link"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="other-projects-title text-center text-xl font-semibold text-foreground mt-24 mb-12">Other Noteworthy Projects</h3>

      <div className="other-projects-grid grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {otherProjects.map((project) => (
          <div
            key={project.title}
            className="other-project-card group bg-card p-6 rounded-xl border border-border shadow-md"
          >
            <div className="flex items-center justify-between mb-6">
              <Folder className="folder-icon w-10 h-10 text-primary transition-all duration-300" />
              <div className="flex gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300"
                    aria-label="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {project.external && (
                  <a
                    href={project.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300"
                    aria-label="External Link"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
            <h4 className="project-title text-lg font-semibold text-foreground mb-2 transition-colors duration-300">
              {project.title}
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">{project.description}</p>
            <ul className="flex flex-wrap gap-2 font-mono text-xs text-muted-foreground">
              {project.technologies.map((tech) => (
                <li key={tech} className="hover:text-primary transition-colors">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
