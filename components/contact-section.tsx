"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Send, Sparkles } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  const containerRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      })

      tl.from(".contact-eyebrow", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      })
        .from(
          ".contact-title",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.4",
        )
        .from(
          ".contact-description",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.6",
        )
        .from(
          ".form-group",
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.4",
        )
        .from(
          ".submit-button",
          {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.2",
        )
        .from(
          ".email-link",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4",
        )

      // Button hover effect
      const button = buttonRef.current
      if (button) {
        button.addEventListener("mouseenter", () => {
          gsap.to(button, { scale: 1.05, duration: 0.3, ease: "elastic.out(1, 0.5)" })
        })
        button.addEventListener("mouseleave", () => {
          gsap.to(button, { scale: 1, duration: 0.3, ease: "power2.out" })
        })
      }
    },
    { scope: containerRef },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formState)

    // Success animation simulation
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        width: "50px",
        color: "transparent",
        duration: 0.3,
        onComplete: () => {
          gsap.to(buttonRef.current, {
            backgroundColor: "#22c55e", // green-500
            scale: 1.1,
            duration: 0.2,
            yoyo: true,
            repeat: 1
          })
        }
      })
    }
  }

  return (
    <section id="contact" className="py-24 scroll-mt-20" ref={containerRef}>
      <div className="max-w-2xl mx-auto text-center">
        <p className="contact-eyebrow font-mono text-primary mb-4">
          05. What's Next?
        </p>
        <h2 className="contact-title text-4xl md:text-5xl font-bold text-foreground mb-6 flex items-center justify-center gap-3">
          Get In Touch
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
        </h2>
        <p className="contact-description text-muted-foreground leading-relaxed mb-12">
          I'm currently looking for new opportunities and my inbox is always open. Whether you have a question, want to
          collaborate, or just want to say hi, I'll try my best to get back to you!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="form-group space-y-2 group">
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
              />
            </div>
            <div className="form-group space-y-2 group">
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
                placeholder="john@example.com"
                className="bg-card border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          <div className="form-group space-y-2 group">
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
              placeholder="Hey Alex, I'd love to chat about..."
              rows={6}
              className="bg-card border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>
          <Button
            ref={buttonRef}
            type="submit"
            className="submit-button w-full md:w-auto px-8 py-6 font-mono bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </form>

        <div className="email-link mt-16">
          <a
            href="mailto:hello@alexchen.dev"
            className="inline-flex items-center px-8 py-4 font-mono text-lg border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            hello@alexchen.dev
          </a>
        </div>
      </div>
    </section>
  )
}
