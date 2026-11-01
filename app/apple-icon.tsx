import { ImageResponse } from "next/og"

// The icon used when the site is saved to an iPhone home screen
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#ffffff",
          fontSize: 124,
          fontWeight: 700,
        }}
      >
        Y
      </div>
    ),
    size,
  )
}
