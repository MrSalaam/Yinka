"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "../components/hero-section"
import { AboutSection } from "../components/about-section"
import { StackSection } from "../components/stack-section"
import { ProjectsSection } from "../components/projects-section"
import { ExperienceSection } from "../components/experience-section"
import { ContactSection } from "../components/contact-section"
import { SectionStack } from "../components/section-stack"
import { TravellerCanvas } from "../components/traveller-canvas"
import { traveller } from "../lib/traveller-store"
import { Footer } from "../components/footer"
import { LoadingScreen } from "../components/loading-screen"
import { useKonamiCode } from "../hooks/use-konami-code"
import { displayConsoleMessage } from "../lib/console-message"

const FLY_OUT = [true, false, false, false, false, false]
// Stack slides up under About, which flies out from inside its own pin
const PULL_UP = [false, false, false, true, false, false]

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setTimeout(() => setShowContent(true), 100)
  }

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
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <div
        className={`relative min-h-screen transition-opacity duration-700 ${showContent ? "opacity-100" : "opacity-0"}`}
      >

        <main>
          {/* Order: Hero, Works, About, Stack, Career, Connect. Hero flies out into Works (which has its own pinned card deck); About flies out into Stack from inside its own pin */}
          <SectionStack flyOut={FLY_OUT} pullUp={PULL_UP}>
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
