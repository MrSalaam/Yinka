import type React from "react"
import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "next-themes"
import "./globals.css"

import { SmoothScroll } from "@/components/smooth-scroll"
import { Nav } from "@/components/nav"
import { SITE_URL, site } from "@/lib/site"

export const metadata: Metadata = {
  // Makes every relative URL below (canonical, share images) absolute
  metadataBase: new URL(SITE_URL),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  keywords: site.keywords,
  applicationName: site.name,
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    creator: site.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // Paste your Google Search Console token here (or set GOOGLE_SITE_VERIFICATION) to verify the site
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
}

// Structured data: tells Google who this page is about, in a form it can read directly
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: site.name,
      jobTitle: site.jobTitle,
      url: SITE_URL,
      email: `mailto:${site.email}`,
      description: site.description,
      address: { "@type": "PostalAddress", addressLocality: site.location.city, addressCountry: site.location.country },
      knowsAbout: site.knowsAbout,
      sameAs: site.sameAs,
    },
    {
      // The service itself, so a search for "website developer" has something to match
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      name: `${site.name}, website development`,
      url: SITE_URL,
      description: site.description,
      provider: { "@id": `${SITE_URL}/#person` },
      serviceType: site.services,
      address: { "@type": "PostalAddress", addressLocality: site.location.city, addressCountry: site.location.country },
      areaServed: [{ "@type": "Country", name: site.location.countryName }, { "@type": "Place", name: "Worldwide" }],
      email: site.email,
      sameAs: site.sameAs,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: site.name,
      description: site.description,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* The two weights the first screen uses start downloading immediately */}
        <link rel="preload" href="/fonts/satoshi-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/satoshi-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* "<" is escaped so the JSON can never close the script tag early */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
          <Nav />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}
