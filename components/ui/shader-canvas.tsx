"use client"

import { useEffect, useRef } from "react"
import { canRender3D } from "@/lib/gpu"
import { whenIdle, whenNear } from "@/lib/when-near"

/**
 * A single full-screen fragment shader drawn with Three.js: no scene, no meshes, one quad.
 *
 * Built to cost almost nothing: it loads Three only when the canvas is near the screen, draws at a reduced
 * resolution and at most ~30 frames a second, stops while off screen or while the tab is hidden, and is skipped
 * entirely on devices without graphics acceleration or when the person prefers reduced motion (then it draws
 * one still frame). The shader gets `uTime` (seconds), `uRes` (pixels) and `uMouse` (0..1, smoothed, y up).
 */
export function ShaderCanvas({
  fragment,
  className,
  scale = 0.6,
  pointer = "window",
}: {
  fragment: string
  className?: string
  /** Render resolution as a fraction of the CSS size (before the device pixel ratio, which is capped at 1). */
  scale?: number
  /** Where the pointer is read from: the whole window, or none. */
  pointer?: "window" | "none"
}) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let disposed = false
    let cleanup = () => {}

    ;(async () => {
      if (!canRender3D()) return
      await whenNear(host)
      await whenIdle(1500)
      if (disposed) return
      const THREE = await import("three")
      if (disposed) return

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      let renderer: InstanceType<typeof THREE.WebGLRenderer>
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" })
      } catch {
        return
      }
      renderer.setClearColor(0x000000, 0)
      host.appendChild(renderer.domElement)
      Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block" })

      const uniforms = {
        uTime: { value: 0 },
        uRes: { value: new THREE.Vector2(1, 1) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      }
      const material = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthTest: false,
        vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
        fragmentShader: `precision highp float; varying vec2 vUv; uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse;\n${fragment}`,
      })
      const geometry = new THREE.PlaneGeometry(2, 2)
      const mesh = new THREE.Mesh(geometry, material)
      const scene = new THREE.Scene()
      scene.add(mesh)
      const camera = new THREE.Camera()

      const resize = () => {
        const w = Math.max(1, host.clientWidth)
        const h = Math.max(1, host.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1) * scale)
        renderer.setSize(w, h, false)
        uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio())
      }
      resize()
      const ro = new ResizeObserver(() => {
        resize()
        if (reduced) renderer.render(scene, camera)
      })
      ro.observe(host)

      // Pointer, as a position inside this canvas
      const target = new THREE.Vector2(0.5, 0.5)
      const onMove = (e: PointerEvent) => {
        const r = host.getBoundingClientRect()
        target.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height)
      }
      if (pointer === "window" && !reduced) window.addEventListener("pointermove", onMove, { passive: true })

      if (reduced) {
        uniforms.uTime.value = 12
        renderer.render(scene, camera)
      }

      let visible = true
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0 })
      io.observe(host)

      let raf = 0
      let last = 0
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop)
        if (!visible || document.hidden || now - last < 33) return
        const dt = Math.min(0.1, (now - last) / 1000)
        last = now
        uniforms.uTime.value += dt
        uniforms.uMouse.value.lerp(target, 0.08)
        renderer.render(scene, camera)
      }
      if (!reduced) raf = requestAnimationFrame(loop)

      cleanup = () => {
        cancelAnimationFrame(raf)
        io.disconnect()
        ro.disconnect()
        window.removeEventListener("pointermove", onMove)
        geometry.dispose()
        material.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    })()

    return () => {
      disposed = true
      cleanup()
    }
  }, [fragment, scale, pointer])

  return <div ref={hostRef} aria-hidden="true" className={className} />
}

/* ── The two shaders ─────────────────────────────────────────────────────── */

/** Works: a stack of thin rings that wobble and breathe like ripples in still water; the cursor stirs them. */
export const RINGS_FRAGMENT = /* glsl */ `
  void main(){
    vec2 uv = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    float r = length(uv);
    float a = atan(uv.y, uv.x);
    vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    float stir = 1.0 + 3.0 * smoothstep(0.6, 0.0, length(m));
    float alpha = 0.0;
    float w = fwidth(r) * 1.4;
    for (int k = 0; k < 8; k++){
      float fk = float(k);
      float rk = 0.07 + 0.045 * fk
        + stir * 0.010 * sin(a * 3.0 + uTime * 0.6 + fk * 0.7)
        + stir * 0.006 * sin(a * 5.0 - uTime * 0.45 + fk * 1.3);
      float line = 1.0 - smoothstep(0.0, w, abs(r - rk));
      alpha = max(alpha, line * (1.0 - fk / 9.0));
    }
    float mask = 1.0 - smoothstep(0.42, 0.5, r);
    gl_FragColor = vec4(vec3(0.0), alpha * 0.55 * mask);
  }
`
