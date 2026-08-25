"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, ShieldCheck, Factory, Truck, Award,
  ChevronDown, CheckCircle2, ChevronLeft, ChevronRight,
  Globe, Zap, FileText, CalendarDays, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories, products, getNewProducts } from "@/data/mock";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n/translations";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// ─── Slider Data ─────────────────────────────────────────────────────────────
const getSlides = (t: any) => [
  {
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop", // Placeholder Industrial
    title1: t("slide1Title1"),
    title2: t("slide1Title2"),
    desc: t("slide1Desc"),
  },
  {
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop", // Placeholder Tubos/Planta
    title1: t("slide2Title1"),
    title2: t("slide2Title2"),
    desc: t("slide2Desc"),
  },
  {
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop", // Placeholder Infraestructura
    title1: t("slide3Title1"),
    title2: t("slide3Title2"),
    desc: t("slide3Desc"),
  }
];

// ─── Noticias Data ───────────────────────────────────────────────────────────
const getNoticias = (t: any) => [
  {
    id: 1,
    title: t("news1Title"),
    date: t("news1Date"),
    category: t("news1Cat"),
    image: "https://images.unsplash.com/photo-1610056494052-6a4f8b030e4b?q=80&w=1000&auto=format&fit=crop", // Placeholder caja
    excerpt: t("news1Desc")
  },
  {
    id: 2,
    title: t("news2Title"),
    date: t("news2Date"),
    category: t("news2Cat"),
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop", // Placeholder maquina
    excerpt: t("news2Desc")
  },
  {
    id: 3,
    title: t("news3Title"),
    date: t("news3Date"),
    category: t("news3Cat"),
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1000&auto=format&fit=crop", // Placeholder herramientas
    excerpt: t("news3Desc")
  }
];

// ─── Client logos (placeholders del sector) ─────────────────────────────────
const CLIENTS = [
  { name: "Aguas Mendocinas", abbr: "AM", color: "#2563eb" },
  { name: "AySA", abbr: "AySA", color: "#1d70d8" },
  { name: "ABSA", abbr: "ABSA", color: "#059669" },
  { name: "Obras Sanitarias", abbr: "OSN", color: "#7c3aed" },
  { name: "Aguas Cordobesas", abbr: "ACA", color: "#d97706" },
  { name: "Sabesp", abbr: "SBP", color: "#0891b2" },
  { name: "ASSA", abbr: "ASSA", color: "#dc2626" },
  { name: "EPAS Neuquén", abbr: "EPAS", color: "#0d9488" },
];

// ─── Countries ──────────────────────────────────────────────────────────────
const COUNTRIES = [
  { flagUrl: "https://flagcdn.com/w80/ar.png", code: "AR", name: "Argentina" },
  { flagUrl: "https://flagcdn.com/w80/br.png", code: "BR", name: "Brasil" },
  { flagUrl: "https://flagcdn.com/w80/uy.png", code: "UY", name: "Uruguay" },
  { flagUrl: "https://flagcdn.com/w80/cl.png", code: "CL", name: "Chile" },
  { flagUrl: "https://flagcdn.com/w80/bo.png", code: "BO", name: "Bolivia" },
];

export default function Home() {
  const language = useStore(state => state.language);
  const t = useTranslation(language);
  const newProducts = products.filter(p => p.isNew);
  const SLIDES = getSlides(t);
  const NOTICIAS = getNoticias(t);

  const [slideIndex, setSlideIndex] = useState(0);

  // Auto-advance main slider
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(i => (i + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [SLIDES.length]);

  const nextSlide = () => setSlideIndex(i => (i + 1) % SLIDES.length);
  const prevSlide = () => setSlideIndex(i => (i - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div className="flex flex-col min-h-screen font-sans">

      {/* ── 1. HERO SLIDER CORPORATIVO CON DOBLE OLA ──────────────────────── */}
      <section className="relative w-full min-h-[580px] h-[calc(100dvh-0px)] max-h-[860px] overflow-hidden bg-navy-950 group">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={slideIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${SLIDES[slideIndex].image})` }}
            />
            {/* Overlays corporativos: Gradiente azul oscuro a transparente */}
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-900/80 to-navy-950/40 lg:to-transparent" />
            <div className="absolute inset-0 bg-primary-600/10 mix-blend-multiply" />

            {/* Text Content - z-20 para estar por encima de las olas (z-10) */}
            <div className="absolute inset-0 flex items-center justify-start pt-[80px] pb-40 z-20">
              <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 w-full">
                {/* ── Layout 2 columnas: texto | botones ── */}
                <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-16">

                  {/* Columna izquierda: Badge + Título + Descripción */}
                  <div className="flex-1 min-w-0">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="inline-flex items-center gap-2 rounded-full bg-electric/10 border border-electric/30 px-3 lg:px-4 py-1.5 text-[10px] lg:text-xs font-extrabold text-electric uppercase tracking-widest mb-4 lg:mb-6 shadow-[0_0_15px_rgba(0,212,255,0.2)]"
                    >
                      <span className="flex h-2 w-2 rounded-full bg-electric animate-pulse shadow-[0_0_8px_#00d4ff]" />
                      {t("slideBadge")}
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold text-white mb-4 lg:mb-6 leading-[1.1] tracking-tight drop-shadow-xl"
                    >
                      {SLIDES[slideIndex].title1} <br className="hidden sm:block" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric to-primary-400 drop-shadow-[0_0_15px_rgba(0,212,255,0.3)]">
                        {SLIDES[slideIndex].title2}
                      </span>
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="text-base sm:text-lg lg:text-xl text-gray-200/90 leading-relaxed font-medium max-w-xl drop-shadow-lg"
                    >
                      {SLIDES[slideIndex].desc}
                    </motion.p>
                  </div>

                  {/* Columna derecha: Botones CTA Apilados */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="w-full lg:w-[320px] flex flex-col gap-4 mt-6 lg:mt-0"
                  >
                    <Link
                      href="/categorias"
                      className="group relative flex items-center justify-between w-full p-4 rounded-xl bg-gradient-to-r from-primary-500 to-electric overflow-hidden shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:shadow-[0_0_40px_rgba(0,212,255,0.5)] transition-all hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative z-10 text-navy-950 font-extrabold uppercase text-sm tracking-widest flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        {t("slideBtn1")}
                      </span>
                      <ArrowRight className="h-5 w-5 text-navy-950 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href="/empresa#certificaciones"
                      className="group relative flex items-center justify-between w-full p-4 rounded-xl bg-navy-950/40 backdrop-blur-md border border-white/10 hover:border-white/30 hover:bg-navy-900/60 transition-all shadow-xl hover:-translate-y-1"
                    >
                      <span className="text-white font-extrabold uppercase text-sm tracking-widest flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-electric group-hover:scale-110 transition-transform" />
                        {t("slideBtn2")}
                      </span>
                      <ArrowRight className="h-5 w-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>

                </div>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

        {/* Slider Controls — Botones circulares glassmorphism, visibles solo al hover */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between z-30 pointer-events-none px-3 lg:px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={prevSlide}
            className="pointer-events-auto flex items-center justify-center w-11 h-11 rounded-full border border-white/20 bg-navy-950/50 backdrop-blur-md text-white/80 hover:text-electric hover:border-electric hover:bg-navy-950/70 hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg shadow-black/30"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="pointer-events-auto flex items-center justify-center w-11 h-11 rounded-full border border-white/20 bg-navy-950/50 backdrop-blur-md text-white/80 hover:text-electric hover:border-electric hover:bg-navy-950/70 hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg shadow-black/30"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Triple Efecto Ola Líquida de Gran Altura (WOW Factor) */}
        <div className="absolute bottom-[-1px] left-0 right-0 overflow-hidden leading-none z-10 h-36 md:h-56 lg:h-64 pointer-events-none">
          {/* Capa 1: Ola Cian Eléctrico con Glow (fondo rápido) */}
          <div className="absolute bottom-0 w-[200%] animate-[wave-x_10s_linear_infinite] h-full opacity-50">
            <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="w-[50%] h-full inline-block fill-electric drop-shadow-[0_-10px_20px_rgba(56,189,248,0.5)]">
              <path d="M0,30 C320,110 640,-10 960,70 C1200,120 1360,40 1440,30 L1440,140 L0,140 Z" />
            </svg>
            <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="w-[50%] h-full inline-block fill-electric drop-shadow-[0_-10px_20px_rgba(56,189,248,0.5)]">
              <path d="M0,30 C320,110 640,-10 960,70 C1200,120 1360,40 1440,30 L1440,140 L0,140 Z" />
            </svg>
          </div>

          {/* Capa 2: Ola Azul Profundo (intermedia) */}
          <div className="absolute bottom-0 w-[200%] animate-[wave-x_15s_linear_infinite] h-[90%] opacity-80">
            <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="w-[50%] h-full inline-block fill-primary-600">
              <path d="M0,70 C360,10 720,100 1080,30 C1260,0 1380,80 1440,70 L1440,140 L0,140 Z" />
            </svg>
            <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="w-[50%] h-full inline-block fill-primary-600">
              <path d="M0,70 C360,10 720,100 1080,30 C1260,0 1380,80 1440,70 L1440,140 L0,140 Z" />
            </svg>
          </div>

          {/* Capa 3: Ola Celeste Agua Principal (frente) - Conecta directamente con la sección celeste */}
          <div className="absolute bottom-0 w-[200%] animate-[wave-x_22s_linear_infinite] h-[80%]">
            <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="w-[50%] h-full inline-block fill-sky-100">
              <path d="M0,50 C400,120 800,10 1150,80 C1300,110 1400,40 1440,50 L1440,140 L0,140 Z" />
            </svg>
            <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="w-[50%] h-full inline-block fill-sky-100">
              <path d="M0,50 C400,120 800,10 1150,80 C1300,110 1400,40 1440,50 L1440,140 L0,140 Z" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── 2. CLIENTES Y PRESTATARIAS (STRIP ANIMADO DEBAJO DEL HERO - MÁS LENTO Y ELEGANTE) ─────────────────────── */}
      <section className="py-14 bg-gradient-to-r from-sky-100/90 via-sky-50 to-sky-100/90 border-b border-sky-200/70 overflow-hidden relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-extrabold uppercase tracking-widest text-sm block mb-3">Partners Estratégicos</span>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-navy-950 mb-4">{t("homeSect1Title")}</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">{t("homeSect1Desc")}</p>
          </div>
        </div>

        <div className="relative overflow-hidden w-full max-w-7xl mx-auto px-4">
          <div className="flex gap-6 animate-[wave-x_60s_linear_infinite] hover:[animation-play-state:paused]" style={{ width: "250%" }}>
            {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
              <div
                key={i}
                className="shrink-0 h-22 w-56 bg-white/90 backdrop-blur-md border border-sky-100 rounded-2xl flex items-center gap-3 px-5 py-3 shadow-md shadow-sky-950/5 hover:shadow-xl hover:border-electric hover:-translate-y-1 transition-all duration-500 group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-xs shadow-md shrink-0 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: client.color }}
                >
                  {client.abbr}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-navy-950 group-hover:text-primary-600 transition-colors leading-tight">
                    {client.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Prestataria Oficial
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Difuminados en bordes para entrada y salida suave */}
          <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-sky-100 via-sky-100/80 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-sky-100 via-sky-100/80 to-transparent pointer-events-none z-10" />
        </div>
      </section>

      {/* ── 3. BENEFICIOS INDUSTRIALES ─────────────────────────────────────── */}
      <section className="py-20 bg-navy-950 relative border-b border-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="text-electric font-extrabold uppercase tracking-widest text-sm mb-3 block">Ventaja Competitiva</span>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-6">
              {t("homeSect2Title")}
            </h2>
            <p className="text-gray-300 text-lg">
              {t("homeSect2Desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: t("homeReason1Title"), desc: t("homeReason1Desc") },
              { icon: Factory, title: t("homeReason2Title"), desc: t("homeReason2Desc") },
              { icon: Award, title: t("homeReason3Title"), desc: t("homeReason3Desc") },
              { icon: Truck, title: t("homeReason4Title"), desc: t("homeReason4Desc") }
            ].map((feature, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="flex flex-col bg-white/5 p-8 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                <feature.icon className="h-10 w-10 text-electric mb-5" />
                <h3 className="text-xl font-heading font-bold text-white mb-3 uppercase">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. PRODUCTOS DESTACADOS ────────────────────────────────────────── */}
      <section className="py-24 bg-sky-50/40 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-950 uppercase mb-2">Productos Destacados</h2>
              <div className="h-1.5 w-20 bg-electric rounded-full" />
            </div>
            <Link href="/productos" className="mt-4 md:mt-0 text-primary-600 font-bold uppercase text-sm hover:text-primary-700 flex items-center group">
              Ver catálogo completo <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newProducts.slice(0, 3).map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={`/productos/${product.slug}`} className="group flex flex-col bg-white border border-sky-100 overflow-hidden hover:border-primary-500 hover:shadow-xl transition-all h-full rounded-2xl">
                  <div className="relative h-64 bg-sky-50/50 flex items-center justify-center p-6 border-b border-sky-100">
                    <img src={product.images[0]} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" />
                    {product.homologado && (
                      <span className="absolute top-4 left-4 bg-green-600 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider rounded-md shadow-sm">
                        Homologado
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">{categories.find(c => c.id === product.categoryId)?.name}</span>
                    <h3 className="text-lg font-bold text-navy-950 mb-2 leading-tight">{product.name}</h3>
                    <p className="text-sm text-gray-500 font-mono mb-4">SKU: {product.code}</p>
                    <div className="mt-auto">
                      <span className="text-primary-600 font-bold uppercase text-xs tracking-wider flex items-center group-hover:text-primary-800 transition-colors">
                        {t("newsReadMore")} <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* ── 6. SECCIÓN NOTICIAS / BLOG ───────────────────────────────────────── */}
      <section className="py-24 bg-gray-50 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-950 uppercase mb-2">Noticias y Novedades</h2>
              <div className="h-1 w-16 bg-electric" />
            </div>
            <Link href="/novedades" className="mt-4 md:mt-0 text-primary-600 font-bold uppercase text-sm hover:text-primary-700 flex items-center group">
              Ver todas las noticias <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {NOTICIAS.map((news, i) => (
              <motion.article key={news.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute top-4 left-4 bg-primary-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider z-10 rounded-sm">
                    {news.category}
                  </div>
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center text-xs text-gray-500 font-bold uppercase mb-3">
                    <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary-600" />
                    {news.date}
                  </div>
                  <h3 className="text-xl font-heading font-bold text-navy-950 mb-3 group-hover:text-primary-600 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-1">
                    {news.excerpt}
                  </p>
                  <Link href="/novedades" className="inline-flex items-center text-sm font-bold text-primary-600 uppercase">
                    Leer artículo <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. PAÍSES E INTERNACIONALIZACIÓN ───────────────────────────────── */}
      <section className="py-24 bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-navy-950 uppercase mb-4">{t("homeCountriesTitle")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("homeCountriesDesc")}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {COUNTRIES.map((country) => (
              <div key={country.name} className="flex flex-col items-center gap-3 p-5 bg-sky-50/50 rounded-2xl border border-sky-100 hover:border-primary-500 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-12 h-8 rounded-md overflow-hidden border border-gray-200 shadow-sm group-hover:scale-110 transition-transform">
                  <img src={country.flagUrl} alt={`Bandera de ${country.name}`} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-extrabold text-navy-950 uppercase text-center tracking-wider">{country.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
