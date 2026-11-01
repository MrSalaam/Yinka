"use client"

import { type ComponentProps, type CSSProperties, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export interface RotatingTextProps extends Omit<ComponentProps<"span">, "children"> {
  /** Which way the solid turns: "up" brings the next face in from below, "down" from above. @default "up" */
  direction?: "up" | "down"
  /** How long each text stays, in milliseconds. @default 2500 */
  duration?: number
  /** How long the turn takes, in milliseconds. @default 700 */
  turn?: number
  /** The texts, one per face of the solid, shown in turn from the first. */
  texts: string[]
}

/**
 * Texts on the faces of a 3D prism that rotates about the X axis.
 *
 * The stage uses `transform-style: preserve-3d`; face i is turned by
 * i × (360° / N) and pushed out by the prism's apothem, so the front face sits
 * flat at z = 0. Each tick rotates the whole stage one more step, so it always
 * keeps turning the same way (the angle never wraps back). Every text also sits
 * invisibly in one grid cell so the widest word holds the width. It pauses
 * while the pointer is over it. Face height is 1em, so size it with font-size.
 */
export const RotatingText = (props: RotatingTextProps) => {
  const { direction = "up", duration = 2500, turn = 700, texts, className, ...rest } = props
  const [tick, setTick] = useState(0)
  const [paused, setPaused] = useState(false)

  const count = texts.length
  const step = 360 / Math.max(count, 2)
  // Distance from the prism's axis to the middle of a face (face height is 1em)
  const apothem = count > 2 ? 1 / (2 * Math.tan(Math.PI / count)) : 0
  const sign = direction === "up" ? 1 : -1

  useEffect(() => {
    if (paused || count < 2) return
    const timer = window.setTimeout(() => setTick((t) => t + 1), duration)
    return () => window.clearTimeout(timer)
  }, [duration, paused, tick, count])

  return (
    <span
      className={cn("inline-block h-[1em] align-top leading-none", className)}
      data-slot="rotating-text"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      {...rest}
    >
      <span className="sr-only">{texts.join(", ")}</span>

      <span aria-hidden="true" className="relative inline-block h-full [perspective:12em]">
        {/* Every text, unseen in one cell: the widest sets the width */}
        <span className="invisible inline-grid whitespace-pre">
          {texts.map((text, i) => (
            <span key={i} className="[grid-area:1/1]">
              {text}
            </span>
          ))}
        </span>

        <span
          className="absolute inset-0 [transform-style:preserve-3d] motion-safe:transition-transform motion-safe:ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={
            {
              transform: `translateZ(${-apothem}em) rotateX(${sign * tick * step}deg)`,
              transitionDuration: `${turn}ms`,
            } as CSSProperties
          }
        >
          {texts.map((text, i) => (
            <span
              key={i}
              className="absolute inset-0 flex items-center whitespace-pre [backface-visibility:hidden]"
              style={{ transform: `rotateX(${-sign * i * step}deg) translateZ(${apothem}em)` }}
            >
              {text}
            </span>
          ))}
        </span>
      </span>
    </span>
  )
}
