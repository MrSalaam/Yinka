"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Format pathname for the loader
  const pageName = pathname === "/" ? "HOME" : pathname.slice(1).toUpperCase()

  // Determine slide direction based on route
  let slideVariants: any = {
    initial: { height: "100vh", width: "100vw", top: 0, left: 0 },
    animate: { height: "0vh" }
  }

  switch (pathname) {
    case "/":
      // Slide Up
      slideVariants = {
        initial: { height: "100vh", width: "100vw", top: 0, left: 0 },
        animate: { height: "0vh" }
      }
      break
    case "/projects":
      // Slide Left
      slideVariants = {
        initial: { width: "100vw", height: "100vh", top: 0, left: 0 },
        animate: { width: "0vw" }
      }
      break
    case "/about":
      // Slide Down
      slideVariants = {
        initial: { height: "100vh", width: "100vw", bottom: 0, left: 0 },
        animate: { height: "0vh" }
      }
      break
    case "/experience":
      // Slide Right
      slideVariants = {
        initial: { width: "100vw", height: "100vh", top: 0, right: 0 },
        animate: { width: "0vw" }
      }
      break
    case "/contact":
      // Slide Up
      slideVariants = {
        initial: { height: "100vh", width: "100vw", top: 0, left: 0 },
        animate: { height: "0vh" }
      }
      break
  }

  return (
    <>
      <motion.div
        className="fixed z-[100] bg-foreground pointer-events-none overflow-hidden"
        initial={slideVariants.initial}
        animate={slideVariants.animate}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.6 }}
        >
          <motion.div className="overflow-hidden">
            <motion.h1 
              className="text-background text-[15vw] md:text-[10vw] font-black uppercase tracking-tighter leading-none whitespace-nowrap"
              initial={{ y: 0 }}
              animate={{ y: "100%" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            >
              {pageName}
            </motion.h1>
          </motion.div>
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.4 }}
      >
        {children}
      </motion.div>
    </>
  )
}
