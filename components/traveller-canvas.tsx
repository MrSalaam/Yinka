"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { traveller } from "@/lib/traveller-store"

/* ────────────────────────────────────────────────────────────────────────────
 * The traveller: one liquid-chrome object that lives in a fixed layer above the
 * whole page and journeys through it.
 *
 *   Hero      a single black chrome drop on the right
 *   → Works   as the hero tips away it glides into the middle and fades out
 *             (the layer is quiet through Works and About)
 *   → Stack   at the end of About it emerges from the knot, flies to Stack's
 *             corner and splits into six blobs, one per group
 *   → Career  when Stack ends it drops away as Career rises
 *
 * Six metaballs are raymarched in a fragment shader (smooth-union, so they merge
 * like mercury). Scroll progress comes from each section via lib/traveller-store.
 * ──────────────────────────────────────────────────────────────────────────── */

const N = 6 // groups in Stack, so six blobs

const POOL_VERT = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const POOL_FRAG = /* glsl */ `
  precision highp float;
  uniform vec2 uRes;
  uniform vec2 uCenter;
  uniform float uTime, uActive, uScale, uVis, uMerged;
  uniform vec4 uB[6]; // xyz = centre, w = radius, per blob

  const int N = 6;

  float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
  }

  float map(vec3 p) {
    // Fully merged: the six coincide, so one sphere is the same shape for a sixth of the work
    if (uMerged > 0.5) return length(p) - 0.95;
    float d = 1e5;
    for (int i = 0; i < N; i++) {
      d = smin(d, length(p - uB[i].xyz) - uB[i].w, 0.55);
    }
    return d;
  }

  vec3 normalAt(vec3 p) {
    vec2 e = vec2(1.0, -1.0) * 0.004;
    return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));
  }

  // A studio: dark floor, a mid sky, and two bright soft-boxes to reflect
  vec3 env(vec3 r) {
    float up = r.y * 0.5 + 0.5;
    vec3 col = mix(vec3(0.02), vec3(0.42), smoothstep(0.0, 1.0, up));
    col += vec3(1.7) * smoothstep(0.55, 0.62, dot(r, normalize(vec3(-0.6, 0.7, 0.5))));
    col += vec3(0.95) * smoothstep(0.80, 0.86, dot(r, normalize(vec3(0.8, 0.3, 0.4))));
    col += vec3(0.3) * smoothstep(0.03, 0.0, abs(r.y - 0.12));
    return col;
  }

  // Shade a point on the surface: reflect the studio, add a pearl sheen
  vec4 shade(vec3 pos, vec3 n, vec3 rd) {
    float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
    vec3 col = env(reflect(rd, n));
    vec3 irid = 0.5 + 0.5 * cos(6.2831 * (vec3(0.0, 0.33, 0.67) + fres * 1.5 + dot(n, rd) * 0.4));
    col = mix(col, col * irid * 1.5, 0.2);
    col += fres * 0.3;
    col = col / (1.0 + col * 0.3);
    return vec4(col, uVis);
  }

  void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y - uCenter;
    vec3 ro = vec3(0.0, 0.0, 6.5);
    vec3 rd = normalize(vec3(p / uScale, -1.3));
    float b = dot(ro, rd);

    // Merged into one drop (the hero, and the journey into and out of About): it is just a
    // sphere, so there is nothing to march. One exact ray-sphere hit per pixel.
    if (uMerged > 0.5) {
      float R = 0.95;
      float h1 = b * b - (dot(ro, ro) - R * R);
      if (h1 < 0.0) {
        // A soft dark edge from how close the ray passes keeps the silhouette smooth
        float miss = sqrt(max(dot(ro, ro) - b * b, 0.0)) - R;
        gl_FragColor = vec4(vec3(0.07), (1.0 - smoothstep(0.0, 0.03, miss)) * 0.9 * uVis);
        return;
      }
      vec3 pos = ro + rd * (-b - sqrt(h1));
      gl_FragColor = shade(pos, normalize(pos), rd);
      return;
    }

    // Six blobs: skip every pixel whose ray misses the bounding sphere, then raymarch
    float br = 2.9;
    float c = dot(ro, ro) - br * br;
    float h = b * b - c;
    if (h < 0.0) {
      gl_FragColor = vec4(0.0);
      return;
    }
    float t = -b - sqrt(h);
    float tmax = -b + sqrt(h);

    float dmin = 1e5;
    bool hit = false;
    for (int i = 0; i < 28; i++) {
      float d = map(ro + rd * t);
      dmin = min(dmin, d);
      if (d < 0.004) {
        hit = true;
        break;
      }
      t += d * 0.9;
      if (t > tmax) break;
    }

    if (!hit) {
      float edge = 1.0 - smoothstep(0.0, 0.03, dmin);
      gl_FragColor = vec4(vec3(0.07), edge * 0.9 * uVis);
      return;
    }

    vec3 pos = ro + rd * t;
    gl_FragColor = shade(pos, normalAt(pos), rd);
  }
`

/* Where the object sits, in screen space (-1..1 from the centre), per layout */
function layoutFor(aspect: number) {
  if (aspect > 1.2) {
    return {
      hero: { x: 0.58, y: 0.02, sc: 1.0 },
      about: { x: 0.29, y: 0, sc: 0.25 }, // where About's sphere is (it emerges from here)
      works: { x: 0, y: 0.05, sc: 0.2 }, // where the drop fades out as the hero tips into Works
      stack: { x: 0.78, y: 0, sc: 0.6 },
    }
  }
  // Phones: small, in the open space at the top
  return {
    hero: { x: 0.55, y: 0.74, sc: 0.4 },
    about: { x: 0, y: 0, sc: 0.2 },
    works: { x: 0, y: 0, sc: 0.2 },
    stack: { x: 0, y: 0.5, sc: 0.5 },
  }
}

const ease = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function TravellerCanvas() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    gsap.registerPlugin(ScrollTrigger)
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
        return // No WebGL: the page works without it
      }
      // Below native resolution: the object is soft, and a raymarcher is per-pixel work
      const small = window.innerWidth < 768
      let pixelRatio = Math.min(window.devicePixelRatio || 1, 1) * (small ? 0.45 : 0.55)
      renderer.setPixelRatio(pixelRatio)
      renderer.setClearColor(0x000000, 0)
      renderer.autoClear = false
      host.appendChild(renderer.domElement)
      renderer.domElement.style.cssText = "width:100%;height:100%;display:block"

      const scene = new THREE.Scene()
      const camera = new THREE.Camera()
      const uniforms = {
        uRes: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uActive: { value: -1 },
        uCenter: { value: new THREE.Vector2(0, 0) },
        uScale: { value: 1 },
        uVis: { value: 0 },
        uMerged: { value: 0 },
        uB: { value: Array.from({ length: N }, () => new THREE.Vector4()) },
      }
      const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: POOL_VERT,
        fragmentShader: POOL_FRAG,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      })
      const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat)
      quad.frustumCulled = false
      scene.add(quad)

      let aspect = window.innerWidth / window.innerHeight
      const resize = () => {
        const w = host.clientWidth || 1
        const h = host.clientHeight || 1
        renderer.setSize(w, h, false)
        const buf = renderer.getDrawingBufferSize(new THREE.Vector2())
        uniforms.uRes.value.set(buf.x, buf.y)
        aspect = w / h
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(host)

      // Career rising into view after Stack tells the object to leave
      const career = document.getElementById("career")
      const careerTrigger = career
        ? ScrollTrigger.create({
            trigger: career,
            start: "top bottom",
            end: "top top",
            onUpdate: (self) => (traveller.careerIn = self.progress),
            onLeaveBack: () => (traveller.careerIn = 0),
            onLeave: () => (traveller.careerIn = 1),
          })
        : null

      // What the object should look like right now, from the sections' progress
      const target = () => {
        const L = layoutFor(aspect)
        const { heroFly: h, aboutP: a, stackP: s, careerIn: w } = traveller

        if (w > 0.001) {
          // Dropping away after Stack, as Career rises
          const e = ease(w)
          return { vis: 1 - clamp01((w - 0.2) / 0.8), x: L.stack.x + e * 0.08, y: L.stack.y - e * 1.1, sc: L.stack.sc * (1 - 0.45 * e), active: N - 1 }
        }
        if (a >= 0.999 || s > 0.001) {
          // In Stack: six blobs, the current group's swelling
          return { vis: 1, x: L.stack.x, y: L.stack.y, sc: L.stack.sc, active: Math.min(N - 1, Math.max(-1, s * N - 1)) }
        }
        if (a > 0.82) {
          // Emerging from About's knot and flying to Stack's corner
          const e = ease(clamp01((a - 0.82) / 0.18))
          return { vis: clamp01(e * 3), x: lerp(L.about.x, L.stack.x, e), y: lerp(L.about.y, L.stack.y, e), sc: lerp(L.about.sc, L.stack.sc, e), active: -1 }
        }
        if (a > 0.02) {
          // Inside About: absorbed by the particle sphere
          return { vis: 0, x: L.about.x, y: L.about.y, sc: L.about.sc, active: -1 }
        }
        // Hero, then gliding into Works' middle and fading out as the hero tips away
        const e = ease(clamp01(h))
        return {
          vis: 1 - clamp01((h - 0.55) / 0.45),
          x: lerp(L.hero.x, L.works.x, e),
          y: lerp(L.hero.y, L.works.y, e),
          sc: lerp(L.hero.sc, L.works.sc, e),
          active: -1,
        }
      }

      const cur = { vis: 0, x: 0.58, y: 0, sc: 1, active: -1, ready: 0 }
      let drawn = false
      let first = true
      let frame = 0
      let lastT = 0
      let dtSum = 0
      let dtN = 0
      const tick = (time: number) => {
        const dt = time - lastT
        lastT = time
        const t = target()
        if (first) {
          Object.assign(cur, t)
          first = false
        }
        cur.vis += (t.vis - cur.vis) * 0.14
        cur.x += (t.x - cur.x) * 0.14
        cur.y += (t.y - cur.y) * 0.14
        cur.sc += (t.sc - cur.sc) * 0.14
        cur.active += (t.active - cur.active) * 0.08
        cur.ready += (traveller.ready - cur.ready) * 0.06

        const vis = cur.vis * cur.ready
        // Nothing to draw: clear once, then cost nothing
        if (vis < 0.01 || document.hidden) {
          if (drawn) {
            renderer.setScissorTest(false)
            renderer.clear()
            drawn = false
          }
          return
        }
        // Adaptive quality: under ~22 fps, step the resolution down (never below 0.3)
        if (dt > 0 && dt < 0.25) {
          dtSum += dt
          if (++dtN >= 90) {
            if (dtSum / dtN > 0.045 && pixelRatio > 0.3) {
              pixelRatio = Math.max(0.3, pixelRatio * 0.8)
              renderer.setPixelRatio(pixelRatio)
              resize()
            }
            dtSum = 0
            dtN = 0
          }
        }
        // Draw every other frame (30 fps); the state above still eases every frame
        if (frame++ % 2 === 1) return
        // Blob centres and radii, once per frame here instead of per ray step in the shader
        const together = Math.min(1, Math.max(0, 1 - (cur.active + 1) * 2))
        uniforms.uMerged.value = together > 0.995 ? 1 : 0
        for (let i = 0; i < N; i++) {
          const a = time * 0.28 * (0.7 + 0.12 * i) + i * 1.0472
          const act = Math.exp(-Math.pow(i - cur.active, 2) * 1.6)
          const k = Math.min(1, Math.max(0, act * 0.8 + together * 0.92))
          uniforms.uB.value[i].set(
            Math.cos(a) * 1.9 * (1 - k),
            Math.sin(a * 1.3 + i) * 0.9 * (1 - k),
            Math.sin(a) * 1.5 * (1 - k),
            lerp(0.5 + 0.58 * act, 0.95, together),
          )
        }
        uniforms.uTime.value = time
        uniforms.uVis.value = vis
        uniforms.uActive.value = cur.active
        uniforms.uScale.value = cur.sc
        uniforms.uCenter.value.set(cur.x * 0.5 * aspect, cur.y * 0.5)

        // The object spans ~0.19 (merged) or ~0.58 (spread) of the screen height per unit of scale
        const resX = uniforms.uRes.value.x
        const resY = uniforms.uRes.value.y
        const rad = (uniforms.uMerged.value ? 0.19 : 0.58) * cur.sc * resY * 1.2
        const cxPx = resX / 2 + uniforms.uCenter.value.x * resY
        const cyPx = resY / 2 + uniforms.uCenter.value.y * resY
        const k = 1 / pixelRatio // setScissor takes CSS pixels
        renderer.setScissorTest(false)
        renderer.clear()
        renderer.setScissorTest(true)
        renderer.setScissor((cxPx - rad) * k, (cyPx - rad) * k, rad * 2 * k, rad * 2 * k)
        renderer.render(scene, camera)
        drawn = true
      }
      gsap.ticker.add(tick)

      cleanup = () => {
        gsap.ticker.remove(tick)
        careerTrigger?.kill()
        ro.disconnect()
        quad.geometry.dispose()
        mat.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    })()

    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  return <div ref={hostRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-40" />
}
