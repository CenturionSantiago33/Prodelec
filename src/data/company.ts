/**
 * Datos institucionales estáticos reutilizables (clientes y presencia geográfica).
 * Antes estaban hardcodeados dentro de `src/app/page.tsx`.
 */

export interface Client {
  name: string;
  fullName: string;
  abbr: string;
  logo: string;
}

/** Prestatarias y organismos de referencia (logos en /public/clientes). */
export const CLIENTS: Client[] = [
  { name: "AySA", fullName: "Agua y Saneamientos Argentinos", abbr: "AySA", logo: "/clientes/aysa.svg" },
  { name: "ABSA", fullName: "Aguas Bonaerenses S.A.", abbr: "ABSA", logo: "/clientes/absa.svg" },
  { name: "Aguas Cordobesas", fullName: "Aguas Cordobesas S.A.", abbr: "AC", logo: "/clientes/aguas-cordobesas.svg" },
  { name: "Aguas Mendocinas", fullName: "AYSAM S.A.", abbr: "AM", logo: "/clientes/aguas-mendocinas.svg" },
  { name: "Sabesp", fullName: "Saneamento Básico SP (Brasil)", abbr: "SBP", logo: "/clientes/sabesp.svg" },
  { name: "ASSA", fullName: "Aguas Santafesinas S.A.", abbr: "ASSA", logo: "/clientes/assa.svg" },
  { name: "EPAS Neuquén", fullName: "Ente Prov. de Agua y Saneamiento", abbr: "EPAS", logo: "/clientes/epas.svg" },
  { name: "OSSE", fullName: "Obras Sanitarias MGP", abbr: "OSSE", logo: "/clientes/osse.svg" },
];

export interface CountryPresence {
  flag: string;
  name: string;
}

/** Presencia geográfica / destino de exportación. */
export const COUNTRIES: CountryPresence[] = [
  { flag: "🇦🇷", name: "Argentina" },
  { flag: "🇧🇷", name: "Brasil" },
  { flag: "🇺🇾", name: "Uruguay" },
  { flag: "🇨🇱", name: "Chile" },
  { flag: "🇧🇴", name: "Bolivia" },
];
