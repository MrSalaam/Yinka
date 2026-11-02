"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { site } from "@/lib/site"

const links = [
  { href: "#home", label: "Home" },
  { href: "#works", label: "Works" },
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
  { href: "#career", label: "Career" },
  { href: "#contact", label: "Connect" },
]

const socials = [
  { href: site.cvUrl, label: "Download CV" },
  { href: "https://github.com/MrSalaam", label: "GitHub" },
  { href: "https://linkedin.com/in/olayinka-salaam", label: "LinkedIn" },
  { href: "https://x.com/yinka_tsx", label: "Twitter (X)" },
]

const EASE = [0.16, 1, 0.3, 1] as const

function useLagosTime() {
  const [time, setTime] = useState("")
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Africa/Lagos",
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [])
  return time
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState("#home")
  const time = useLagosTime()

  // Scroll-spy: highlight the section currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    )
    links.forEach((l) => {
      const el = document.querySelector(l.href)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <>
      {/* Click-away backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2">
        <div className="rounded-[28px] border border-border bg-background p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          {/* Pill bar */}
          <div className="flex h-12 items-center justify-between rounded-full bg-foreground px-4 text-background">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex items-center gap-3 text-sm font-medium"
            >
              <span className="relative h-5 w-5">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={open ? "x" : "menu"}
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.15, ease: EASE }}
                  >
                    {open ? <X size={18} /> : <Menu size={18} />}
                  </motion.span>
                </AnimatePresence>
              </span>
              {/* Label rolls between Menu / Close */}
              <span className="relative h-5 w-12 overflow-hidden text-left">
                <motion.span
                  className="absolute left-0 top-0 flex flex-col"
                  animate={{ y: open ? -20 : 0 }}
                  transition={{ duration: 0.2, ease: EASE }}
                >
                  <span className="flex h-5 items-center">Menu</span>
                  <span className="flex h-5 items-center">Close</span>
                </motion.span>
              </span>
            </button>

            <span className="text-right font-mono text-sm tabular-nums text-background/55" suppressHydrationWarning>
              {time || "--:--"}
            </span>
          </div>

          {/* Dropdown panel */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.nav
                id="site-menu"
                aria-label="Site"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 pt-6">
                  <p className="mb-3 text-sm text-muted-foreground">Menu</p>
                  <ul className="flex flex-col gap-1">
                    {links.map((link, i) => (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.015, 0.05), duration: 0.2, ease: EASE }}
                      >
                        <a
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={`block py-1.5 text-lg font-semibold tracking-tight transition-opacity duration-150 hover:opacity-60 ${
                            active === link.href ? "text-foreground" : "text-foreground/70"
                          }`}
                        >
                          {link.label}
                        </a>
                      </motion.li>
                    ))}
                  </ul>

                  <div className="my-5 h-px bg-border" />

                  <p className="mb-3 text-sm text-muted-foreground">Social media</p>
                  <ul className="flex flex-col gap-1">
                    {socials.map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block py-1 text-sm font-medium text-foreground/80 transition-opacity duration-150 hover:opacity-60"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
