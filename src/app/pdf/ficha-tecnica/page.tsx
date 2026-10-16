"use client";

import React from "react";
import { products } from "@/data/mock";
import { Printer, ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { PdfIndex } from "@/components/pdf/PdfIndex";

export default function FichaTecnicaPDFPage() {
  const handlePrint = () => {
    window.print();
  };

  // Entradas del índice: un ancla por producto, en el orden del documento.
  const indexItems = products.map((prod) => ({
    anchor: `doc-${prod.id}`,
    code: prod.code,
    name: prod.name,
  }));

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans text-navy-950">
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
            <Printer className="h-4 w-4" /> Imprimir / Descargar Ficha Técnica (PDF)
          </button>
        </div>
      </div>

      {/* HOJA IMPRIMIBLE TIPO AGUAMAT EXACTO */}
      <div className="max-w-4xl mx-auto bg-white shadow-2xl p-10 font-sans print:shadow-none print:p-6 border border-gray-300">
        
        {/* CABECERA OFICIAL TIPO AGUAMAT CON CUADRO DE CONTROL */}
        <div className="border-2 border-navy-950 mb-8">
          <div className="grid grid-cols-12 divide-x-2 divide-navy-950">
            <div className="col-span-4 p-4 flex flex-col justify-center items-center bg-sky-50">
              <span className="text-2xl font-heading font-extrabold tracking-widest text-navy-950">PRODELEC</span>
              <span className="text-[9px] font-bold text-primary-600 tracking-widest uppercase">SOLUCIONES INDUSTRIALES</span>
            </div>
            <div className="col-span-5 p-4 flex flex-col justify-center items-center text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-gray-500">Documento Oficial</span>
              <h1 className="text-base font-heading font-extrabold uppercase text-navy-950">ESPECIFICACIÓN TÉCNICA UNIFICADA</h1>
              <span className="text-xs font-bold text-primary-600">PORTFOLIO DE COMPONENTES HIDRÁULICOS</span>
            </div>
            <div className="col-span-3 p-3 text-[11px] font-mono space-y-1 bg-sky-50">
              <div className="flex justify-between"><strong>REVISIÓN:</strong> 04</div>
              <div className="flex justify-between"><strong>FECHA:</strong> 10/08/2026</div>
              <div className="flex justify-between"><strong>CÓDIGO:</strong> ET-PROD-2026</div>
              <div className="flex justify-between border-t border-gray-300 pt-1"><strong>NORMA:</strong> ISO 9001</div>
            </div>
          </div>
        </div>

        {/* RESUMEN DE CUMPLIMIENTO NORMATIVO Y CALIDAD */}
        <div className="mb-10 bg-slate-50 border border-slate-200 p-5 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3 mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600 block">Normativa Vigente</span>
              <h2 className="text-sm font-heading font-extrabold uppercase text-navy-950">
                Certificaciones de Calidad y Ensayos Normalizados
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded">
              ISO 9001:2015 · OAA
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Todos los componentes y accesorios hidráulicos de PRODELEC S.R.L. se producen bajo estrictos estándares de calidad con polímeros vírgenes de alta densidad, protección UV y ensayos hidráulicos según especificaciones técnicas de prestatarias sanitarias nacionales (AySA, ABSA, Aguas Cordobesas, Aguas Mendocinas, ASSA).
          </p>
        </div>

        {/* ÍNDICE CLICKEABLE CON BUSCADOR — este documento reúne todos los
            productos, por eso lleva índice y buscador. */}
        <PdfIndex
          items={indexItems}
          title="Índice de productos"
          hint="Hacé clic en un código para ir directo a su ficha. El buscador filtra el índice en pantalla."
          placeholder="Buscar por nombre o código (ej. C1400CS)…"
          emptyText="Ningún producto coincide con esa búsqueda."
          counterLabel={(visible, total) => `${visible} / ${total} productos`}
          entryHint="Ir a la ficha de este producto"
        />

        {/* FICHAS TÉCNICAS DESGLOSADAS DE PRODUCTO */}
        <div className="space-y-12">
          {products.map((prod) => (
            <div
              key={prod.id}
              id={`doc-${prod.id}`}
              className="border-2 border-gray-300 p-6 bg-white page-break-inside-avoid scroll-mt-6"
            >
              
              {/* Encabezado del Producto */}
              <div className="flex justify-between items-center border-b-2 border-navy-950 pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono font-extrabold text-primary-600 uppercase tracking-widest">FICHA TÉCNICA OFICIAL PRODELEC</span>
                  <h3 className="text-xl font-heading font-extrabold uppercase text-navy-950">{prod.name} (Código: {prod.code})</h3>
                </div>
                <span className="text-xs font-mono font-bold border border-navy-950 px-3 py-1 bg-sky-50">
                  {prod.diameter ? `DN: ${prod.diameter}` : prod.homologado ? "HOMOLOGADO" : "LÍNEA ESTÁNDAR"}
                </span>
              </div>

              {/* Contenido normativo */}
              <div className="space-y-4 text-xs">
                <div>
                  <strong className="text-navy-950 uppercase block font-extrabold mb-1">1. Objeto y Alcance:</strong>
                  <p className="text-gray-700 leading-relaxed">
                    Definir las características técnicas y mecánicas de la pieza {prod.name} para su utilización en redes de distribución de agua potable y saneamiento bajo normas de prestatarias sanitarias.
                  </p>
                </div>

                <div>
                  <strong className="text-navy-950 uppercase block font-extrabold mb-1">2. Referencias Normativas:</strong>
                  <ul className="list-disc pl-5 text-gray-700 space-y-0.5">
                    <li>El presente documento ha sido elaborado en base a los lineamientos establecidos por <strong>AySA ET N° 15</strong>.</li>
                    <li>Cumplimiento de normas <strong>IRAM 13478 / ISO 9001 / EN 545</strong>.</li>
                  </ul>
                </div>

                <div>
                  <strong className="text-navy-950 uppercase block font-extrabold mb-1">3. Características Constructivas y Materiales (generales de línea):</strong>
                  <table className="w-full text-xs border border-gray-300 border-collapse mt-2">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="p-2 font-bold bg-sky-50 w-1/3">Material del Cuerpo:</td>
                        <td className="p-2">Polipropileno Técnico Inyectado (PP) con filtro UV de alta durabilidad / Inox AISI 304.</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2 font-bold bg-sky-50">Junta de Hermeticidad:</td>
                        <td className="p-2">Elastómero Goma NBR / EPDM atóxico certificado para agua potable.</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2 font-bold bg-sky-50">Temperatura Máxima:</td>
                        <td className="p-2 font-mono">80 °C en operación continua.</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2 font-bold bg-sky-50">Torque de Apriete Recomendado:</td>
                        <td className="p-2 font-mono font-bold text-emerald-700">Según especificación del modelo — consultar al área técnica de Prodelec.</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold bg-sky-50">Identificación de Pieza:</td>
                        <td className="p-2">Marca registrada grabada en relieve &quot;PRODELEC&quot;, DN y PN normalizados.</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Especificaciones propias del producto (cuando están cargadas en el catálogo) */}
                  {prod.specs && prod.specs.length > 0 && (
                    <table className="w-full text-xs border border-gray-300 border-collapse mt-2">
                      <tbody>
                        {prod.sizeInfo && (
                          <tr className="border-b border-gray-200">
                            <td className="p-2 font-bold bg-sky-50 w-1/3">Medida / Dimensiones:</td>
                            <td className="p-2">{prod.sizeInfo}</td>
                          </tr>
                        )}
                        {prod.diameter && (
                          <tr className="border-b border-gray-200">
                            <td className="p-2 font-bold bg-sky-50">Diámetro Nominal:</td>
                            <td className="p-2 font-mono">{prod.diameter}</td>
                          </tr>
                        )}
                        {prod.specs.map((spec) => (
                          <tr key={spec.label} className="border-b border-gray-200 last:border-0">
                            <td className="p-2 font-bold bg-sky-50">{spec.label}:</td>
                            <td className="p-2">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Ficha técnica específica del modelo (cuando existe en origen) */}
                {prod.technicalSheet && (
                  <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap items-center gap-2 text-xs">
                    <FileText className="h-3.5 w-3.5 text-primary-600 shrink-0" aria-hidden />
                    <span className="font-extrabold uppercase text-navy-950">
                      Ficha técnica específica:
                    </span>
                    <a
                      href={prod.technicalSheet}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-primary-700 underline hover:text-navy-950"
                    >
                      {prod.code} — abrir PDF
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-6 border-t-2 border-navy-950 text-center text-xs text-gray-500 font-mono">
          PRODELEC S.R.L. — Ficha Técnica Oficial de Productos Homologados para Redes de Agua y Saneamiento.
        </div>
      </div>
    </div>
  );
}
