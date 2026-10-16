# Plan de Mejoras — Sitio Corporativo y Catálogo Técnico PRODELEC S.R.L.

> Documento vivo. Registra etapas, prioridades y progreso del trabajo de mejora del sitio.
> Última actualización: 2026-10-15

## Contexto

PRODELEC S.R.L. es un fabricante argentino (desde 1986) de componentes poliméricos para redes
de agua potable, saneamiento y gas. El sitio es una **web corporativa + catálogo técnico B2B**
(no e-commerce): su objetivo es que prestatarias, municipios, distribuidores, contratistas e
ingenieros encuentren productos, vean documentación técnica, preparen solicitudes de cotización
y contacten al área comercial con mínima fricción.

### Stack

- Next.js 16 (App Router), React 19, TypeScript estricto.
- Tailwind CSS v4 (`@theme inline` en `src/app/globals.css`).
- Zustand + `persist` (`src/store/useStore.ts`) para carrito, favoritos e idioma.
- framer-motion, embla-carousel, lucide-react, react-hook-form + zod.
- i18n propio ES/EN/PT/ZH (`src/i18n/`), 383 claves por idioma.
- **Sin backend**: no hay rutas API, base de datos, Server Actions, auth ni middleware.

### Estado base verificado (antes de esta ronda de mejoras)

- `npm run build` → OK, 21 rutas generadas.
- `npx tsc --noEmit` → OK (0 errores).
- `npm run lint` → 26 errores, 75 advertencias.

## Objetivos

1. Backend no simulado cuando corresponda (documentado, no implementado sin aprobación).
2. Coherencia visual industrial, sin diseño genérico.
3. Catálogo unificado, fotografías reales bien identificadas, fichas técnicamente responsables.
4. Accesibilidad, SEO y rendimiento medidos, no afirmados.
5. Cero pérdida de datos, trabajo previo ni funcionalidades.

## Restricciones

- Solo se preserva la fuente de verdad del catálogo en `src/data/products.ts`.
- No se inventan especificaciones, certificaciones, clientes ni estadísticas.
- No commits, no push, no deploy, no migraciones destructivas, no credenciales reales.
- Backup obligatorio y verificado antes de modificar (ver abajo).

## Backup

- Ruta: `C:\Users\santi\Pictures\Prodelec-main\prodelec main backup`
- Método: `robocopy /E` excluyendo `node_modules` y `.next` (artefactos regenerables) y `tsconfig.tsbuildinfo`.
- Verificación: 735 archivos / 487,9 MB idénticos en origen y copia; `.git` (257,6 MB) preservado
  con historial y cambios sin commitear; `public/productos` y `public/clientes` presentes.
- Estado Git preservado sin reset/checkout/clean/commit/push.

## Etapas y prioridades

### Prioridad 1 — Backup, protección y plan ✅

- [x] Backup completo y verificado.
- [x] Estado Git documentado (15 modificados + `public/clientes/` sin seguimiento).
- [x] Plan registrado en este documento.

### Prioridad 2 — Errores, coherencia visual, navegación, responsive y calidad ✅ (mayormente)

- [x] Corregir los 26 errores de ESLint (sin desactivar reglas) → **0 errores**.
- [~] Advertencias relevantes corregidas; quedan 21 `no-img-element` (migración a `next/image` pendiente).
- [x] Resolver el patrón `setState` en efectos (React Compiler) sin romper comportamiento.
- [x] Unificar la navegación del catálogo (`/categorias` y `/productos`) con lógica compartida (`src/lib/catalog.ts`).
- [x] Corregir parámetros de URL no consumidos (`/categorias?categoria=` y `?q=`).
- [x] Manejo del idioma persistido e hidratación (`skipHydration` + `AppHydration` + `lang` del documento).
- [x] Componentes sin uso evaluados (`ProductQuickViewModal`): **no eliminado**. `Product3DViewer` dejó de estar sin uso: es la pestaña 3D de la ficha (ver `CAMBIOS_REALIZADOS.md` §20).

### Prioridad 3 — Catálogo unificado y fotografías reales ✅ (parcial)

- [x] Imágenes analizadas; galerías ampliadas con ángulos del mismo producto; inventario en `docs/INVENTARIO_IMAGENES.md`.
- [x] Estados de "sin resultados" (el estado "sin imagen" queda pendiente de revisión).
- [x] Ordenamiento y búsqueda por nombre/código (compartidos).
- [x] Detalle de producto: se eliminaron especificaciones genéricas/fabricadas; nota de validación técnica.
- [-] Reasignación de las 155 fotos sin asignar: **pendiente de revisión visual** (no se inventaron correspondencias).

### Prioridad 4 — Home, institucional, SEO, accesibilidad y rendimiento 🟡 (parcial)

- [x] Centralizados CLIENTES y PAÍSES en `src/data/company.ts`.
- [x] Metadatos, Open Graph, sitemap y robots (`src/lib/site.ts`, `sitemap.ts`, `robots.ts`).
- [-] Accesibilidad: revisión parcial (foco/aria en catálogo y galerías). Auditoría completa pendiente.
- [-] Rendimiento: **sin mediciones reales** (no se ejecutó Lighthouse). Pendiente.

### Prioridad 5 — Flujo frontend de cotización y contacto ✅ (mejoras de honestidad)

- [x] Avisos claros: contacto abre cliente de correo; cotización no se almacena (WhatsApp/impresión).
- [-] Envío real / notificaciones: requieren backend (ver Prioridad 6).

### Prioridad 6 — Propuesta documentada de backend y administración segura ✅

- [x] `docs/PROPUESTA_BACKEND.md`: alternativas, modelo de datos, auth, anti-abuso, backups, roadmap (no implementado).

## Registro de progreso

Ver `docs/CAMBIOS_REALIZADOS.md` para el detalle por archivo.

## Decisiones pendientes de validación humana

- Canal definitivo de recepción de cotizaciones (email / CRM / WhatsApp Business / ERP).
- Especificaciones técnicas reales por producto (presiones, torque, materiales, dimensiones).
- Necesidad real de los 4 idiomas y textos oficiales por idioma.
- Infraestructura de despliegue y gestión del panel `/admin`.
