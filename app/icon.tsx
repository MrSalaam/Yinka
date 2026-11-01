import { ImageResponse } from "next/og"

// The tab icon: a black rounded square with a white Y
export const size = { width: 64, height: 64 }
export const contentType = "image/png"

export default function Icon() {
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
          fontSize: 44,
          fontWeight: 700,
          borderRadius: 14,
        }}
      >
        Y
      </div>
    ),
    size,
  )
}
