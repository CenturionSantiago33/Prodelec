/**
 * Datos institucionales y de sitio de PRODELEC S.R.L.
 *
 * `url` es configurable por entorno (`NEXT_PUBLIC_SITE_URL`). El valor por defecto
 * se toma del propio contenido del sitio (catálogo PDF / metadatos existentes) y
 * DEBE confirmarse con el área comercial antes de publicar/indexar.
 */
export const SITE = {
  name: "PRODELEC S.R.L.",
  shortName: "Prodelec",
  legalName: "PRODELEC S.R.L.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.prodelec.com.ar",
  description:
    "Fabricación nacional de componentes poliméricos para redes de agua potable, saneamiento y gas. Cajas de conexión, abrazaderas y accesorios con certificación ISO 9001:2015.",
  email: "prodelec@prodelec.com.ar",
  whatsapp: "5491139122763",
  // Los teléfonos de contacto NO se publican (decisión del cliente, 2026-10-15).
  addressCommercial: "Camino General Belgrano 1910, Berazategui, Buenos Aires",
  addressPlant: "Parque Industrial Good Park, Florencio Varela, Buenos Aires, Argentina",
  locality: "Berazategui",
  region: "Buenos Aires",
  country: "AR",
  foundedYear: 1986,
} as const;
