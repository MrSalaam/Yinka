"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { ArrowUpRight01Icon } from "hugeicons-react"
import projectData from "../data/projects.json"
import { whenNear } from "@/lib/when-near"
import { canRender3D } from "@/lib/gpu"



type Project = {
  id: string
  title: string
  category: string
  year?: string
  description: string
  link: string
  adminLink?: string
  status?: string
  tools?: string[]
}

const projects = projectData as Project[]
const N = projects.length

/* ── Shapes: one cloud of points per project, each loosely about its project ─ */
type Rand = () => number

function rng(seed: number): Rand {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const TAU = Math.PI * 2

// Which shape each project gets (an index into SHAPES, below), keyed by project id
const SHAPE_BY_ID: Record<string, number> = { "01": 0, "02": 1, "03": 2, "04": 3, "05": 4, "06": 5, "07": 6, "08": 7, "09": 8, "10": 9 }

const SHAPES: ((n: number, r: Rand) => Float32Array)[] = [
  // Admin Dashboard: a bar chart (thin columns standing on an axis)
  (n, r) => {
    const out = new Float32Array(n * 3)
    const heights = [0.8, 1.3, 1.0, 1.9, 1.5, 2.4]
    for (let i = 0; i < n; i++) {
      if (r() < 0.1) {
        // the axis along the bottom, and a short one up the left
        if (r() < 0.75) out.set([(r() - 0.5) * 4.2, -1.32, (r() - 0.5) * 0.3], i * 3)
        else out.set([-2.1, -1.32 + r() * 2.7, (r() - 0.5) * 0.3], i * 3)
        continue
      }
      const c = Math.floor(r() * 6)
      out.set([(c - 2.5) * 0.68 + (r() - 0.5) * 0.26, -1.3 + r() * heights[c], (r() < 0.5 ? -0.34 : 0.34) + (r() - 0.5) * 0.26], i * 3)
    }
    return out
  },
  // Oc8via: a funnel, leads in at the top and customers out of the spout
  (n, r) => {
    const out = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const k = r()
      if (k < 0.74) {
        // the cone, with extra points on rings so it reads as stacked stages
        let t = r()
        if (r() < 0.55) t = Math.round(t * 7) / 7
        const y = 1.3 - t * 1.8
        const rad = 1.6 * (1 - t) + 0.26 * t
        const a = r() * TAU
        out.set([Math.cos(a) * rad, y, Math.sin(a) * rad], i * 3)
      } else if (k < 0.86) {
        // the spout
        const a = r() * TAU
        out.set([Math.cos(a) * 0.26, -0.5 - r() * 0.9, Math.sin(a) * 0.26], i * 3)
      } else {
        // leads falling in from above
        const a = r() * TAU
        const rad = Math.sqrt(r()) * 1.45
        out.set([Math.cos(a) * rad, 1.5 + r() * 0.9, Math.sin(a) * rad], i * 3)
      }
    }
    return out
  },
  // Dedwell: a house
  (n, r) => {
    const out = new Float32Array(n * 3)
    const a = 1.15 // half width
    const d = 0.85 // half depth
    for (let i = 0; i < n; i++) {
      const k = r()
      let x: number
      let y: number
      let z: number
      if (k < 0.5) {
        // walls: front/back and the two sides
        const wall = Math.floor(r() * 4)
        y = -1 + r() * 1.2
        if (wall < 2) {
          x = (r() - 0.5) * 2 * a
          z = wall === 0 ? d : -d
        } else {
          z = (r() - 0.5) * 2 * d
          x = wall === 2 ? a : -a
        }
      } else if (k < 0.92) {
        // the roof: two slopes meeting at a ridge
        const s = r() < 0.5 ? -1 : 1
        const u = r()
        x = s * a * 1.08 * (1 - u)
        y = 0.2 + u * 1.05
        z = (r() - 0.5) * 2 * (d + 0.15)
      } else {
        // a chimney
        x = 0.6 + (r() - 0.5) * 0.25
        y = 0.4 + r() * 1.0
        z = -0.3 + (r() - 0.5) * 0.25
      }
      out.set([x, y, z], i * 3)
    }
    return out
  },
  // Dashboard: three stacked UI sheets
  (n, r) => {
    const out = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const sheet = i % 3
      const edge = r() < 0.35
      let x: number
      let z: number
      if (edge) {
        const side = Math.floor(r() * 4)
        const u = (r() - 0.5)
        if (side < 2) {
          x = u * 3.2
          z = side === 0 ? 1.1 : -1.1
        } else {
          x = side === 2 ? 1.6 : -1.6
          z = u * 2.2
        }
      } else {
        // grid-snapped interior, like UI blocks
        x = Math.round(((r() - 0.5) * 3.2) / 0.32) * 0.32
        z = Math.round(((r() - 0.5) * 2.2) / 0.32) * 0.32
      }
      out.set([x, (sheet - 1) * 0.95, z], i * 3)
    }
    return out
  },
  // Learnille landing page: a rising double helix
  (n, r) => {
    const out = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const t = r() * 2 - 1
      const a = t * 6 * Math.PI
      if (r() < 0.2) {
        // rungs between the strands
        const m = r() * 2 - 1
        out.set([Math.cos(a) * 0.9 * m, t * 2.1, Math.sin(a) * 0.9 * m], i * 3)
      } else {
        const k = i % 2
        const ph = a + k * Math.PI
        out.set([Math.cos(ph) * 0.9 + (r() - 0.5) * 0.1, t * 2.1, Math.sin(ph) * 0.9 + (r() - 0.5) * 0.1], i * 3)
      }
    }
    return out
  },
  // PrintDaily: a fan of paper sheets (outlines, with lines of text)
  (n, r) => {
    const out = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const sheet = Math.floor(r() * 5)
      const ang = (sheet - 2) * 0.42
      let u: number
      let v: number
      if (r() < 0.5) {
        // the sheet's edge
        const side = Math.floor(r() * 4)
        const t = (r() - 0.5)
        if (side < 2) {
          u = t * 2.0
          v = side === 0 ? 0.85 : -0.85
        } else {
          u = side === 2 ? 1.0 : -1.0
          v = t * 1.7
        }
      } else {
        // lines of text across the page
        u = (r() - 0.5) * 1.5
        v = Math.round(((r() - 0.5) * 1.3) / 0.26) * 0.26
      }
      // each sheet is a rectangle turned about the vertical axis
      out.set([u * Math.cos(ang), v, -u * Math.sin(ang) + (sheet - 2) * 0.05], i * 3)
    }
    return out
  },
  // SA Ayilara: a spiral galaxy
  (n, r) => {
    const out = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const arm = i % 3
      const rad = Math.pow(r(), 0.6) * 2.1
      const a = rad * 2.2 + (arm * TAU) / 3 + (r() - 0.5) * 0.45
      out.set([Math.cos(a) * rad, (r() - 0.5) * 0.22 * (1 - rad / 2.6), Math.sin(a) * rad * 0.85], i * 3)
    }
    return out
  },
  // FaceTrust AI: a head traced by scan lines, inside a face-ID viewfinder
  (n, r) => {
    const out = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const k = r()
      if (k < 0.62) {
        // contour rings round an ellipsoid head
        const level = Math.floor(r() * 13)
        const v = -1 + ((level + 0.5) / 13) * 2
        const rr = Math.sqrt(1 - v * v)
        const a = r() * TAU
        out.set([Math.cos(a) * rr, v * 1.45, Math.sin(a) * rr * 0.95], i * 3)
      } else if (k < 0.84) {
        // a light scatter over the surface
        const u = r() * 2 - 1
        const rr = Math.sqrt(1 - u * u)
        const a = r() * TAU
        out.set([Math.cos(a) * rr, u * 1.45, Math.sin(a) * rr * 0.95], i * 3)
      } else {
        // viewfinder corners in front of the face
        const corner = Math.floor(r() * 4)
        const sx = corner % 2 ? 1 : -1
        const sy = corner < 2 ? 1 : -1
        const t = r() * 0.55
        if (r() < 0.5) out.set([sx * 1.75 - sx * t, sy * 1.95, 1.3], i * 3)
        else out.set([sx * 1.75, sy * 1.95 - sy * t, 1.3], i * 3)
      }
    }
    return out
  },
  // Unilorin IT Alumni: a graduation cap with its tassel
  (n, r) => {
    const out = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const k = r()
      if (k < 0.5) {
        // the flat board, turned to a diamond; many points on its edges
        let u = (r() - 0.5) * 2.5
        let v = (r() - 0.5) * 2.5
        if (r() < 0.4) {
          if (r() < 0.5) u = u < 0 ? -1.25 : 1.25
          else v = v < 0 ? -1.25 : 1.25
        }
        out.set([(u - v) * 0.7071, 0.6 + (r() - 0.5) * 0.05, (u + v) * 0.7071], i * 3)
      } else if (k < 0.78) {
        // the cap beneath
        const a = r() * TAU
        out.set([Math.cos(a) * 0.72, -0.35 + r() * 0.9, Math.sin(a) * 0.72], i * 3)
      } else if (k < 0.9) {
        // the cord, out along the board and down
        const t = r()
        if (r() < 0.5) out.set([t * 1.77, 0.6, 0], i * 3)
        else out.set([1.77, 0.6 - t * 1.2, 0], i * 3)
      } else {
        // the tassel
        out.set([1.77 + (r() - 0.5) * 0.22, -0.7 + (r() - 0.5) * 0.4, (r() - 0.5) * 0.22], i * 3)
      }
    }
    return out
  },
  // MentorMatch: two clusters, a mentor and a student, joined by a bridge of points
  (n, r) => {
    const out = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const k = r()
      if (k < 0.72) {
        // two spheres: the bigger one the mentor
        const side = i % 2 === 0 ? -1 : 1
        const rad = (side < 0 ? 0.95 : 0.7) * Math.cbrt(r())
        const u = r() * 2 - 1
        const rr = Math.sqrt(1 - u * u)
        const a = r() * TAU
        out.set([side * 1.35 + Math.cos(a) * rr * rad, u * rad, Math.sin(a) * rr * rad], i * 3)
      } else if (k < 0.92) {
        // the bridge: an arc between them
        const t = r()
        out.set([-1.35 + t * 2.7, Math.sin(t * Math.PI) * 0.75 + (r() - 0.5) * 0.08, (r() - 0.5) * 0.08], i * 3)
      } else {
        // a few points orbiting between, as matches being made
        const a = r() * TAU
        out.set([Math.cos(a) * 0.3, 0.2 + Math.sin(a * 2) * 0.1, Math.sin(a) * 0.3], i * 3)
      }
    }
    return out
  },
]

const PARTICLE_VERT = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aRand;
  uniform float uTime, uMix, uPixelRatio;
  varying float vAlpha;

  void main() {
    // Each particle leaves its old place a little later than its neighbours (same morph as About)
    float t = smoothstep(0.0, 1.0, clamp(uMix * 1.35 - aRand * 0.35, 0.0, 1.0));
    vec3 p = mix(aFrom, aTo, t);
    // Swirl while travelling between the two shapes
    float travel = t * (1.0 - t) * 4.0;
    p.x += sin(aRand * 40.0 + uTime) * travel * 0.35;
    p.z += cos(aRand * 33.0 + uTime) * travel * 0.35;
    // A slow breath
    p += normalize(p + 0.0001) * sin(uTime * 0.8 + aRand * 20.0) * 0.03;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vAlpha = 0.5 + 0.5 * aRand;
    gl_PointSize = (1.4 + aRand * 1.8) * uPixelRatio * (7.0 / -mv.z);
  }
`

const PARTICLE_FRAG = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vec3(1.0), smoothstep(0.5, 0.0, d) * vAlpha);
  }
`

/* ── One project's panel ─────────────────────────────────────────────────── */
function Panel({ p, first }: { p: Project; first: boolean }) {
  const hasLink = p.link !== "#"
  return (
    <div
      data-panel
      className="flex h-[100svh] w-screen shrink-0 flex-col justify-end px-6 pb-24 pt-24 md:justify-center md:px-16 md:pb-0 md:pt-0 lg:px-24"
    >
      <div className="max-w-2xl">
        <p data-fade className="mb-5 font-mono text-[12px] font-bold uppercase tracking-[0.3em] text-white/85">
          {p.category}
          {p.year ? ` · ${p.year}` : ""}
        </p>

        {/* The mask the title's letters rise through */}
        <h3
          // Sized from the longest word (capitals are wide), so a name never loses its last letter
          style={{ fontSize: `clamp(1.75rem, min(max(5.2vw, 2.1rem), ${(88 / (0.78 * Math.max(...p.title.split(" ").map((w) => w.length)))).toFixed(2)}vw, ${(40 / (0.78 * Math.max(...p.title.split(" ").map((w) => w.length)))).toFixed(2)}rem), 5rem)` }}
          className="-my-[0.05em] py-[0.05em] pr-[0.14em] font-bold uppercase leading-[0.92] tracking-tighter [overflow-x:visible] [overflow-y:clip]"
        >
          <span data-title className="block">
            {p.title}
          </span>
        </h3>

        {p.status && (
          <p data-fade className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/70 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            {p.status}
          </p>
        )}

        <p data-fade className="mt-5 line-clamp-5 max-w-xl text-base font-semibold leading-relaxed text-white md:line-clamp-none md:text-lg">
          {p.description}
        </p>

        <div data-fade className={`mt-5 flex flex-wrap gap-1.5 ${p.tools?.length ? "" : "hidden"}`}>
          {(p.tools ?? []).slice(0, 6).map((t) => (
            <span key={t} className="rounded-full border border-white/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
              {t}
            </span>
          ))}
        </div>

        <div data-fade className="mt-7 flex flex-wrap items-center gap-3">
          {hasLink && (
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white py-2 pl-4 pr-2 text-[11px] font-bold uppercase tracking-widest text-black transition-transform duration-150 hover:-translate-y-px"
            >
              Visit Site
              <span className="grid h-7 w-7 place-items-center bg-black text-white">
                <ArrowUpRight01Icon size={14} />
              </span>
            </a>
          )}
          {p.adminLink && (
            <a
              href={p.adminLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/70 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition-colors duration-150 hover:bg-white hover:text-black"
            >
              Admin <ArrowUpRight01Icon size={12} />
            </a>
          )}
          {!hasLink && <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">Link coming soon</span>}
        </div>

        {first && (
          <p className="mt-10 hidden font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-white/75 md:block">Scroll to see the next →</p>
        )}
      </div>
    </div>
  )
}

const HOLD = 1.2 // timeline units the scroll rests on each project
const MOVE = 1 // timeline units to slide to the next
const TOTAL = HOLD + (N - 1) * (MOVE + HOLD)

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const swapRef = useRef<((i: number) => void) | null>(null)
  const currentRef = useRef(0)
  const activeRef = useRef(true)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  /* ── The pinned slide, with a rest on every project (GSAP) ──────────────── */
  useEffect(() => {
    if (reduced || !sectionRef.current || !trackRef.current) return
    gsap.registerPlugin(ScrollTrigger, SplitText)
    const section = sectionRef.current
    const track = trackRef.current

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", track)
      const dots = gsap.utils.toArray<HTMLElement>("[data-dot]", section)
      const bar = section.querySelector<HTMLElement>("[data-progress]")

      // Each panel's text writes itself in when the panel arrives
      const reveals = panels.map((panel) => {
        const title = panel.querySelector<HTMLElement>("[data-title]")
        const chars = title ? SplitText.create(title, { type: "words,chars", aria: "none" }).chars : []
        const fades = panel.querySelectorAll("[data-fade]")
        gsap.set(chars, { yPercent: 110 })
        gsap.set(fades, { autoAlpha: 0, y: 16 })
        return gsap
          .timeline({ paused: true })
          .to(chars, { yPercent: 0, duration: 0.6, ease: "power3.out", stagger: 0.02 }, 0)
          .to(fades, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.07 }, 0.15)
      })
      ScrollTrigger.create({ trigger: section, start: "top 75%", once: true, onEnter: () => reveals[0].play() })

      let current = 0
      const travel = () => (N - 1) * window.innerWidth

      // Rest, slide, rest, slide...: the scroll cannot skip past a project
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${TOTAL * 0.5 * window.innerHeight}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: () => {
            const x = gsap.getProperty(track, "x") as number
            if (bar) bar.style.transform = `scaleX(${Math.min(1, Math.max(0, -x / travel()))})`
            const idx = Math.min(N - 1, Math.max(0, Math.round(-x / window.innerWidth)))
            if (idx !== current) {
              reveals[current].timeScale(2).reverse()
              reveals[idx].timeScale(1).play()
              current = idx
              currentRef.current = idx
              swapRef.current?.(idx)
              dots.forEach((d, i) => d.classList.toggle("bg-white", i <= idx))
            }
          },
        },
      })
      tl.to({}, { duration: HOLD })
      for (let k = 1; k < N; k++) {
        tl.to(track, { x: () => -k * window.innerWidth, duration: MOVE, ease: "power2.inOut" })
        tl.to({}, { duration: HOLD })
      }
    }, section)

    return () => ctx.revert()
  }, [reduced])

  /* ── The particle stage (Three.js, loaded on demand) ────────────────────── */
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
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" })
      } catch {
        return // No WebGL: the panels still work on their own
      }
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      renderer.setPixelRatio(pixelRatio)
      renderer.setClearColor(0x000000, 0)
      host.appendChild(renderer.domElement)
      renderer.domElement.style.cssText = "width:100%;height:100%;display:block"

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60)
      camera.position.set(0, 0.2, 7.5)
      const group = new THREE.Group()
      scene.add(group)

      // The cloud: every particle morphs from where it is (aFrom) to its place in the next shape (aTo)
      const count = window.innerWidth < 768 ? 7000 : 13000
      const rand = rng(11)
      const randAttr = new Float32Array(count)
      for (let i = 0; i < count; i++) randAttr[i] = rand()
      const shapeCache = new Map<number, Float32Array>()
      const shapeFor = (i: number) => {
        const k = SHAPE_BY_ID[projects[i].id] ?? 0
        if (!shapeCache.has(k)) shapeCache.set(k, SHAPES[k](count, rng(100 + k)))
        return shapeCache.get(k)!
      }

      let shown = currentRef.current
      const aFrom = new THREE.BufferAttribute(new Float32Array(shapeFor(shown)), 3)
      const aTo = new THREE.BufferAttribute(new Float32Array(shapeFor(shown)), 3)
      const geo = new THREE.BufferGeometry()
      geo.setAttribute("position", aTo) // Points needs a position attribute; the shader reads aFrom/aTo
      geo.setAttribute("aFrom", aFrom)
      geo.setAttribute("aTo", aTo)
      geo.setAttribute("aRand", new THREE.BufferAttribute(randAttr, 1))
      const uniforms = { uTime: { value: 0 }, uMix: { value: 1 }, uPixelRatio: { value: pixelRatio } }
      const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: PARTICLE_VERT, fragmentShader: PARTICLE_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
      const points = new THREE.Points(geo, mat)
      points.frustumCulled = false
      group.add(points)

      // Wide screens: the shape sits on the right, clear of the text. Phones: small, at the top.
      let baseTilt = 0.15
      const resize = () => {
        const w = host.clientWidth || 1
        const h = host.clientHeight || 1
        renderer.setSize(w, h, false)
        const aspect = w / h
        camera.aspect = aspect
        const tanHalf = Math.tan((camera.fov * Math.PI) / 360)
        if (aspect > 1.2) {
          camera.position.z = 7.5
          const halfW = tanHalf * 7.5 * aspect
          group.position.set(halfW * 0.46, 0, 0)
          group.scale.setScalar(0.82)
          baseTilt = 0.15
        } else {
          camera.position.z = Math.max(7.5, 3.1 / (tanHalf * aspect))
          const halfH = tanHalf * camera.position.z
          group.position.set(0, halfH * 0.42, 0)
          group.scale.setScalar(0.9)
          baseTilt = 0.55 // seen more from above, so flat shapes do not collapse to a line
        }
        camera.updateProjectionMatrix()
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(host)

      // Morph to project i's shape. If a morph is mid-way, start from where the particles are now.
      const swapTo = (i: number) => {
        if (i === shown) return
        shown = i
        const m = uniforms.uMix.value
        const from = aFrom.array as Float32Array
        const to = aTo.array as Float32Array
        if (m >= 1) {
          from.set(to)
        } else {
          for (let k = 0; k < count; k++) {
            const t0 = Math.min(1, Math.max(0, m * 1.35 - randAttr[k] * 0.35))
            const t = t0 * t0 * (3 - 2 * t0)
            for (let c = 0; c < 3; c++) from[k * 3 + c] += (to[k * 3 + c] - from[k * 3 + c]) * t
          }
        }
        to.set(shapeFor(i))
        aFrom.needsUpdate = true
        aTo.needsUpdate = true
        gsap.killTweensOf(uniforms.uMix)
        uniforms.uMix.value = 0
        gsap.to(uniforms.uMix, { value: 1, duration: 1.5, ease: "power2.inOut" })
      }
      swapRef.current = swapTo

      // Pointer: a gentle parallax
      const mouse = { x: 0, y: 0, sx: 0, sy: 0 }
      const onMove = (e: PointerEvent) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
      }
      window.addEventListener("pointermove", onMove, { passive: true })

      const io = new IntersectionObserver(([entry]) => (activeRef.current = entry.isIntersecting), { threshold: 0 })
      if (sectionRef.current) io.observe(sectionRef.current)

      const tick = (time: number) => {
        if (!activeRef.current) return
        mouse.sx += (mouse.x - mouse.sx) * 0.06
        mouse.sy += (mouse.y - mouse.sy) * 0.06
        uniforms.uTime.value = time
        // A slow swing, never a full turn, so no shape is seen edge-on
        group.rotation.y = Math.sin(time * 0.35) * 0.9 + mouse.sx * 0.25
        group.rotation.x = baseTilt + mouse.sy * 0.12
        renderer.render(scene, camera)
      }
      gsap.ticker.add(tick)

      cleanup = () => {
        swapRef.current = null
        gsap.ticker.remove(tick)
        gsap.killTweensOf(uniforms.uMix)
        io.disconnect()
        ro.disconnect()
        window.removeEventListener("pointermove", onMove)
        geo.dispose()
        mat.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    })()

    return () => {
      disposed = true
      cleanup()
    }
  }, [reduced])

 
  if (reduced) {
    return (
      <section id="works" className="bg-[#0a0a0a] px-6 py-24 text-white md:px-16 lg:px-24">
        <h2 className="mb-16 text-[15vw] font-bold uppercase leading-[0.8] tracking-tighter md:text-[10rem]">Works.</h2>
        <div className="flex flex-col gap-10">
          {projects.map((p) => (
            <article key={p.id} className="max-w-3xl border-t border-white/15 pt-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/55">
                {p.category}
                {p.year ? ` · ${p.year}` : ""}
              </p>
              <h3 className="mt-3 text-4xl font-bold uppercase tracking-tighter">{p.title}</h3>
              <p className="mt-3 text-white/55">{p.description}</p>
              {p.link !== "#" && (
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                  Visit site <ArrowUpRight01Icon size={14} />
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="works" ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden bg-[#0a0a0a] text-white">
      <h2 className="sr-only">Selected work: web apps, platforms and websites by Olayinka Salaam</h2>
      <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" />

      <div className="pointer-events-none absolute left-6 top-24 z-20 md:left-16 lg:left-24">
        <p className="font-mono text-[12px] font-bold uppercase tracking-[0.3em] text-white/85">Works</p>
      </div>

      <div ref={trackRef} className="relative z-10 flex h-full w-max will-change-transform">
        {projects.map((p, i) => (
          <Panel key={p.id} p={p} first={i === 0} />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-6 bottom-8 z-20 md:inset-x-16 lg:inset-x-24">
        <div className="relative h-px bg-white/15">
          <div data-progress className="h-full origin-left bg-white" style={{ transform: "scaleX(0)" }} />
          {projects.map((p, i) => (
            <span
              key={p.id}
              data-dot
              className={`absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[#0a0a0a] transition-colors duration-150 ${i === 0 ? "bg-white" : ""}`}
              style={{ left: `${(i / (N - 1)) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
