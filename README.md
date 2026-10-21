# PRODELEC S.R.L. — Sitio Corporativo y Catálogo Técnico

Web corporativa y catálogo técnico B2B de **PRODELEC S.R.L.**, fabricante argentino (desde 1986)
de componentes poliméricos para redes de **agua potable, saneamiento y gas**.

El sitio **no es un e-commerce**: su objetivo es que prestatarias, municipios, distribuidores,
contratistas e ingenieros encuentren productos, consulten documentación técnica, descarguen
catálogos/fichas, preparen **solicitudes de cotización** y contacten al área comercial.

---

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript (estricto) |
| Estilos | Tailwind CSS v4 (`@theme inline` en `src/app/globals.css`) |
| Estado | Zustand + `persist` (`src/store/useStore.ts`) |
| Animación | framer-motion, embla-carousel |
| Formularios | react-hook-form + zod |
| Iconos | lucide-react |
| i18n | propio (ES / EN / PT / ZH) en `src/i18n/` |

> **Importante:** este proyecto **no tiene backend**. No hay rutas API, base de datos, Server
> Actions, autenticación ni middleware. Todo el contenido es client-side y estático. Ver
> `docs/PROPUESTA_BACKEND.md`.

---

## Requisitos

- **Node.js 20.9 o superior** (requerido por Next.js 16).
- npm (se usa `package-lock.json`).

## Instalación y ejecución

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo  → http://localhost:3000
npm run build      # build de producción
npm run start      # servir el build de producción
npm run lint       # ESLint
npx tsc --noEmit   # verificación de tipos
```

---

## Estructura del proyecto

```
src/
├── app/                        # Rutas (App Router). Casi todas son Client Components.
│   ├── page.tsx                # Home institucional
│   ├── layout.tsx              # Layout raíz (fuentes, metadata, Navbar/Footer/CartDrawer)
│   ├── categorias/             # Catálogo por familia (con ?categoria= y ?q=)
│   ├── productos/              # Catálogo con filtros avanzados + [slug] (detalle)
│   ├── empresa/  equipos/  novedades/  ubicacion/  contacto/  favoritos/
│   ├── admin/                  # Panel DEMO sin autenticación ni persistencia (ver aviso)
│   ├── pdf/catalogo/           # Catálogo general imprimible
│   ├── pdf/ficha-tecnica/      # Fichas técnicas imprimibles
│   ├── sitemap.ts  robots.ts   # SEO técnico
│   └── globals.css             # Tokens de diseño (paleta navy/primary/accent, tipografías)
├── components/
│   ├── layout/                 # Navbar, Footer
│   ├── product/                # ProductCard, Product3DViewer (sin uso)
│   ├── catalog/                # ProductQuickViewModal (sin uso)
│   ├── cart/                   # CartDrawer (solicitud de cotización)
│   ├── home/  novedades/  ui/  system/
├── data/
│   ├── products.ts             # ⭐ FUENTE ÚNICA del catálogo (categorías + productos)
│   ├── company.ts              # CLIENTES y PAÍSES
│   └── mock.ts                 # Re-export de products.ts
├── i18n/                       # es.ts, en.ts, pt.ts, zh.ts, index.ts
├── lib/                        # utils.ts (cn), catalog.ts (búsqueda/filtros), site.ts
├── store/useStore.ts           # Zustand (carrito, favoritos, idioma)
└── types/index.ts              # Tipos de dominio
```

### Fuente de verdad del catálogo

TODO el catálogo vive en **`src/data/products.ts`** (categorías, productos, imágenes, especificaciones
y enlaces a PDF). Para agregar o modificar productos, editá ese archivo. No existen fuentes duplicadas
de productos; el resto de las páginas consume este archivo.

### Internacionalización (i18n)

- Idiomas: **ES, EN, PT, ZH** con paridad de claves.
- Uso en componentes: `const t = useTranslation(language); t("nav.home")`.
- `getTranslatedProduct` / `getTranslatedCategory` resuelven textos localizados desde los campos
  `*I18n` de cada registro del catálogo.
- Al agregar una clave nueva, **agregarla en los 4 idiomas** (`es.ts`, `en.ts`, `pt.ts`, `zh.ts`).

---

## Panel `/admin` — autenticado, con persistencia local

El panel `/admin` ya **no es una demo**: tiene **login con usuario y contraseña**, gestiona
**productos** y **novedades** (CRUD), muestra **estadísticas reales de visitas** y persiste los
cambios en `data/db.json`. Los cambios se reflejan en el sitio público sin rebuild.

- Credenciales de acceso: se configuran con las variables de entorno `ADMIN_USER`,
  `ADMIN_PASSWORD` y `ADMIN_SECRET` en un archivo `.env.local` (que **no** se versiona).
- Rutas de la API: `/api/auth/*`, `/api/catalog`, `/api/admin/*` y `/api/track`.
- `src/middleware.ts` protege `/admin/*` (redirige al login si no hay sesión).

> **Límite:** el almacenamiento en archivo sirve para desarrollo. En un deploy serverless
> (Render/Vercel) el filesystem no persiste entre deploys; para producción hay que mover los datos
> a una base real (Supabase), ver `docs/PROPUESTA_BACKEND.md`. El detalle completo está en
> `docs/CAMBIOS_REALIZADOS.md` §22.

---

## Cotizaciones y contacto

- **Carrito = solicitud de cotización** (no una compra). No hay pago ni backend.
- El envío se realiza por **WhatsApp** (deep link) y/o **impresión** de una proforma en el navegador.
- El formulario de contacto abre el **cliente de correo** del usuario (`mailto:`).
- **Nada se guarda en el sitio**: no se simula persistencia. Ver `docs/PROPUESTA_BACKEND.md` para
  receptar solicitudes de forma real.

---

## Imágenes

- Fotos de producto: `public/productos/catalogo/<familia>/…` y `public/productos/…`.
- Logos de clientes: `public/clientes/`.
- Certificados: `public/certificados/`.
- Fotos institucionales y de carrusel: `public/carousel-*.jpg`.
- Inventario y archivos sin asignar: `docs/INVENTARIO_IMAGENES.md`.

---

## Testing y verificación

No hay suite de tests automatizados configurada. Las comprobaciones disponibles son:

```bash
npx tsc --noEmit   # tipos
npm run lint       # ESLint
npm run build      # build de producción (compila + genera páginas estáticas)
```

---

## Documentación

- `docs/PLAN_MEJORAS.md` — etapas, prioridades y progreso.
- `docs/CAMBIOS_REALIZADOS.md` — detalle de cambios por archivo/funcionalidad.
- `docs/INVENTARIO_IMAGENES.md` — inventario de imágenes y casos a revisar.
- `docs/PROPUESTA_BACKEND.md` — propuesta de backend, BD, auth y recepción real de solicitudes.

---

## Backlog conocido (resumen)

- Sin backend ni persistencia real (cotizaciones/contacto).
- `/admin` sin autenticación.
- Especificaciones técnicas: completar/validar con el área técnica (no se inventan valores).
- Imágenes: 155 archivos en `public/productos/` sin asignar a un producto (ver inventario).
- Optimización de imágenes: se usa `<img>` en varios componentes; evaluar `next/image`.
- Assets de plantilla (`next.svg`, `vercel.svg`, etc.) y archivos sueltos en la raíz pendientes de limpieza.
