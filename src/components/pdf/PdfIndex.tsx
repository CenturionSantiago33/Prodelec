"use client";

import React, { useMemo, useState } from "react";
import { ListTree, Search, X } from "lucide-react";

export type PdfIndexItem = {
  /** id del ancla en el documento (sin el "#"). */
  anchor: string;
  /** Código oficial de la pieza (se usa también en la búsqueda). */
  code: string;
  /** Nombre del producto. */
  name: string;
};

type PdfIndexProps = {
  items: PdfIndexItem[];
  title: string;
  hint?: string;
  placeholder: string;
  emptyText: string;
  /** Texto del contador: recibe los visibles y el total. */
  counterLabel: (visible: number, total: number) => string;
  /** Texto que acompaña a cada entrada (p. ej. "Ir a la ficha"). */
  entryHint?: string;
};

/** Normaliza para buscar sin acentos ni mayúsculas. */
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

/**
 * Índice clickeable con buscador para los documentos que reúnen más de un
 * producto (ficha técnica general y catálogo).
 *
 * - Cada entrada es un ancla interna (`#doc-<id>`) que funciona tanto en
 *   pantalla como en el PDF exportado desde el navegador.
 * - El buscador filtra el índice en pantalla; al imprimir se imprime el
 *   índice completo para que el documento en papel nunca quede recortado.
 */
export function PdfIndex({
  items,
  title,
  hint,
  placeholder,
  emptyText,
  counterLabel,
  entryHint,
}: PdfIndexProps) {
  const [query, setQuery] = useState("");
  const needle = normalize(query.trim());

  const matches = useMemo(() => {
    if (!needle) return null;
    return new Set(
      items
        .filter((item) => normalize(`${item.code} ${item.name}`).includes(needle))
        .map((item) => item.anchor)
    );
  }, [items, needle]);

  const visible = matches ? matches.size : items.length;

  return (
    <section className="mb-12 border-2 border-navy-950 bg-sky-50/40 break-inside-avoid">
      {/* Encabezado del índice */}
      <div className="border-b-2 border-navy-950 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ListTree className="h-5 w-5 text-primary-600 shrink-0" aria-hidden />
          <div>
            <h2 className="text-base font-heading font-extrabold uppercase text-navy-950 leading-none">
              {title}
            </h2>
            {hint && <p className="text-[11px] text-gray-500 mt-1.5">{hint}</p>}
          </div>
        </div>
        <span className="text-[11px] font-mono font-bold text-navy-950 bg-white border border-navy-950 px-3 py-1 shrink-0">
          {counterLabel(visible, items.length)}
        </span>
      </div>

      {/* Buscador: sólo en pantalla (en papel no tendría utilidad) */}
      <div className="px-5 py-4 border-b border-sky-200 print:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="w-full h-11 pl-10 pr-10 border border-gray-300 bg-white text-sm rounded-lg text-navy-950 placeholder:text-gray-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-950"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {visible === 0 && (
          <p className="text-xs text-gray-600 mt-3 font-semibold">{emptyText}</p>
        )}
      </div>

      {/* Entradas del índice */}
      <ol className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0.5">
        {items.map((item) => {
          const isVisible = !matches || matches.has(item.anchor);
          return (
            <li
              key={item.anchor}
              className={isVisible ? "break-inside-avoid" : "hidden print:list-item"}
            >
              <a
                href={`#${item.anchor}`}
                title={entryHint}
                className="group flex items-baseline gap-2 py-1.5 border-b border-sky-100 text-xs hover:text-primary-700"
              >
                <span className="font-mono font-bold text-primary-700 shrink-0 group-hover:underline">
                  {item.code}
                </span>
                <span className="text-gray-700 leading-snug group-hover:underline">
                  {item.name}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
