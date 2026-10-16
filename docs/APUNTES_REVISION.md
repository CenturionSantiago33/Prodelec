# Revisión de apuntes (hoja manuscrita) contra el estado real del sitio

Fecha: 2026-10-15
Alcance: contraste punto por punto entre los apuntes del cliente y el código actual.
Estados: **HECHO** · **PARCIAL** · **PENDIENTE** · **A ACLARAR** · **ENTREGABLE DEL CLIENTE**

> **Actualización 2026-10-15 (tarde).** El cliente respondió: teléfono **se saca**, las fichas
> **sí se publican** (lo prohibido son planos internos), el mapeo de nichos **se aprueba** con
> varios nichos por categoría, y el 3D va **con fotos reales ahora + pipeline 360**. Los puntos
> resueltos quedan marcados **✅**. Detalle de lo implementado en `docs/CAMBIOS_REALIZADOS.md` §17.
>
> **Actualización 2026-10-15 (noche).** A pedido del cliente se **sacó el Sol de Mayo del título
> del hero**: queda solo la bandera (`PRODUCCIÓN` / `ARGENTINA` celeste, `INDUSTRIAL` blanco). Con
> eso queda cerrado el punto **#22** (colores del título). Detalle en `docs/CAMBIOS_REALIZADOS.md` §21.

> Regla que se mantiene: no se inventan especificaciones, certificaciones, clientes,
> métricas ni **taxonomías de negocio**. Todo dato dudoso queda para validación humana.

---

## 1. Página 1 de los apuntes

| # | Apunte | Estado | Detalle / qué falta |
|---|--------|--------|---------------------|
| 1 | Imagen industrial y profesional (planta de producción, materiales, productos) en el **carrusel principal** y la **landing** | **ENTREGABLE DEL CLIENTE** | Hoy el carrusel usa imágenes genéricas (`/carousel-*.jpg`). Hacen falta fotos reales de planta, extrusión, inyección, depósito y producto en obra. Sin esas fotos no se puede cerrar este punto. |
| 2 | Logos **únicamente** en el apartado de *Clientes*; pasarlos por IA y hacerlos **PNG** | **PARCIAL** | Existen 8 logos en `public/clientes/` y son **SVG** (vectorial, mejor que PNG). Hay que: (a) verificar que no se usen fuera de la sección Clientes; (b) revisar si están deformados o mal trazados antes de decidir el pase a PNG — convertir a PNG es un downgrade de calidad. |
| 3 | Corregir **carrusel de novedades de productos** | **A ACLARAR** | No especifica qué corregir (¿contenido?, ¿orden?, ¿imágenes?, ¿que no coinciden?). |
| 4 | Corregir **pantalla principal de novedades** | **A ACLARAR** | Ídem anterior. |
| 5 | Líneas de producto: corregir en **Catálogo / subproductos**, no en Catálogo; **sacar la palabra "homologadas"** del detalle | **PARCIAL** | "Homologado" sigue visible en: `ProductCard` (badge), home (`src/app/page.tsx:562`), carrito (`CartDrawer`), filtro de `/productos` (`catHomologated`), modal de vista rápida, `/pdf/catalogo` ("Modelos Homologados", "HOMOLOGADO"), `/pdf/ficha-tecnica` ("Productos Homologados") y **admin** ("100% Homologados", métrica inventada). Falta decidir el reemplazo del texto y aplicarlo en todo el sitio. |
| 6 | Certificación ISO en el carrusel principal + botón | **HECHO** | Badge ISO 9001:2015 en el hero (`src/app/page.tsx:198-205`) con descarga del certificado. Verificar en ventana normal que se ve correcto. |
| 7 | Corregir texto en las **fichas de productos** (¿texto en inglés?) | **PENDIENTE** | Hay que auditar los textos de las fichas/PDF buscando restos en inglés. |
| 8 | "Producto o editar" | **A ACLARAR** | Ilegible. |
| 9 | Sacar **TECH SHEET** y **guía de instalación**; poner la ficha técnica por producto en su lugar | **PARCIAL** | La ficha por producto ya está en su lugar. Pero sigue existiendo la clave `product.tabInstallation` → "Guía Técnica de Instalación" en el detalle. Falta confirmar si hay que eliminarla. |
| 10 | "cath homologated" → corregir | **PENDIENTE** | Probablemente es la etiqueta del filtro / badge "Homologado" (ver punto 5). |
| 11 | Sacar **n.º de parte industrial** | **HECHO** | 0 coincidencias en `src` de "N.º de parte" / "Nro. de parte" / "parte industrial". Confirmado. |
| 12 | **Categorías – Área de interés**: Ventas, Logística, **Cobranzas**, **Facturación**, Finanzas, Compras, General | **HECHO ✅** | Agregadas *Cobranzas y Facturación* y *Pago a Proveedores*; la lista quedó reordenada según los apuntes. Se mantiene *Soporte Técnico* (no figuraba en la lista). |
| 13 | Mejorar estética | **EN CURSO** | Rediseño "ingeniería editorial" en marcha. |
| 14 | **Panel administrativo necesario** | **PARCIAL (con riesgo)** | `/admin` existe pero es **demo sin autenticación** y con datos ficticios (clientes, teléfonos, cotizaciones). No debe publicarse así. |
| 15 | **NO MOSTRAR DATOS DE FABRICACIÓN** (planos, etc.) | **RESUELTO ✅** | Decisión del cliente: **las fichas públicas y los catálogos sí se muestran**; lo prohibido es la documentación interna de fabricación (moldes, planos de producción, listas de precios). No se quita ninguna ficha. |

## 2. Página 2 de los apuntes

| # | Apunte | Estado | Detalle / qué falta |
|---|--------|--------|---------------------|
| 16 | **Panel Admin**: visualizaciones, productos más vistos, cotizaciones solicitadas (tickets), usuarios admin, cambiar imágenes del carrusel — "falta aclarar bien" | **PENDIENTE** | Hay que definir alcance y fuente de datos. Nada de esto puede ser real sin backend: hoy serían datos ficticios. |
| 17 | Cosas que **el cliente debe entregar**: fotos para carruseles, logos PNG, fichas técnicas de productos, catálogos por categoría | **ENTREGABLE DEL CLIENTE** | Es una lista de pedidos al cliente, no una tarea de desarrollo. |
| 18 | **Filtro por nicho** en el catálogo, igual que las categorías | **HECHO ✅** | Implementado en `/productos` (bloque "Aplicación" del panel de filtros) y en `/categorias` (chips de filtro + secciones por nicho). Ver §5 y `CAMBIOS_REALIZADOS.md` §17.5. |
| 19 | **Botón de descarga del catálogo completo (PDF)** | **PARCIAL** | `/productos` tiene enlaces a `/pdf/catalogo` y `/pdf/ficha-tecnica`; falta el botón destacado "Descargar catálogo completo". |
| 20 | **Sistema de gestión de calidad ISO → agregar** | **HECHO** | Certificado descargable en hero y footer, y sello en el hero. |
| 21 | **Sello/aclaración ISO** en el carrusel principal + botón | **HECHO** | Mismo que 6/20. Verificar visualmente. |
| 22 | Corregir **colores del texto del título** de la página principal (banderas) | **HECHO** | Resuelto en la sección **21** del changelog: se sacó el Sol de Mayo del título y quedó solo la bandera — `PRODUCCIÓN` y `ARGENTINA` en celeste `#74ACDF`, `INDUSTRIAL` en blanco. Sin adornos ni capas encimadas. |
| 23 | Corregir "**dice de contacto** en el footer → de descarga de la ISO" | **A ACLARAR** | Lectura dudosa. El footer ya tiene el enlace al certificado ISO (`Footer.tsx:71`). ¿Es la ubicación, el texto o el color del enlace? |
| 24 | Corregir **colores de los botones** de la sección de contacto | **PENDIENTE** | Revisar botones de `/contacto` contra el sistema `.btn-*-corp`. |
| 25 | Cambiar texto del inicio: "**agua, saneamiento y gas**" | **HECHO** | Aplicado en el hero. |
| 26 | Texto del catálogo: "**Catálogo de Productos**" | **HECHO (a revisar)** | El H1 actual es "Catálogo de Productos por Categoría". Si se quiere exactamente "Catálogo de Productos", es un cambio de una línea. |
| 27 | Navbar "Catálogo" → "**Productos**" | **HECHO** | Aplicado en la sesión anterior. |
| 28 | **PDF por categoría** en la sección "Productos" | **PENDIENTE** | Falta la descarga de PDF por categoría dentro de `/productos` (hoy está en `/categorias`). |
| 29 | "Habrá monopróductos" | **INFO** | A tener en cuenta: hay categorías de un solo producto. |
| 30 | "Descargar catálogo de cajas de conexión" → y de las demás categorías (menos monoproducción) | **PENDIENTE** | Depende de que el cliente entregue los PDF por categoría (punto 17). |
| 31 | **Desplegable** en la sección de novedades | **PENDIENTE** | `/novedades` usa sliders; no hay desplegable. |
| 32 | Especificar la **adaptabilidad** de los productos en el apartado "Empresa" | **PENDIENTE** | Contenido a redactar/validar con el cliente (no inventar). |

## 3. Pedidos nuevos de este mensaje

| Pedido | Estado | Detalle |
|--------|--------|---------|
| **Teléfono** a corregir | **RESUELTO ✅** | Decisión del cliente: **"no pongas número"**. Se eliminaron los teléfonos de todos los lugares visibles (contacto, ubicación, footer, pie del carrito y del catálogo, i18n y `site.ts`). El botón de WhatsApp sigue funcionando. Ver `CAMBIOS_REALIZADOS.md` §17.2. |
| **Vista 3D del producto** (360°, por categoría, que no parezca IA) | **RESUELTO ✅** | Ver §4. |
| Categorías **más lindas, separadas e intuitivas** | **PENDIENTE** | Ver §5. |
| Categorías separadas por **gas / agua / saneamiento / domiciliaria** | **REQUIERE VALIDACIÓN** | Ver §5. |

---

## 4. Vista 3D del producto

### Estado final (resuelto)

Se implementó **C + A**. El visor de las fichas usa **las fotos reales**:
`ProductPhotoViewer` (galería, zoom anclado al clic, pantalla completa y giro entre las
vistas reales cuando hay 3 o más), más una pestaña **3D** que monta la foto real como
lámina en el espacio (perspectiva, sombra de piso que acompaña el giro y reflejo), con
inclinación acotada. El texto de la ficha lo aclara y no se inventa geometría, medidas ni
materiales. El `Product3DViewer` falso (geometría abstracta con `PROD-CX-400`, A15,
ASTM G154, C-37700) se borró.

El pipeline de **A** quedó listo y sin usar (`scripts/preparar-360.js` +
`docs/GUIA_FOTOS_360.md`, con `src/data/panoramas.ts` vacío a propósito): cuando el cliente
saque las 12+ tomas de un producto, esa ficha pasa al modo turntable **sin tocar código**.

Además se probó un 3D por **extrusión del recorte de la foto** (generar los 27 recortes y
proyectar el prisma). **Se descartó con evidencia medida** y se borraron los 54 PNG que
había generado: ver `CAMBIOS_REALIZADOS.md` §20.

### Situación al momento del relevamiento
`src/components/product/Product3DViewer.tsx` (673 líneas) **existe pero no se usa en ninguna página**.
Además es exactamente el tipo de cosa que no queremos:

- Dibuja geometría abstracta en canvas (cajas y cilindros con degradados), no el producto real.
- Usa **códigos inventados** (`PROD-CX-400`, `PROD-AB-200`…).
- Usa **especificaciones inventadas**: Clase A15, ASTM G154, IRAM/AySA, "Inserto de Bronce Estampado C-37700", "PN 16 BAR".
- No se parece a ninguna foto del catálogo.

**Conclusión técnica honesta:** no es posible generar un modelo 3D fiel a partir de una o dos fotos.
Un 3D real requiere, o bien CAD, o bien fotogrametría/escaneo de muchas vistas. Cualquier
"3D" que armemos inventando geometría va a verse genérico y de IA — justo lo que se pide evitar.

### Opciones reales

| Opción | Cómo se ve | Qué necesita | Cuándo |
|--------|-----------|--------------|--------|
| **A. Turntable 360° con fotos reales** (recomendada) | Gira el producto real arrastrando el mouse, como un e-commerce serio. 100% real, no parece IA. | Sesión de fotos: 24–36 tomas por producto sobre base giratoria, cámara y luz fijas, fondo recortado. | Cuando haya fotos: yo dejo el visor y el instructivo de captura listos |
| **B. Modelo 3D real (GLB/GLTF)** con `<model-viewer>` | 360° real, zoom, luz, hotspots 3D, se puede girar en cualquier eje. | Un modelador 3D (o fotogrametría) que entregue el GLB por producto. | Cuando exista el GLB |
| **C. Visor técnico con las fotos actuales** (sin nuevas fotos) | Galería grande con zoom y **hotspots anclados a datos reales** de `products.ts`. Profesional, honesto, sin geometría falsa. | Nada. Se hace ya. | Ya |

### Recomendación
1. **Ahora**: hacer **C** (reemplazar el visor falso por un visor real con las fotos que ya hay y datos de `products.ts`), y **borrar** `Product3DViewer.tsx` (código muerto con datos inventados).
2. **En paralelo**: preparar el pipeline de **A** (viso + `docs/GUIA_FOTOS_360.md` + script que ordena/optimiza `01.jpg … NN.jpg`) para que, cuando el cliente saque las fotos, activar el 360° real en **todas** las categorías sin tocar código.
3. **Opcional**: si aparece un modelador 3D, pasar a **B**.

---

## 5. Categorías: agrupación por nicho (gas / agua / saneamiento / domiciliaria)

Hoy hay **16 categorías** y ninguna noción de nicho. La agrupación pedida **era una decisión de
negocio**, así que se propuso un mapeo basado en la propia descripción de cada categoría.

> **RESUELTO ✅ (2026-10-15).** El cliente **aprobó el mapeo** y pidió **permitir varios nichos por
> categoría**. Ya está implementado (`CAMBIOS_REALIZADOS.md` §17.5). La tabla de abajo es la que
> quedó en el código.

| Categoría | Nicho propuesto | Fundamento (texto actual de la categoría) |
|-----------|-----------------|------------------------------------------|
| Cajas de Conexión y Protección | **Agua** (y cloaca/gas según modelo) | "redes de agua potable, cloaca y gas" |
| Abrazaderas de Derivación | **Agua + Gas** | "domiciliaria e industrial para PVC, PEAD, AC e hierro" |
| Abrazaderas de Reparación | **Agua** | reparación de cañerías bajo presión |
| TIL – Toma Intradomiciliaria de Línea | **Agua / domiciliaria** | toma domiciliaria de agua |
| Cinchas de Acero Inoxidable | **Transversal (obra)** | fijación y sujeción de cañerías en obra pública |
| Cepos de Corte y Seguridad | **Agua** | corte y restricción de servicio en medidores de agua |
| Collar Toma en Carga | **Agua** | perforación y derivación bajo presión hidrostática |
| Junta de Reparación | **Agua + Saneamiento** | unión y reparación de tuberías de distintos materiales |
| Collar de Toma de Agua | **Agua** | derivación domiciliaria y tomas de agua potable |
| Empalmes de Goma Cloacal | **Saneamiento** | redes de saneamiento cloacal por gravedad |
| Empalmes de Goma Hidráulicos | **Agua** | absorción de vibraciones en cañerías |
| Llaves Esféricas de Polímero | **Agua / domiciliaria** | redes domiciliarias e intradomiciliarias |
| Llaves de Bronce Sanitario | **Agua** | bronce forjado sanitario |
| Kits de Conexión Domiciliaria | **Domiciliaria (medición)** | medidor volumétrico + válvula + caja |
| Niples de Conexión | **Domiciliaria** | empalme en módulos de medición |
| Sistemas Grupales | **Domiciliaria (medición)** | baterías de medición para obras grandes |

**Respuesta del cliente:** varias categorías pueden quedar en **más de un nicho**.

Implementado:
1. `Category.niches` en el data model; las 16 categorías lo tienen.
2. `/categorias`: chips de filtro por nicho + grilla partida en **secciones por nicho**.
3. `/productos`: bloque "Aplicación" dentro del panel de filtros.

**Ojo, para revisar más adelante:** con el mapeo aprobado, *Gas* queda con sólo 3 categorías
(Cajas de Conexión, Abrazaderas de Derivación y Cinchas) y *Saneamiento* con 4. Si el cliente
quiere refinar esas asignaciones, se cambia en **un solo lugar**: el campo `niches` de cada
categoría en `src/data/products.ts`.

---

## 6. Prioridad sugerida

1. ~~**Bloqueantes**~~ **RESUELTOS ✅**: el teléfono se **saca** del sitio · las fichas **sí** se publican.
2. ~~**Decisiones de negocio**: mapeo de nichos~~ **APROBADO E IMPLEMENTADO ✅**.
3. **Sin dependencias externas (se puede hacer ya)**: quitar/renombrar "Homologado", ordenar los textos en inglés, colores del título y de los botones, desplegable de novedades, "Catálogo de Productos", una descarga de PDF por categoría en `/productos`.
4. **Visor 3D/360** (decisión tomada): visor con las fotos reales + pipeline de fotos 360.
5. **Depende del cliente**: fotos de planta, fotos 360, logos PNG, PDF por categoría.
