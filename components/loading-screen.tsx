"use client"

import { useState, useEffect } from "react"

export function LoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [text, setText] = useState("")
  const fullText = "Loading portfolio..."

  useEffect(() => {
    // Typing animation
    let charIndex = 0
    const typingInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setText(fullText.slice(0, charIndex))
        charIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 80)

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(onLoadingComplete, 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 150)

    return () => {
      clearInterval(typingInterval)
      clearInterval(progressInterval)
    }
  }, [onLoadingComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
          style={{ animation: "float 4s ease-in-out infinite" }}
        />
        <div
          className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
          style={{ animation: "float 5s ease-in-out infinite reverse" }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-2xl"
          style={{ animation: "scale-pulse 3s ease-in-out infinite" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        

        {/* Terminal-style text */}
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-lg border border-border bg-card px-6 py-3 font-mono shadow-lg">
            <span className="text-primary">$ </span>
            <span className="text-foreground">{text}</span>
            <span className="animate-pulse text-primary">|</span>
          </div>

          {/* Progress bar */}
          <div className="relative h-2 w-64 overflow-hidden rounded-full bg-secondary">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
            {/* Shimmer effect on progress bar */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                animation: "shimmer 1.5s infinite",
                backgroundSize: "200% 100%",
              }}
            />
          </div>

          {/* Progress percentage */}
          <span className="font-mono text-sm text-muted-foreground">{Math.min(Math.round(progress), 100)}%</span>
        </div>

        {/* Loading indicators */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-primary"
              style={{
                animation: "bounce-subtle 1s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
