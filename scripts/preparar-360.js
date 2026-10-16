/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Prepara una secuencia 360° real para el visor de producto.
 *
 * Uso:
 *   node scripts/preparar-360.js <slug> "<carpeta de fotos crudas>"
 *
 * Qué hace:
 *   1. Toma las fotos de la carpeta, las ordena por nombre.
 *   2. Las optimiza (respeta la orientación EXIF, redimensiona, comprime).
 *   3. Las guarda como public/productos/360/<slug>/01.jpg … NN.jpg
 *   4. Regenera src/data/panoramas.ts, así el visor de esa ficha pasa a modo
 *      360° real sin tocar código.
 *
 * Requiere `sharp`. Next.js lo trae como dependencia opcional. Si no está:
 *   npm i -D sharp
 *
 * Protocolo de captura: docs/GUIA_FOTOS_360.md
 */
const fs = require("fs");
const path = require("path");

const [, , slug, srcDir, ...rest] = process.argv;

const MAX_SIDE = Number(
  (rest.find((a) => a.startsWith("--max=")) || "--max=1200").split("=")[1]
);
const QUALITY = Number(
  (rest.find((a) => a.startsWith("--quality=")) || "--quality=82").split("=")[1]
);
const MIN_FRAMES = 12;

if (!slug || !srcDir) {
  console.error('Uso: node scripts/preparar-360.js <slug> "<carpeta de fotos crudas>"');
  process.exit(1);
}

const root = path.resolve(__dirname, "..");
const absSrc = path.resolve(srcDir);
const outDir = path.join(root, "public", "productos", "360", slug);
const EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".avif"]);

let sharp;
try {
  sharp = require("sharp");
} catch {
  console.error("Falta `sharp`. Instalalo con:  npm i -D sharp");
  process.exit(1);
}

/** Orden natural: 1, 2, 10 (y no 1, 10, 2). */
function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

async function main() {
  if (!fs.existsSync(absSrc)) {
    console.error(`No existe la carpeta: ${absSrc}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(absSrc)
    .filter((f) => EXT.has(path.extname(f).toLowerCase()))
    .sort(naturalSort);

  if (files.length === 0) {
    console.error(`No hay imágenes en: ${absSrc}`);
    process.exit(1);
  }
  if (files.length < MIN_FRAMES) {
    console.warn(
      `AVISO: hay ${files.length} fotos y se recomiendan ${MIN_FRAMES} o más ` +
        `para que el giro se vea fluido (ver docs/GUIA_FOTOS_360.md).`
    );
  }

  fs.mkdirSync(outDir, { recursive: true });

  let n = 0;
  for (const file of files) {
    n += 1;
    const name = String(n).padStart(2, "0") + ".jpg";
    await sharp(path.join(absSrc, file))
      .rotate()
      .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(path.join(outDir, name));
  }
  console.log(`${slug}: ${n} cuadros -> public/productos/360/${slug}/`);

  // Regenerar el manifiesto que consume el visor
  const base360 = path.join(root, "public", "productos", "360");
  const map = {};
  if (fs.existsSync(base360)) {
    for (const dir of fs.readdirSync(base360).sort(naturalSort)) {
      const full = path.join(base360, dir);
      if (!fs.statSync(full).isDirectory()) continue;
      const shots = fs
        .readdirSync(full)
        .filter((f) => EXT.has(path.extname(f).toLowerCase()))
        .sort(naturalSort);
      if (shots.length > 0) {
        map[dir] = shots.map((f) => `/productos/360/${dir}/${f}`);
      }
    }
  }

  const lines = Object.keys(map)
    .sort()
    .map(
      (k) =>
        `  ${JSON.stringify(k)}: [\n` +
        map[k].map((u) => `    ${JSON.stringify(u)},`).join("\n") +
        `\n  ],`
    )
    .join("\n");

  const out = `/**
 * Secuencias de fotos 360° por producto.
 *
 * ARCHIVO GENERADO por \`scripts/preparar-360.js\`. No editar a mano:
 * volvé a correr el script después de preparar las fotos.
 *
 * Las fotos viven en \`public/productos/360/<slug>/\` y el visor de la ficha
 * las detecta por el \`slug\` del producto. Ver \`docs/GUIA_FOTOS_360.md\`.
 */
export const PANORAMAS: Record<string, string[]> = {
${lines}
};
`;

  fs.writeFileSync(path.join(root, "src", "data", "panoramas.ts"), out, "utf8");
  const productos = Object.keys(map);
  console.log(
    `src/data/panoramas.ts regenerado (${productos.length} producto(s) con 360): ` +
      (productos.join(", ") || "ninguno")
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
