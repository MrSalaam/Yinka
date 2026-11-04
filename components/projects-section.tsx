"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight01Icon, Cancel01Icon } from "hugeicons-react"
import { ShaderCanvas, RINGS_FRAGMENT } from "./ui/shader-canvas"
import { InfiniteMarquee } from "./wensity/infinite-marquee"
import projectData from "../data/projects.json"

/* Works, minimal: a short header and one slow marquee of cards. Each card is a screenshot with the project's
 * name under it. Clicking one opens a modal with the screenshot, the description and a "Go to project" button.
 * Screenshots live in public/works/<slug>.png (see slugOf); until one is added a quiet placeholder is shown. */

type Project = {
  id: string
  title: string
  category: string
  year?: string
  description: string
  link: string
  adminLink?: string
  tools?: string[]
  /** Optional screenshot path; defaults to /works/<slug>.png */
  image?: string
}

const projects = projectData as Project[]

/** "Admin Dashboard Learnille" -> "admin-dashboard-learnille" */
export const slugOf = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

const srcOf = (p: Project) => p.image ?? `/works/${slugOf(p.title)}.png`

/** A screenshot that falls back to a quiet placeholder with the name when the file is missing. */
function Shot({ project, className, hover = false }: { project: Project; className?: string; hover?: boolean }) {
  const [missing, setMissing] = useState(false)
  const ref = useRef<HTMLImageElement>(null)

  // The browser may have failed to load the file before React attached onError, so check once on mount
  useEffect(() => {
    const img = ref.current
    if (img && img.complete && img.naturalWidth === 0) setMissing(true)
  }, [])

  if (missing) {
    return (
      <div className={`flex items-end bg-[#f1f1ef] p-6 ${className ?? ""}`}>
        <span className="text-2xl font-medium tracking-tighter text-foreground/40">{project.title}</span>
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={srcOf(project)}
      alt={`${project.title} screenshot`}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setMissing(true)}
      className={`bg-[#f1f1ef] object-cover object-top ${hover ? "transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.04]" : ""} ${className ?? ""}`}
    />
  )
}

function Card({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      aria-haspopup="dialog"
      aria-label={`${project.title}, ${project.category}. Open details.`}
      className="group/card relative block w-[min(80vw,22rem)] shrink-0 text-left"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
        <Shot project={project} hover className="h-full w-full" />

        {/* The notch the arrow sits in: a white corner around a dark disc */}
        <span className="absolute bottom-0 right-0 grid h-[4.5rem] w-[4.5rem] place-items-center rounded-tl-[2rem] bg-white">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-foreground text-white transition-transform duration-300 group-hover/card:-rotate-45">
            <ArrowUpRight01Icon size={20} className="transition-transform duration-300 group-hover/card:rotate-45" />
          </span>
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4 pr-1">
        <p className="text-lg font-medium tracking-tight text-foreground">{project.title}</p>
        <p className="shrink-0 text-sm text-muted-foreground">{project.category}</p>
      </div>
    </button>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  // Escape closes; the page behind stays put while the modal is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      data-lenis-prevent
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        className="relative flex max-h-[92svh] w-full max-w-3xl flex-col overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-foreground shadow-sm transition-colors hover:bg-white"
        >
          <Cancel01Icon size={18} />
        </button>

        <Shot project={project} className="aspect-[16/10] w-full shrink-0" />

        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              {project.category}
              {project.year ? ` · ${project.year}` : ""}
            </p>
            <h3 className="mt-2 text-3xl font-medium tracking-tighter text-foreground sm:text-4xl">{project.title}</h3>
          </div>

          <p className="text-base leading-relaxed text-muted-foreground">{project.description}</p>

          {project.tools && project.tools.length > 0 && (
            <p className="font-mono text-[11px] leading-relaxed tracking-[0.1em] text-muted-foreground">{project.tools.join(" · ")}</p>
          )}

          <div className="flex flex-wrap items-center gap-6 pt-1">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-12 items-center gap-3 rounded-full bg-foreground pl-6 pr-4 text-sm font-medium text-white"
            >
              Go to project
              <ArrowUpRight01Icon size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            {project.adminLink && (
              <a
                href={project.adminLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground underline decoration-foreground/30 underline-offset-[6px] hover:decoration-foreground"
              >
                Admin dashboard
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function ProjectsSection() {
  const [open, setOpen] = useState<Project | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const items = projects.map((p) => <Card key={p.id} project={p} onOpen={setOpen} />)

  return (
    <section id="works" className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div className="relative mx-auto mb-12 flex max-w-7xl flex-col gap-6 px-6 md:flex-row md:items-end md:justify-between lg:px-12">
        {/* Thin rings that wobble like ripples in still water; the cursor stirs them */}
        <ShaderCanvas fragment={RINGS_FRAGMENT} scale={1} className="pointer-events-none absolute -top-12 right-48 hidden h-60 w-60 md:block lg:right-56" />
        <div className="max-w-xl">
          <p className="mb-5 inline-block rounded-full border border-foreground/70 px-3.5 py-1 text-sm text-foreground">What I&apos;ve been up to</p>
          <h2 className="text-[clamp(2rem,4.4vw,3.5rem)] font-medium leading-[1.05] tracking-tighter text-foreground">Selected work</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            Websites and web apps I have built, from marketing sites to dashboards and platforms.
          </p>
        </div>
        <a
          href="https://github.com/MrSalaam"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex h-12 w-fit items-center gap-3 rounded-full bg-foreground pl-6 pr-4 text-sm font-medium text-white"
        >
          See more
          <ArrowUpRight01Icon size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>

      <InfiniteMarquee items={items} speed={70} gap="gap-5" fade={false} pauseOnHover />

      {/* In a portal: the section sits inside transformed wrappers, which would break a fixed overlay */}
      {mounted && createPortal(<AnimatePresence>{open && <ProjectModal key={open.id} project={open} onClose={close} />}</AnimatePresence>, document.body)}
    </section>
  )
}
