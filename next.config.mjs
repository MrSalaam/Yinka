/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      { source: "/about", destination: "/#about", permanent: false },
      { source: "/stack", destination: "/#stack", permanent: false },
      { source: "/projects", destination: "/#works", permanent: false },
      { source: "/experience", destination: "/#career", permanent: false },
      { source: "/contact", destination: "/#contact", permanent: false },
    ]
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
