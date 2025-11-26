"use client"

import { useState, useEffect } from "react"
import { cn } from "../lib/utils"
import { X } from "lucide-react"
import { MenuIcon } from "./menu-icon"
import { ThemeToggle } from "./theme-toggle"
import { BreadcrumbTrail } from "./breadcrumb-trail"


const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
]

export function Navigation() {
  const [activeSection, setActiveSection] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const sections = navItems.map((item) => item.href.slice(1))
      const scrollPosition = window.scrollY + 100

      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm" : "bg-transparent",
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-6 z-50 relative">
            <a
              href="#"
              className="font-mono text-primary text-xl font-bold hover:scale-105 transition-transform duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {"<YS />"}
            </a>
            <div className="hidden lg:block">
              <BreadcrumbTrail />
            </div>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-4 lg:gap-8">
            {navItems.map((item, index) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-300 hover:text-primary relative group py-2",
                    activeSection === item.href.slice(1) ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <span className="font-mono text-primary/70 mr-1 text-xs">0{index + 1}.</span>
                  {item.label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-out",
                      activeSection === item.href.slice(1) ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <ThemeToggle />
            <a
              href="/resume.pdf"
              className="inline-flex items-center px-3 lg:px-4 py-2 text-sm font-mono border border-primary/50 text-primary rounded-md hover:bg-primary/10 hover:border-primary transition-all duration-300"
            >
              Resume
            </a>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-4 z-50 relative">
            <ThemeToggle />
            <button
              className="text-foreground hover:text-primary transition-colors p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-background/95 backdrop-blur-xl z-40 md:hidden transition-all duration-500 ease-in-out flex flex-col justify-center items-center",
          isMobileMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <ul className="flex flex-col items-center gap-8 w-full px-6">
          {navItems.map((item, index) => (
            <li
              key={item.href}
              className={cn(
                "w-full text-center transform transition-all duration-500 delay-[100ms]",
                isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <a
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block text-3xl font-bold transition-colors hover:text-primary py-2",
                  activeSection === item.href.slice(1) ? "text-primary" : "text-foreground/80",
                )}
              >
                <span className="font-mono text-primary/50 text-lg block mb-1">0{index + 1}.</span>
                {item.label}
              </a>
            </li>
          ))}
          <li
            className={cn(
              "mt-8 transform transition-all duration-500 delay-[500ms]",
              isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )}
          >
            <a
              href="/resume.pdf"
              className="inline-flex items-center px-8 py-3 text-lg font-mono border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Resume
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
