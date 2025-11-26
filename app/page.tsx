"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "../components/hero-section"
import { AboutSection } from "../components/about-section"
import { QuoteSection } from "../components/quote-section"
import { ExperienceSection } from "../components/experience-section"
import { ProjectsSection } from "../components/projects-section"
import { SkillsSection } from "../components/skills-section"
import { ContactSection } from "../components/contact-section"
import { Navigation } from "../components/navigation"
import { Footer } from "../components/footer"
// import { CursorGlow } from "../components/cursor-glow"
import { LoadingScreen } from "../components/loading-screen"
import { useKonamiCode } from "../hooks/use-konami-code"
import { displayConsoleMessage } from "../lib/console-message"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setTimeout(() => setShowContent(true), 100)
  }

  // Display console message on mount
  useEffect(() => {
    displayConsoleMessage()
  }, [])

  // Konami code easter egg
  useKonamiCode(() => {
    setShowConfetti(true)
    console.log("%c🎉 KONAMI CODE ACTIVATED! 🎉", "color: #ec5a00; font-size: 24px; font-weight: bold;")
    console.log("%cYou found the secret! You're clearly a developer of culture 🎮", "color: #666; font-size: 14px;")

    // Create confetti effect
    const colors = ["#ec5a00", "#ff7f50", "#ffa500", "#ffb347"]
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
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <div
        className={`relative min-h-screen transition-opacity duration-700 ${showContent ? "opacity-100" : "opacity-0"}`}
      >
        {/* <CursorGlow /> */}
        <Navigation />
        <main className="mx-auto max-w-6xl px-6 lg:px-12">
          <HeroSection />
          <AboutSection />
          <QuoteSection />
          <ExperienceSection />
          <ProjectsSection />
          <SkillsSection />
          <ContactSection />
        </main>
        <Footer />
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
