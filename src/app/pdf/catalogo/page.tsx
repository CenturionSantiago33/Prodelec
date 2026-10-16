"use client";

import React, { useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { products, categories } from "@/data/mock";
import { Printer, ArrowLeft, ShieldCheck, Filter } from "lucide-react";
import Link from "next/link";
import { PdfIndex } from "@/components/pdf/PdfIndex";

function CatalogoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedCategory = searchParams.get("categoria") || searchParams.get("familia") || "all";

  const activeCatObj = categories.find(
    (c) => c.id === selectedCategory || c.slug === selectedCategory
  );

  const displayedProducts = useMemo(() => {
    if (selectedCategory === "all" || !activeCatObj) {
      return products;
    }
    return products.filter(
      (p) => p.categoryId === activeCatObj.id || p.categoryId === activeCatObj.slug
    );
  }, [selectedCategory, activeCatObj]);

  const handleCategoryChange = (newCat: string) => {
    if (newCat === "all") {
      router.push("/pdf/catalogo");
    } else {
      router.push(`/pdf/catalogo?categoria=${newCat}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans text-navy-950">
      {/* Barra de control flotante no imprimible */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-center bg-navy-950 text-white p-4 rounded-2xl shadow-xl gap-4 print:hidden">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <Link
            href="/categorias"
            className="inline-flex items-center text-xs font-extrabold uppercase text-gray-300 hover:text-sky-300 gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al Catálogo
          </Link>
          <span className="text-gray-600 hidden sm:inline">|</span>
        </div>

        {/* Selector de categoría */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-sky-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="bg-navy-900 border border-navy-700 text-white text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-sky-400 w-full sm:w-64 cursor-pointer"
          >
            <option value="all">Catálogo General Completo ({products.length} productos)</option>
            {categories.map((c) => {
              const count = products.filter(
                (p) => p.categoryId === c.id || p.categoryId === c.slug
              ).length;
              return (
                <option key={c.id} value={c.id}>
                  {c.name} ({count} productos)
                </option>
              );
            })}
          </select>
        </div>

        {/* Botón de impresión / guardado como PDF */}
        <div className="flex gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-extrabold hover:bg-primary-500 transition-all shadow-md cursor-pointer"
          >
            <Printer className="h-4 w-4" /> Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      {/* DOCUMENTO PDF - HOJA A4 IMPRIMIBLE */}
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-none print:shadow-none p-10 sm:p-14 text-navy-950 border border-gray-200">
        
        {/* PORTADA OFICIAL PRODELEC */}
        <div className="min-h-[880px] flex flex-col justify-between border-b-4 border-primary-600 pb-12 mb-14 relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white p-8 rounded-2xl border border-sky-100">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-3xl font-heading font-black tracking-widest text-navy-950 block">PRODELEC</span>
              <span className="text-[10px] font-bold text-primary-600 tracking-[0.3em] uppercase block">Soluciones Industriales</span>
            </div>
            <div className="text-right text-xs text-gray-500 font-mono">
              <strong>{activeCatObj ? `CATÁLOGO: ${activeCatObj.name.toUpperCase()}` : "CATÁLOGO GENERAL"}</strong><br/>
              NORMA: ISO 9001:2015 · OAA<br/>
              REV: 2026-V4 · www.prodelec.com.ar
            </div>
          </div>

          <div className="my-auto py-12 text-center">
            <div className="inline-flex items-center gap-2 bg-primary-600/10 text-primary-700 font-extrabold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-primary-600/20">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> 
              {activeCatObj ? `Línea Técnica Especializada · ${displayedProducts.length} Modelos` : "Portfolio Consolidado de Infraestructura Hidráulica"}
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-heading font-black uppercase text-navy-950 tracking-tight leading-tight mb-6">
              {activeCatObj ? (
                <>Catálogo Técnico:<br /><span className="text-primary-600">{activeCatObj.name}</span></>
              ) : (
                "Catálogo Oficial de Accesorios para Redes de Agua Potable y Saneamiento"
              )}
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
              {activeCatObj?.description ||
                "Soluciones confiables de alta resistencia para conducción, derivación, reparación y corte en tuberías hidráulicas y de gas."}
            </p>

            {activeCatObj && (
              <div className="mt-8 inline-flex items-center gap-4 bg-white px-6 py-3 rounded-xl border border-gray-200 text-xs text-gray-700 shadow-xs">
                <div>
                  <span className="font-bold text-gray-400 block text-[10px] uppercase">Línea Técnica</span>
                  <span className="font-mono font-bold text-navy-950">{activeCatObj.name}</span>
                </div>
                <div className="h-6 w-px bg-gray-200" />
                <div>
                  <span className="font-bold text-gray-400 block text-[10px] uppercase">Modelos Homologados</span>
                  <span className="font-mono font-bold text-primary-600">{displayedProducts.length} productos</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-sky-200 flex justify-between items-end text-xs text-gray-500">
            <div>
              <strong className="text-navy-950">PRODELEC S.R.L.</strong><br/>
              Parque Industrial Good Park · Florencio Varela<br/>
              Buenos Aires, Argentina
            </div>
            <div className="text-right font-mono">
              Email: prodelec@prodelec.com.ar
            </div>
          </div>
        </div>

        {/* ÍNDICE (Solo en catálogo general) */}
        {!activeCatObj && (
          <div className="mb-14">
            <h2 className="text-xl font-heading font-extrabold uppercase border-b-2 border-navy-950 pb-3 mb-6 text-navy-950">
              Índice de Categorías de Productos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((cat, idx) => {
                const catProducts = products.filter(
                  (p) => p.categoryId === cat.id || p.categoryId === cat.slug
                );
                const firstProduct = catProducts[0];
                const rowClass =
                  "flex justify-between items-center gap-3 p-3.5 bg-sky-50/50 rounded-xl border border-sky-100 text-xs transition-colors";
                const content = (
                  <>
                    <span className="font-extrabold text-navy-950">
                      {idx + 1}. {cat.name}
                    </span>
                    <span className="font-mono text-xs text-primary-600 font-bold shrink-0">
                      {catProducts.length} modelos
                    </span>
                  </>
                );

                // Cada categoría salta al primer producto del listado.
                return firstProduct ? (
                  <a
                    key={cat.id}
                    href={`#doc-${firstProduct.id}`}
                    title={`Ir a ${cat.name}`}
                    className={`${rowClass} hover:bg-sky-100 hover:border-sky-300`}
                  >
                    {content}
                  </a>
                ) : (
                  <div key={cat.id} className={rowClass}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ÍNDICE CLICKEABLE CON BUSCADOR — este documento reúne varios
            productos, por eso lleva índice y buscador. */}
        {displayedProducts.length > 1 && (
          <PdfIndex
            items={displayedProducts.map((prod) => ({
              anchor: `doc-${prod.id}`,
              code: prod.code,
              name: prod.name,
            }))}
            title={
              activeCatObj
                ? `Índice de modelos · ${activeCatObj.name}`
                : "Índice de productos"
            }
            hint="Hacé clic en un código para ir directo a su ficha. El buscador filtra el índice en pantalla."
            placeholder="Buscar por nombre o código (ej. C1400CS)…"
            emptyText="Ningún producto coincide con esa búsqueda."
            counterLabel={(visible, total) => `${visible} / ${total} modelos`}
            entryHint="Ir a la ficha de este producto"
          />
        )}

        {/* LISTADO DE PRODUCTOS */}
        <div className="space-y-12">
          <div className="flex justify-between items-end border-b-2 border-navy-950 pb-3">
            <h2 className="text-xl font-heading font-extrabold uppercase text-navy-950">
              {activeCatObj ? `Modelos de ${activeCatObj.name}` : "Fichas de Productos y Líneas Principales"}
            </h2>
            <span className="text-xs font-mono font-bold text-slate-500">
              {displayedProducts.length} modelos listados
            </span>
          </div>

          {displayedProducts.map((prod) => (
            <div
              key={prod.id}
              id={`doc-${prod.id}`}
              className="border border-sky-200 rounded-2xl p-6 bg-white page-break-inside-avoid shadow-xs scroll-mt-6"
            >
              <div className="flex justify-between items-start mb-4 border-b border-sky-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-extrabold uppercase text-primary-600 tracking-wider">Código: {prod.code}</span>
                  <h3 className="text-lg font-heading font-extrabold text-navy-950">{prod.name}</h3>
                </div>
                <div className="text-right">
                  {prod.homologado && (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      ✓ HOMOLOGADO
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="h-36 bg-slate-50 rounded-xl p-4 flex items-center justify-center border border-slate-200">
                  <img src={prod.images[0]} alt={prod.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <p className="text-xs text-gray-600 leading-relaxed">{prod.description}</p>
                  
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-1.5">
                    {prod.sizeInfo && (
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-500">Medida / Dimensión:</span>
                        <span className="font-bold text-navy-950">{prod.sizeInfo}</span>
                      </div>
                    )}
                    {prod.diameter && (
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-500">Diámetro Nominal:</span>
                        <span className="font-bold text-primary-600">{prod.diameter}</span>
                      </div>
                    )}
                    {(prod.specs || []).slice(0, 3).map((spec) => (
                      <div key={spec.label} className="flex justify-between">
                        <span className="font-semibold text-gray-500">{spec.label}:</span>
                        <span className="font-bold text-navy-950">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PIE DE PÁGINA IMPRESO */}
        <div className="mt-16 pt-6 border-t-2 border-navy-950 text-center text-xs text-gray-500 font-mono">
          PRODELEC S.R.L. — Catálogo Técnico Oficial 2026. Documento de Consulta para Pliegos y Obras.
        </div>
      </div>
    </div>
  );
}

export default function CatalogoPDFPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">Cargando catálogo...</div>}>
      <CatalogoContent />
    </Suspense>
  );
}
