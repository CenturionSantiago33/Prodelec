/**
 * Novedades del sitio (antes hardcodeadas dentro de `src/app/page.tsx`).
 * Se movieron a un archivo propio para que sean editables desde el panel /admin.
 */
export interface Novelty {
  id: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
}

export const novelties: Novelty[] = [
  {
    id: "n1",
    category: "Innovación",
    date: "2025",
    title: "Nueva línea de abrazaderas homologadas para redes de alta presión",
    excerpt:
      "Desarrollamos una nueva generación de abrazaderas de derivación con homologación extendida para presiones de trabajo superiores a 16 bar en redes de agua potable.",
    image: "/carousel-2.jpg",
  },
  {
    id: "n2",
    category: "Producción",
    date: "2025",
    title: "Ampliación de capacidad productiva en Florencio Varela",
    excerpt:
      "Nueva línea de inyección incorporada para responder a la demanda creciente del mercado regional.",
    image: "/carousel-3.jpg",
  },
  {
    id: "n3",
    category: "Exportación",
    date: "2025",
    title: "Prodelec consolida su presencia en Brasil y Uruguay",
    excerpt:
      "Acuerdos comerciales con operadores de infraestructura hídrica en Sudamérica.",
    image: "/carousel-4.jpg",
  },
];
