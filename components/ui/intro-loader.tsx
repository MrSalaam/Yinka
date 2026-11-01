"use client"

import React, { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { RotateCw, X } from "lucide-react"
import { cn } from "../../lib/utils"
import { motionTransitions } from "../../lib/motion-tokens"

export interface GreetingItem {
  text: string
  lang?: string
}

export interface IntroLoaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"> {
  /** Multilingual greetings to cycle through (strings or { text, lang } objects) */
  greetings?: (string | GreetingItem)[]
  /** Callback fired when welcome sequence completes */
  onComplete?: () => void
  /** Whether to render as fixed full-screen overlay or inline container */
  fullScreen?: boolean
  /** Milliseconds per greeting cycle */
  intervalMs?: number
  /** Show hairline progress indicator */
  showProgress?: boolean
  /** Show language badge above the greeting */
  showLangBadge?: boolean
  /** Allow pressing ESC or clicking Skip button to bypass */
  allowSkip?: boolean
  /** Speed multiplier (e.g. 1 = normal, 1.5 = fast) */
  speedMultiplier?: number
  /** Keep cycling forever instead of finishing (for ambient inline use) */
  loop?: boolean
}

const DEFAULT_GREETINGS: GreetingItem[] = [
  { text: "Hello", lang: "EN" },
  { text: "Hola", lang: "ES" },
  { text: "Bonjour", lang: "FR" },
  { text: "Ciao", lang: "IT" },
  { text: "こんにちは", lang: "JA" },
  { text: "नमस्कार", lang: "HI" },
]

export const IntroLoader: React.FC<IntroLoaderProps> = ({
  greetings = DEFAULT_GREETINGS,
  onComplete,
  fullScreen = true,
  intervalMs = 240,
  showProgress = true,
  showLangBadge = true,
  allowSkip = true,
  speedMultiplier = 1,
  loop = false,
  className,
  ...props
}) => {
  const normalizedGreetings: GreetingItem[] = greetings.map((g) => (typeof g === "string" ? { text: g } : g))

  const [greetingIndex, setGreetingIndex] = useState(0)
  const [stage, setStage] = useState<"greeting" | "done">("greeting")
  const [cycleKey, setCycleKey] = useState(0)
  const reducedMotion = useReducedMotion()

  const adjustedInterval = Math.max(100, Math.round(intervalMs / speedMultiplier))

  const handleFinish = useCallback(() => {
    setStage("done")
    onComplete?.()
  }, [onComplete])

  // Greeting cycling (runs on mount and on every replay)
  useEffect(() => {
    if (stage !== "greeting") return

    // Reduced motion: no cycling. Looping panels hold on the first greeting.
    if (reducedMotion) {
      if (!loop) handleFinish()
      return
    }

    setGreetingIndex(0)

    let finishTimeout: ReturnType<typeof setTimeout> | null = null
    const interval = setInterval(() => {
      setGreetingIndex((prev) => {
        if (prev < normalizedGreetings.length - 1) return prev + 1
        if (loop) return 0
        clearInterval(interval)
        finishTimeout = setTimeout(handleFinish, Math.round(450 / speedMultiplier))
        return prev
      })
    }, adjustedInterval)

    return () => {
      clearInterval(interval)
      if (finishTimeout) clearTimeout(finishTimeout)
    }
  }, [cycleKey, stage, normalizedGreetings.length, adjustedInterval, reducedMotion, handleFinish, speedMultiplier, loop])

  // ESC to skip
  useEffect(() => {
    if (!allowSkip || stage === "done") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        handleFinish()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [allowSkip, stage, handleFinish])

  const replay = () => {
    setGreetingIndex(0)
    setStage("greeting")
    setCycleKey((prev) => prev + 1)
  }

  const current = normalizedGreetings[greetingIndex] || normalizedGreetings[0]
  const progressPercent = stage === "greeting" ? ((greetingIndex + 1) / normalizedGreetings.length) * 100 : 100

  return (
    <AnimatePresence mode="wait">
      {stage !== "done" ? (
        <motion.div
          key={`intro-overlay-${cycleKey}`}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: reducedMotion ? 1 : 1.02,
            filter: reducedMotion ? "none" : "blur(12px)",
          }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          role={fullScreen ? "dialog" : "group"}
          aria-modal={fullScreen || undefined}
          aria-label="Welcome greetings"
          className={cn(
            "flex select-none flex-col items-center justify-center overflow-hidden",
            fullScreen ? "fixed inset-0 z-[100] bg-[#090909]" : "relative h-80 w-full bg-[#090909] sm:h-96",
            className,
          )}
          {...props}
        >
          {/* Ambient backlight */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="h-72 w-72 rounded-full bg-white/[0.035] blur-[80px] sm:h-96 sm:w-96" />
          </div>

          {/* Screen readers: announce once, not on every cycle when looping */}
          <div className="sr-only" aria-live={loop ? "off" : "polite"} aria-atomic="true">
            {loop ? "Hello" : current.text}
          </div>

          {allowSkip && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.25 }}
              onClick={handleFinish}
              className="absolute right-4 top-4 z-20 flex cursor-pointer items-center gap-1.5 rounded-full border border-[#333333] bg-[#181818]/90 px-3 py-1.5 font-mono text-[11px] text-[#A1A1A1] backdrop-blur-md transition-all hover:border-[#4A4A4A] hover:text-white sm:right-6 sm:top-6"
              aria-label="Skip welcome sequence"
            >
              <span>Skip</span>
              <kbd className="hidden rounded border border-[#1F1F1F] bg-[#222222] px-1 text-[9px] text-[#6B6B6B] sm:inline-block">ESC</kbd>
              <X className="h-3 w-3 sm:hidden" />
            </motion.button>
          )}

          {/* Greeting */}
          <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center justify-center px-4 text-center">
            {showLangBadge && current.lang && (
              <span className="mb-4 rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
                {current.lang}
              </span>
            )}
            <motion.div
              key={`greeting-${greetingIndex}`}
              aria-hidden="true"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 10, filter: "blur(8px)" }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center text-center"
            >
              <span className="text-4xl font-medium tracking-tight text-[#FAFAFA] sm:text-5xl md:text-6xl">{current.text}</span>
            </motion.div>
          </div>

          {showProgress && (
            <div className="pointer-events-none absolute inset-x-8 bottom-6 h-[2px] overflow-hidden rounded-full bg-white/[0.08] sm:inset-x-1/3 sm:bottom-8">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-white/40 via-white to-white/70"
                animate={{ width: `${progressPercent}%` }}
                transition={{ ease: "easeOut", duration: 0.22 }}
              />
            </div>
          )}
        </motion.div>
      ) : (
        !fullScreen && (
          <motion.div
            key="replay-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={motionTransitions.springGentle}
            className="flex h-80 w-full items-center justify-center sm:h-96"
          >
            <button
              type="button"
              onClick={replay}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#1F1F1F] bg-[#0E0E0E] px-4 py-2.5 text-xs font-medium text-white shadow-sm transition-all hover:border-[#4A4A4A] hover:bg-[#262626] active:scale-95"
              aria-label="Replay greetings"
            >
              <RotateCw className="h-3.5 w-3.5 text-white" />
              <span>Replay</span>
            </button>
          </motion.div>
        )
      )}
    </AnimatePresence>
  )
}

export default IntroLoader
