import { ImageResponse } from "next/og"
import { site } from "@/lib/site"

// The picture shown when the link is shared on WhatsApp, LinkedIn, X, Slack, iMessage...
export const alt = `${site.name}, ${site.jobTitle} in ${site.location.city}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#ffffff",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, color: "rgba(255,255,255,0.55)" }}>PORTFOLIO</div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 118, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{site.name}</div>
          <div style={{ display: "flex", fontSize: 44, marginTop: 28, color: "rgba(255,255,255,0.8)" }}>
            {site.jobTitle} in {site.location.city}, {site.location.countryName}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 28, color: "rgba(255,255,255,0.55)", letterSpacing: 2 }}>
          Next.js · React · TypeScript · Node.js · PostgreSQL
        </div>
      </div>
    ),
    size,
  )
}
