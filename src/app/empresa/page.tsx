"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Award, Users, Globe, Leaf, ShieldCheck, CheckCircle2, ArrowRight, Download, ExternalLink, FileCheck } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n/translations";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function EmpresaPage() {
  const language = useStore(state => state.language);
  const t = useTranslation(language);

  return (
    <div className="min-h-screen bg-sky-50/50 pt-[80px] font-sans">
      {/* ── HERO INSTITUCIONAL ── */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-navy-950 text-white">
        <div className="absolute inset-0 bg-primary-600/10 mix-blend-overlay pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-electric/10 border border-electric/30 px-4 py-1.5 text-xs font-extrabold text-electric uppercase tracking-widest mb-6">
              <span className="flex h-2 w-2 rounded-full bg-electric" />
              {t("empresaYears")}
            </div>
            <h1 className="text-4xl lg:text-6xl font-heading font-extrabold mb-6 tracking-tight leading-tight">
              {t("empresaHeroTitle")}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed font-medium">
              {t("empresaHeroDesc")}
            </p>
          </motion.div>
        </div>

        {/* Separador de Ola Celeste */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10 h-16">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-full fill-sky-50/50">
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ── VALORES / PILARES ESTILO AGUAMAT ── */}
      <section className="py-20 relative z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: t("empresaPillar1Title"), desc: t("empresaPillar1Desc"), bg: "from-blue-500 to-electric" },
              { icon: Users, title: t("empresaPillar2Title"), desc: t("empresaPillar2Desc"), bg: "from-sky-500 to-blue-600" },
              { icon: Globe, title: t("empresaPillar3Title"), desc: t("empresaPillar3Desc"), bg: "from-teal-500 to-emerald-600" },
              { icon: Leaf, title: t("empresaPillar4Title"), desc: t("empresaPillar4Desc"), bg: "from-cyan-500 to-blue-500" }
            ].map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-xl shadow-sky-950/5 border border-sky-100 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Circulo de color flotante detrás del ícono estilo Aguamat */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${val.bg} flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  <val.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-heading font-extrabold text-navy-950 mb-3">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HISTORIA Y LÍNEA DE TIEMPO CON FOTOS INDUSTRIALES ── */}
      <section className="py-24 bg-white border-y border-sky-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-extrabold text-primary-600 uppercase tracking-widest block mb-2">{t("empresaEvo")}</span>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-navy-950 tracking-tight">{t("empresaHistoryTitle")}</h2>
          </div>

          <div className="space-y-20">
            {[
              { year: t("empresaHist1Year"), title: t("empresaHist1Title"), desc: t("empresaHist1Desc"), img: "/productos/caja cuerpo ampliado 1.jpg.jpeg" },
              { year: t("empresaHist2Year"), title: t("empresaHist2Title"), desc: t("empresaHist2Desc"), img: "/productos/Abrazadera de Derivacion - Frente.jpg.jpeg" },
              { year: t("empresaHist3Year"), title: t("empresaHist3Title"), desc: t("empresaHist3Desc"), img: "/productos/Abrazadera con llave de corte.jpg.jpeg" },
              { year: t("empresaHist4Year"), title: t("empresaHist4Title"), desc: t("empresaHist4Desc"), img: "/productos/Abrazadera de Reparación 1 Banda.jpg.jpeg" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${idx % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className="w-full lg:w-1/2">
                  <div className="relative h-72 md:h-80 rounded-3xl overflow-hidden shadow-2xl border border-sky-100 group">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-navy-950 text-white font-mono text-base font-extrabold px-4 py-2 rounded-xl shadow-lg border border-white/20">
                      {item.year}
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-1/2">
                  <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-navy-950 mb-4">{item.title}</h3>
                  <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-6">{item.desc}</p>
                  <div className="inline-flex items-center gap-2 text-primary-600 font-extrabold text-sm uppercase tracking-wider">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" /> {t("empresaWarranty")}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICACIONES ── */}
      <section id="certificaciones" className="py-24 bg-navy-950 text-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold mb-12">{t("empresaCertTitle")}</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <a
              href="/certificados/PRODELEC-SRL-ISO-9001-2015.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-44 h-44 rounded-3xl bg-white/5 border border-white/10 hover:border-electric/80 hover:bg-white/10 flex items-center justify-center flex-col gap-2.5 backdrop-blur-md transition-all shadow-2xl group cursor-pointer"
              title="Ver Certificado Oficial ISO 9001:2015"
            >
              <ShieldCheck className="h-10 w-10 text-electric group-hover:scale-110 transition-transform" />
              <span className="text-base font-bold font-mono text-white">ISO 9001:2015</span>
              <span className="text-[10px] text-electric uppercase font-bold tracking-wider flex items-center gap-1 group-hover:underline">
                Descargar PDF <ExternalLink className="h-3 w-3" />
              </span>
            </a>
            <div className="w-44 h-44 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center flex-col gap-2.5 backdrop-blur-md hover:border-electric transition-colors shadow-2xl">
              <ShieldCheck className="h-10 w-10 text-electric" />
              <span className="text-base font-bold font-mono text-white">NORMA IRAM</span>
              <span className="text-[10px] text-slate-400 uppercase font-medium">Estándar Industrial</span>
            </div>
            <div className="w-44 h-44 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center flex-col gap-2.5 backdrop-blur-md hover:border-electric transition-colors shadow-2xl">
              <ShieldCheck className="h-10 w-10 text-electric" />
              <span className="text-base font-bold font-mono text-white">AGUA POTABLE</span>
              <span className="text-[10px] text-slate-400 uppercase font-medium">Uso Sanitario</span>
            </div>
          </div>

          {/* Tarjeta Destacada del Certificado Oficial ISO 9001:2015 de PRODELEC S.R.L. */}
          <div className="mt-12 max-w-2xl mx-auto bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-left flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-electric/50 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-lg text-white">
                <FileCheck className="h-8 w-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                  Certificación Oficial OAA
                </div>
                <h3 className="text-lg font-heading font-extrabold text-white">
                  PRODELEC S.R.L. — ISO 9001:2015
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Certificado AR-O241697 v01. Sistema de Gestión de la Calidad para diseño y fabricación de piezas técnicas.
                </p>
              </div>
            </div>

            <a
              href="/certificados/PRODELEC-SRL-ISO-9001-2015.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-electric hover:bg-white text-navy-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-electric/20 shrink-0"
            >
              <Download className="h-4 w-4" />
              Descargar PDF
            </a>
          </div>

          <div className="mt-16">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-primary-500 to-electric text-navy-950 font-extrabold text-base uppercase tracking-wider shadow-xl shadow-electric/20 hover:scale-105 transition-all"
            >
              {t("empresaConsult")} <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
