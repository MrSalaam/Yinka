"use client"

import { site } from "@/lib/site"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { ArrowUpRight01Icon } from "hugeicons-react"
import { whenNear } from "@/lib/when-near"
import { canRender3D } from "@/lib/gpu"

/* ────────────────────────────────────────────────────────────────────────────
 * Connect: a dark finale. A field of particles ripples under the pointer
 * (Three.js, shader) and rises as the section scrolls in; the headline and the
 * email are written in with GSAP, and the email's letters ripple on hover.
 * ──────────────────────────────────────────────────────────────────────────── */

const EMAIL = "olayinkasalaam.dev@gmail.com"

const SOCIALS = [
  { label: "Download CV", href: site.cvUrl },
  { label: "LinkedIn", href: "https://linkedin.com/in/olayinka-salaam" },
  { label: "Twitter (X)", href: "https://x.com/yinka_tsx" },
  { label: "GitHub", href: "https://github.com/MrSalaam" },
]

const GRID_VERT = /* glsl */ `
  uniform float uTime, uIntro, uAmp, uPixelRatio;
  uniform vec3 uMouse;
  varying float vA;

  void main() {
    vec3 p = position;
    float base = sin(p.x * 0.55 + uTime * 0.7) * 0.22 + sin(p.z * 0.8 + uTime * 0.5) * 0.22;
    float d = distance(p.xz, uMouse.xz);
    float ripple = sin(d * 3.2 - uTime * 4.0) * exp(-d * 0.45) * 0.55 * uAmp;
    // The field rises into place as the section scrolls in
    p.y = (base + ripple) * uIntro - (1.0 - uIntro) * 1.6;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = length(p.xz);
    vA = (0.4 + 0.6 * smoothstep(0.0, 0.6, abs(ripple) + 0.12)) * (1.0 - smoothstep(5.0, 9.0, dist)) * uIntro;
    gl_PointSize = (1.5 + abs(ripple) * 3.2) * uPixelRatio * (7.0 / -mv.z);
  }
`

const GRID_FRAG = /* glsl */ `
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vec3(1.0), smoothstep(0.5, 0.0, d) * vA);
  }
`

function useLagosTime() {
  const [time, setTime] = useState("")
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Africa/Lagos" })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [])
  return time
}

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const introRef = useRef(0)
  const activeRef = useRef(false)
  const [reduced, setReduced] = useState(false)
  const time = useLagosTime()

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  /* ── Text and scroll reveals (GSAP) ─────────────────────────────────────── */
  useEffect(() => {
    if (reduced || !sectionRef.current) return
    gsap.registerPlugin(ScrollTrigger, SplitText)
    const section = sectionRef.current

    const ctx = gsap.context(() => {
      const kicker = section.querySelector("[data-kicker]")
      const lines = gsap.utils.toArray<HTMLElement>("[data-line]", section)
      const emailEl = section.querySelector<HTMLElement>("[data-email]")
      const rule = section.querySelector("[data-rule]")
      const info = gsap.utils.toArray<HTMLElement>("[data-info]", section)

      const lineChars = lines.map((l) => SplitText.create(l, { type: "chars", aria: "none" }).chars)
      const emailChars = emailEl ? SplitText.create(emailEl, { type: "chars", aria: "none" }).chars : []

      gsap.set(lineChars.flat(), { yPercent: 115, rotate: 6 })
      gsap.set(emailChars, { yPercent: 115 })
      gsap.set([kicker, ...info], { autoAlpha: 0, y: 20 })
      gsap.set(rule, { scaleX: 0 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 60%", toggleActions: "play none none reverse" },
      })
      tl.to(kicker, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0)
      lineChars.forEach((chars, i) => {
        tl.to(chars, { yPercent: 0, rotate: 0, duration: 0.8, ease: "power4.out", stagger: 0.025 }, 0.15 + i * 0.25)
      })
      tl.to(emailChars, { yPercent: 0, duration: 0.7, ease: "power3.out", stagger: 0.02 }, 0.8)
      tl.to(rule, { scaleX: 1, duration: 1, ease: "power3.inOut" }, 1.1)
      tl.to(info, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 }, 1.2)

      // The field rises as the section scrolls in (read by the 3D scene)
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "top 25%",
        scrub: true,
        onUpdate: (self) => (introRef.current = self.progress),
      })

      // Hover: a wave runs through the email's letters
      const link = section.querySelector<HTMLElement>("[data-email-link]")
      const wave = () =>
        gsap.fromTo(emailChars, { y: 0 }, { y: -12, duration: 0.22, yoyo: true, repeat: 1, ease: "power2.out", stagger: 0.018, overwrite: "auto" })
      link?.addEventListener("pointerenter", wave)
      return () => link?.removeEventListener("pointerenter", wave)
    }, section)

    return () => ctx.revert()
  }, [reduced])

  /* ── The particle field (Three.js, loaded on demand) ────────────────────── */
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
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
      } catch {
        return // No WebGL: the text works on its own
      }
      const pixelRatio = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1 : 1.25)
      renderer.setPixelRatio(pixelRatio)
      renderer.setClearColor(0x000000, 0)
      host.appendChild(renderer.domElement)
      renderer.domElement.style.cssText = "width:100%;height:100%;display:block"

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 60)
      camera.position.set(0, 3.4, 7.5)
      camera.lookAt(0, -0.3, 0)

      // A flat grid of points on the XZ plane
      const cols = window.innerWidth < 768 ? 90 : 170
      const rows = window.innerWidth < 768 ? 50 : 96
      const pos = new Float32Array(cols * rows * 3)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = (r * cols + c) * 3
          pos[i] = (c / (cols - 1) - 0.5) * 18
          pos[i + 1] = 0
          pos[i + 2] = (r / (rows - 1) - 0.5) * 10
        }
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
      const uniforms = {
        uTime: { value: 0 },
        uIntro: { value: 0 },
        uAmp: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uMouse: { value: new THREE.Vector3(0, 0, 0) },
      }
      const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: GRID_VERT,
        fragmentShader: GRID_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const points = new THREE.Points(geo, mat)
      points.frustumCulled = false
      points.position.y = -0.9
      scene.add(points)

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

      // Pointer → a point on the grid's plane, where the ripple starts
      const raycaster = new THREE.Raycaster()
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -points.position.y)
      const hit = new THREE.Vector3()
      const ndc = new THREE.Vector2()
      let lastMove = -10
      const onMove = (e: PointerEvent) => {
        const r = host.getBoundingClientRect()
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1))
        raycaster.setFromCamera(ndc, camera)
        if (raycaster.ray.intersectPlane(plane, hit)) {
          uniforms.uMouse.value.set(hit.x, 0, hit.z)
          lastMove = performance.now() / 1000
        }
      }
      window.addEventListener("pointermove", onMove, { passive: true })

      const io = new IntersectionObserver(([entry]) => (activeRef.current = entry.isIntersecting), { threshold: 0 })
      if (sectionRef.current) io.observe(sectionRef.current)

      let amp = 0
      const tick = (time: number) => {
        if (!activeRef.current) return
        // The ripple fades out a moment after the pointer stops
        const target = performance.now() / 1000 - lastMove < 1.2 ? 1 : 0.25
        amp += (target - amp) * 0.06
        uniforms.uTime.value = time
        uniforms.uAmp.value = amp
        uniforms.uIntro.value = introRef.current
        renderer.render(scene, camera)
      }
      gsap.ticker.add(tick)

      cleanup = () => {
        gsap.ticker.remove(tick)
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

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#0a0a0a] px-6 py-28 text-white md:px-16 lg:px-24"
    >
      {!reduced && <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" />}

      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        <p data-kicker className="mb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
          Connect
        </p>

        <h2 className="text-[clamp(2.5rem,8vw,8rem)] font-bold leading-[0.95] tracking-tighter">
          <span className="block overflow-hidden py-[0.04em]">
            <span data-line className="block">
              Have a vision?
            </span>
          </span>
          <span className="block overflow-hidden py-[0.04em] text-white/45">
            <span data-line className="block italic">
              Let&apos;s build it together.
            </span>
          </span>
        </h2>

        <div className="mt-14">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Inquiries</p>
          <a
            data-email-link
            href={`mailto:${EMAIL}`}
            className="group relative inline-block max-w-full break-all text-[clamp(1.4rem,4.4vw,4.2rem)] font-bold tracking-tighter"
          >
            <span className="block overflow-hidden py-[0.1em]">
              <span data-email className="block">
                {EMAIL}
              </span>
            </span>
          </a>
          <div data-rule className="mt-2 h-px w-full max-w-3xl origin-left bg-white/30" />
        </div>

        <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-3">
          <div data-info>
            <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Social</h3>
            <ul className="flex flex-col gap-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group/link inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80 transition-colors duration-150 hover:text-white"
                  >
                    {s.label}
                    <ArrowUpRight01Icon size={14} className="transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-info>
            <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Location</h3>
            <p className="text-xs font-bold uppercase leading-relaxed tracking-widest text-white/80">
              Lagos, Nigeria
              <br />
              Available globally
            </p>
          </div>

          <div data-info>
            <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Local time</h3>
            <p className="font-mono text-2xl tabular-nums text-white/90" suppressHydrationWarning>
              {time || "--:--"}
              <span className="ml-3 text-[10px] uppercase tracking-[0.3em] text-white/60">GMT +1</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
