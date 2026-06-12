"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Menu01Icon, Cancel01Icon } from "hugeicons-react"

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/stack", label: "Stack" },
  { href: "/projects", label: "Works" },
  { href: "/experience", label: "Career" },
  { href: "/contact", label: "Connect" },
]

export function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center">
      {/* Drawer panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-1 bg-foreground text-background px-4 py-5 md:px-5 md:py-6 shadow-2xl rounded-r-2xl"
          >
            {links.map((link, i) => {
              const isActive = pathname === link.href
              return (
                <motion.div
                  key={link.href}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.25, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block px-3 py-2.5 md:py-2 text-[11px] font-bold uppercase tracking-[0.25em] rounded-lg transition-colors duration-150 ${
                      isActive
                        ? "bg-background/15 text-background"
                        : "text-background/60 hover:text-background hover:bg-background/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              )
            })}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Toggle tab — always visible on the left edge */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        className="relative flex flex-col items-center justify-center gap-2.5 w-8 md:w-10 py-5 md:py-6 bg-foreground text-background rounded-r-xl md:rounded-r-2xl shadow-xl hover:w-10 md:hover:w-12 transition-all duration-200"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Cancel01Icon size={13} className="md:hidden" />
              <Cancel01Icon size={14} className="hidden md:block" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Menu01Icon size={13} className="md:hidden" />
              <Menu01Icon size={14} className="hidden md:block" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Vertical label — hidden on very small screens */}
        <span
          className="hidden sm:block text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] leading-none"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
        >
          {open ? "Close" : "Menu"}
        </span>

        {/* Pulse ring on first load */}
        {!open && (
          <span className="absolute inset-0 rounded-r-xl md:rounded-r-2xl animate-ping bg-foreground/25 pointer-events-none" />
        )}
      </button>
    </div>
  )
}
