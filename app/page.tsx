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
import { TravellerCanvas } from "../components/traveller-canvas"
import { traveller } from "../lib/traveller-store"
import { canRender3D } from "../lib/gpu"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Footer } from "../components/footer"
import { LoadingScreen } from "../components/loading-screen"
import { useKonamiCode } from "../hooks/use-konami-code"
import { displayConsoleMessage } from "../lib/console-message"

const FLY_OUT = [true, false, false, false, false, false]
// Stack slides up under About, which flies out from inside its own pin
const PULL_UP = [false, false, false, true, false, false]

export default function Home() {
  // "loading": the typing screen covers the page. "leaving": it fades out. "done": gone.
  // The page itself is always in the HTML and never hidden, so search engines read all of it.
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">("loading")
  const [showConfetti, setShowConfetti] = useState(false)
  const showContent = phase !== "loading"
  // True when About falls back to plain type (no 3D, or reduced motion): then Stack must not be pulled up under it
  const [plainAbout, setPlainAbout] = useState(false)

  const handleLoadingComplete = () => {
    try {
      sessionStorage.setItem("seen-intro", "1")
    } catch {}
    setPhase("leaving")
    setTimeout(() => setPhase("done"), 700)
  }

  useEffect(() => {
    const plain = window.matchMedia("(prefers-reduced-motion: reduce)").matches || !canRender3D()
    if (plain) {
      setPlainAbout(true)
      // The layout changed, so the scroll positions need recalculating
      // About and Stack settle over a few renders, so measure again as they do
      gsap.registerPlugin(ScrollTrigger)
      const timers = [700].map((ms) => setTimeout(() => ScrollTrigger.refresh(), ms))
      return () => timers.forEach(clearTimeout)
    }
  }, [])

  // Skip the intro for search-engine bots and speed tests, for reduced motion,
  // and when it has already played in this browser session
  useEffect(() => {
    let skip =
      /bot|crawl|spider|lighthouse|pagespeed|gtmetrix|headless/i.test(navigator.userAgent) ||
      navigator.webdriver ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    try {
      skip = skip || sessionStorage.getItem("seen-intro") === "1"
    } catch {}
    if (skip) setPhase("done")
  }, [])

  // The shared 3D layer waits for the loading screen to finish
  useEffect(() => {
    traveller.ready = showContent ? 1 : 0
  }, [showContent])

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
      {phase !== "done" && (
        <div className={`fixed inset-0 z-50 transition-opacity duration-700 ${phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"}`}>
          <LoadingScreen onLoadingComplete={handleLoadingComplete} />
        </div>
      )}
      <div className="relative min-h-screen">

        <main>
          {/* Order: Hero, Works, About, Stack, Career, Connect. Hero flies out into Works (which has its own pinned card deck); About flies out into Stack from inside its own pin */}
          <SectionStack flyOut={FLY_OUT} pullUp={plainAbout ? [] : PULL_UP}>
            <HeroSection ready={showContent} />
            <ProjectsSection />
            <AboutSection />
            <StackSection />
            <ExperienceSection />
            <ContactSection />
          </SectionStack>
        </main>
        <Footer />
        <TravellerCanvas />
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
