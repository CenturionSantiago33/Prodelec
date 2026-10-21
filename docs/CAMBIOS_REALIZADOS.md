# Cambios Realizados — Prodelec

Detalle de los cambios concretos aplicados al proyecto, por archivo/funcionalidad.
Acompaña a `docs/PLAN_MEJORAS.md`.

> Estado base de referencia (antes de los cambios): `npm run build` OK · `tsc --noEmit` OK ·
> ESLint **26 errores / 75 advertencias**.

---

## 0. Backup (Fase 0)

- **Ruta:** `C:\Users\santi\Pictures\Prodelec-main\prodelec main backup`
- **Método:** `robocopy /E` excluyendo `node_modules` y `.next` (regenerables) y `tsconfig.tsbuildinfo`.
- **Verificación:** 735 archivos / 487,9 MB idénticos en origen y copia; `.git` (257,6 MB) preservado
  con historial y cambios sin commitear; `public/productos` y `public/clientes` presentes.
- No se hizo reset/checkout/clean/commit/push.

---

## 1. Calidad de código y ESLint

**Resultado: de 26 errores + 75 advertencias → 0 errores + 22 advertencias.**
`tsc --noEmit` OK. `npm run build` OK.

### `src/i18n/index.ts`
- Se separó la fábrica pura de traducción (`createTranslator`) del alias `useTranslation`
  (evita el falso positivo de reglas de hooks al llamarla desde funciones no-hook).
- Se tiparon `getTranslatedProduct` / `getTranslatedCategory` / `getTranslatedTag` (se eliminaron
  los `as any`); nuevo tipo exportado `TranslateFn`; nuevo tipo `LangKey`.
- Se agregaron los mapeos legacy faltantes `catAll` → `common.all` y `catFilters` → `common.filters`
  (antes se mostraba la clave cruda `catAll` en el catálogo).
- Se quitó el import sin uso `TranslationKey`.

### Correcciones de `setState` dentro de efectos (React Compiler)
- `src/components/layout/Navbar.tsx`: patrón `mounted` reemplazado por `useSyncExternalStore`
  (`useIsMounted`); se eliminó el efecto que cerraba menús según `pathname` y se cerraron los menús
  explícitamente en la búsqueda. Imports sin uso eliminados (`X`, `Globe`, `Layers`, `LanguageCode`).
- `src/components/novedades/HeroCarousel.tsx`: el índice del carrusel ahora se lee con
  `useSyncExternalStore` sobre embla (se eliminaron `useState`+`useEffect`). Imports sin uso eliminados.
- `src/app/pdf/catalogo/page.tsx`: la categoría seleccionada se deriva directamente de la URL
  (`searchParams`) en lugar de sincronizarse por efecto. Imports sin uso eliminados.
- `src/app/productos/[slug]/page.tsx`: el producto y los relacionados se calculan sincrónicamente
  desde `src/data/products.ts` (sin estado de carga ni efectos). Se eliminó el `Skeleton` de carga.

### Otros
- Imports/variables sin uso eliminados en: `admin/layout.tsx`, `admin/page.tsx`,
  `admin/productos/page.tsx`, `admin/cotizaciones/page.tsx`, `admin/mailing/page.tsx`,
  `admin/configuracion/page.tsx`, `categorias/page.tsx`, `pdf/ficha-tecnica/page.tsx`,
  `product/ProductCard.tsx`, `novedades/DocumentCards.tsx`, `ui/button.tsx`,
  `ui/HydraulicRippleProvider.tsx`, `product/Product3DViewer.tsx`,
  `catalog/ProductQuickViewModal.tsx`.
- Comillas sin escapar corregidas (`&quot;`) en `admin/productos/page.tsx` y `pdf/ficha-tecnica/page.tsx`.
- `equipos/page.tsx`: parámetro `t: any` tipado como `TranslateFn`.
- `eslint.config.mjs`: se declaran `src/scripts/**/*.js` como CommonJS (scripts legacy de Node, fuera
  del bundle) y se ignora `docs/**`. **No se desactivó ninguna regla para el código de la app.**
- `admin/imagenes/page.tsx`: el icono lucide `Image` se aliasó a `ImageIcon` (evita falso positivo de
  `jsx-a11y/alt-text`).

### Pendiente (advertencias restantes)
- 21 advertencias `@next/next/no-img-element`: uso intencional de `<img>` para fotos dinámicas de
  producto/logo. Migrar a `next/image` es un trabajo aparte (ver Plan).
- 1 advertencia informativa `react-hooks/incompatible-library` en `contacto/page.tsx`
  (`react-hook-form` `watch`), sin acción posible.

---

## 2. Catálogo unificado

### Nuevo: `src/lib/catalog.ts`
Lógica compartida por `/categorias` y `/productos`:
- `productMatchesQuery` (búsqueda multi-campo: nombre, código, familia, descripción, diámetro, medidas, tags, modelos).
- `filterCatalog` (categorías, diámetros, arquitecturas, sólo homologados).
- `sortCatalog` (relevancia, A-Z, Z-A, novedades) — **no muta** el array.
- `buildCategoryCounts`, `DIAMETER_RANGES`, `SortKey`.

### `src/app/productos/page.tsx` (reescrito)
- Se adoptó el **lenguaje visual corporativo** de `/categorias` (`container-corp`, `industrial-label`,
  `btn-primary-corp`, paleta navy/slate) en lugar del diseño previo con gradientes y grises genéricos.
- Filtros: familias (multi), norma/homologación, diámetro; ordenamiento; vista grilla/lista; búsqueda.
- Corrección de la **clave cruda `catAll`** y del `prefer-const` mutando el array filtrado.
- El panel de filtros se extrajo a un componente de módulo (`FilterPanel`) — sin componentes definidos
  dentro del render.
- Sincronización de estado con la URL mediante el patrón recomendado de React
  (ajuste de estado durante el render), evitando `setState` en efectos.
- Estado vacío y "cargar más" conservados.

### `src/app/categorias/page.tsx`
- Ahora **lee los parámetros de URL** `?categoria=` y `?q=` (antes se ignoraban: los enlaces del menú
  de Productos del Navbar no filtraban nada). Se envolvió en `Suspense` (requerido por `useSearchParams`).
- La búsqueda usa `productMatchesQuery` compartida.

---

## 3. Detalle de producto y documentación técnica (precisión)

### `src/app/productos/[slug]/page.tsx`
- Se eliminaron especificaciones **fabricadas/generales** aplicadas a todos los productos:
  `PN 10 / PN 16 BAR`, torque `25–35 N·m` y el relleno por defecto `DN 20 a DN 110 mm`.
- La tabla de especificaciones ahora muestra **solo** datos reales del producto (`sizeInfo`,
  `diameter`, `specs[]`) y una nota al pie aclarando que los valores no informados deben confirmarse
  con el área técnica (clave `product.specsNote`).
- Imágenes: la galería ahora tiene más ángulos reales (ver §5).

### `src/app/pdf/catalogo/page.tsx`
- Se quitó la fila fija `Presión de Trabajo: PN 10 / PN 16 BAR`; en su lugar se listan `specs` reales.

### `src/app/pdf/ficha-tecnica/page.tsx`
- Se quitó el badge fijo `PN 10 / PN 16 BAR` por producto; ahora muestra `DN`/`HOMOLOGADO`/`LÍNEA ESTÁNDAR`
  según datos reales.
- La tabla de características constructivas se rotuló como **“(generales de línea)”** y el torque dejó
  de afirmarse con un valor fijo (“Según especificación del modelo — consultar al área técnica”).
- Se agregó una tabla de especificaciones propias del producto cuando existen (`sizeInfo`, `diameter`, `specs`).

---

## 4. Contacto y cotización (sin falsa persistencia)

- **`src/app/contacto/page.tsx`**: se agregó un aviso claro de que el formulario **abre el cliente de
  correo** y que hay que presionar Enviar para completar la consulta (`contact.mailtoHint`).
- **`src/components/cart/CartDrawer.tsx`**: se agregó el aviso de que la solicitud **no se guarda en el
  sitio** y se envía por WhatsApp o se imprime (`cart.noStoreNotice`).
- Nuevas claves i18n en **los 4 idiomas**: `contact.mailtoHint`, `cart.noStoreNotice`, `product.specsNote`.

---

## 5. Imágenes reales (Fase 4)

- Se completaron **galerías** de producto agregando ángulos hermanos ya presentes en el catálogo oficial
  (misma carpeta y misma base de nombre, archivos verificados como existentes):
  - Abrazadera de Derivación: +`_2`, +`_3`.
  - Abrazadera de Reparación 1 Banda (150-165): +`150-165_largo_191_2`.
  - Cepo de Corte y Restricción: +`_3`, +`_4`.
  - Collar Toma en Carga: +`_3`.
  - Collarín de Toma de Agua: +`_c`.
  - Empalme Flexible de Goma Cloacal: +`_detalle`, +`_reverso`.
- No se reasignó ninguna foto por coincidencia dudosa. Inventario completo en `docs/INVENTARIO_IMAGENES.md`.

---

## 6. Home e institucional (Fase 5) — centralización parcial

- Nuevo `src/data/company.ts` con `CLIENTS` (8 prestatarias) y `COUNTRIES` (5 países), antes
  hardcodeados dentro de `src/app/page.tsx`. La home ahora los importa.
- Se corrigió el `useEffect` del carrusel de la home (`exhaustive-deps`).

---

## 7. SEO, metadata e hidratación (Fase 9)

- **`src/lib/site.ts`** (nuevo): datos institucionales y `SITE.url` configurable por
  `NEXT_PUBLIC_SITE_URL` (default `https://www.prodelec.com.ar`, **a confirmar antes de publicar**).
- **`src/app/layout.tsx`**: `metadataBase`, título con plantilla, `description`, `keywords`, Open Graph,
  `robots`. `lang` del documento sincronizado con el idioma activo.
- **`src/app/sitemap.ts`** (nuevo) y **`src/app/robots.ts`** (nuevo): sitemap de rutas estáticas,
  categorías y productos; `robots.txt` excluye `/admin`, `/pdf` y `/favoritos`.
- **`src/store/useStore.ts`**: `skipHydration: true` para evitar el mismatch de hidratación del estado
  persistido (idioma/carrito/favoritos).
- **`src/components/system/AppHydration.tsx`** (nuevo): rehidrata el store tras el montaje y sincroniza
  `document.documentElement.lang`.

---

## 8. Documentación

- `README.md`: reemplazado el template de create-next-app por documentación real del proyecto.
- `docs/PLAN_MEJORAS.md`, `docs/CAMBIOS_REALIZADOS.md`, `docs/PROPUESTA_BACKEND.md`,
  `docs/INVENTARIO_IMAGENES.md`.

---

## Verificación ejecutada

| Comprobación | Antes | Después |
| --- | --- | --- |
| `npx tsc --noEmit` | OK (0) | **OK (0)** |
| `npm run lint` | 26 errores / 75 advertencias | **0 errores / 22 advertencias** |
| `npm run build` | OK (21 rutas) | **OK (23 rutas)** |
| Rutas rotas de imágenes/fichas en `products.ts` | 0 | **0** |

**Nota:** no se ejecutaron tests automatizados (no hay suite configurada) ni mediciones de rendimiento
reales en navegador. Las afirmaciones de rendimiento quedan como pendientes de medición.

---

## 9. Rediseño visual / sistema de UI (fase posterior)

Objetivo: quitar el aspecto de "plantilla generada" y hacer las pantallas más intuitivas de escanear
(imagen + código + acción directa por encima del texto), aplicado a **todos los idiomas**.

### Sistema de botones (`src/app/globals.css`)
- Se reemplazó el botón rectangular con mayúsculas y *tracking* amplio por un sistema unificado:
  **radio 10px**, en oración (sin `uppercase`), `font-weight 600`, altura consistente, ícono + etiqueta.
- Variantes: `.btn-primary-corp` (sólido), `.btn-outline-corp` (para fondos oscuros),
  `.btn-ghost-corp` (**nueva**, para fondos claros).
- Estados agregados: `hover` (oscurece + micro-elevación), `active`, `focus-visible` (anillo),
  `disabled`.
- Foco visible global para navegación por teclado (`:focus-visible` en enlaces, botones e inputs).

### Contacto (`src/app/contacto/page.tsx`)
- Se eliminaron los **emojis** del selector "Área de interés" y se reemplazaron por **íconos lucide**
  en tarjetas seleccionables (estado activo con borde/fondo de color primario).
- Se quitó el panel "Asunto que verá el receptor" (ruido) y el badge "Direct Web".
- Etiquetas en oración (no mayúsculas), botón de envío unificado y accesible.
- El `value` de cada área sigue siendo estable (viaja en el asunto del correo); la etiqueta visible
  se traduce reutilizando las claves existentes (`contact.areaVentas`, `contact.areaCompras`, etc.).

### Catálogo (`/categorias` y `/productos`)
- Tarjetas de familia: **se quitó la numeración "Familia #01"** y el ruido repetido;
  ahora priorizan imagen, nombre, descripción y acciones.
- Chips de familia convertidos a *pill* (`rounded-full`) con tinte del color de la familia en el
  estado activo (antes: bloque navy con mayúsculas).
- Controles, búsqueda y sidebar con radios coherentes (`rounded-xl`/`rounded-2xl`) y `focus` visible.
- `ProductCard`: tarjetas `rounded-2xl` con *hover* elevado; badges en *pill*; se mantienen
  **código/SKU visible** y el botón **"Cotizar"** directo en la tarjeta (no hace falta entrar al
  producto para agregar a la cotización).

### Detalle de producto y carrito
- Botones principales migrados al sistema nuevo (`.btn-primary-corp` / `.btn-ghost-corp`).
- Títulos de sección sin mayúsculas forzadas; tarjetas con `shadow-sm` y radios coherentes.
- Carrito: CTA de WhatsApp, descarga y "vaciar" alineados al sistema de botones.

### Chino (ZH)
- Poppins y League Spartan no incluyen glifos CJK, por lo que el chino caía a una fuente de sistema
  despareja. Se agregó una **pila CJK** (`PingFang SC`, `Microsoft YaHei`, `Hiragino Sans GB`,
  `Noto Sans SC`) para `body` y títulos cuando `html[lang="zh"]`.
- Se **reduce el *tracking*** amplio en ZH (se ve mal sobre caracteres chinos).
- Nota técnica: `@theme inline` inyecta la pila de fuentes directamente en la utilidad `font-sans`,
  así que el override de la variable `--font-sans` no alcanzaba; hubo que declarar la familia de forma
  explícita. Se optó por fuentes CJK del sistema para no descargar webfonts pesadas.

### Verificación de esta fase
- `npx tsc --noEmit` → **0 errores**.
- `npx eslint src` → **0 errores / 22 advertencias** (las mismas de la línea base: `<img>` sin
  `next/image` y un aviso de `react-hook-form`).
- `npm run build` → **OK (23 rutas)**.
- Servidor de producción en `-p 3100`: `/`, `/productos`, `/categorias`, `/contacto`, `/empresa` y un
  detalle de producto responden **200**, sin errores de consola.
- Comprobado en navegador: botones con `text-transform: none`, `border-radius: 10px`,
  `font-weight: 600`; tarjetas `rounded-2xl`; sin emojis en contacto; y con `html[lang="zh"]` el
  `font-family` incluye las fuentes CJK.

**Pendiente de esta fase:** restyling profundo de bloques internos de la home (`src/app/page.tsx`)
más allá de los botones, y barra de acción *sticky* en el detalle de producto.

---

## 10. Ajustes de UI + fichas técnicas reales

### Correcciones de UI
- **Botón "Certificado ISO 9001" (home, hero):** era rectangular mientras los otros dos CTA del
  mismo grupo ya tenían radio 10px. Se unificó (radio 10px, padding y tipografía equivalentes,
  ícono + etiqueta traducida con `isoCertPdf` en los 4 idiomas). Ya no queda "cuadrado".
- **Desplegable de catálogo del Navbar (rediseño):**
  - Se eliminó la pared de MAYÚSCULAS con *tracking* ancho en las 17 filas de familias; ahora van
    en oración y peso medio.
  - Se quitó el glifo `★` y el *glow* azul del panel; sombra más limpia.
  - Panel con `rounded-2xl`; filas con `rounded-lg`; chips de variantes y contador en *pill*.
  - Se agregó un ícono real (`LayoutGrid`) en lugar del símbolo decorativo.

### Fichas técnicas reales
- Se copiaron **32 PDF de fichas** desde `Muestra\Fichas técnicas` a `public/fichas/`, con nombres
  ASCII sin espacios ni acentos.
- **13 productos** del catálogo quedaron vinculados a su ficha específica (antes apuntaban a una
  lista de precios genérica).
- Verificado: las 16 fichas referenciadas existen y se sirven con HTTP 200 / `application/pdf`.
- Detalle completo, dudas y hallazgos en **`docs/INVENTARIO_FICHAS.md`**.

### Verificación de esta tanda
- `npx tsc --noEmit` → **0 errores**.
- `npm run build` → **OK**.
- Verificado en runtime que la página de producto referencia `/fichas/...` y que los PDF responden.

---

## 11. Imágenes nuevas + reglas de fichas + kit de ventas

### Imágenes de producto actualizadas (4)
Se reemplazaron las fotos de los 4 productos cuyo código coincide exactamente con
las fotos de `Muestra`:

| Producto | Código | Origen | Antes | Después |
| --- | --- | --- | --- | --- |
| Caja de Conexión Compacta | `C1400CS` | C1400CS.jpg / C1400CS-PRO.jpg | 1752 KB + 1840 KB | 91 KB + 95 KB |
| Caja Recta Alta | `C11530CS` | C11530CS.jpg / C11530CS-2.jpg | 1753 KB + 3765 KB | 82 KB + 83 KB |
| Caja de Conexión Reducida | `C2200CS` | C2200CS.jpg | 1915 KB | 103 KB |
| Gabinete de Pared | `C10500CS` | C10500CS.jpg / C10500CS-2.jpg | 1621 KB + 4033 KB | 66 KB + 76 KB |

- Procesadas con `sharp`: recorte a 1400×1400 máx., fondo blanco, JPEG progresivo q82.
- **Reducción total: ~16,7 MB → 0,6 MB** (≈96%).
- Salida en `public/productos/fotos/`. Las fotos nuevas quedan **primero** y las
  antiguas se conservan como ángulos adicionales.

### Reglas de fichas técnicas (definidas por el cliente)
- Si el producto **tiene** ficha propia → botón "Ficha Técnica" con ese PDF.
- Si **no tiene** → el botón **no aparece** (se quitaron 4 referencias a listas de
  precios genéricas que solo agregaban ruido).
- La **Ficha Técnica General** (`/pdf/ficha-tecnica`) queda disponible para **todos**
  los productos, rotulada como general.
- Nuevas claves i18n `techSheetGeneral` y `techSheetGeneralDesc` en los 4 idiomas.

### UI
- Los tabs del detalle de producto ya no usan emojis (📊 / 📥): ahora usan íconos
  `Table2` y `FileDown` de lucide, como el resto del rediseño.
- Verificado en navegador: producto **con** ficha muestra 1 botón de ficha; producto
  **sin** ficha no muestra ninguno y en "Documentación" solo aparece la general.

### Kit de ventas (fuera de la app, en `ventas/`)
Herramienta personal de trabajo, **sin relación con los datos de PRODELEC**:
- `ventas/demo/` — plantilla de landing de una página + `generar.js` (sin dependencias).
  Se personaliza editando un `.json` y corriendo `node ventas/demo/generar.js`.
- `ventas/prospeccion.csv` — planilla de prospección de comercios (3 filas de ejemplo).
- `ventas/PITCH.md` — guion de 60 s, 5 objeciones, estructura de precios sugerida, seguimiento.
- `ventas/README.md` — cómo usarlo paso a paso.

> La carpeta `ventas/` **no forma parte del build de Next** (no está en `src/` ni en `public/`).

### Verificación de esta tanda
- `npx tsc --noEmit` → **0 errores**.
- `npx eslint src` → **0 errores** / 22 warnings (línea base).
- `npm run build` → **OK**.
- 4 imágenes nuevas servidas con HTTP 200; demo generada sin tokens pendientes.

---

## 12. Título con la bandera argentina

El H1 del hero (3 líneas) pasa a leerse como la bandera nacional:

| Línea | Antes | Ahora |
| --- | --- | --- |
| `title1` | blanco | **celeste** `#74ACDF` (banda superior) |
| `title2` | azul `#4a9de0` | **blanco** (banda central) **+ Sol de Mayo detrás** |
| `title3` | blanco | **celeste** `#74ACDF` (banda inferior) |

- **`src/components/brand/SolDeMayo.tsx`** (nuevo): sol estilizado de 32 rayos
  (16 largos + 16 cortos) generado por código, sin dependencias ni imágenes.
  Es **decorativo** (`aria-hidden`), va detrás del texto y no intercepta clics.
- El sol se centra sobre la **palabra del medio** con `left-1/2 -translate-x-1/2`
  dentro de un `inline-block`, así **no rompe el texto**: funciona igual en
  ES (*INDUSTRIAL*), EN (*PRODUCTION*), PT (*INDUSTRIAL*) y ZH (*工业制造*).
- **Tamaño:** `1.24em` con `leading-[1.2]` (~14% más grande que la primera
  versión). Sobresale solo ~1,5 px por lado de la caja de línea, muy por debajo
  del espacio libre que queda hasta los glifos de las palabras vecinas.
- **Centrado óptico:** el centro geométrico de *INDUSTRIAL* cae sobre la unión
  `S`/`T`, que a ojo se lee corrido hacia la derecha. Se aplicó un desplazamiento
  de `-0.18em` — `translate(calc(-50% - 0.18em), -50%)` — para que el sol quede
  alineado con la **S**.
- El texto del H1 queda intacto para lectores de pantalla y SEO.

**Verificado en el navegador:** fuente `84,24 px`, alto de línea `101,09 px`,
sol `104 px`; centro del sol `254` vs centro de la `S` `257` (**Δ 3 px**);
colores celeste/blanco/celeste; texto accesible `PRODUCCIÓN INDUSTRIAL ARGENTINA`;
sin desborde horizontal y los CTA del hero siguen dentro de la pantalla.

### Animación del sol (destello)

Tres capas, definidas en `globals.css` y aplicadas desde `SolDeMayo` / `page.tsx`:

| Clase | Efecto | Duración |
| --- | --- | --- |
| `.sol-halo` | El resplandor "respira" (`opacity` 0.5 → 1, `scale` 1 → 1.18) | 4,6 s |
| `.sol-destello` | Destello corto del núcleo (`opacity` 0 → 0.9 → 0) | 4,6 s |
| `.sol-rayos` | Los 32 rayos giran muy lento | 180 s |

- Se animan **`opacity`/`transform`** (baratos para el compositor) en lugar de
  `filter`/`drop-shadow`, que forzarían repintado en cada frame.
- Las tres capas van **detrás del texto**, así que el destello se ve como un
  resplandor alrededor y entre las letras, sin taparlas.
- `@media (prefers-reduced-motion: reduce)` **desactiva las tres** y deja el
  halo en un estado fijo: quien pidió menos movimiento no ve parpadeo.

**Verificado con el Web Animations API** (posicionando cada animación en su pico):
halo al 50% → `opacity: 1`, `scale(1.18)`; destello al 64% → `opacity: 0.9`;
destello al 96% → `opacity: 0`. Estados `running`.

---

## 13. Rediseño del desplegable de catálogo (Navbar)

Se veía "rancio" y **truncaba los nombres de las familias** (`Cajas de Conexión y Protec…`),
así que no se entendía qué categoría era.

| Métrica | Antes | Ahora |
| --- | --- | --- |
| Ancho del panel | 640 px | **940 px** (con `min(…, 100vw - 40px)`) |
| Alto de las columnas | 380 px | **462 px** (responsive a la altura de pantalla) |
| Columna de familias | 300 px | **372 px** |
| Imagen de la familia | 144 px de alto | **236 px** |
| Nombres truncados | varios | **0** (envuelven en 2 líneas) |
| Botón "Ver productos" | 11 px / ~32 px | **13.5 px / 44 px** |
| Tamaño de fila | 12.5 px | **13.5 px** |

Otros cambios:
- **Encabezado real**: ícono en caja + título `Catálogo completo` 16 px + subtítulo
  dinámico *"N productos en M familias"*, con franja superior degradada. Antes era
  una línea gris con un número suelto.
- **Ítem activo** con fondo y chevron que se desplaza; se quitó el `divide-y` que
  rayaba la lista y la hacía ver cargada.
- **Scrollbar propio** (`.dd-scroll` en `globals.css`): antes se veía la barra gris
  nativa pegada al borde; ahora es fina, redondeada y se insinúa con hover.
- **Imagen** sobre tarjeta blanca con `object-contain` centrado (antes tenía `p-3`
  y el producto quedaba chico y pegado al borde).
- Se eliminó el `+2 más` que quedaba cortado al borde del panel.
- El panel usa un `pt-2` con hitbox continuo: hay separación visual del navbar sin
  romper el hover.

**Verificado en el navegador:** panel 940 px, radio 16 px, 16 familias listadas,
**0 nombres truncados**, imagen 236 px, botón 44 px.

---

## 14. Filtro de familias: del muro de 17 chips a un solo control

**Problema:** en `/categorias` el filtro de familias era una fila de **17 botones (chips)**
que se partía en varias líneas. Dos problemas de fondo:

- **12 de las 16 familias tienen 1 solo producto.** Elegir "Junta de Reparación (1)" no
  reducía nada, así que el filtro no ayudaba a decidir.
- **Estaba duplicado en `/productos`:** la misma fila de chips *y además* una barra lateral
  con las mismas familias en checkboxes — la misma lista dos veces en una pantalla.

### `src/app/categorias/page.tsx`
- Se eliminaron **los 17 chips** y el `<select>` que sólo se mostraba en mobile.
- En su lugar, **un único control plegable** junto al buscador: `[🔍 Buscar…] [⚙ Familia ▾]`,
  que muestra la familia actual y la cantidad de productos de cada una
  (`Cajas de Conexión y Protección (6)`).
- La **grilla de 16 tarjetas de familia con foto** queda como selector principal cuando
  estás en "Todas las familias": se recorre con la vista mucho más rápido que leyendo 17 nombres.
- Se quitó el import de `cn` (quedó sin uso).

### `src/app/productos/page.tsx`
- Se eliminó la **fila de chips duplicada**. El único filtro de familias es ahora la
  **barra lateral** (checkboxes, en `lg+`) y el **drawer "Filtros"** en mobile/tablet.
- Se quitaron `buildCategoryCounts` / `categoryCounts` (quedaron sin uso).

**Nota (por qué no se agrupó):** `src/data/products.ts` exporta `architectureFilters`
(9 "filtros de arquitectura": Redes de Agua Potable, Saneamiento Cloacal, etc.) pero
**no está conectado a ninguna familia ni producto**: 0 productos declaran `architecture`.
No se usó para agrupar familias para no inventar una taxonomía de negocio.

**Verificado por DOM** (el entorno no tiene ventana visible, así que no hay capturas):

| Pantalla | Chips | Select | Resultado |
| --- | --- | --- | --- |
| `/categorias` (todas) | **0** | 1 (288 px) | grilla con **16** tarjetas de familia |
| `/categorias` (cajas-conexion) | **0** | 1 → `Cajas de Conexión y Protección (6)` | 6 productos, sin grilla de familias |
| `/productos` | **0** | — | barra lateral: 16 familias + norma + diámetro (27 checkboxes) |

Sin desborde horizontal en ninguna. `tsc` 0 · ESLint 0 errores · `build` OK.

---

## 15. Adiós a "familia" y a "SKU"

Dos pedidos concretos de la empresa:

1. **La palabra "familia" no se usa más** en ninguna parte visible del sitio (era confuso:
   "familia" sonaba a parentesco, no a catálogo).
2. **La palabra "SKU" desaparece** de la página. El buscador **sigue encontrando por
   código** (uno se sabe `C1400CS` de memoria y lo tipea), pero el código se muestra
   como **"Código"**, y en la ficha del producto como **"Código de producto"**.

### Palabra elegida: "categoría"

Se eligió **Categoría / Category / Categoria / 类别**. Motivos:

- Es la palabra que **ya usa el código y la URL** (`/categorias`, tipo `Category`,
  `categoryId`, `getTranslatedCategory`). Antes la página decía una cosa y la URL otra.
- El usuario la propuso como ejemplo.
- Alternativas como "línea de producto" habrían vuelto a chocar contra la URL.

### Dónde se cambió (todo lo visible, en los 4 idiomas)

| Antes | Ahora |
| --- | --- |
| Catálogo de Productos por **Familia** | Catálogo de Productos por **Categoría** |
| **Familias** de Productos Prodelec | **Categorías** de Productos Prodelec |
| Todas las **Familias** | Todas las **Categorías** |
| Seleccionar **Familia** de Productos | Seleccionar **Categoría** de Productos |
| Filtrar por **Familia** | Filtrar por **Categoría** |
| Ver todas las **familias** | Ver todas las **categorías** |
| **Familias** de productos (desplegable) | **Categorías** de productos |
| 27 productos en 16 **familias** | 27 productos en 16 **categorías** |
| misma **familia** técnica | misma **categoría** técnica |
| PDF **Familia** | PDF **Categoría** |
| Índice de **Familias** de Productos (catálogo PDF) | Índice de **Categorías** de Productos |
| N **familias** completas (slide de novedades) | N **categorías** completas (*ver nota al final*) |

- En chino se pasó de 系列 (*serie*) a **类别** (*categoría*). Se dejaron como estaban
  las menciones a **"C-Series" / C系列**, que no son una categoría sino el nombre real
  de la línea de cajas.

### "SKU" → "Código"

| Ubicación | Antes | Ahora |
| --- | --- | --- |
| **Ficha de producto** (arriba del título) | `SKU: C1400CS` | **`Código de producto: C1400CS`** |
| Tabla de modelos y variantes | columna `SKU` | columna **`Código`** |
| Tarjetas del inicio y de novedades | `SKU: …` | `Código: …` |
| Vista rápida (modal) y carrito | `SKU: …` | `Código: …` |
| Mensaje de WhatsApp del carrito | `(SKU: …)` | `(Código: …)`, traducido según idioma |
| Encabezado del carrito impreso | `SKU / Code` | `Code` |
| Catálogo PDF y ficha técnica general | `SKU: …` | `Código: …` |
| Placeholder del buscador | "…nombre, **SKU**, código o modelo…" | "…nombre, **código**, medida o modelo…" |

**El buscador no se tocó:** `productMatchesQuery()` ya comparaba contra `p.code`
(además de nombre, categoría, descripción, diámetro, medidas y modelos), así que
escribir `C1400CS` sigue devolviendo la caja. La palabra "SKU" era sólo la etiqueta
visible; nunca fue el criterio de búsqueda.

En i18n se renombraron las claves `common.sku` → `common.code` y `product.sku` →
`product.code`. Como **esas claves ya existían** (usadas por la cabecera de
`/categorias`), quedaron duplicadas en el primer intento; se corrigió dejando una
sola de cada una y se verificó la **paridad de 386 claves** en los 4 idiomas.

### Qué NO se tocó (a propósito)

- `src/scripts/updateTranslations*.js`: son los scripts históricos con los que se
  generaron las traducciones. No se renderizan en ninguna página; se dejan como registro.
- `globals.css` línea 456 habla de la **familia tipográfica** del chino (fuentes), no
  de familias de producto.
- Los nombres internos `sku` en `Product3DViewer.tsx` y en `/admin` son campos de datos
  y variables, no texto visible (las etiquetas ya dicen "Código"). `/admin` sigue siendo
  una **demo sin autenticación**.
- En `pdf/catalogo` se mantiene `?familia=` como **alias heredado** de `?categoria=`,
  para que los links viejos que ya circularon no se rompan.

### Verificación

- `npx tsc --noEmit` → **0 errores**.
- `npx eslint src` → **0 errores** / 22 warnings (línea base sin cambios).
- `npm run build` → **OK** (`/categorias` `○`, `/productos` `○`, `/productos/[slug]` `ƒ`).
- Paridad i18n → **386 claves** en ES/EN/PT/ZH, sin faltantes ni sobrantes.
- Grep final: **0** apariciones visibles de "familia" o "SKU".

Verificado en el navegador (servidor de producción, `next start`):

| Pantalla | Comprobación |
| --- | --- |
| `/productos/caja-conexion-compacta-c1400cs` | **`Código de producto: C1400CS`** |
| `/productos/caja-recta-alta-c11530cs` | `Código de producto: C11530CS` |
| `/categorias` | H1 *Catálogo de Productos por **Categoría***, select *Todas las **Categorías** (27)* |
| `/categorias` buscando `C1400CS` | devuelve la caja C1400CS (y el kit domiciliario, que la incluye en su ficha) |
| `/productos` | buscador *"Search by name, **code**, size or model…"* |
| Inicio y `/novedades` | tarjetas con `Código: C10500CS`, `Código: REP-2B-300`; *CATEGORÍAS DE PRODUCTOS* |
| Desplegable del navbar | *27 productos en 16 **categorías***, *Ver todas las **categorías*** |
| `/pdf/catalogo` | *ÍNDICE DE **CATEGORÍAS** DE PRODUCTOS*, `CÓDIGO: C1400CS` |
| `/pdf/ficha-tecnica` | `CAJA DE CONEXIÓN COMPACTA C1400CS (CÓDIGO: C1400CS)` |

**Nota sobre la verificación (importante para futuras tandas):** en este entorno el
navegador corre **sin ventana visible** (`document.visibilityState === "hidden"`). En
las rutas que usan `useSearchParams` dentro de un `<Suspense>` (`/categorias`,
`/productos`, `/pdf/catalogo`) React **no resuelve el Suspense durante la hidratación
inicial** en una pestaña oculta: queda el cartel "Cargando…" y el contenido real
`display:none` — aunque el HTML y el JS cargaron bien (200) y no hay errores en consola.
**Cualquier interacción lo resuelve**: al tocar el selector de idioma el contenido
aparece al instante. Por eso todas las verificaciones de arriba se hicieron forzando un
re-render. Es un artefacto de la pestaña oculta (Chrome no ejecuta `requestIdleCallback`
en pestañas no visibles), **no un bug del sitio**: conviene confirmarlo abriendo esas
tres rutas en una ventana normal.

**Pendiente heredado:** el slide del hero dice "**10** categorías completas" y
`AnimatedStats` (`/novedades`) muestra "**10** Categorías de Productos", pero el catálogo
tiene **16**. Se cambió la palabra, no el número (no se inventan datos): hay que definir
si el número correcto es 16 o si "10" responde a otro criterio comercial.

---

## 16. Índice con buscador en los PDF multi-producto + todas las fichas ubicadas

Dos pedidos: (a) que los documentos que reúnen **más de un artículo** tengan un **índice
clickeable** o un **buscador**; (b) que **todas** las fichas de
`Muestra\Fichas técnicas` queden publicadas **donde corresponde**.

### 16.1 Índice clickeable + buscador

Componente nuevo `src/components/pdf/PdfIndex.tsx`, usado por las dos páginas que
reúnen varios productos:

| Página | Productos | Qué se agregó |
| --- | --- | --- |
| `/pdf/ficha-tecnica` | 27 | Índice de productos + buscador + ancla por producto + enlace a la ficha propia de cada modelo |
| `/pdf/catalogo` | 27 (o los de la categoría) | Índice de productos + buscador + ancla por producto; el índice de categorías ahora es clickeable |

Cómo funciona:

- Cada producto tiene su ancla (`#doc-<id>`) y el índice son links internos, así que
  **funciona igual en pantalla y en el PDF** guardado desde el navegador (Chrome
  convierte los anclajes internos en links del PDF).
- El buscador filtra el índice **en pantalla** por código o nombre, sin acentos y sin
  distinguir mayúsculas.
- **Al imprimir se imprime el índice completo**: las entradas filtradas no se borran,
  sólo se ocultan en pantalla (`hidden print:list-item`). Así el documento en papel
  nunca sale recortado por una búsqueda.
- El índice de categorías del catálogo PDF saltó de ser una lista muda a saltar al
  primer producto de cada categoría (**16 filas clickeables**).
- Se quitaron los emojis 📂/📁 del selector de categoría del catálogo PDF (quedan
  íconos lucide, como en el resto del sitio).

### 16.2 Todas las fichas, en su lugar

De los 32 PDF de `public/fichas/`, antes había **13 vinculados**. Ahora:

1. **Nueva vinculación por evidencia.** `ABD-RAC-BR` (Abrazadera con Racor de Bronce)
   → `ficha-tecnica-abrazadera-derivacion-abs-estandar-con-racord-bronce.pdf`.
   Evidencia: la ficha es del modelo *"Abrazadera Derivación **ABS Estandar** + Racord
   Bronce para PEAD"* (plano `ADA-ERB`), que es justo el producto sin inserto; la foto
   del catálogo se llama *"Abrazadera **Estandar** + Racord Bronce"*. Total: **14**.

2. **Fichas de modelos no publicados → nivel categoría** (`category.technicalSheets`,
   campo nuevo en `src/types/index.ts`). Se muestran en `/categorias` cuando hay una
   categoría elegida, en el bloque **"Fichas técnicas adicionales"**:
   - *Cajas de Conexión y Protección*: **13 fichas** (C1401, C5151, C4201, C4170,
     C4171, C4171 CSLVE, C6201 CSLVE, C5201 CSLH, C12530, C12531, C11531, C2201, C6151).
   - *Abrazaderas de Derivación*: **5 fichas** (ABS con Inserto, ABS Inserto + Racord,
     ABS salida PEAD, PP con Inserto, PP salida PEAD).

3. **Resultado:** **31 de 32 PDF** quedaron alcanzables desde el sitio. Los 2 que no
   tienen dónde ir (ver *Pendientes*) quedan sólo como archivo.

### 16.3 Verificación

- `npx tsc --noEmit` → **0 errores**.
- `npx eslint src` → **0 errores** / 22 warnings (línea base sin cambios).
- `npm run build` → **OK** (23 páginas; `/pdf/ficha-tecnica` y `/pdf/catalogo` `○`).
- Paridad i18n → **388 claves** en ES/EN/PT/ZH (se sumaron `catalog.lineSheetsTitle` y
  `catalog.lineSheetsSub`).

En el navegador:

| Comprobación | Resultado |
| --- | --- |
| `/pdf/ficha-tecnica` | 27 anclas `#doc-…`, **0 rotas**; contador `27 / 27 productos`; 14 links a fichas propias |
| Buscar `C1400CS` en ese índice | queda **1 entrada visible**, contador `1 / 27`; las otras 26 conservan `print:list-item` |
| `/pdf/catalogo` | 27 anclas + **16 filas de categoría clickeables** + buscador |
| `/categorias?categoria=cajas-conexion` | bloque con **13 fichas** |
| `/categorias?categoria=abrazaderas-derivacion` | bloque con **5 fichas** |
| `/productos/abrazadera-racor-bronce` | `Código de producto: ABD-RAC-BR` + ficha `…abs-estandar-con-racord-bronce.pdf` |

> La verificación del DOM en `/categorias` y `/pdf/catalogo` se hizo sobre el **HTML
> prerenderizado** por el mismo motivo que en la sección 15 (pestaña oculta). El test
> de control con `/productos` (ruta que no toqué) muestra exactamente el mismo
> comportamiento, así que es del entorno y no de estos cambios.

### 16.4 Pendientes que necesitan decisión de la empresa

1. **`ABD-INS` sin ficha.** Las planillas de origen usan el **mismo código `AD-INS`**
   para dos piezas distintas: *"Abrazadera Derivación **ABS** con Inserto"* y
   *"Abrazadera Derivación con Inserto"* (PP). El catálogo no dice si el cuerpo es ABS
   o PP, así que **no se vinculó ninguna** (vincular la equivocada sería peor). Las dos
   fichas quedaron listadas en la categoría. Definir cuál corresponde.
2. **`C2200CS` y `C6200CSLVE`.** El catálogo los marca **homologados**, pero las únicas
   fichas disponibles son `C2201 CS` y `C6201 CSLVE`, que **no** dicen "Homologada"
   (el patrón del origen es `…0` = homologada, `…1` = no homologada). No se vincularon:
   se listan a nivel categoría. Confirmar si la ficha del homologado existe.
3. **`C11530CS`: nombre vs. ficha.** El catálogo dice *"Caja Recta **Alta** C11530CS"*
   y la ficha del código `C11530 CS` dice *"Caja Recta **Baja** Homologada"*. Sigue
   vinculada (el código coincide exacto), pero hay que confirmar el nombre.
4. **2 fichas sin destino:** `ficha-tecnica-bulones-para-bridas.pdf` y
   `ficha-tecnica-mtapa-plastico-para-br-v2.pdf` (los PDF no tienen texto extraíble
   —usan fuentes con codificación propia— y no hay planilla `.xlsx` que los acompañe).
   No se inventó una categoría para ellos. ¿A qué categoría o producto pertenecen?
5. **Textos generales de la ficha técnica unificada** (`/pdf/ficha-tecnica`): el
   documento declara para **todos** los productos "Material del Cuerpo: Polipropileno
   Técnico Inyectado (PP)", "Temperatura Máxima: 80 °C", "IRAM 13478 / EN 545" y
   "AySA ET N° 15". Eso es **relleno heredado** del mock: no sale de las fichas reales
   (que hablan de ISO 17885, ISO 228/1 e IRAM 113035) y aplicarlo a toda la línea
   —cajas, llaves de bronce— es incorrecto. **No se tocó en esta tanda** porque no
   estaba pedido, pero conviene decidir si se reemplaza por un texto general honesto o
   se elimina.

---

## 17. Revisión de los apuntes · teléfonos fuera · nichos de aplicación

### 17.1 Informe de apuntes
Se contrastó la hoja manuscrita punto por punto con el código y se dejó el detalle en
**`docs/APUNTES_REVISION.md`** (32 puntos clasificados en hecho / parcial / pendiente /
a aclarar). De paso aparecieron dos hallazgos: que `/admin` es demo sin autenticación y
que el apunte *"NO MOSTRAR DATOS DE FABRICACIÓN (planos)"* choca con las 32 fichas
publicadas.

### 17.2 Teléfonos: no se publican
Decisión del cliente (2026-10-15): **"no pongas número"**. Se eliminaron los teléfonos de
todos los lugares visibles:

- `src/app/contacto/page.tsx`: la tarjeta de teléfono pasó a ser una tarjeta de WhatsApp.
- `src/app/ubicacion/page.tsx`: se eliminó el bloque completo de teléfonos.
- `src/components/layout/Footer.tsx`: queda el botón de WhatsApp, sin número.
- `src/components/cart/CartDrawer.tsx` y `src/app/pdf/catalogo/page.tsx`: se sacaron los
  teléfonos del pie de los documentos.
- i18n: eliminadas `location.phoneSales` / `location.phonePlant`; en `src/lib/site.ts` se
  eliminaron `phoneSales` / `phonePlant`.

Claves nuevas: `contact.whatsappCardTitle` y `contact.whatsappCardCta`.
El enlace de WhatsApp sigue operativo (el número sólo vive en el `href` de `wa.me`).
**Verificado:** 0 apariciones de `3912-2763` / `2341-3935` en `src` y en el HTML de
`/`, `/contacto` y `/ubicacion`.

> Si el cliente quiere el teléfono en el catálogo impreso, hay que reponerlo en
> `/pdf/catalogo` y en `CartDrawer`.

### 17.3 Razón social
Corregido **"PRODELEC S.A." → "PRODELEC S.R.L."** en `/pdf/ficha-tecnica` (2 apariciones)
y `/admin/mailing` (2 apariciones).

### 17.4 Áreas del formulario de contacto
Según los apuntes faltaban áreas. Se agregaron **Cobranzas y Facturación**
(`contact.areaCobranzas`) y **Pago a Proveedores** (`contact.areaSuppliers`, clave que
existía sin usar) y se reordenó la lista. Se mantiene *Soporte Técnico* (no figuraba en
la lista de los apuntes).

### 17.5 Nichos de aplicación (gas / agua / saneamiento / domiciliaria)
Decisión del cliente: **se aprueba el mapeo propuesto y se permite que una categoría
pertenezca a varios nichos**.

- `src/types/index.ts`: tipo `Niche` (`agua` | `saneamiento` | `gas` | `domiciliaria`),
  constante `NICHE_ORDER` y campo `Category.niches?: Niche[]` (el primero es el principal).
- `src/data/products.ts`: las 16 categorías llevan `niches`.
- `src/lib/catalog.ts`: `CatalogFilters.niches` + su lógica dentro de `filterCatalog`.
- i18n: `niche.filterLabel`, `niche.all`, `niche.agua`, `niche.saneamiento`, `niche.gas`,
  `niche.domiciliaria` (en los 4 idiomas).

**`/categorias`**: fila de chips para filtrar por nicho y la grilla partida en
**secciones por nicho** (`#nicho-agua`, `#nicho-saneamiento`, `#nicho-gas`,
`#nicho-domiciliaria`), cada una con ícono, título y contador. Está aprobado que una
categoría se repita entre secciones (p. ej. Cajas de Conexión en agua, saneamiento y gas).

**`/productos`**: nuevo bloque **"Aplicación"** en el panel de filtros, sumado al contador
de filtros activos y a "Limpiar filtros".

**Reparto verificado en el HTML servido** (25 tarjetas):
Agua 13 · Saneamiento 4 · Gas 3 · Domiciliaria 5.

### 17.6 Verificación
`tsc --noEmit` 0 errores · `eslint src` 0 errores / 22 warnings (igual que la línea base) ·
`npm run build` OK (23 páginas) · i18n **394 claves** parejas en ES / EN / PT / ZH.

### 17.7 Fuera de esta tanda
- Visor 3D/360 con fotos reales (decisión tomada: visor con fotos reales ahora + pipeline
  360 preparado). Queda pendiente de implementar.
- Resto de los apuntes: ver `docs/APUNTES_REVISION.md`.

---

## 18. Sol del hero anclado a la letra + visor de producto con fotos reales

### 18.1 Sol de Mayo anclado a la "S"

Antes el Sol se centraba en el **centro geométrico de la palabra** con un corrimiento
fijo de `-0.18em`, así que caía cerca de la S pero no sobre ella (y en los otros
idiomas quedaba en cualquier lado).

Ahora se ancla a la **letra**: `WordWithSun` (`src/components/brand/SolDeMayo.tsx`)
parte la palabra del medio, envuelve la primera "S" en un `inline-block` y centra el
Sol exactamente sobre esa letra. Si la palabra no tiene "S" (p. ej. `PRODUCTION` en
inglés) se ancla a la letra del medio, así el Sol queda siempre cerca del centro en
los 4 idiomas.

El cuadro del Sol pasó de `1.24em` a `1.8em` para que el disco (0,44 del cuadro) se
**superponga un poco** sobre la letra en vez de esconderse detrás. Las capas
`sol-halo` / `sol-destello` y la animación de rayos se mantienen.

En el HTML servido queda: `INDU` + `[sol]` + `S` + `TRIAL`.

### 18.2 Visor de producto (`ProductPhotoViewer`)

Se **eliminó** `src/components/product/Product3DViewer.tsx`: no lo usaba ninguna
página, dibujaba geometría falsa y mostraba datos inventados (`PROD-CX-400`, clase
A15, ASTM G154, "inserto de bronce C-37700"). Nada de eso estaba verificado.

En su lugar, `src/components/product/ProductPhotoViewer.tsx` trabaja **solo con las
fotos reales del catálogo**. Elige el modo según el material disponible:

| Modo | Cuándo | Qué hace |
|---|---|---|
| `turntable` | hay 12 cuadros o más en `src/data/panoramas.ts` | 360° real: arrastrar para girar + play/pausa |
| `spin` | el producto tiene 3 fotos o más | arrastrar para girar entre las vistas reales |
| `gallery` | 1 o 2 fotos | foto grande + miniaturas |

En todos los modos: **clic sobre la foto para ampliar** (el zoom se ancla al punto
donde se hizo clic), botón de **pantalla completa**, flechas del teclado y `Esc`.
El arrastre usa `Pointer Events` con `touch-action: none`, así funciona igual con
mouse y con dedo.

Está integrado en `/productos/[slug]`, reemplazando la galería anterior (los badges
de "Nuevo"/"Homologado" y el botón de favorito se pasan como `overlay`).

### 18.3 Pipeline de fotos 360° (listo, sin fotos todavía)

- `docs/GUIA_FOTOS_360.md`: protocolo de captura (24 cuadros mínimo / 36 ideal, luz y
  cámara fijas, orden de archivos, errores que arruinan el giro).
- `scripts/preparar-360.js`: ordena las fotos, respeta la orientación EXIF,
  redimensiona, comprime, las deja en `public/productos/360/<slug>/01.jpg … NN.jpg` y
  **regenera** `src/data/panoramas.ts`, que es lo que lee el visor.
- `src/data/panoramas.ts`: manifiesto generado, hoy **vacío a propósito** (no hay
  fotos 360° reales todavía). Cuando el cliente saque las fotos, esa ficha pasa a modo
  360 **sin tocar código**.

Requiere `sharp` (ya presente en `node_modules` como dependencia opcional de Next.js;
si falta: `npm i -D sharp`). No se agregó ninguna dependencia.

### 18.4 Verificación
`tsc --noEmit` 0 errores · `eslint .` 0 errores / 22 warnings (misma línea base) ·
`npm run build` OK (23 páginas) · i18n **402 claves** parejas (+8 `viewer.*`) ·
`/`, `/productos`, `/productos/caja-conexion-compacta-c1400cs` y
`/productos/abrazadera-derivacion-estandar` responden 200.

---

## 19. Sol superpuesto y visor 3D generado de las fotos reales

> **Nota:** el visor 3D de este apartado (§19.2) **se dio de baja en §20**. Se deja
> escrito porque explica la evidencia y el algoritmo que se probó.

### 19.1 Sol del hero: por delante, con la letra redibujada

El Sol estaba **detrás** de la letra: se veía como un resplandor de fondo y las
letras lo tapaban. Ahora `WordWithSun` arma cuatro capas:

1. halo y destello, detrás de la letra;
2. la letra, en el flujo del texto;
3. el Sol, **por delante** (tapa la letra y el borde de las vecinas);
4. la letra **otra vez, encima del Sol**.

El paso 4 es lo que garantiza que la letra no se pierda: no depende de
`mix-blend-mode` ni de filtros. Si el navegador dibuja una capa, dibuja la otra.
El cuadro del Sol quedó en `1.65em`.

### 19.2 Visor 3D (`Product3DViewer`)

`scripts/generar-3d.js` genera, por producto, un recorte PNG con transparencia
sacado de su **foto real** (saca el fondo por relleno desde los bordes, descarta
las islas chicas —sombras sueltas— y recorta al producto) y una copia oscurecida
para el canto. Escribe también `src/data/recortes.ts`.

El visor apila el recorte en 20 capas separadas en Z: las dos de las puntas son
las caras (color) y las del medio el canto (oscurecido), y gira alrededor del eje
vertical. **Por qué el giro de 360° es correcto:** el sólido es un prisma de
sección constante, así que la silueta no cambia y lo que cambia es el ancho del
canto, que es exactamente lo que proyecta el navegador.

- **27 de 27 productos** con recorte.
- **7 con profundidad real** (la medida del dato `sizeInfo`, p. ej.
  `400 × 200 × 180 mm` → 180/400 = 0,45): las 6 cajas y el kit con caja.
- Los 20 restantes usan una profundidad de presentación (0,35) marcada
  `estimada: true` en el manifiesto y avisada en la ficha.

No hay geometría inventada: el contorno y las caras son la foto real, y la
profundidad es la medida real cuando existe. El texto de la ficha lo dice:
«Vista 3D generada a partir de las fotos reales del producto.»

El visor tiene selector **3D / Fotos**: el 3D es la vista por defecto y las fotos
reales siguen disponibles. Se arrastra para girar, hay play/pausa y flechas del
teclado. El ángulo se aplica directo al DOM (sin re-render por cuadro) y el ancho
se mide con `ResizeObserver`, así escala en mobile.

**Límites honestos de esta aproximación:** asume que el producto tiene sección
constante (para una caja es exacto; para una abrazadera es una aproximación), y
la profundidad de 20 productos es estimada. El 360 real se logra con la secuencia
de fotos de `docs/GUIA_FOTOS_360.md`.

### 19.3 Riesgo detectado: PDF internos dentro de `public/`

En `public/productos/` hay **9 PDF internos** que Next sirve públicamente, así que
se pueden bajar desde la web. Verificado con el servidor levantado:

| Archivo | Respuesta |
|---|---|
| `/productos/LP 09-2024 CAJAS.pdf` | 200 · 3,6 MB |
| `/productos/LP 13-2025-AB.DER. HOMOLOGADAS.pdf` | 200 · 6,1 MB |
| `/productos/LISTA DE PRECIOS ABRAZADERAS DE REPARACION LP11-2025.pdf` | 200 · 1,9 MB |

Además, en `src/data/products.ts` hay referencias a esos archivos: 7 categorías
con `technicalSheet` apuntando a una lista de precios (hoy no se renderiza, la
página usa `technicalSheets`) y los 2 productos de kit con
`Kit Plastico con medidor Plastico.pdf`, que **sí** se muestra como botón "Ficha
Técnica". **No se tocó nada**: hay que decidir a dónde debe apuntar cada botón.

### 19.4 Verificación
`tsc --noEmit` 0 errores · `eslint .` 0 errores / 22 warnings (misma línea base) ·
`npm run build` OK (23 páginas) · i18n **406 claves** parejas (+4 del visor 3D) ·
en el HTML de la ficha se cuentan **20 capas** del sólido (2 caras + 18 cantos),
el selector 3D/Fotos, el aviso de la vista 3D, `preserve-3d` y `perspective`.

---

## 20. El 3D por extrusión se dio de baja (probado con las fotos reales)

El visor de §19 apilaba 20 capas para simular el sólido. En la pantalla se veía un
**peine de chapas**: al girar, cada capa se separa de la anterior y quedan huecos
entre ellas. Se reescribió la geometría (proyección cerrada de un prisma de
sección constante: la cara se comprime por `cos θ` y el canto es la silueta
estirada por `|cos θ| + d·|sen θ| / W`) y con eso alcanzan **dos capas** y el giro
es geométricamente correcto. Igual **no se sostiene**, y para no dejar un
artefacto en el catálogo se dio de baja. Evidencia, medida con los archivos reales
(simulador en Node sobre los mismos PNG, mirando las imágenes):

| Problema | Detalle |
|---|---|
| Fotos 3/4, no frontales | la cara se "aplasta" y el costado se lee como una superficie plana |
| Recorte automático poco confiable | limpia bien productos oscuros (la caja C2200CS salió limpia), pero en productos claros **el fondo queda dentro de la máscara**: la abrazadera 1B 150-165 conserva medio fondo y al girar se extruye como un manchón (verificado: 45,1 % de alfa 0 / 54,9 % opaco, y el contorno del alfa incluye el fondo) |
| Logo espejado | pasando los 90° la cara de atrás muestra "augA" |
| Adornos de la foto | el reflejo y el chorro de agua decorativos también se extruyen |

**Qué se hizo:** `Product3DViewer` ahora monta la **foto real** como una lámina en
el espacio —perspectiva, sombra de piso que acompaña el giro y un reflejo que
corre al lado opuesto— con inclinación acotada (32° horizontal / 16° vertical).
El texto de la ficha es explícito: «Vista 3D interactiva sobre la foto real del
producto. El giro completo de 360° se habilita con la secuencia de fotos.» No hay
geometría, medidas ni materiales inventados, y **no puede romperse**.

Como la vista 3D se arma con cualquier foto, la pestaña 3D/Fotos ahora está en
**todos** los productos (antes dependía de tener recorte). El 360° de verdad
necesita una de estas dos cosas:

1. **Secuencia de fotos** del producto girando: `scripts/preparar-360.js` +
   `docs/GUIA_FOTOS_360.md` (el visor ya tiene el modo `turntable` para 12+ tomas).
2. **Modelo 3D de fábrica** (planos o moldes de producción).

**Se borraron** (aprobado por el cliente): `src/data/recortes.ts`,
`scripts/generar-3d.js` y `public/productos/3d/` (54 PNG, **29,9 MB**), que ya no
los usaba nadie. Si algún día vuelve el 3D por extrusión se puede rearmar con el
algoritmo que describe este apartado; mientras tanto esos 29,9 MB no viajan más en
el build.

### 20.1 Verificación
`tsc --noEmit` 0 errores · `eslint .` 0 errores / 22 warnings (misma línea base) ·
`npm run build` OK (23 páginas) · i18n **406 claves** parejas en ES/EN/PT/ZH
(`viewer.depthEstimated` se eliminó, entró `viewer.tilt`) · en el HTML de la ficha:
`perspective:1500px`, `preserve-3d`, la inclinación inicial
(`rotateX(6deg) rotateY(-16deg)`), la tarjeta de la foto, la sombra de piso, el
texto de la vista 3D y **0 referencias** a `/productos/3d/`.

## 21. El Sol de Mayo sale del título: queda solo la bandera

Pedido textual del cliente: *"saca el sol directamente, deja la bandera nomás,
blanco y medio celeste afuera"*.

El título institucional queda **solo con tipografía y los colores de la
bandera**: `PRODUCCIÓN` y `ARGENTINA` en celeste (`#74ACDF`) y `INDUSTRIAL` en
blanco. Sin Sol, sin destellos, sin capas superpuestas.

### Qué se borró
| Archivo | Qué era |
| --- | --- |
| `src/components/brand/SolDeMayo.tsx` | `SolDeMayo` (32 rayos en SVG) y `WordWithSun` (las 4 capas halo / letra / Sol / letra) |
| `src/app/globals.css` | `.sol-halo`, `.sol-destello`, `.sol-rayos` + los 3 `@keyframes` + sus reglas de `prefers-reduced-motion` |
| `src/components/brand/` | La carpeta entera: quedó vacía |

Quedó **una sola** palabra clave de color, `CELESTE_BANDERA`, movida a
`src/lib/brand.ts` (antes vivía dentro de `SolDeMayo.tsx`). El `h1` de la home
pasó de 4 capas anidadas a tres `<span>` planos.

### Verificación
`tsc --noEmit` 0 errores · `eslint` sobre los archivos tocados: 0 errores
(6 warnings de `<img>` preexistentes) · en el DOM real de `localhost:3000`:
`document.querySelectorAll('.sol-halo, .sol-destello, .sol-rayos, [class*="sol-"]')`
→ **0**, `<svg>` dentro del `h1` → **0**, `span.absolute` dentro del `h1` → **0**,
y el HTML del `h1` es exactamente
`<span style="color:#74ACDF">PRODUCCIÓN</span><br><span style="color:#FFFFFF">INDUSTRIAL</span><br><span style="color:#74ACDF">ARGENTINA</span>`.

> Las secciones **12** (línea 326), **18.1** y **19.1** describen el Sol tal como
> estaba en su momento. Se dejan como registro histórico; **lo vigente es esta
> sección**.

---

## 22. Panel de administración real (auth + CRUD + analítica)

Se reemplazó el panel `/admin` que era una **demo sin autenticación y con datos
ficticios** (cotizaciones, clientes, stock y métricas inventadas) por un panel
funcional con persistencia y seguridad básica.

### 22.1 Autenticación

- `src/lib/auth.ts`: token de sesión firmado con **HMAC-SHA256 vía Web Crypto**
  (funciona en Edge y en Node); la contraseña se verifica con **scrypt** en la ruta
  de login (solo Node). Un único usuario admin.
- `src/middleware.ts`: protege `/admin/*` (menos `/admin/login`) y redirige al login
  si no hay sesión válida.
- Rutas: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`.
- Credenciales configurables con `ADMIN_USER`, `ADMIN_PASSWORD` y `ADMIN_SECRET`
  (archivo `.env.local`, que no se versiona).

### 22.2 Almacenamiento (JSON, sin dependencias)

- `src/lib/db.ts`: mini base de datos en `data/db.json` (lectura/escritura con `fs`).
- `src/lib/catalogStore.ts`: `getCatalogData()` devuelve categorías + productos +
  novedades, con **prioridad a lo que editó el admin** sobre la semilla
  (`src/data/products.ts` / `src/data/novelties.ts`). Incluye `trackView()`.

> **Límite honesto:** el archivo funciona en desarrollo. En un deploy serverless
> (Render/Vercel) el filesystem no persiste entre deploys; el camino es migrar a
> Supabase (ver `docs/PROPUESTA_BACKEND.md`).

### 22.3 Datos en runtime (el sitio público refleja los cambios)

Antes todo el catálogo se leía por import estático de `src/data/products.ts` (queda
"horneado" en el build). Ahora:

- `GET /api/catalog` sirve el catálogo en runtime (con lo editado por el admin).
- `src/components/system/CatalogProvider.tsx`: proveedor cliente que arranca con la
  semilla (para que el SSR/SEO nunca quede vacío) y enseguida trae los datos reales
  de `/api/catalog`; re-sincroniza al volver a la pestaña.
- Se migraron a `useCatalog()` los consumidores: `Navbar`, `Footer`, `ProductCard`,
  `ProductQuickViewModal`, `ProductSlider`, y las páginas `home`, `/categorias`,
  `/productos`, `/productos/[slug]`, `/pdf/catalogo`, `/pdf/ficha-tecnica`.
- `src/app/sitemap.ts` pasa a leer `getCatalogData()`.

### 22.4 Analítica real de visitas

- `src/components/system/PageViewTracker.tsx` (en el layout raíz): registra cada
  navegación en `POST /api/track` (excluye `/admin` y `/api`).
- `GET /api/admin/stats`: total, visitas de hoy, serie de los últimos 14 días y
  páginas más visitadas.

### 22.5 CRUD

- Productos: `GET/POST /api/admin/products` y `PUT/DELETE /api/admin/products/[id]`.
- Novedades: `GET/POST /api/admin/novelties` y `PUT/DELETE /api/admin/novelties/[id]`.
- UI nueva: `/admin` (dashboard), `/admin/productos` (tabla + formulario con toggles
  de stock/homologado/nuevo), `/admin/novedades` (tarjetas + formulario) y
  `/admin/login`. Las páginas demo viejas (`cotizaciones`, `clientes`, `mailing`,
  `imagenes`) quedaron fuera de la navegación.

### 22.6 Verificación

`npx tsc --noEmit` 0 errores · `npm run build` OK (**33 rutas**: 23 + `/admin/login`
+ `/admin/novedades` + 7 rutas API) · probado en runtime: login → redirección del
middleware → dashboard con estadísticas → crear/editar/eliminar producto y novedad
(aparece y desaparece en `/api/catalog`) → el sitio público muestra los cambios.




