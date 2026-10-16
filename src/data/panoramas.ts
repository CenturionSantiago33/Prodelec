/**
 * Secuencias de fotos 360° por producto.
 *
 * Lo genera `scripts/preparar-360.js` a partir de las fotos reales que se
 * saquen con la base giratoria (ver `docs/GUIA_FOTOS_360.md`).
 *
 * La clave es el `slug` del producto y el valor es la lista ORDENADA de
 * imágenes (`/productos/360/<slug>/01.jpg` … `NN.jpg`).
 *
 * Mientras un producto no esté en este mapa, el visor de su ficha funciona con
 * las fotos normales del catálogo (y permite girar entre ellas si hay 3 o más).
 *
 * NO se cargan acá secuencias inventadas: si está vacío, es que todavía no hay
 * fotos 360° reales.
 */
export const PANORAMAS: Record<string, string[]> = {};
