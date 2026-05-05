"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlossyButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode
}

export const GlossyButton = React.forwardRef<HTMLButtonElement, GlossyButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300",
          "bg-gradient-to-r from-gray-500 to-gray-700 text-white shadow-lg hover:shadow-xl",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

GlossyButton.displayName = "GlossyButton"