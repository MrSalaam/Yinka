"use client"

import { useRef, useState, type ReactNode } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface MagneticButtonProps {
    children: ReactNode
    className?: string
    strength?: number
}

export function MagneticButton({ children, className = "", strength = 0.3 }: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)

    const x = useSpring(0, { stiffness: 150, damping: 15 })
    const y = useSpring(0, { stiffness: 150, damping: 15 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const distanceX = (e.clientX - centerX) * strength
        const distanceY = (e.clientY - centerY) * strength

        x.set(distanceX)
        y.set(distanceY)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{ x, y }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
