"use client";

import React from "react";
import { products, categories } from "@/data/mock";
import { Download, Printer, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CatalogoPDFPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans">
      {/* Barra de control flotante no imprimible */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center bg-navy-950 text-white p-4 rounded-2xl shadow-xl print:hidden">
        <Link href="/productos" className="inline-flex items-center text-xs font-extrabold uppercase text-gray-300 hover:text-electric gap-2">
          <ArrowLeft className="h-4 w-4" /> Volver al Sitio
        </Link>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-electric text-navy-950 text-xs font-extrabold hover:bg-white transition-all shadow-md"
          >
            <Printer className="h-4 w-4" /> Imprimir / Descargar PDF
          </button>
        </div>
      </div>

      {/* DOCUMENTO PDF - HOJA A4 IMPRIMIBLE */}
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-none print:shadow-none p-12 text-navy-950">
        
        {/* PORTADA ESTILO AGUAMAT DE PRODELEC */}
        <div className="min-h-[1000px] flex flex-col justify-between border-b-4 border-primary-600 pb-12 mb-16 relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white p-8 rounded-2xl border border-sky-100">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-3xl font-heading font-extrabold tracking-widest text-navy-950">PRODELEC</span>
              <span className="text-xs font-bold text-primary-600 tracking-[0.3em] uppercase block">Soluciones Industriales</span>
            </div>
            <div className="text-right text-xs text-gray-500 font-mono">
              <strong>CATÁLOGO GENERAL 2026</strong><br/>
              REV: 04-2026<br/>
              www.prodelec.com.ar
            </div>
          </div>

          <div className="my-auto py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-primary-600/10 text-primary-600 font-extrabold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <ShieldCheck className="h-4 w-4" /> Componentes Plásticos de Ingeniería
            </div>
            <h1 className="text-5xl font-heading font-extrabold uppercase text-navy-950 tracking-tight leading-none mb-6">
              Catálogo General de Accesorios para Redes de Agua Potable y Saneamiento
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              Soluciones confiables de alta resistencia para conducción, derivación, reparación y corte en tuberías hidráulicas.
            </p>
          </div>

          <div className="pt-8 border-t border-sky-200 flex justify-between items-end text-xs text-gray-500">
            <div>
              <strong>PRODELEC S.A.</strong><br/>
              Parque Industrial Good Park, Florencio Varela<br/>
              Buenos Aires, Argentina
            </div>
            <div className="text-right font-mono">
              Email: prodelec@prodelec.com.ar<br/>
              Tel Ventas: +54 9 11 3912-2763 | Planta: (54-11) 2341-3935
            </div>
          </div>
        </div>

        {/* ÍNDICE DE FAMILIAS */}
        <div className="mb-16">
          <h2 className="text-2xl font-heading font-extrabold uppercase border-b-2 border-navy-950 pb-3 mb-6 text-navy-950">
            Índice del Portfolio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat, idx) => (
              <div key={cat.id} className="flex justify-between items-center p-3 bg-sky-50/50 rounded-xl border border-sky-100 text-sm">
                <span className="font-extrabold text-navy-950">{idx + 1}. {cat.name}</span>
                <span className="font-mono text-xs text-primary-600 font-bold">Pág. {idx + 2}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCTOS POR CATEGORÍA ESTILO MUESTRA PDF */}
        <div className="space-y-16">
          <h2 className="text-2xl font-heading font-extrabold uppercase border-b-2 border-navy-950 pb-3 text-navy-950">
            Fichas de Productos y Líneas Principales
          </h2>

          {products.map((prod, idx) => (
            <div key={prod.id} className="border border-sky-200 rounded-2xl p-6 bg-white page-break-inside-avoid shadow-sm">
              <div className="flex justify-between items-start mb-4 border-b border-sky-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-extrabold uppercase text-primary-600 tracking-wider">SKU: {prod.code}</span>
                  <h3 className="text-xl font-heading font-extrabold text-navy-950">{prod.name}</h3>
                </div>
                <div className="text-right">
                  {prod.homologado && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      ✓ HOMOLOGADO
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="h-40 bg-sky-50/50 rounded-xl p-4 flex items-center justify-center border border-sky-100">
                  <img src={prod.images[0]} alt={prod.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <p className="text-xs text-gray-600 leading-relaxed">{prod.description}</p>
                  
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-500">Medida / Dimensión:</span>
                      <span className="font-bold text-navy-950">{prod.sizeInfo || "Estándar de fábrica"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-500">Diámetro Nominal:</span>
                      <span className="font-bold text-primary-600">{prod.diameter || "DN 20 - DN 110 mm"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-500">Presión Trabajo:</span>
                      <span className="font-bold text-navy-950">PN 10 / PN 16 BAR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PIE DE PÁGINA IMPRESO */}
        <div className="mt-20 pt-8 border-t-2 border-navy-950 text-center text-xs text-gray-500 font-mono">
          PRODELEC S.A. — Catálogo Oficial de Productos 2026. Documento de Consulta Técnica.
        </div>
      </div>
    </div>
  );
}
