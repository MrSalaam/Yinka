"use client"

import { useState, useEffect } from "react"

export function LoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          // Add a tiny delay so the user sees "100" before it disappears
          setTimeout(onLoadingComplete, 400)
          return 100
        }
        // Increment randomly between 2 and 15
        return prev + Math.floor(Math.random() * 14) + 2
      })
    }, 80)

    return () => {
      clearInterval(progressInterval)
    }
  }, [onLoadingComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative z-10 flex items-baseline gap-2">
        <span className="text-[30vw] md:text-[20rem] font-bold tracking-tighter tabular-nums leading-none bg-gradient-to-br from-gray-800 via-gray-400 to-gray-800 dark:from-gray-600 dark:via-gray-400 dark:to-gray-100 bg-clip-text text-transparent">
          {Math.min(progress, 100)}
        </span>
        <span className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-gray-800 via-gray-400 to-gray-800 dark:from-gray-600 dark:via-gray-400 dark:to-gray-100 bg-clip-text text-transparent opacity-50 mb-4 md:mb-12">
          %
        </span>
      </div>
    </div>
  )
}
