"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { traveller } from "@/lib/traveller-store"

/* ────────────────────────────────────────────────────────────────────────────
 * About: a 3D type fly-through, on a soft light ground.
 *
 * Each statement of the story is set as large type on its own plane, drawn on a
 * 2D canvas and used as a texture (Three.js). The camera flies down a corridor
 * of them, with thin wireframe frames and a receding grid for depth, and a
 * pinned GSAP timeline RESTS on each statement before flying to the next. The
 * last stretch tips the whole section away into Stack, as before.
 * ──────────────────────────────────────────────────────────────────────────── */

type Statement = { label: string; head: string; sub: string }

const STATEMENTS: Statement[] = [
  { label: "Hello", head: "I'm Olayinka Salaam.", sub: "A developer in Lagos." },
  { label: "What I do", head: "I build the whole thing.", sub: "Interfaces people enjoy using, APIs that hold up, and the database underneath." },
  { label: "Where", head: "From Lagos, for the world.", sub: "Based in Lagos, building with teams anywhere." },
  { label: "Who for", head: "Real estate, edtech, e-commerce.", sub: "Startups I've shipped for, from the first wireframe to the production database." },
  { label: "Next", head: "Let's make something.", sub: "Keep scrolling for the tools I reach for." },
]
const N = STATEMENTS.length

const BG = "#ecebe7" // the section's ground, also the fog colour
const SPACING = 7.5 // distance between statements down the corridor

// Timeline: rest on a statement, fly to the next, rest again... then tip away into Stack
const HOLD = 1.1
const MOVE = 1.1
const STORY = HOLD + (N - 1) * (MOVE + HOLD)
const PER_SCREEN = 0.45 // timeline units per screen of scrolling (the same for story and fly-out)
const FLIGHT = 1 / PER_SCREEN // the fly-out is exactly one screen of scrolling
const TOTAL = STORY + FLIGHT

/* ── A statement drawn on a canvas (transparent ground), used as a texture ─ */
function drawStatement(st: Statement, W: number, H: number): HTMLCanvasElement {
  const c = document.createElement("canvas")
  c.width = W
  c.height = H
  const g = c.getContext("2d")!
  const sans = '"Satoshi", "Helvetica Neue", Arial, sans-serif'
  const mono = '"JetBrains Mono", ui-monospace, monospace'
  const spaced = (px: number) => {
    ;(g as unknown as { letterSpacing: string }).letterSpacing = `${px}px`
  }
  const pad = W * 0.05
  const maxW = W - pad * 2

  const wrap = (text: string, font: string, width: number, ls: number) => {
    g.font = font
    spaced(ls)
    const out: string[] = []
    let line = ""
    for (const w of text.split(" ")) {
      const test = line ? `${line} ${w}` : w
      if (g.measureText(test).width > width && line) {
        out.push(line)
        line = w
      } else line = test
    }
    out.push(line)
    return out
  }

  const labelSize = W * (W > 1400 ? 0.0165 : 0.03)
  const headSize = W * (W > 1400 ? 0.088 : 0.125)
  const subSize = W * (W > 1400 ? 0.0235 : 0.036)
  const headFont = `700 ${headSize}px ${sans}`
  const subFont = `400 ${subSize}px ${sans}`

  const headLines = wrap(st.head, headFont, maxW, -headSize * 0.03)
  const subLines = wrap(st.sub, subFont, maxW * (W > 1400 ? 0.62 : 0.95), 0)

  // Vertical layout, centred
  const labelH = labelSize * 2.2
  const headH = headLines.length * headSize * 0.98
  const subH = subLines.length * subSize * 1.4 + subSize * 0.8
  let y = (H - (labelH + headH + subH)) / 2

  g.textBaseline = "alphabetic"
  g.textAlign = "left"
  g.font = `500 ${labelSize}px ${mono}`
  spaced(labelSize * 0.35)
  g.fillStyle = "#7a7a76"
  g.fillText(st.label.toUpperCase(), pad, y + labelSize)
  y += labelH

  g.font = headFont
  spaced(-headSize * 0.03)
  g.fillStyle = "#0b0b0b"
  headLines.forEach((ln, i) => g.fillText(ln, pad, y + headSize * 0.82 + i * headSize * 0.98))
  y += headH + subSize * 0.8

  g.font = subFont
  spaced(0)
  g.fillStyle = "#55554f"
  subLines.forEach((ln, i) => g.fillText(ln, pad, y + subSize + i * subSize * 1.4))
  return c
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({ f: 0 }) // which statement the camera is at (0..N-1), fractional while flying
  const activeRef = useRef(true)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  /* ── The pinned timeline (GSAP): rest, fly, rest... then tip away ───────── */
  useEffect(() => {
    if (reduced || !sectionRef.current) return
    gsap.registerPlugin(ScrollTrigger)
    const section = sectionRef.current
    const state = stateRef.current

    const ctx = gsap.context(() => {
      const bar = section.querySelector<HTMLElement>("[data-progress]")
      const dots = gsap.utils.toArray<HTMLElement>("[data-dot]", section)

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${TOTAL * PER_SCREEN * window.innerHeight}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            traveller.aboutP = self.progress
            if (bar) bar.style.transform = `scaleX(${Math.min(1, state.f / (N - 1))})`
            const idx = Math.round(state.f)
            dots.forEach((d, i) => d.classList.toggle("bg-foreground", i <= idx))
          },
        },
      })

      tl.to({}, { duration: HOLD })
      for (let k = 1; k < N; k++) {
        tl.to(state, { f: k, duration: MOVE, ease: "power2.inOut" })
        tl.to({}, { duration: HOLD })
      }

      // The last screen of scrolling: the whole section tips away to the top-left,
      // and Stack (pulled up one screen in SectionStack) rises underneath as it goes.
      tl.to(section, { y: () => -window.innerHeight * 1.15, rotate: -25, scale: 0.94, transformOrigin: "0% 100%", ease: "none", duration: FLIGHT }, STORY)
    }, section)

    return () => ctx.revert()
  }, [reduced])

  /* ── The corridor (Three.js, loaded on demand) ───────────────────────────── */
  useEffect(() => {
    if (reduced) return
    let disposed = false
    let cleanup = () => {}

    ;(async () => {
      const THREE = await import("three")
      const host = hostRef.current
      if (disposed || !host) return

      let renderer: InstanceType<typeof THREE.WebGLRenderer>
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" })
      } catch {
        return // No WebGL: the section still shows its label and progress
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25))
      renderer.setClearColor(0x000000, 0)
      host.appendChild(renderer.domElement)
      renderer.domElement.style.cssText = "width:100%;height:100%;display:block"

      // The statements are drawn in the site's fonts, so wait for them
      try {
        await Promise.all([document.fonts.load('700 100px "Satoshi"'), document.fonts.load('400 40px "Satoshi"'), document.fonts.load('500 20px "JetBrains Mono"')])
      } catch {
        /* fall back to system fonts */
      }
      if (disposed) {
        renderer.dispose()
        return
      }

      const portrait = host.clientWidth / host.clientHeight < 1.2
      const scene = new THREE.Scene()
      scene.background = null
      scene.fog = new THREE.Fog(new THREE.Color(BG), 8, 30)
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 80)
      const tanHalf = Math.tan((camera.fov * Math.PI) / 360)

      // One plane per statement. Landscape on wide screens, portrait on phones.
      const planeW = portrait ? 4.6 : 7.4
      const planeH = portrait ? 5.6 : 3.7
      const texW = portrait ? 1000 : 1600
      const texH = Math.round(texW * (planeH / planeW))
      const planeGeo = new THREE.PlaneGeometry(planeW, planeH)
      const planes = STATEMENTS.map((st, i) => {
        const tex = new THREE.CanvasTexture(drawStatement(st, texW, texH))
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 4
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false })
        const mesh = new THREE.Mesh(planeGeo, mat)
        const side = i % 2 === 0 ? -1 : 1
        const x = portrait ? 0 : side * 0.9
        mesh.position.set(x, 0, -i * SPACING)
        scene.add(mesh)
        return { mesh, tex, mat, x, turn: portrait ? 0 : -side * 0.22 }
      })

      // Depth cues: thin wireframe frames and rings drifting beside the corridor, and a floor grid
      const ink = 0x111111
      const lineMat = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.22 })
      const decoGeos: InstanceType<typeof THREE.BufferGeometry>[] = []
      const rnd = (() => {
        let a = 7
        return () => {
          a = (a * 16807) % 2147483647
          return a / 2147483647
        }
      })()
      const rect = (w: number, h: number) => {
        const g = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-w / 2, -h / 2, 0), new THREE.Vector3(w / 2, -h / 2, 0), new THREE.Vector3(w / 2, h / 2, 0), new THREE.Vector3(-w / 2, h / 2, 0),
        ])
        decoGeos.push(g)
        return g
      }
      const ring = (r: number) => {
        const pts: InstanceType<typeof THREE.Vector3>[] = []
        for (let k = 0; k < 64; k++) pts.push(new THREE.Vector3(Math.cos((k / 64) * Math.PI * 2) * r, Math.sin((k / 64) * Math.PI * 2) * r, 0))
        const g = new THREE.BufferGeometry().setFromPoints(pts)
        decoGeos.push(g)
        return g
      }
      const reach = N * SPACING + 10
      for (let k = 0; k < 10; k++) {
        const z = 4 - rnd() * reach
        const side = rnd() < 0.5 ? -1 : 1
        const x = side * ((portrait ? 2.2 : 4.6) + rnd() * 3)
        const y = (rnd() - 0.5) * 5
        const obj = k % 3 === 0 ? new THREE.LineLoop(ring(0.6 + rnd() * 1.2), lineMat) : new THREE.LineLoop(rect(1 + rnd() * 2.2, 0.8 + rnd() * 1.6), lineMat)
        obj.position.set(x, y, z)
        obj.rotation.y = -side * (0.3 + rnd() * 0.4)
        scene.add(obj)
      }
      // A light floor: a few lines across and along the corridor
      const floorPts: number[] = []
      for (let z = 6; z > -reach; z -= 3) floorPts.push(-34, -2.6, z, 34, -2.6, z)
      for (let x = -28; x <= 28; x += 7) floorPts.push(x, -2.6, 6, x, -2.6, -reach)
      const floorGeo = new THREE.BufferGeometry()
      floorGeo.setAttribute("position", new THREE.Float32BufferAttribute(floorPts, 3))
      const floorMat = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.09 })
      scene.add(new THREE.LineSegments(floorGeo, floorMat))

      // Fit a plane's width in view
      let dist = 8
      const resize = () => {
        const w = host.clientWidth || 1
        const h = host.clientHeight || 1
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        dist = Math.max(6.5, (planeW * 1.1) / (2 * tanHalf * camera.aspect))
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

      const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
      const smooth = (a: number, b: number, v: number) => {
        const t = clamp01((v - a) / (b - a))
        return t * t * (3 - 2 * t)
      }
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t

      const tick = () => {
        if (!activeRef.current) return
        const f = stateRef.current.f
        mouse.sx += (mouse.x - mouse.sx) * 0.05
        mouse.sy += (mouse.y - mouse.sy) * 0.05

        // The camera follows the corridor, drifting a little toward each statement's side
        const lo = Math.min(N - 1, Math.floor(f))
        const hi = Math.min(N - 1, lo + 1)
        const camX = lerp(planes[lo].x, planes[hi].x, f - lo) * 0.75
        camera.position.set(camX + mouse.sx * 0.45, 0.15 - mouse.sy * 0.28, -f * SPACING + dist)
        camera.lookAt(camX * 0.6, 0, -f * SPACING - 6)

        planes.forEach((p, i) => {
          const d = f - i // negative: still ahead; positive: already passed
          const ad = Math.abs(d)
          // Each statement turns to face you as you reach it, and settles forward
          p.mesh.rotation.y = p.turn * clamp01(ad)
          p.mesh.scale.setScalar(1 - 0.07 * clamp01(ad))
          p.mesh.position.y = -0.5 * clamp01(-d) // rises into place as it nears
          // (a statement is invisible while the camera rests on its neighbour, and cross-fades during the flight)
          p.mat.opacity = d > 0 ? 1 - smooth(0.3, 0.95, d) : 1 - smooth(0.05, 0.8, -d)
          p.mesh.visible = p.mat.opacity > 0.01
        })
        renderer.render(scene, camera)
      }
      gsap.ticker.add(tick)

      cleanup = () => {
        gsap.ticker.remove(tick)
        io.disconnect()
        ro.disconnect()
        window.removeEventListener("pointermove", onMove)
        planes.forEach((p) => {
          p.tex.dispose()
          p.mat.dispose()
        })
        planeGeo.dispose()
        decoGeos.forEach((g) => g.dispose())
        lineMat.dispose()
        floorGeo.dispose()
        floorMat.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    })()

    return () => {
      disposed = true
      cleanup()
    }
  }, [reduced])

  /* Reduced motion: no pin, no 3D. The same story as plain type. */
  if (reduced) {
    return (
      <section id="about" className="bg-[#ecebe7] px-6 py-24 md:px-16 lg:px-24">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-16">
          {STATEMENTS.map((st) => (
            <div key={st.label} className="max-w-3xl">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{st.label}</p>
              <h2 className="text-[clamp(2.2rem,6vw,5rem)] font-bold leading-[0.98] tracking-tighter">{st.head}</h2>
              <p className="mt-4 text-lg text-muted-foreground">{st.sub}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="about" ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden bg-[#ecebe7]">
      <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" />

      {/* The statements are drawn on canvas, so screen readers get the same words as text */}
      <div className="sr-only">
        {STATEMENTS.map((st) => (
          <p key={st.label}>
            {st.head} {st.sub}
          </p>
        ))}
      </div>

      <div className="pointer-events-none absolute left-6 top-24 z-10 md:left-16 lg:left-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">About</p>
      </div>

      {/* Progress: a line with a dot per statement */}
      <div className="pointer-events-none absolute inset-x-6 bottom-8 z-10 md:inset-x-16 lg:inset-x-24">
        <div className="relative h-px bg-foreground/15">
          <div data-progress className="h-full origin-left bg-foreground" style={{ transform: "scaleX(0)" }} />
          {STATEMENTS.map((st, i) => (
            <span
              key={st.label}
              data-dot
              className={`absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground bg-[#ecebe7] transition-colors duration-150 ${i === 0 ? "bg-foreground" : ""}`}
              style={{ left: `${(i / (N - 1)) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
