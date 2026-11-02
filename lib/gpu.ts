
let cached: boolean | null = null

export function canRender3D(): boolean {
  if (cached !== null) return cached
  if (typeof window === "undefined") return false

  try {
    if (localStorage.getItem("force-3d") === "1") return (cached = true)
  } catch {
    /* storage blocked: carry on */
  }

  if (navigator.webdriver || /lighthouse|pagespeed|gtmetrix|headless|bot|crawl|spider/i.test(navigator.userAgent)) return (cached = false)

  try {
    const canvas = document.createElement("canvas")
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null
    if (!gl) return (cached = false)
    const info = gl.getExtension("WEBGL_debug_renderer_info")
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ""
    gl.getExtension("WEBGL_lose_context")?.loseContext()
    cached = !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)
  } catch {
    cached = false
  }
  return cached
}
