"use client"

import { motion } from "framer-motion"

export function TextReveal({ text, className = "", textClassName = "", delay = 0 }: { text: string, className?: string, textClassName?: string, delay?: number }) {
  const words = text.split(" ")

  return (
    <div className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <div key={i} className="overflow-hidden inline-block mr-[0.25em] pb-4">
          <motion.div
            className={textClassName}
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: [0.76, 0, 0.24, 1],
              delay: delay + i * 0.1,
            }}
          >
            {word}
          </motion.div>
        </div>
      ))}
    </div>
  )
}
