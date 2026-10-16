# Inventario de Fichas Técnicas (importadas)

Origen: `C:\Users\santi\Pictures\prodelec drive y fotos\Muestra\Fichas técnicas`
Destino: `public/fichas/` — **32 PDFs** copiados y renombrados a nombres ASCII sin espacios.

- Se copiaron **solo los PDF** (los `.xlsx` son las planillas madre y no se publican).
- Los nombres originales tenían espacios y acentos; se normalizaron
  (ej. `Ficha Técnica Caja Compacta Homologada C1400 CS.pdf` →
  `ficha-tecnica-caja-compacta-homologada-c1400-cs.pdf`).
- Las fichas se sirven desde `/fichas/<archivo>.pdf` (verificado: HTTP 200, `application/pdf`).

---

## 1. Productos vinculados a su ficha específica (14)

Mapeo por **coincidencia exacta de código**.

| Producto | Código | Ficha asignada |
| --- | --- | --- |
| Caja de Conexión Compacta C1400CS | `C1400CS` | ficha-tecnica-caja-compacta-homologada-c1400-cs.pdf |
| Caja Recta Alta C11530CS **(ver observación A)** | `C11530CS` | ficha-tecnica-caja-recta-baja-homologada-c11530-cs.pdf |
| Caja Cloacal DN110 C4200CSLC | `C4200CSLC` | ficha-tecnica-caja-cx-cloacal-homologada-c4200-cslc.pdf |
| Gabinete de Pared para Medidor C10500CS | `C10500CS` | ficha-tecnica-caja-gabinete-c10500-cs.pdf |
| Abrazadera de Derivación Estándar | `ABD-EST` | ficha-tecnica-abrazadera-derivacion-pp-standard.pdf |
| Abrazadera con Racor de Bronce **(nuevo)** | `ABD-RAC-BR` | ficha-tecnica-abrazadera-derivacion-abs-estandar-con-racord-bronce.pdf |
| Abrazadera de Reparación 1 Banda (45-55 mm) | `REP-1B-4555` | ficha-tecnica-abrazadera-reparacion.pdf |
| Abrazadera de Reparación 1 Banda (150-165 mm) | `REP-1B-150165` | ficha-tecnica-abrazadera-reparacion.pdf |
| Abrazadera de Reparación 2 Bandas DN300 | `REP-2B-300` | ficha-tecnica-abrazadera-reparacion.pdf |
| TIL - Toma Intradomiciliaria de Línea DN110 | `TIL-DN110` | ficha-tecnica-ramal-t-de-limpieza-til-dn110.pdf |
| Cincha de Sujeción de Acero Inoxidable DN100 | `CIN-DN100` | ficha-tecnica-cincha-para-collar-toma-en-carga.pdf |
| Cepo de Corte y Restricción Antivandálico | `CEP-CRT` | ficha-tecnica-cepos-para-corte-y-restriccion-de-servicio.pdf |
| Collar Toma en Carga Bajo Presión | `CTC-TEC` | ficha-tecnica-collar-toma-en-carga-plastico.pdf |
| Empalme Flexible de Goma Cloacal | `EGC-110` | ficha-tecnica-empalme-de-goma-cloacal.pdf |

### Cómo se resolvió `ABD-RAC-BR`

Se leyó la planilla madre del origen (los PDF no tienen texto extraíble: usan fuentes
con codificación propia; las `.xlsx` que los acompañan sí). La ficha dice
**"Abrazadera Derivación ABS *Estandar* + Racord Bronce para PEAD HOMOLOGADA"**
(código de plano `ADA-ERB`), que es la variante **sin** inserto — la que corresponde a
este producto. La otra candidata (`ADA-IRB`, *"ABS Inserto con Racord Bronce"*) es la
que **sí** lleva inserto. La foto del catálogo se llama, además, *"Abrazadera **Estandar**
+ Racord Bronce"*.

## 2. Pendientes de confirmación (3)

No se asignó nada para no inventar correspondencias. **Las fichas candidatas sí quedaron
publicadas**, listadas a nivel de su categoría (`technicalSheets` → bloque "Fichas
técnicas adicionales" en `/categorias`).

| Producto | Código | Candidatas en el origen | Duda |
| --- | --- | --- | --- |
| Abrazadera de Derivación con Inserto | `ABD-INS` | *ABS con Inserto* / *PP con Inserto* | ¿Cuerpo ABS o PP? Las dos piezas comparten el mismo código `AD-INS` en el origen |
| Caja de Conexión Reducida C2200CS | `C2200CS` | *Caja reducida C2201 CS* | El catálogo lo marca **homologado**; la ficha disponible (`C2201 CS`) **no** lo está |
| Brasero para Válvula Esclusa C6200CSLVE | `C6200CSLVE` | *Caja Brasero para Válvula Esclusa C6201 CSLVE* | Ídem: `C6201 CSLVE` es la versión no homologada |

## 3. Productos sin ficha técnica propia

No existe PDF específico en el origen para estos códigos:

`JNT-AR` (Junta de Reparación Amplio Rango), `CTA-STD` (Collarín de Toma de Agua Potable),
`EPG-100` (Empalme de Goma Hidráulico), `LLV-15HH`, `LLV-15PEAD`, `LLB-MTL` (llaves),
`NIP165DN15` (Niple), `GRP-INT` (Sistema Grupal), `ABD-INS`, `ABD-RAC-BR`,
`C2200CS`, `C6200CSLVE`.

### Regla aplicada (definida por el cliente)

1. **Si el producto tiene ficha técnica propia** → se muestra el botón "Ficha Técnica"
   que abre ese PDF.
2. **Si NO tiene ficha propia** → el botón **no se muestra**. Se eliminaron las referencias
   a listas de precios genéricas (eran contenido de relleno).
3. **Todos los productos** tienen disponible la **Ficha Técnica General**
   (`/pdf/ficha-tecnica`), separada y claramente rotulada como general.

### Referencias genéricas eliminadas

Se quitó el `technicalSheet` (lista de precios) de: `C6200CSLVE`, `ABD-INS`,
`ABD-RAC-BR`, `NIP165DN15`.

> Los PDF de listas de precios siguen en `public/productos/` (no se borraron), por si
> se necesitan para otro uso. Si se confirma que no se usan, se pueden eliminar.

## 4. Fichas importadas SIN producto en el catálogo (21)

Hallazgo relevante: **la línea real de PRODELEC es más amplia que el catálogo actual**.
Estas fichas corresponden a modelos que hoy no están publicados:

- **Cajas:** C1401 CS, C5151 CS, C11531 CS (recta baja), C12530 CS (recta alta homologada),
  C12531 CS (recta alta), C2201 CS (reducida), C6151 CS (reducida), C4201 CSLC, C4170 CSLC,
  C4171 CSLC, C4171 CSLVE, C6201 CSLVE, C5201 CSLH (hidrante).
- **Abrazaderas de derivación:** ABS con Inserto, ABS Estándar con Racord Bronce,
  ABS Inserto con Racord Bronce, ABS salida PEAD Homologada, PP con Inserto, PP salida PEAD.
- **Otros:** Bulones para Bridas, MTapa Plástico para BR v2.

> **Resuelto (tanda 16).** Estos modelos **no se agregaron** al catálogo (no hay
> imágenes, medidas ni precios verificados para publicarlos como producto), pero sus
> fichas **ya no quedan como archivo muerto**: se publican a nivel de categoría en
> `/categorias` (bloque *"Fichas técnicas adicionales"*), porque pertenecen a la misma
> categoría que los productos publicados:
>
> - **Cajas de Conexión y Protección** → 13 fichas (todas las "Cajas" de esta lista).
> - **Abrazaderas de Derivación** → 5 fichas (ABS con Inserto, ABS Inserto con Racord
>   Bronce, ABS salida PEAD Homologada, PP con Inserto, PP salida PEAD). La sexta,
>   *ABS Estándar con Racord Bronce*, pasó a estar vinculada al producto `ABD-RAC-BR`.
>
> **Los 2 de "Otros" siguen sin destino** (`Bulones para Bridas`, `MTapa Plástico para
> BR v2`): no se les inventó una categoría. Ver *Observación D*.

---

## Observaciones de consistencia (requieren validación humana)

**A. Nombre vs. código (C11530CS).** El catálogo lo llama *"Caja Recta **Alta** C11530CS"*, pero la
ficha del código `C11530 CS` dice *"Caja Recta **Baja** Homologada"*. Se mapeó por **código**
(la señal más fuerte), pero hay que confirmar si el nombre del catálogo está mal o el código.

**B. Códigos 2200/2201 y 6200/6201.** El catálogo usa `C2200CS` y `C6200CSLVE`; las fichas son
`C2201 CS` y `C6201 CSLVE`. Las planillas del origen confirman el patrón del resto de la
línea (`…0` = homologada, `…1` = no homologada), así que las fichas disponibles son de la
versión **no homologada** mientras el catálogo marca esos productos como homologados. Por
eso **no se vincularon**: quedan listadas a nivel categoría hasta confirmar.

**C. Fichas genéricas.** 7 productos seguían apuntando a listas de precios (`LP 09-2024 CAJAS.pdf`,
`LP 13-2025-AB.DER. HOMOLOGADAS.pdf`, etc.) en lugar de una ficha técnica.

**D. Dos fichas sin destino.** `ficha-tecnica-bulones-para-bridas.pdf` y
`ficha-tecnica-mtapa-plastico-para-br-v2.pdf` no tienen planilla `.xlsx` en el origen y el
texto no se puede extraer de los PDF (usan fuentes con codificación propia), así que no se
pudo determinar a qué categoría pertenecen. **No se les asignó una categoría inventada.**
Confirmar destino ("MTapa" probablemente sea una tapa de reemplazo; "BR" no está claro).

**E. `AD-INS` duplicado.** En el origen, *"Abrazadera Derivación **ABS** con Inserto"* y
*"Abrazadera Derivación con Inserto"* (PP) comparten el código `AD-INS`. El catálogo usa
`ABD-INS` (con "B") para *"Abrazadera de Derivación con Inserto"*. Igual que en B, no se
vinculó ninguna de las dos.

## Archivos con nombres originales que no se volverán a usar

Las fichas viejas de `public/productos/` (listas de precios y folletos) **no se borraron**: algunos
productos todavía las usan. Verificar antes de eliminarlas.
