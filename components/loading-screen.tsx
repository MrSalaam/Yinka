"use client"

import { useCallback } from "react"
import { BackspaceText } from "./ui/backspace-text"

// A slip on purpose: "Yinak" is typed, noticed and fixed, then the line is rewritten and finally replaced
const LINES = ["Hello, I'm Yinak.", "Hello, I'm Yinka.", "Hello, I build for the web.", "Come on in, let's make something."]

export function LoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  // Hold the finished line for a beat so it can be read, then hand over
  const handleComplete = useCallback(() => {
    setTimeout(onLoadingComplete, 700)
  }, [onLoadingComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background px-6">
      <h1 className="w-full max-w-4xl text-left text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-7xl">
        <BackspaceText
          text={LINES}
          loop={false}
          speed={42}
          deleteSpeed={32}
          pause={420}
          delay={250}
          onComplete={handleComplete}
        />
      </h1>
    </div>
  )
}
