"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Quote } from "lucide-react"

export function QuoteSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section ref={ref} className="py-20 md:py-32 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="container px-4 md:px-6 mx-auto">
                <div className="max-w-4xl mx-auto text-center relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mb-8 flex justify-center"
                    >
                        <div className="p-4 rounded-full bg-primary/10 text-primary">
                            <Quote size={48} className="fill-current opacity-50" />
                        </div>
                    </motion.div>

                    <motion.blockquote
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-3xl md:text-5xl font-bold leading-tight mb-8 tracking-tight"
                    >
                        "Computer science is no more about computers than astronomy is about telescopes."
                    </motion.blockquote>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col items-center"
                    >
                        <cite className="text-xl md:text-2xl font-medium not-italic text-foreground/80">
                            Edsger W. Dijkstra
                        </cite>
                        <span className="text-sm md:text-base text-muted-foreground mt-2">
                            Theoretical Physicist & Computer Scientist
                        </span>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
