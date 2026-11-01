"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { NewTwitterIcon, GithubIcon, InstagramIcon, Linkedin02Icon, ArrowUp01Icon } from "hugeicons-react"

const socialLinks = [
  { icon: GithubIcon, href: "https://github.com/MrSalaam", label: "GitHub" },
  { icon: InstagramIcon, href: "https://instagram.com/", label: "Instagram" },
  { icon: NewTwitterIcon, href: "https://x.com/OlayinkaSZN", label: "Twitter" },
  { icon: Linkedin02Icon, href: "https://linkedin.com/in/olayinka-salaam", label: "LinkedIn" },
]

/* The footer continues Connect's dark finale: a huge outlined wordmark whose
   letters rise as it scrolls into view. */
export function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!footerRef.current) return
    gsap.registerPlugin(ScrollTrigger, SplitText)
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const word = footerRef.current!.querySelector<HTMLElement>("[data-wordmark]")
        const bar = gsap.utils.toArray<HTMLElement>("[data-bar]", footerRef.current)
        if (!word) return
        const chars = SplitText.create(word, { type: "chars" }).chars
        gsap.set(chars, { yPercent: 110 })
        gsap.set(bar, { autoAlpha: 0, y: 16 })
        gsap
          .timeline({ scrollTrigger: { trigger: footerRef.current, start: "top 85%", toggleActions: "play none none reverse" } })
          .to(chars, { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.03 }, 0)
          .to(bar, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08 }, 0.5)
      }, footerRef)
      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

  return (
    <footer ref={footerRef} className="overflow-hidden bg-[#0a0a0a] px-6 pb-8 pt-4 text-white md:px-16 lg:px-24">
      {/* The wordmark: outlined, so it reads as a quiet signature */}
      <div className="overflow-hidden pb-[0.04em]" aria-label="Olayinka Salaam">
        <p
          data-wordmark
          aria-hidden="true"
          className="whitespace-nowrap text-center text-[clamp(2.5rem,9.5vw,10rem)] font-bold uppercase leading-[0.9] tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.28)]"
        >
          Olayinka Salaam
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-6 md:flex-row">
        <p data-bar className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
          © {new Date().getFullYear()} Olayinka Salaam
        </p>

        <div data-bar className="flex items-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 transition-colors duration-150 hover:text-white"
              aria-label={link.label}
            >
              <link.icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        <a
          data-bar
          href="#home"
          className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/50 transition-colors duration-150 hover:text-white"
        >
          Back to top
          <ArrowUp01Icon size={14} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </footer>
  )
}
