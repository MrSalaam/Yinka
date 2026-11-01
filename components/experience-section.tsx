"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import experiences from "../data/experience.json"
import { whenNear } from "@/lib/when-near"
import { canRender3D } from "@/lib/gpu"

/* ────────────────────────────────────────────────────────────────────────────
 * Career: a pinned journey. A line winds through 3D space with one node per
 * job; scrolling flies the camera along it (Three.js) while GSAP writes each
 * job in as the camera reaches its node.
 * ──────────────────────────────────────────────────────────────────────────── */

type Job = { company: string; role: string; period: string; location?: string; description: string }

const JOBS = experiences as Job[]
const N = JOBS.length
const STEP = 3 // timeline units between nodes
const T = STEP * (N - 1) + 2 // plus a short hold at the end

function JobBeat({ job, className = "" }: { job: Job; className?: string }) {
  return (
    <div data-job className={`max-w-[48rem] ${className}`}>
      <p data-rest className="mb-5 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        {job.period}
      </p>
      {/* The mask the company's letters rise through */}
      <h3
        // Sized from the name's length so a long one ("RAJ Consulting") still fits on one line
        style={{ fontSize: `clamp(1.75rem, min(6.5vw, ${(70 / job.company.length).toFixed(2)}vw, ${(46 / (0.74 * job.company.length)).toFixed(2)}rem), 6rem)` }}
        className="-my-[0.05em] py-[0.05em] pr-[0.14em] font-bold uppercase leading-[0.9] tracking-tighter [overflow-x:visible] [overflow-y:clip]"
      >
        <span data-company className="block whitespace-nowrap">
          {job.company}
        </span>
      </h3>
      <p data-rest className="mt-4 font-mono text-sm uppercase tracking-widest text-foreground/70">
        {job.role}
      </p>
      <p data-rest className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
        {job.description}
      </p>
      {job.location && (
        <p data-rest className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
          {job.location}
        </p>
      )}
    </div>
  )
}

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0) // 0..1 along the journey
  const activeRef = useRef(true)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  /* ── Scroll timeline (GSAP) ─────────────────────────────────────────────── */
  useEffect(() => {
    if (reduced || !sectionRef.current) return
    gsap.registerPlugin(ScrollTrigger, SplitText)
    const section = sectionRef.current

    const ctx = gsap.context(() => {
      const beats = gsap.utils.toArray<HTMLElement>("[data-job]", section)
      const dots = gsap.utils.toArray<HTMLElement>("[data-dot]", section)
      const bar = section.querySelector<HTMLElement>("[data-progress]")
      const state = { t: 0 }

      beats.slice(1).forEach((b) => gsap.set(b, { autoAlpha: 0 }))

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${(T / 4) * window.innerHeight}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar) bar.style.transform = `scaleX(${self.progress})`
            const unit = self.progress * T
            dots.forEach((d, i) => d.classList.toggle("bg-foreground", unit >= STEP * i - 0.6))
          },
        },
      })

      // The camera's place along the journey
      tl.to(
        state,
        {
          t: 1,
          duration: STEP * (N - 1),
          onUpdate: () => {
            progressRef.current = state.t
          },
        },
        0,
      )
      tl.to({}, { duration: 2 }, STEP * (N - 1))

      // Each job writes itself in as the camera reaches its node
      beats.forEach((beat, i) => {
        const chars = SplitText.create(beat.querySelector("[data-company]") as HTMLElement, { type: "chars", aria: "none" }).chars
        const rest = beat.querySelectorAll("[data-rest]")
        const inAt = STEP * i - 1.4
        const outAt = STEP * i + 1.1

        if (i > 0) {
          tl.fromTo(beat, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, inAt)
          tl.fromTo(chars, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "power3.out", stagger: 0.025 }, inAt)
          tl.fromTo(rest, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08 }, inAt + 0.25)
        }
        if (i < N - 1) {
          tl.to(chars, { yPercent: -110, duration: 0.45, ease: "power2.in", stagger: 0.012 }, outAt - 0.5)
          tl.to(rest, { autoAlpha: 0, y: -14, duration: 0.4, ease: "power2.in", stagger: 0.04 }, outAt - 0.5)
          tl.to(beat, { autoAlpha: 0, duration: 0.01 }, outAt)
        }
      })
    }, section)

    return () => ctx.revert()
  }, [reduced])

  /* ── The journey (Three.js, loaded on demand) ───────────────────────────── */
  useEffect(() => {
    if (reduced) return
    let disposed = false
    let cleanup = () => {}

    ;(async () => {
      if (!canRender3D()) return // no graphics acceleration (or a robot): skip the 3D, the page works without it
      const host = hostRef.current
      if (!host) return
      await whenNear(host)
      if (disposed) return
      const THREE = await import("three")
      if (disposed) return

      let renderer: InstanceType<typeof THREE.WebGLRenderer>
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      } catch {
        return // No WebGL: the text sequence still plays
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
      renderer.setClearColor(0x000000, 0)
      host.appendChild(renderer.domElement)
      renderer.domElement.style.cssText = "width:100%;height:100%;display:block"

      const dark = document.documentElement.classList.contains("dark")
      const ink = dark ? 0xf0f0f0 : 0x111111
      const scene = new THREE.Scene()
      scene.fog = new THREE.Fog(dark ? 0x151515 : 0xffffff, 4, 17)
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 80)

      // The path: one control point per job, with a lead-in and a lead-out
      const nodePts = JOBS.map((_, i) => new THREE.Vector3(Math.sin(i * 1.1) * 2.4, Math.cos(i * 0.9) * 0.9 + i * 0.1, -i * 3.6))
      const curve = new THREE.CatmullRomCurve3(
        [new THREE.Vector3(0, 0, 3), ...nodePts, new THREE.Vector3(0, 0.6, -N * 3.6 - 2)],
        false,
        "catmullrom",
        0.5,
      )

      // Where each node sits along the curve (0..1), so the camera passes exactly through them
      const spaced = curve.getSpacedPoints(2000)
      const nodeU = nodePts.map((p) => {
        let best = 0
        let bd = Infinity
        spaced.forEach((q, k) => {
          const d = q.distanceToSquared(p)
          if (d < bd) {
            bd = d
            best = k
          }
        })
        return best / 2000
      })

      const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(600))
      const lineMat = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.55 })
      scene.add(new THREE.Line(lineGeo, lineMat))

      // Dust along the path
      const dustN = 1600
      const dust = new Float32Array(dustN * 3)
      for (let i = 0; i < dustN; i++) {
        const p = curve.getPointAt(Math.random())
        const r = 0.4 + Math.random() * 3
        const a = Math.random() * Math.PI * 2
        dust[i * 3] = p.x + Math.cos(a) * r
        dust[i * 3 + 1] = p.y + (Math.random() - 0.5) * 3
        dust[i * 3 + 2] = p.z + Math.sin(a) * r
      }
      const dustGeo = new THREE.BufferGeometry()
      dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3))
      const dustMat = new THREE.PointsMaterial({ color: ink, size: 0.04, transparent: true, opacity: 0.35, depthWrite: false })
      scene.add(new THREE.Points(dustGeo, dustMat))

      // Nodes: a small wireframe crystal inside a ring that faces down the path
      const crystalGeo = new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.26))
      const ringPts: number[] = []
      for (let k = 0; k <= 64; k++) ringPts.push(Math.cos((k / 64) * Math.PI * 2) * 0.62, Math.sin((k / 64) * Math.PI * 2) * 0.62, 0)
      const ringGeo = new THREE.BufferGeometry()
      ringGeo.setAttribute("position", new THREE.Float32BufferAttribute(ringPts, 3))
      const nodes = nodePts.map((p, i) => {
        const g = new THREE.Group()
        const cMat = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.4 })
        const rMat = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.25 })
        g.add(new THREE.LineSegments(crystalGeo, cMat), new THREE.Line(ringGeo, rMat))
        g.position.copy(p)
        const tan = curve.getTangentAt(nodeU[i])
        g.lookAt(p.clone().add(tan))
        scene.add(g)
        return { g, cMat, rMat }
      })

      // The traveller: a bright dot just ahead of the camera
      const travGeo = new THREE.BufferGeometry()
      travGeo.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0], 3))
      const travMat = new THREE.PointsMaterial({ color: ink, size: 0.22, transparent: true, opacity: 0.9, depthWrite: false })
      const traveller = new THREE.Points(travGeo, travMat)
      scene.add(traveller)

      const resize = () => {
        const w = host.clientWidth || 1
        const h = host.clientHeight || 1
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(host)

      const mouse = { x: 0, y: 0, sx: 0, sy: 0 }
      const onMove = (e: PointerEvent) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
      }
      window.addEventListener("pointermove", onMove, { passive: true })

      const io = new IntersectionObserver(([entry]) => (activeRef.current = entry.isIntersecting), { threshold: 0 })
      if (sectionRef.current) io.observe(sectionRef.current)

      let smooth = 0
      const tick = () => {
        if (!activeRef.current) return
        smooth += (progressRef.current - smooth) * 0.1
        mouse.sx += (mouse.x - mouse.sx) * 0.05
        mouse.sy += (mouse.y - mouse.sy) * 0.05

        // Progress → place along the curve, piecewise so each node lands exactly on its text
        const f = smooth * (N - 1)
        const lo = Math.min(N - 1, Math.floor(f))
        const hi = Math.min(N - 1, lo + 1)
        const u = nodeU[lo] + (nodeU[hi] - nodeU[lo]) * (f - lo)

        const p = curve.getPointAt(Math.min(0.999, u))
        const tan = curve.getTangentAt(Math.min(0.999, u))
        camera.position.copy(p).addScaledVector(tan, -3).add(new THREE.Vector3(mouse.sx * 0.6, 1 - mouse.sy * 0.4, 0))
        camera.lookAt(curve.getPointAt(Math.min(0.999, u + 0.025)))
        traveller.position.copy(p).addScaledVector(tan, 0.6)

        nodes.forEach((n, i) => {
          const act = Math.max(0, 1 - Math.abs(f - i))
          const s = 1 + act * 0.9
          n.g.scale.setScalar(s)
          n.g.rotation.z += 0.004 + act * 0.02
          n.cMat.opacity = 0.35 + act * 0.65
          n.rMat.opacity = 0.2 + act * 0.6
        })
        renderer.render(scene, camera)
      }
      gsap.ticker.add(tick)

      cleanup = () => {
        gsap.ticker.remove(tick)
        io.disconnect()
        ro.disconnect()
        window.removeEventListener("pointermove", onMove)
        lineGeo.dispose()
        lineMat.dispose()
        dustGeo.dispose()
        dustMat.dispose()
        crystalGeo.dispose()
        ringGeo.dispose()
        travGeo.dispose()
        travMat.dispose()
        nodes.forEach((n) => {
          n.cMat.dispose()
          n.rMat.dispose()
        })
        renderer.dispose()
        renderer.domElement.remove()
      }
    })()

    return () => {
      disposed = true
      cleanup()
    }
  }, [reduced])

  /* Reduced motion: no pin, no scene. The same jobs as a plain list. */
  if (reduced) {
    return (
      <section id="career" className="border-t border-border px-6 py-24 md:px-16 lg:px-24">
        <h2 className="mb-16 text-[15vw] font-bold uppercase leading-[0.8] tracking-tighter md:text-[10rem]">Career.</h2>
        <div className="flex flex-col gap-16">
          {JOBS.map((j, i) => (
            <JobBeat key={`${j.company}-${i}`} job={j} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="career" ref={sectionRef} className="relative h-screen w-full overflow-hidden border-t border-border bg-background">
      <h2 className="sr-only">Career and work experience</h2>
      <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" />
      {/* Keep the text readable over the path */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-background via-background/60 to-transparent md:via-background/30" />

      <div className="pointer-events-none relative z-10 mx-auto grid h-full max-w-7xl items-end px-6 pb-28 md:items-center md:pb-0 lg:px-12">
        {JOBS.map((j, i) => (
          <JobBeat key={`${j.company}-${i}`} job={j} className="[grid-area:1/1]" />
        ))}
      </div>

      {/* Progress: a line, with a dot for each stop */}
      <div className="pointer-events-none absolute inset-x-6 bottom-8 z-10 lg:inset-x-12">
        <div className="relative h-px bg-border">
          <div data-progress className="h-full origin-left bg-foreground" style={{ transform: "scaleX(0)" }} />
          {JOBS.map((_, i) => (
            <span
              key={i}
              data-dot
              className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground bg-background transition-colors duration-150"
              style={{ left: `${(i / (N - 1)) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
