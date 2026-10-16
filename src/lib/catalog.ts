import { Category, Niche, Product } from "@/types";

/**
 * Lógica compartida del catálogo.
 * Usada por `/productos` y `/categorias` para que ambas compartan búsqueda,
 * filtros, ordenamiento y conteos con el mismo comportamiento.
 */

export const DIAMETER_RANGES = [
  "15mm a 25mm",
  "20mm a 50mm",
  "50mm a 110mm",
  "63mm a 110mm",
  "63mm a 160mm",
  "50mm a 1200mm",
  "110mm a 315mm",
  "160mm a 400mm",
  "DN110",
] as const;

export type SortKey = "relevance" | "az" | "za" | "new";

/** Búsqueda multi-campo: nombre, código, categoría, descripción, diámetro, medidas y modelos. */
export function productMatchesQuery(p: Product, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    p.name.toLowerCase().includes(q) ||
    p.code.toLowerCase().includes(q) ||
    (p.family?.toLowerCase().includes(q) ?? false) ||
    (p.description?.toLowerCase().includes(q) ?? false) ||
    (p.diameter?.toLowerCase().includes(q) ?? false) ||
    (p.sizeInfo?.toLowerCase().includes(q) ?? false) ||
    (p.tags?.some((tag) => tag.toLowerCase().includes(q)) ?? false) ||
    (p.models?.some(
      (m) => m.code.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)
    ) ?? false)
  );
}

export interface CatalogFilters {
  query?: string;
  categorySlugs?: string[];
  /** Nichos de aplicación: agua, saneamiento, gas, domiciliaria. */
  niches?: Niche[];
  diameters?: string[];
  architectures?: string[];
  homologadoOnly?: boolean;
}

export function filterCatalog(
  products: Product[],
  categories: Category[],
  filters: CatalogFilters = {}
): Product[] {
  const {
    query = "",
    categorySlugs = [],
    niches = [],
    diameters = [],
    architectures = [],
    homologadoOnly = false,
  } = filters;

  return products.filter((p) => {
    if (!productMatchesQuery(p, query)) return false;

    if (categorySlugs.length > 0) {
      const matches = categorySlugs.some((slug) => {
        const cat = categories.find((c) => c.slug === slug || c.id === slug);
        return p.categoryId === cat?.id || p.categoryId === slug;
      });
      if (!matches) return false;
    }

    if (niches.length > 0) {
      const cat = categories.find((c) => c.id === p.categoryId || c.slug === p.categoryId);
      const matches = cat?.niches?.some((n) => niches.includes(n)) ?? false;
      if (!matches) return false;
    }

    if (diameters.length > 0) {
      if (!p.diameter) return false;
      const matches = diameters.some(
        (d) => p.diameter!.includes(d.split(" ")[0]) || d === p.diameter
      );
      if (!matches) return false;
    }

    if (architectures.length > 0) {
      const matches =
        p.architecture?.some((a) => architectures.some((sel) => a.includes(sel))) ?? false;
      if (!matches) return false;
    }

    if (homologadoOnly && p.homologado !== true) return false;

    return true;
  });
}

/** Ordena sin mutar el array de entrada. */
export function sortCatalog(products: Product[], key: SortKey): Product[] {
  const copy = [...products];
  switch (key) {
    case "az":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "za":
      return copy.sort((a, b) => b.name.localeCompare(a.name));
    case "new":
      return copy.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
    case "relevance":
    default:
      return copy;
  }
}

/** Cantidad de productos por categoría (por id y por slug). */
export function buildCategoryCounts(
  categories: Category[],
  products: Product[]
): Record<string, number> {
  const map: Record<string, number> = {};
  categories.forEach((cat) => {
    map[cat.id] = products.filter(
      (p) => p.categoryId === cat.id || p.categoryId === cat.slug
    ).length;
  });
  return map;
}
