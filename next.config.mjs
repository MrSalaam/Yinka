/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [{ source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }]
  },
  async redirects() {
    return [
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/stack", destination: "/#stack", permanent: true },
      { source: "/projects", destination: "/#works", permanent: true },
      { source: "/experience", destination: "/#career", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
    ]
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
