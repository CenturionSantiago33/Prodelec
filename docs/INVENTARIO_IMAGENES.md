# Inventario de Imágenes y Assets — Prodelec

> Generado durante la auditoría/mejora (2026-10-15). Objetivo: documentar qué imágenes están en uso,
> cuáles quedan sin asignar y con qué nivel de confianza, **sin reasignar fotos por coincidencia dudosa**.

Total bajo `public/productos/`: **171 archivos**. Referenciados en `src/data/products.ts`: **16 imágenes
+ 6 PDFs** (todos existentes, 0 enlaces rotos).

---

## 1. Imágenes y PDF en uso (asignados en `src/data/products.ts`)

| Archivo | Uso |
| --- | --- |
| `/productos/catalogo/04-cajas/5_-_compactada.jpg` | Imagen de la familia “Cajas de Conexión y Protección” |
| `/productos/catalogo/1-_abrazaderas_de_reparacion/150-165_largo_191_1.jpg` (+ `_2`) | Abrazadera de Reparación 1 Banda |
| `/productos/catalogo/1-_abrazaderas_de_reparacion/abrazaderas_de_reparacion.jpeg` | Abrazadera de Reparación 1 Banda |
| `/productos/catalogo/11_kit/2-_con_medidor_con_caja.jpeg` | Kit con medidor y caja |
| `/productos/catalogo/15_-_cinchas/1-_dn_100_1.jpg` | Cincha DN 100 |
| `/productos/catalogo/2-_niple/2-_niple.jpg` | Niple |
| `/productos/catalogo/20-_empalmes_de_goma/1-_100.jpg` | Empalme de goma |
| `/productos/catalogo/22_grupales/grupal_cajas.jpeg` | Grupo de cajas |
| `/productos/catalogo/23_cepos/23_cepos_1..4.jpg` | Cepo de Corte y Restricción |
| `/productos/catalogo/24_collar_toma_en_carga/…_1..3` | Collar Toma en Carga |
| `/productos/catalogo/25_junta_de_reparacion/25_junta_de_reparacion.jpeg` | Junta de reparación |
| `/productos/catalogo/3-til/3-til.jpeg` | Til |
| `/productos/catalogo/5-abrazadera_de_derivacion/…_1..3` | Abrazadera de Derivación |
| `/productos/catalogo/6-collar_de_toma_de_agua/6-collar_de_toma_de_agua(.jpg/_b/_c)` | Collarín de Toma de Agua |
| `/productos/catalogo/7-emplame_de_goma_cloacal/…_(.jpeg/_calle/_detalle/_reverso)` | Empalme Flexible Cloacal |
| `/productos/catalogo/8-llaves/1-dn_15_hembra_hebra.jpeg` | Llave DN15 |
| `/productos/catalogo/9-llaves_de_bronce/01-_macho_tl.jpeg` | Llave de bronce |
| `/productos/LP 09-2024 CAJAS.pdf`, `LP 13-2025-AB.DER. HOMOLOGADAS.pdf`, `LP 15-2025-Cincha de Acero Inoxidable.pdf`, `LISTA DE PRECIOS ABRAZADERAS DE REPARACION LP11-2025.pdf`, `Kit de Gabinete de pared.pdf`, `Kit Plastico con medidor Plastico.pdf` | Fichas técnicas / listas de precios |
| `/logo-clean.png` | Logo en Navbar y Footer |
| `/carousel-1.jpg` … `/carousel-4.jpg` | Home (carrusel/historia) y `/empresa` |
| `/clientes/*.svg` (8) | Logos de prestatarias (AySA, ABSA, Aguas Cordobesas, AYSAM, Sabesp, ASSA, EPAS, OSSE) |

> Las galerías de producto se ampliaron con ángulos hermanos (`_2`, `_3`, `_4`, `_c`, `_detalle`,
> `_reverso`) del **mismo** producto. Detalle en `docs/CAMBIOS_REALIZADOS.md` §5.

---

## 2. Archivos del catálogo `catalogo/<familia>/` SIN ASIGNAR

Candidato por **familia** (alta confianza a nivel familia; **asignación a producto individual pendiente**).

| Carpeta | Familia candidata | Archivos sin asignar | Confianza |
| --- | --- | --- | --- |
| `catalogo/04-cajas/` | Cajas de Conexión y Protección | 24 (metrogas, prolongada, tronco con/sin visor, reducida _1/_2, cloacal _1/_2, hidrante, válvula esclusa _1/_2, reducida cozzuol _1/_2/_3, redonda VE _1/_2/_3, redonda C, compacta cozzuol _1/_2/_3, pared _1/_2, recta baja _1/_2, recta alta) | Alta (familia) / Media (producto) |
| `catalogo/1-_abrazaderas_de_reparacion/` | Abrazaderas de Reparación | `45-55_largo_191_1/2`, `180-195_largo_382_1/2` (medidas 45-55 y 180-195) | Alta |
| `catalogo/11_kit/` | Kits de medición | `1-_con_medidor_sin_caja`, `3-con_soporte_s_medidor`, `4-_con_soporte_sin_medidor_con_caja`, `5_-_kit_con_cepo` | Alta (familia) |
| `catalogo/15_-_cinchas/` | Cinchas | `1-_dn_100_2`, `2-_todas_1/2` | Alta |
| `catalogo/20-_empalmes_de_goma/` | Empalmes de goma | `2-100x`, `3-200`, `4-_150` | Alta |
| `catalogo/21-_ab_reparacion/` | Abrazaderas de reparación (grupo 21) | `1_-_150_1/2`, `2-300`, `2-300_b`, `3-_valvula_de_retencion`, `ab_reparacion_grupal` | Alta (familia) |
| `catalogo/22_grupales/` | Kits grupales / medición | `25_junta_de_reparacion._grupal`, `5_-_todas`, `grupal_2/3/4`, `grupal_abrazaderas`, `grupal_abrazaderas_2`, `grupal_medidores` | Alta (familia) |
| `catalogo/8-llaves/` | Llaves de paso | `3-dn_15_salida_tl_3-4`, `4-_dn_15_pead_25_tl_3-4` | Alta |
| `catalogo/9-llaves_de_bronce/` | Llaves de bronce | `ia_02-_politileno_tl` | Media |

---

## 3. Fotos sueltas en `public/productos/` (raíz) SIN ASIGNAR

Archivos con nombres descriptivos que **probablemente** corresponden a productos, pero cuya asignación
a un producto específico **no puede confirmarse por nombre**. **NO reasignar sin verificación visual.**

Ejemplos: `Abrazadera Bridada-02/03.jpg.jpeg`, `Abrazadera con llave de corte.jpg`,
`Abrazadera de Derivacion - Dorso/Frente.jpg.jpeg`, `Abrazadera de Reparación 1/2/3/4 Bandas.jpg.jpeg`,
`Abrazadera Estandar + Racord Bronce.jpg.jpeg`, `abrazadera Inserto.jpg(.jpeg)`,
`ADR con Brida.JPG.jpeg`, `Bracero Cloacal 1/2/5.jpg.jpeg`, `C11530CS.jpg.jpeg`, `c4200cs .jpg.jpeg`,
`C5151CS.png`, `caja 140x140x60 Metrogas.JPG.jpeg`, `Caja Brasero Cloacal 170x170x130.JPG.jpeg`,
`Caja Chica con llave1/2.jpg.jpeg`, `Caja cozzuol.jpeg`, `caja cuerpo ampliado 1..4.jpg.jpeg`,
`CAJA DE GAS dorso/frente.jpg.jpeg`, `cepo_corte_seguridad.png`, `dibujo caja 2.jpg.jpeg`,
`Diseño Caja_1/2/3.jpg.jpeg`, `explocion 2 alta ByN.jpg.jpeg`, `Explosión de Abrazadera …`,
`Hidrante todo.jpg.jpeg`, `Kit Cloacal frente.jpg.jpeg`, `Linea Prodelec SRL-1/2.jpg.jpeg`,
`LOGO DE PRODELEC NUEVO.jpg.jpeg`, `Modelo Compacto-Medida 400x200x170mm C1400CS.jpg.jpeg`,
`Modelo de Cajas 2/3.jpg.jpeg`, `Modelo Grande-Medida 600x360x322mm.jpg.jpeg`,
`Modelo Reducida-C 2200 CS.jpg.jpeg`, `Racor plastico(.jpg/Incorporado)`, `reducida cozzuol.jpeg`,
`reducida riego.jpeg`, `toma_de_carga_bronce.png`, `Valvula esclusa todo.jpg.jpeg`,
`folleto 1 - instructivo instalacion.jpg.jpeg`, `Folleto 2-Tolerancias...jpg.jpeg`,
`Folleto Frente.JPG.jpeg`, `Folleto Gabinete Pared Agua.JPG.jpeg`, `*RIEGO*`, `3 juntas.jpg.jpeg`, etc.

**Acción sugerida:** revisión visual por el área técnica/comercial para asignar. Muchos son ángulos o
versiones en alta calidad de productos ya representados.

### PDF sin asignar
- `/productos/Folleto de contratapa.pdf`
- `/productos/LP 02-2026 Bulones.pdf`
- `/productos/LP 14-2025- AB. DER. ECONOMICAS.pdf`

---

## 4. Assets de plantilla / sueltos — NO usar, candidatos a limpieza

Estos **no** son contenido de Prodelec o no están referenciados. Su eliminación requiere confirmación.

### `public/` (raíz)
`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` (iconos por defecto de create-next-app),
`logo-p.png`, `logo-prodelec.jpeg`, `Logo.png`, `monogram.png`, `preview.png` (logos/variantes sin uso;
el logo en uso es `logo-clean.png`).

### Raíz del repositorio (fuera de `public/`, no se sirven)
`2e1242bc-d796-4f6c-a762-92132a5db566.jpg`, `52365e59-123b-42c3-b0e8-c89e12b844d7.jpg`,
`ficha_preview.png`, `Logo.png`, `PRODELEC ... CERTIFICATE ... .pdf`.

---

## 5. Notas

- **No se inventaron** correspondencias. Solo se ampliaron galerías con archivos del **mismo producto**
  (misma carpeta y misma base de nombre), verificados como existentes.
- Pendiente: revisión visual asistida (modelo con visión) para asignar las fotos de §2 y §3.
- Los archivos con acentos en el nombre (p. ej. `Explosión`, `Diseño`, `Reparación`) requieren
  **URL-encoding** si se referencian desde el código; se recomienda renombrarlos a ASCII al reasignarlos.
