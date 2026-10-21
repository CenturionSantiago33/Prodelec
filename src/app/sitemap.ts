import type { MetadataRoute } from "next";
import { getCatalogData } from "@/lib/catalogStore";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const { categories, products } = getCatalogData();

  const staticRoutes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/categorias", priority: 0.9, freq: "weekly" },
    { path: "/productos", priority: 0.8, freq: "weekly" },
    { path: "/empresa", priority: 0.6, freq: "monthly" },
    { path: "/equipos", priority: 0.5, freq: "monthly" },
    { path: "/novedades", priority: 0.5, freq: "monthly" },
    { path: "/ubicacion", priority: 0.4, freq: "yearly" },
    { path: "/contacto", priority: 0.6, freq: "yearly" },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${SITE.url}${r.path}`,
      lastModified: now,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...categories.map((c) => ({
      url: `${SITE.url}/categorias?categoria=${c.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...products.map((p) => ({
      url: `${SITE.url}/productos/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
