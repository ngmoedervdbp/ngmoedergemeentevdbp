import type { MetadataRoute } from "next";
import { absoluteUrl, IS_PREVIEW, PUBLIC_PAGES } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  if (IS_PREVIEW) return [];

  // No invented modification dates: static content has no reliable updated_at.
  // Google ignores priority/changefreq, so list the canonical public URLs only.
  return Object.keys(PUBLIC_PAGES).map((path) => ({ url: absoluteUrl(path) }));
}
