"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { categories as seedCategories, products as seedProducts } from "@/data/products";
import { novelties as seedNovelties, type Novelty } from "@/data/novelties";
import type { Category, Product } from "@/types";

interface CatalogValue {
  categories: Category[];
  products: Product[];
  novelties: Novelty[];
  loading: boolean;
  refresh: () => void;
}

const CatalogContext = createContext<CatalogValue>({
  categories: seedCategories,
  products: seedProducts,
  novelties: seedNovelties,
  loading: false,
  refresh: () => {},
});

export function useCatalog(): CatalogValue {
  return useContext(CatalogContext);
}

/**
 * Provee el catálogo (categorías, productos y novedades) a todo el sitio.
 *
 * Arranca con los datos de semilla (para que el SSR/SEO nunca quede vacío) y
 * enseguida trae los datos reales desde /api/catalog, que incluyen lo que el
 * administrador editó en el panel. Así el sitio público refleja los cambios
 * sin tocar código ni rebuild.
 */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState({
    categories: seedCategories,
    products: seedProducts,
    novelties: seedNovelties,
  });
  const [loading, setLoading] = useState(true);
  const mounted = useRef(false);

  const refresh = useCallback(() => {
    setLoading(true);
    fetch("/api/catalog")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json && Array.isArray(json.categories) && Array.isArray(json.products)) {
          setData({
            categories: json.categories,
            products: json.products,
            novelties: Array.isArray(json.novelties) ? json.novelties : seedNovelties,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    refresh();
  }, [refresh]);

  // Re-sincroniza al volver a la pestaña (por si el admin editó desde el panel).
  useEffect(() => {
    const onFocus = () => refresh();
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  return (
    <CatalogContext.Provider value={{ ...data, loading, refresh }}>
      {children}
    </CatalogContext.Provider>
  );
}
