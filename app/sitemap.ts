import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

// One page, so one entry. Add routes here if the site ever grows more.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }]
}
