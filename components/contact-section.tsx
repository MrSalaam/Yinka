"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Send, CheckCircle2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { motion, useInView, type Variants } from "framer-motion"

export function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log(formState)
    setIsSubmitting(false)
    setIsSuccess(true)

    // Reset form after delay
    setTimeout(() => {
      setIsSuccess(false)
      setFormState({ name: "", email: "", message: "" })
    }, 3000)
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <section id="contact" className="py-24 scroll-mt-20" ref={ref}>
      <motion.div
        className="max-w-2xl mx-auto text-center"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.p variants={itemVariants} className="contact-eyebrow font-mono text-primary mb-4">
          05. What's Next?
        </motion.p>
        <motion.h2 variants={itemVariants} className="contact-title text-4xl md:text-5xl font-bold text-foreground mb-6 flex items-center justify-center gap-3">
          Get In Touch
        </motion.h2>
        <motion.p variants={itemVariants} className="contact-description text-muted-foreground leading-relaxed mb-12">
          I'm currently looking for new opportunities and my inbox is always open. Whether you have a question, want to
          collaborate, or just want to say hi, I'll try my best to get back to you!
        </motion.p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants} className="form-group space-y-2 group">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground group-focus-within:text-primary transition-colors"
              >
                Name
              </label>
              <Input
                id="name"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                placeholder="John Doe"
                className="bg-card border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </motion.div>
            <motion.div variants={itemVariants} className="form-group space-y-2 group">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground group-focus-within:text-primary transition-colors"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                placeholder="john@mail.com"
                className="bg-card border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </motion.div>
          </div>
          <motion.div variants={itemVariants} className="form-group space-y-2 group">
            <label
              htmlFor="message"
              className="text-sm font-medium text-foreground group-focus-within:text-primary transition-colors"
            >
              Message
            </label>
            <Textarea
              id="message"
              value={formState.message}
              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              placeholder="Hey Yinka, I'd love to chat about..."
              rows={6}
              className="bg-card border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`w-full md:w-auto px-8 py-6 font-mono transition-all duration-300 ${isSuccess ? "bg-green-500 hover:bg-green-600 text-white" : "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25"
                }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending...
                </span>
              ) : isSuccess ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Message Sent!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </span>
              )}
            </Button>
          </motion.div>
        </form>

        <motion.div variants={itemVariants} className="email-link mt-16">
          <a
            href="mailto:olayinkasalaam.dev@gmail.com"
            className="inline-flex items-center px-8 py-4 font-mono text-xs sm:text-sm lg:text-lg border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            olayinkasalaam.dev@gmail.com
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
