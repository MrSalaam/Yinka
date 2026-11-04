"use client"

import { useState, useEffect } from "react"
import "../lib/gsap-setup" // first, so GSAP is configured before any section uses it
import { HeroSection } from "../components/hero-section"
import { AboutSection } from "../components/about-section"
import { StackSection } from "../components/stack-section"
import { ProjectsSection } from "../components/projects-section"
import { ExperienceSection } from "../components/experience-section"
import { ContactSection } from "../components/contact-section"
import { SectionStack } from "../components/section-stack"
import { afterIntro } from "../lib/intro-gate"
import { setupSectionEntrances } from "../lib/section-enter"
import { openIntroGate } from "../lib/intro-gate"
import { traveller } from "../lib/traveller-store"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Footer } from "../components/footer"
import { useKonamiCode } from "../hooks/use-konami-code"
import { displayConsoleMessage } from "../lib/console-message"

const FLY_OUT = [true, false, false, false, false, false]
// No section is pulled up under another any more: About no longer pins or flies out
const PULL_UP = [false, false, false, false, false, false]

export default function Home() {
  const [showConfetti, setShowConfetti] = useState(false)

  // Scroll animations are built after the first paint, so the hero text can render first
  useEffect(() => {
    traveller.ready = 1
    // Wait for the hero text to finish arriving, then build the scroll animations when the browser is idle
    const t = setTimeout(() => {
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
      if (w.requestIdleCallback) w.requestIdleCallback(openIntroGate, { timeout: 1500 })
      else openIntroGate()
    }, 3400)
    return () => clearTimeout(t)
  }, [])

  // Each section arrives in its own way (skipped with reduced motion)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    return afterIntro(setupSectionEntrances)
  }, [])

  // Display console message on mount
  useEffect(() => {
    displayConsoleMessage()
  }, [])

  // Konami code easter egg
  useKonamiCode(() => {
    setShowConfetti(true)
    console.log("%c🎉 KONAMI CODE ACTIVATED! 🎉", "color: #111111; font-size: 24px; font-weight: bold;")
    console.log("%cYou found the secret! You're clearly a developer of culture 🎮", "color: #666; font-size: 14px;")

    // Create confetti effect
    const colors = ["#111111", "#555555", "#888888", "#bbbbbb"]
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div")
        confetti.style.cssText = `
          position: fixed;
          left: ${Math.random() * 100}%;
          top: -10px;
          width: 10px;
          height: 10px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          opacity: 1;
          transform: rotate(${Math.random() * 360}deg);
          pointer-events: none;
          z-index: 9999;
          animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
        `
        document.body.appendChild(confetti)
        setTimeout(() => confetti.remove(), 4000)
      }, i * 30)
    }

    setTimeout(() => setShowConfetti(false), 5000)
  })

  return (
    <>
      <div className="relative min-h-screen">

        <main>
          {/* Order: Hero, Works, About, Stack, Career, Connect. Hero flies out into Works (which has its own pinned card deck); About flies out into Stack from inside its own pin */}
          <SectionStack flyOut={FLY_OUT} pullUp={PULL_UP}>
            <HeroSection />
            <ProjectsSection />
            <AboutSection />
            <StackSection />
            <ExperienceSection />
            <ContactSection />
          </SectionStack>
        </main>
        <Footer />
        {/* The shared chrome drop is switched off while the site moves to a minimal look */}
      </div>

      <style jsx global>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
