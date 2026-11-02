
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText)
  ScrollTrigger.config({ autoRefreshEvents: "visibilitychange,resize" })
  // Pins above shift the sections below, so one re-measure once the page and fonts are in keeps every
  // start/end position correct (one pass instead of several, because each pass is expensive)
  const loaded = new Promise<void>((resolve) => {
    if (document.readyState === "complete") resolve()
    else window.addEventListener("load", () => resolve(), { once: true })
  })
  Promise.all([loaded, document.fonts ? document.fonts.ready : Promise.resolve()]).then(() => setTimeout(() => ScrollTrigger.refresh(), 300))
}
