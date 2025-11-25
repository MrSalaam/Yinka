"use client"

import { useEffect, useState } from "react"

export function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 lg:block hidden"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, oklch(0.65 0.2 45 / 0.08), transparent 40%)`,
      }}
    />
  )
}
