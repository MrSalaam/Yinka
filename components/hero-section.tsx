"use client"

import { DoubleArrowDownIcon } from "@radix-ui/react-icons"
import { GlossyButton } from "./ui/glossy-button"
import { ArrowUpRight01Icon } from "hugeicons-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { TextReveal } from "./ui/text-reveal"
import { MagneticEffect } from "./ui/magnetic-effect"
import { FadeIn } from "./ui/fade-in"

export function HeroSection() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsNavigating(true)
    setTimeout(() => {
      router.push("/projects")
    }, 1000)
  }

  return (
    <>
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            className="fixed inset-0 z-[100] bg-foreground flex items-center justify-center pointer-events-none"
            initial={{ height: "0vh", top: 0 }}
            animate={{ height: "100vh" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div className="overflow-hidden">
              <motion.h1
                className="text-background text-[15vw] md:text-[10vw] font-black uppercase tracking-tighter leading-none"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
              >
                PROJECTS
              </motion.h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="min-h-screen flex flex-col justify-center items-center relative px-4 md:px-0">
        <div className="flex flex-col items-start text-left space-y-8 w-full max-w-7xl mx-auto px-6 lg:px-12 z-20 relative">

          <TextReveal 
            text="Pristine Web Architect." 
            className="max-w-none pb-4"
            textClassName="text-6xl md:text-8xl lg:text-9xl uppercase font-bold tracking-tighter leading-none bg-gradient-to-br from-gray-800 via-gray-400 to-gray-800 dark:from-gray-600 dark:via-gray-400 dark:to-gray-100 bg-clip-text text-transparent pb-4"
          />

          <FadeIn delay={0.6}>
            <div className="pt-8 flex flex-col sm:flex-row items-center gap-6">
              <a href="/projects" onClick={handleNavigate}>
                <MagneticEffect>
                  <GlossyButton className="flex items-center gap-2">
                    <span>View Exhibition</span>
                    <ArrowUpRight01Icon size={18} />
                  </GlossyButton>
                </MagneticEffect>
              </a>
            </div>
          </FadeIn>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-50 hover:opacity-100 transition-opacity duration-500 z-10">
          <a href="#about" aria-label="Scroll down">
            <DoubleArrowDownIcon className="w-5 h-5 animate-bounce-subtle text-foreground" />
          </a>
        </div>


        <div className="absolute bottom-0 right-0 pointer-events-none select-none overflow-hidden translate-y-1/4 opacity-[0.03] dark:opacity-[0.02] w-full flex">
          <motion.div
            animate={{ x: [0, "-50%"] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 35,
              ease: "linear",
            }}
            className="flex whitespace-nowrap"
          >
            {[...Array(6)].map((_, i) => (
              <h2 key={i} className="text-[15vw] md:text-[12vw] font-bold uppercase tracking-[0.1em] leading-none pr-24">
                Frontend Developer
              </h2>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
