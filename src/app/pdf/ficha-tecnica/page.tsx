"use client";

import React from "react";
import { products } from "@/data/mock";
import { Download, Printer, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function FichaTecnicaPDFPage() {
  const handlePrint = () => {
    window.print();
  };

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

        {/* CUADRO DE REVISIÓN Y APROBACIÓN TIPO AGUAMAT */}
        <div className="mb-10">
          <h2 className="text-xs font-extrabold uppercase tracking-widest bg-navy-950 text-white px-4 py-1.5 mb-2">
            HOJA DE CAMBIOS Y CONTROL DE REVISIONES
          </h2>
          <table className="w-full text-xs border border-gray-300 border-collapse text-left">
            <thead>
              <tr className="bg-sky-100/60 font-bold border-b border-gray-300">
                <th className="p-2 border.r border-gray-300">REVISIÓN</th>
                <th className="p-2 border-r border-gray-300">FECHA</th>
                <th className="p-2">SECCIÓN / DESCRIPCIÓN DEL CAMBIO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="p-2 border-r font-mono font-bold">03</td>
                <td className="p-2 border-r font-mono">17/05/2024</td>
                <td className="p-2">Se actualiza tabla de tolerancias y torques de apriete N·m.</td>
              </tr>
              <tr>
                <td className="p-2 border-r font-mono font-bold">04</td>
                <td className="p-2 border-r font-mono">10/08/2026</td>
                <td className="p-2">Incorporación de nuevos modelos Cajas C400 CS y Abrazaderas Inox.</td>
              </tr>
            </tbody>
          </table>

          <div className="grid grid-cols-2 gap-4 mt-4 text-xs border border-gray-300 p-3 bg-gray-50">
            <div>
              <span className="font-bold text-gray-500 block">Última Revisión Técnica:</span>
              <span className="font-extrabold text-navy-950">Ing. Pablo Bondi — Dpto. de Ingeniería</span>
            </div>
            <div>
              <span className="font-bold text-gray-500 block">Aprobó Control de Calidad:</span>
              <span className="font-extrabold text-navy-950">Ing. Guillermo Ocio — Dirección Técnica</span>
            </div>
          </div>
        </div>

        {/* FICHAS TÉCNICAS DESGLOSADAS DE PRODUCTO */}
        <div className="space-y-12">
          {products.map((prod, i) => (
            <div key={prod.id} className="border-2 border-gray-300 p-6 bg-white page-break-inside-avoid">
              
              {/* Encabezado del Producto Tipo Aguamat */}
              <div className="flex justify-between items-center border-b-2 border-navy-950 pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono font-extrabold text-primary-600 uppercase tracking-widest">PRODELEC TECHNICAL SHEET</span>
                  <h3 className="text-xl font-heading font-extrabold uppercase text-navy-950">{prod.name} (SKU: {prod.code})</h3>
                </div>
                <span className="text-xs font-mono font-bold border border-navy-950 px-3 py-1 bg-sky-50">
                  PN 10 / PN 16 BAR
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
                  <strong className="text-navy-950 uppercase block font-extrabold mb-1">3. Características Constructivas y Materiales:</strong>
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
                        <td className="p-2 font-mono font-bold text-emerald-700">25 N·m - 35 N·m (Aplicar en cruz con dinamométrica)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold bg-sky-50">Marcado de Fábrica:</td>
                        <td className="p-2">Isotipo grabado en relieve "PRODELEC", DN, PN y fecha de fabricación.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-6 border-t-2 border-navy-950 text-center text-xs text-gray-500 font-mono">
          PRODELEC S.A. — Documento Técnico Confidencial de Especificación Técnica Unificada.
        </div>
      </div>
    </div>
  );
}
