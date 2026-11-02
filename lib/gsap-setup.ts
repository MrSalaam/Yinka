
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText)
  ScrollTrigger.config({ autoRefreshEvents: "visibilitychange,resize" })
  const settle = () => setTimeout(() => ScrollTrigger.refresh(), 300)
  if (document.readyState === "complete") settle()
  else window.addEventListener("load", settle, { once: true })
  if (document.fonts) {
    document.fonts.ready.then(() => requestAnimationFrame(() => ScrollTrigger.refresh()))
  }
}
