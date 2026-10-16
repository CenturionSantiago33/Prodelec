import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // El panel /admin no debe indexarse. Además, hoy no tiene autenticación:
        // ver docs/PROPUESTA_BACKEND.md antes de exponerlo públicamente.
        disallow: ["/admin", "/favoritos", "/pdf"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
