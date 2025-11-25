"use client"

import { useState, useEffect } from "react"
import { cn } from "../lib/utils"
import { Menu, X } from "lucide-react"
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
        isScrolled ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm" : "",
      )}
    >
      <nav className="mx-auto max-w-6xl px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="font-mono text-primary text-lg font-bold hover:scale-110 transition-transform duration-300"
            >
              {"<YS />"}
            </a>
            <BreadcrumbTrail />
          </div>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "text-sm transition-all duration-300 hover:text-primary relative group",
                    activeSection === item.href.slice(1) ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <span className="font-mono text-primary/70 mr-1">0{index + 1}.</span>
                  {item.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                      activeSection === item.href.slice(1) ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/resume.pdf"
              className="inline-flex items-center px-4 py-2 text-sm font-mono border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Resume
            </a>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border animate-in slide-in-from-top-2 duration-300">
          <ul className="px-6 py-4 space-y-4">
            {navItems.map((item, index) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block text-sm transition-colors hover:text-primary",
                    activeSection === item.href.slice(1) ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <span className="font-mono text-primary/70 mr-2">0{index + 1}.</span>
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Theme:</span>
                <ThemeToggle />
              </div>
            </li>
            <li>
              <a
                href="/resume.pdf"
                className="inline-flex items-center px-4 py-2 text-sm font-mono border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
