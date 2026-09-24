"use client";

import { motion } from "framer-motion";
import { FileText, Download, Eye, FileDown } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n/translations";

export function DocumentCards() {
  const language = useStore((state) => state.language);
  const t = useTranslation(language);

  const DOCUMENTS = [
    {
      title: t("catPdfCatalog") || "Catálogo Técnico General Prodelec 2026",
      category: "Catálogo PDF",
      pages: "12 págs",
      size: "8.4 MB",
      date: "Ene 2026",
      available: true,
      url: "/pdf/catalogo",
    },
    {
      title: t("catPdfSpecs") || "Ficha Técnica Unificada de Componentes",
      category: "Ficha Técnica",
      pages: "12 págs",
      size: "4.2 MB",
      date: "Ago 2026",
      available: true,
      url: "/pdf/ficha-tecnica",
    },
    {
      title: "Manual Técnico de Instalación Certificada",
      category: "Manual Obra",
      pages: "8 págs",
      size: "3.5 MB",
      date: "Ago 2026",
      available: true,
      url: "/pdf/ficha-tecnica",
    },
    {
      title: "Certificado Oficial ISO 9001:2015 — PRODELEC S.R.L.",
      category: "Certificación OAA",
      pages: "1 pág",
      size: "70 KB",
      date: "2026",
      available: true,
      url: "/certificados/PRODELEC-SRL-ISO-9001-2015.pdf",
    },
  ];

  return (
    <section className="py-20 bg-navy-950 relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-primary-600/5 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-electric/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-electric uppercase tracking-widest block mb-2">
              {t("navNews")}
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white tracking-tight mb-3 uppercase">
              {t("techDocuments")}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {t("catalog.subtitle")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DOCUMENTS.map((doc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:bg-white/10 hover:border-white/25 shadow-md">
                
                <div>
                  {/* Cabecera del doc */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-electric bg-white/10 px-3 py-1 rounded-full border border-white/15">
                      {doc.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-heading font-bold text-white mb-6 leading-snug">
                    {doc.title}
                  </h3>
                </div>

                <div>
                  <div className="grid grid-cols-3 gap-2 mb-6 text-center border-t border-white/10 pt-4">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Págs</div>
                      <div className="text-xs font-mono font-bold text-white">{doc.pages}</div>
                    </div>
                    <div className="border-l border-white/10">
                      <div className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">MB</div>
                      <div className="text-xs font-mono font-bold text-white">{doc.size}</div>
                    </div>
                    <div className="border-l border-white/10">
                      <div className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Año</div>
                      <div className="text-xs font-mono font-bold text-white">{doc.date}</div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2.5">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white hover:bg-electric text-navy-950 font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      <Download className="h-4 w-4" /> {t("common.downloadPdf")}
                    </a>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-none bg-white/10 hover:bg-white/20 text-white font-bold p-3 rounded-xl transition-colors flex items-center justify-center"
                      title="Ver PDF"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
