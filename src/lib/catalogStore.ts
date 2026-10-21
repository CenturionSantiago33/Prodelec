/**
 * Capa de datos del catálogo + analítica.
 *
 * La fuente de datos inicial sigue siendo `src/data/products.ts` (semilla). Cuando el
 * panel de administración guarda cambios, estos se persisten en `data/db.json` y pasan
 * a tener prioridad sobre la semilla. Así el sitio público refleja lo que edita el admin.
 */
import { categories as seedCategories, products as seedProducts } from "@/data/products";
import { novelties as seedNovelties, type Novelty } from "@/data/novelties";
import type { Category, Product } from "@/types";
import { readDB, writeDB } from "./db";

export interface ViewEvent {
  path: string;
  ts: number;
  date: string; // YYYY-MM-DD
}

export interface CatalogDB {
  categories: Category[];
  products: Product[];
  novelties: Novelty[];
  analytics: { views: ViewEvent[] };
}

const MAX_VIEWS = 20000;

function seed(): CatalogDB {
  return {
    categories: seedCategories,
    products: seedProducts,
    novelties: seedNovelties,
    analytics: { views: [] },
  };
}

export function getCatalogData(): CatalogDB {
  const s = seed();
  const db = readDB<Partial<CatalogDB>>({});
  return {
    categories:
      Array.isArray(db.categories) && db.categories.length ? db.categories : s.categories,
    products:
      Array.isArray(db.products) && db.products.length ? db.products : s.products,
    novelties:
      Array.isArray(db.novelties) && db.novelties.length ? db.novelties : s.novelties,
    analytics: db.analytics ?? s.analytics,
  };
}

export function saveCatalog(data: CatalogDB): void {
  writeDB(data);
}

export function trackView(path: string): void {
  const db = getCatalogData();
  const now = new Date();
  db.analytics.views.push({
    path: path || "/",
    ts: now.getTime(),
    date: now.toISOString().slice(0, 10),
  });
  if (db.analytics.views.length > MAX_VIEWS) {
    db.analytics.views = db.analytics.views.slice(-MAX_VIEWS / 2);
  }
  saveCatalog(db);
}
