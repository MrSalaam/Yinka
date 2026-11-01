"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Cursor = "bar" | "block" | "underscore" | "none"

export interface BackspaceTextProps {
  /** Lines in turn: each is typed, then deleted only back to the start it shares with the next. */
  text: string[]
  cursor?: Cursor
  /** Wait before the first character (ms). */
  delay?: number
  /** Time to delete one character (ms). */
  deleteSpeed?: number
  /** Average time to type one character (ms). */
  speed?: number
  /** How much each keystroke varies, 0 (even) to 1. */
  jitter?: number
  /** How long a finished line stays before it is corrected (ms). */
  pause?: number
  /** Correct the last line back into the first and go round again. */
  loop?: boolean
  /** Called once the last line is typed (when not looping). */
  onComplete?: () => void
  className?: string
}

type Step = { text: string; wait: number }

function sharedPrefix(a: string, b: string) {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  return i
}

const CURSOR_CLASS: Record<Exclude<Cursor, "none">, string> = {
  bar: "ml-[0.06em] inline-block h-[1em] w-[0.07em] translate-y-[0.12em]",
  block: "ml-[0.06em] inline-block h-[1em] w-[0.55em] translate-y-[0.12em]",
  underscore: "ml-[0.06em] inline-block h-[0.07em] w-[0.55em] translate-y-[0.1em]",
}

export function BackspaceText({
  text,
  cursor = "bar",
  delay = 0,
  deleteSpeed = 40,
  speed = 60,
  jitter = 0.5,
  pause = 1400,
  loop = true,
  onComplete,
  className,
}: BackspaceTextProps) {
  const lines = text
  const last = lines[lines.length - 1] ?? ""
  const [shown, setShown] = useState("")
  const [reduced, setReduced] = useState(false)

  // Keep the latest callback without restarting the animation
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // The whole script as a list of keystrokes: [text on screen, wait before the next one]
  const steps = useMemo(() => {
    const out: Step[] = []
    const type = (line: string, from: number) => {
      for (let k = from + 1; k <= line.length; k++) {
        const wait = speed * (1 + (Math.random() * 2 - 1) * jitter)
        out.push({ text: line.slice(0, k), wait })
      }
    }
    const erase = (line: string, to: number) => {
      for (let k = line.length - 1; k >= to; k--) out.push({ text: line.slice(0, k), wait: deleteSpeed })
    }

    type(lines[0] ?? "", 0)
    lines.forEach((line, i) => {
      const next = lines[i + 1] ?? (loop ? lines[0] : undefined)
      if (next === undefined) return
      if (out.length) out[out.length - 1].wait = pause
      const keep = sharedPrefix(line, next)
      erase(line, keep)
      type(next, keep)
    })
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines.join("\u0000"), speed, deleteSpeed, jitter, pause, loop])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
  }, [])

  useEffect(() => {
    // Reduced motion: no typing, the last line shows whole
    if (reduced) {
      setShown(last)
      const t = setTimeout(() => onCompleteRef.current?.(), 400)
      return () => clearTimeout(t)
    }

    let i = 0
    let timer: ReturnType<typeof setTimeout>

    const tick = () => {
      const step = steps[i]
      if (!step) {
        if (loop) i = 0
        else {
          onCompleteRef.current?.()
          return
        }
      }
      const s = steps[i]
      if (!s) return
      setShown(s.text)
      i++
      if (i >= steps.length && !loop) {
        onCompleteRef.current?.()
        return
      }
      timer = setTimeout(tick, s.wait)
    }

    timer = setTimeout(tick, delay)
    return () => clearTimeout(timer)
  }, [steps, delay, loop, reduced, last])

  return (
    <span data-slot="backspace-text" className={cn("inline", className)}>
      {/* Screen readers hear the line it settles on, never the keystrokes */}
      <span className="sr-only">{loop ? lines.join(" ") : last}</span>
      <span aria-hidden="true">
        {shown}
        {cursor !== "none" && <span className={cn("backspace-caret bg-current align-baseline", CURSOR_CLASS[cursor])} />}
      </span>
    </span>
  )
}
