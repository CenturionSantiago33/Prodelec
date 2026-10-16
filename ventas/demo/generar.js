#!/usr/bin/env node
/**
 * Generador de demos — PRODELEC / kit de ventas
 *
 * Uso:
 *   node ventas/demo/generar.js                       -> genera todos los .json de ventas/demo/negocios
 *   node ventas/demo/generar.js ruta/al/negocio.json  -> genera uno solo
 *
 * Salida:  ventas/demo/salida/<slug>.html   (+ un index.html con la lista)
 * No tiene dependencias: funciona con Node 18+ y no requiere build.
 */
/* eslint-disable @typescript-eslint/no-require-imports -- script suelto de Node (CommonJS), fuera del build de Next */
const fs = require("fs");
const path = require("path");

const HERE = __dirname;
const PLANTILLA = path.join(HERE, "plantilla.html");
const NEGOCIOS = path.join(HERE, "negocios");
const SALIDA = path.join(HERE, "salida");

/* ── Íconos (SVG en línea, sin dependencias) ───────────────────────────── */
const SVG = (p) =>
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

const ICONOS = {
  reloj: SVG('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  camion: SVG('<path d="M2 7h11v9H2z"/><path d="M13 10h4l4 4v2h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'),
  estrella: SVG('<path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9z"/>'),
  escudo: SVG('<path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>'),
  corazon: SVG('<path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9z"/>'),
  cafe: SVG('<path d="M4 8h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M16 9h2a2.5 2.5 0 0 1 0 5h-2"/><path d="M6 3v2M10 3v2M14 3v2"/>'),
  pesas: SVG('<path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12"/>'),
  tijera: SVG('<circle cx="6" cy="6" r="2.6"/><circle cx="6" cy="18" r="2.6"/><path d="M8.2 7.6L20 18M20 6L8.2 16.4"/>'),
  llave: SVG('<path d="M14.7 6.3a4.5 4.5 0 0 0 6 6L21 12l-9 9-3-3 9-9z"/><path d="M9 15l-6 6"/>'),
  pata: SVG('<circle cx="8" cy="8" r="2"/><circle cx="16" cy="8" r="2"/><circle cx="5.5" cy="14" r="2"/><circle cx="18.5" cy="14" r="2"/><path d="M9 18c0-2 1.3-3.5 3-3.5s3 1.5 3 3.5-1.3 3-3 3-3-1-3-3z"/>'),
  carrito: SVG('<circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2 3h3l2.4 11.2a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6L21 7H6"/>'),
  pin: SVG('<path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>'),
  telefono: SVG('<path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 3 5.2 2 2 0 0 1 5 3z"/>'),
  bolsa: SVG('<path d="M5 8h14l-1.3 11.2a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8z"/><path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8"/>'),
  check: SVG('<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>'),
  default: SVG('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.2"/>'),
};

/* ── Textos por defecto (español) ──────────────────────────────────────── */
const TEXTOS = {
  T_NAV_SERVICIOS: "Servicios",
  T_NAV_GALERIA: "Galería",
  T_NAV_CONTACTO: "Contacto",
  T_CTA_VER: "Ver servicios",
  T_SERV_EYEBROW: "Qué ofrecemos",
  T_SERV_TITULO: "Nuestros servicios",
  T_SERV_SUB: "Todo lo que necesitás, en un solo lugar.",
  T_GAL_EYEBROW: "Nuestro trabajo",
  T_GAL_TITULO: "Galería",
  T_INFO_TITULO: "Dónde encontrarnos",
  T_DIR: "Dirección",
  T_TEL: "Teléfono",
  T_FINAL_TITULO: "¿Te podemos ayudar?",
  T_FINAL_SUB: "Escribinos por WhatsApp y te respondemos a la brevedad.",
  T_FOOT_DEMO: "Sitio de demostración — contenido de ejemplo.",
};

/* ── Utilidades ────────────────────────────────────────────────────────── */
const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const RAW = new Set(["ICONO", "FOTO", "HERO_MEDIA", "MAPS_EMBED", "HORARIOS_HTML", "INSTAGRAM_ROW"]);

const soloDigitos = (s) => String(s ?? "").replace(/[^\d]/g, "");

const slugify = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "demo";

function formatearTel(s) {
  const d = soloDigitos(s);
  if (d.length === 10) return `${d.slice(0, 2)} ${d.slice(2, 6)}-${d.slice(6)}`;
  if (d.length === 11 && d.startsWith("0")) return `${d.slice(0, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
  return s;
}

function media(src, titulo) {
  if (!src) {
    return `<svg class="phi" width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.2l1.1-2h7.4l1.1 2h1.7A2.5 2.5 0 0 1 20.5 8.5v9A2.5 2.5 0 0 1 18 20H5.5A2.5 2.5 0 0 1 3 17.5z"/><circle cx="12" cy="13" r="3.4"/></svg>`;
  }
  return `<img src="${esc(src)}" alt="${esc(titulo || "")}" loading="lazy">`;
}

/* ── Render ───────────────────────────────────────────────────────────── */
function preparar(data) {
  const d = { ...data };
  for (const [k, v] of Object.entries(TEXTOS)) if (!d[k]) d[k] = v;

  d.NOMBRE = d.nombre || "Comercio de ejemplo";
  d.RUBRO = d.rubro || "Comercio";
  d.CIUDAD = d.ciudad || "Ezpeleta";
  d.DIRECCION = d.direccion || "";
  d.TELEFONO = d.telefono || "";
  d.WHATSAPP = d.whatsapp || d.telefono || "";
  d.INSTAGRAM = d.instagram || "";
  d.SITIO = d.sitio || "";
  d.DESCRIPCION = d.descripcion || `${d.NOMBRE} — ${d.RUBRO} en ${d.CIUDAD}.`;
  d.TAGLINE = d.tagline || `${d.RUBRO} en ${d.CIUDAD}`;
  d.COLOR = d.color || "#1a65b5";
  d.COLOR_OSCURO = d.colorOscuro || "#0f2744";
  d.COLOR_HEX = d.COLOR.replace("#", "");
  d.INICIAL = d.NOMBRE.trim().charAt(0).toUpperCase();

  const wa = soloDigitos(d.WHATSAPP);
  d.WA_LINK = wa ? `https://wa.me/54${wa.replace(/^0/, "")}` : "#";
  if (d.whatsappTexto) d.WA_LINK += `?text=${encodeURIComponent(d.whatsappTexto)}`;

  d.TELEFONO_VISIBLE = d.telefono ? formatearTel(d.telefono) : "—";
  d.WHATSAPP_VISIBLE = d.WHATSAPP ? formatearTel(d.WHATSAPP) : "—";

  d.HORARIOS_SCHEMA = (d.horarios || []).join(" ");
  d.HORARIOS_HTML = (d.horarios || [])
    .map((h) => `<div class="row"><span class="k">Horarios</span><span class="v">${esc(h)}</span></div>`)
    .join("\n          ");
  d.INSTAGRAM_ROW = d.INSTAGRAM
    ? `<div class="row"><span class="k">Instagram</span><span class="v"><a href="${esc(d.INSTAGRAM)}" target="_blank" rel="noopener">${esc(
        d.INSTAGRAM.replace(/^https?:\/\/(www\.)?instagram\.com\/?/, "@").replace(/\/$/, "")
      )}</a></span></div>`
    : "";

  const q = d.mapsQuery || `${d.NOMBRE}, ${d.DIRECCION}, ${d.CIUDAD}, Buenos Aires`;
  d.MAPS_EMBED = `<iframe src="https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed" loading="lazy" title="${esc(
    "Ubicación de " + d.NOMBRE
  )}" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;

  d.OG_IMAGE = d.ogImage || (d.hero && d.hero.foto) || "";
  d.HERO_MEDIA = media(d.hero && d.hero.foto, d.NOMBRE);

  d.SERVICIOS = (d.servicios || []).map((s) => ({
    ICONO: ICONOS[(s.icono || "").toLowerCase()] || ICONOS.default,
    TITULO: s.titulo || "",
    TEXTO: s.texto || "",
  }));

  d.GALERIA = (d.galeria || []).map((g) => ({ FOTO: media(g.foto, g.alt) }));

  d.__slug = slugify(d.NOMBRE + "-" + d.CIUDAD);
  return d;
}

function render(plantilla, data) {
  let out = plantilla;

  // 1) bloques repetibles
  out = out.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, nombre, inner) => {
    const items = data[nombre];
    if (!Array.isArray(items) || items.length === 0) return "";
    return items
      .map((item) =>
        inner.replace(/\{\{(\w+)\}\}/g, (__, key) => {
          if (!(key in item)) return "";
          const val = item[key];
          return RAW.has(key) ? String(val ?? "") : esc(val);
        })
      )
      .join("");
  });

  // 2) tokens simples
  out = out.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in data)) return "";
    const val = data[key];
    return RAW.has(key) ? String(val ?? "") : esc(val);
  });

  return out;
}

/* ── Main ─────────────────────────────────────────────────────────────── */
function archivosDeEntrada(arg) {
  if (arg) return [path.resolve(arg)];
  if (!fs.existsSync(NEGOCIOS)) return [];
  return fs
    .readdirSync(NEGOCIOS)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(NEGOCIOS, f));
}

(function main() {
  const plantilla = fs.readFileSync(PLANTILLA, "utf8");
  const entradas = archivosDeEntrada(process.argv[2]);
  if (entradas.length === 0) {
    console.log("No hay archivos .json en ventas/demo/negocios/");
    console.log("Copiá demo-rotiseria.json, editá los datos y volvé a correr.");
    process.exit(0);
  }

  fs.mkdirSync(SALIDA, { recursive: true });
  const generados = [];

  for (const entrada of entradas) {
    const data = preparar(JSON.parse(fs.readFileSync(entrada, "utf8")));
    const html = render(plantilla, data);
    const destino = path.join(SALIDA, `${data.__slug}.html`);
    fs.writeFileSync(destino, html, "utf8");
    generados.push({ slug: data.__slug, nombre: data.NOMBRE, ciudad: data.CIUDAD });
    console.log(`OK  ${path.relative(process.cwd(), destino)}  (${data.NOMBRE})`);
  }

  const index = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Demos generadas</title>
<style>body{font-family:system-ui,sans-serif;max-width:720px;margin:48px auto;padding:0 20px;color:#0f172a}
h1{font-size:1.5rem}li{margin:.5rem 0}a{color:#1a65b5}</style></head><body>
<h1>Demos generadas (${generados.length})</h1><ul>${generados
    .map((g) => `<li><a href="./${g.slug}.html">${g.nombre}</a> — ${g.ciudad}</li>`)
    .join("")}</ul></body></html>`;
  fs.writeFileSync(path.join(SALIDA, "index.html"), index, "utf8");
  console.log(`\nTotal: ${generados.length} demo(s). Abrí ventas/demo/salida/index.html`);
})();
