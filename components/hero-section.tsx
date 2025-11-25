"use client"

import { useEffect, useState } from "react"
import { Github, Linkedin, Twitter, Mail, MapPin } from "lucide-react"
import { MagneticButton } from "./magnetic-button"
import { DoubleArrowDownIcon, ArrowRightIcon} from "@radix-ui/react-icons"


const socialLinks = [
  { icon: Github, href: "https://github.com/MrSalaam", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/olayinka-salaam", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/OlayinkaSZN", label: "Twitter" },
  { icon: Mail, href: "mailto:olayinkasalaam.dev@gmail.com", label: "Email" },
]

export function HeroSection() {
  const [displayText, setDisplayText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const fullText = "I build things for the web."

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <section className="min-h-screen flex flex-col justify-center py-24 lg:py-0 relative">
     
      

      <div className="space-y-6 relative mt-20">
        {/* Availability Badge & Location */}
        <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-green-600 dark:text-green-400">Available for work</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-sm">
            <MapPin className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Lagos, Nigeria</span>
          </div>
        </div>

        <p className="font-mono text-primary text-sm md:text-base animate-in fade-in slide-in-from-bottom-4 duration-700">
          Hi, my name is
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 hover:text-primary transition-colors cursor-default">
          Yinka Salaam.
        </h1>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          {displayText}
          <span className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity text-primary`}>|</span>
        </h2>
        <p className="max-w-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          I'm a frontend developer specializing in building exceptional digital experiences. Currently focused on
          creating accessible, pixel-perfect interfaces that blend thoughtful design with robust engineering.
        </p>
        <div className="flex items-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <MagneticButton>
            <a
              href="#projects"
              className="inline-flex items-center gap-3 px-6 py-3 font-mono text-sm bg-primary text-primary-foreground rounded-lg hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300 group"
            >
              Check out my work
              
            </a>
          </MagneticButton>
          <MagneticButton>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-6 py-3 font-mono text-sm border-2 border-primary text-primary rounded-lg hover:bg-primary/10 hover:-translate-y-1 transition-all duration-300 group"
            >
              Get in touch
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <ArrowRightIcon className="w-3 h-3" />
              </span>
            </a>
          </MagneticButton>
        </div>
        <div className="flex items-center gap-5 pt-8">
          {socialLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary hover:-translate-y-2 hover:scale-110 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${500 + index * 100}ms`, animationDuration: "700ms" }}
              aria-label={link.label}
            >
              <link.icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
        <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
          <DoubleArrowDownIcon className="w-6 h-6" />
        </a>
      </div>
    </section>
  )
}
