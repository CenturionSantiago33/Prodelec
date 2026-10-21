"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Registra cada visita a una ruta en la analítica del panel (/api/track).
 * Se monta una sola vez en el layout raíz y avisa en cada cambio de ruta.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const last = useRef<string>("");

  useEffect(() => {
    if (!pathname || pathname === last.current) return;
    last.current = pathname;
    // No se cuentan las rutas internas del panel ni las de la API.
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
