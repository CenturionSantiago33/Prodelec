"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

/**
 * Rehidrata el estado persistido (carrito, favoritos, idioma) después del montaje
 * y mantiene `document.documentElement.lang` sincronizado con el idioma activo.
 *
 * Se usa en el layout raíz. Al rehidratar en un efecto (y no en el primer render)
 * se evita el desajuste de hidratación entre el HTML del servidor y el cliente.
 */
export function AppHydration() {
  const language = useStore((state) => state.language);

  useEffect(() => {
    void useStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
  }, [language]);

  return null;
}
