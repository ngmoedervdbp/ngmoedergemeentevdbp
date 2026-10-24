import type { MetadataRoute } from "next";
import { absoluteUrl, IS_PREVIEW } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (IS_PREVIEW) return { rules: { userAgent: "*", disallow: "/" } };

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Authentication and noindex protect private pages independently of this file.
      // Leave login/reset pages crawlable so crawlers can read their noindex tags.
      disallow: [
        "/api/",
        "/auth/",
        "/dashboard",
        "/lidmate",
        "/gesinne",
        "/wyke",
        "/kategese",
        "/kalender$",
        "/kalender/",
        "/verslae",
        "/dokumentasie",
        "/argief",
        "/kommunikasie",
        "/instellings",
        "/registrasies",
        "/bediening$",
        "/bediening/",
        "/soek",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
