"use client"

import { motion } from "framer-motion"

export function ImageReveal({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 z-10 bg-background"
        initial={{ height: "100%" }}
        whileInView={{ height: "0%" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        initial={{ scale: 1.2 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  )
}
