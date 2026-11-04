"use client"

import { type AnimationEvent, type ComponentProps, type CSSProperties, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export interface SplittingTextProps extends Omit<ComponentProps<"span">, "children"> {
  /** What slides in on its own: each character, each word, or each line (`\n`). @default "characters" */
  by?: "characters" | "words" | "lines"
  /** The wait before the first one slides in, in milliseconds. @default 0 */
  delay?: number
  /** Where each one slides in from. @default "end" */
  direction?: "end" | "start" | "top" | "bottom"
  /** How long one unit takes to slide in, in milliseconds. @default 700 */
  duration?: number
  /** Called once the last unit is in place. */
  onComplete?: () => void
  /** The time between one and the next, in milliseconds. @default 50 (characters), 200 (words), 300 (lines) */
  stagger?: number
  /** The text. Its line breaks (`\n`) are kept. */
  text: string
  /** When it plays: as soon as it's on the page, or once it scrolls into view. @default "mount" */
  trigger?: "mount" | "view"
}

type By = NonNullable<SplittingTextProps["by"]>

const segmenter = typeof Intl.Segmenter === "function" ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : undefined

/** A word's characters, whole (emoji and accents stay one character). */
const graphemes = (word: string) => (segmenter ? Array.from(segmenter.segment(word), (part) => part.segment) : Array.from(word))

const LINES = /\r?\n/
const SPACES = /(\s+)/
const SPACE = /^\s+$/

/** What one part (a word, a space or a line) splits into. */
const unitsOf = (part: string, by: By) => {
  if (SPACE.test(part)) return []
  return by === "words" ? [part] : graphemes(part)
}

/** The text's parts (words and the spaces between them, or lines), each with the units that slide in, numbered across the text. */
const partsOf = (text: string, by: By) => {
  if (by === "lines") {
    return text.split(LINES).map((line, key) => ({ key, part: line, units: [{ index: key, value: line }] }))
  }
  let count = 0
  return text
    .split(SPACES)
    .filter(Boolean)
    .map((part, key) => {
      const units = unitsOf(part, by).map((value, offset) => ({ index: count + offset, value }))
      count += units.length
      return { key, part, units }
    })
}

const STAGGER: Record<By, number> = { characters: 50, lines: 300, words: 200 }

/** Where units come from, as a direction on each axis; the line's start and end follow the text's own direction. */
const FROM = {
  bottom: "[--splitting-text-dy:1]",
  end: "[--splitting-text-dx:1] [&:dir(rtl)]:[--splitting-text-dx:-1]",
  start: "[--splitting-text-dx:-1] [&:dir(rtl)]:[--splitting-text-dx:1]",
  top: "[--splitting-text-dy:-1]",
}

/** Each unit that slides in: `splitting-text` keyframes, delayed by its index. */
const UNIT =
  "inline-block animate-splitting-text group-data-[view=out]/splitting-text:[animation-play-state:paused] motion-reduce:animate-none [@media(scripting:none)]:animate-none"

/**
 * Text split into characters, words or lines that slide into place one after the other.
 * With reduced motion the text is simply there.
 *
 * @cssvar --splitting-text-distance How far each unit slides in from (`1.5em`).
 * @cssvar --splitting-text-duration One unit's slide.
 * @cssvar --splitting-text-filter A filter each unit starts from, cleared as it lands (`none`; `blur(8px)` for a soft start).
 */
export const SplittingText = (props: SplittingTextProps) => {
  const { by = "characters", delay, direction = "end", duration, onComplete, stagger, text, trigger = "mount", className, ...rest } = props
  const root = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(trigger === "mount")
  const completed = useRef(false)
  const parts = partsOf(text, by)
  // The last unit, whose end is the whole text's.
  const last = parts.reduce((count, part) => count + part.units.length, 0) - 1

  useEffect(() => {
    const node = root.current
    if (trigger !== "view" || !node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          setVisible(true)
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [trigger])

  // With reduced motion nothing plays, so nothing ends: it's complete once shown.
  useEffect(() => {
    if (visible && !completed.current && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      completed.current = true
      onComplete?.()
    }
  }, [visible, onComplete])

  const animationEnd = (event: AnimationEvent<HTMLSpanElement>) => {
    if ((event.target as HTMLElement).dataset.last !== undefined) onComplete?.()
  }

  return (
    <span className={cn("group/splitting-text", className)} data-slot="splitting-text" data-view={visible ? "in" : "out"} ref={root} {...rest}>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        className={cn("whitespace-pre-line", FROM[direction])}
        dir="auto"
        onAnimationEnd={animationEnd}
        style={
          {
            "--splitting-text-delay": delay === undefined ? undefined : `${delay}ms`,
            "--splitting-text-duration": duration === undefined ? undefined : `${duration}ms`,
            "--splitting-text-stagger": `${stagger ?? STAGGER[by]}ms`,
          } as CSSProperties
        }
      >
        {parts.map((part) =>
          part.units.length === 0 ? (
            part.part
          ) : (
            <span className={by === "lines" ? "block" : "inline-block whitespace-nowrap"} key={part.key}>
              {part.units.map((unit) => (
                <span
                  className={UNIT}
                  data-last={unit.index === last ? "" : undefined}
                  key={unit.index}
                  style={{ "--splitting-text-index": unit.index } as CSSProperties}
                >
                  {unit.value}
                </span>
              ))}
            </span>
          ),
        )}
      </span>
    </span>
  )
}
