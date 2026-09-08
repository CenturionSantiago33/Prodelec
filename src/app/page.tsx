"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, ChevronLeft, ChevronRight, ShieldCheck,
  Factory, Award, Truck, MapPin, Phone
} from "lucide-react";
import { categories, products } from "@/data/mock";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n/translations";

// ─── Slides ──────────────────────────────────────────────────
const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop",
    label: "Fabricación Nacional",
  },
  {
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop",
    label: "Ingeniería Industrial",
  },
  {
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop",
    label: "Infraestructura Hidráulica",
  },
];

// ─── Clientes ────────────────────────────────────────────────
const CLIENTS = [
  { name: "Aguas Mendocinas",  abbr: "AM"   },
  { name: "AySA",              abbr: "AySA" },
  { name: "ABSA",              abbr: "ABSA" },
  { name: "Obras Sanitarias",  abbr: "OSN"  },
  { name: "Aguas Cordobesas",  abbr: "AC"   },
  { name: "Sabesp",            abbr: "SBP"  },
  { name: "ASSA",              abbr: "ASSA" },
  { name: "EPAS Neuquén",      abbr: "EPAS" },
];

// ─── Países ──────────────────────────────────────────────────
const COUNTRIES = [
  { flag: "🇦🇷", name: "Argentina" },
  { flag: "🇧🇷", name: "Brasil"    },
  { flag: "🇺🇾", name: "Uruguay"   },
  { flag: "🇨🇱", name: "Chile"     },
  { flag: "🇧🇴", name: "Bolivia"   },
];

// ─── Noticias ────────────────────────────────────────────────
const NOTICIAS = [
  {
    id: 1,
    category: "Innovación",
    date: "Junio 2025",
    title: "Nueva línea de abrazaderas homologadas para redes de alta presión",
    excerpt:
      "Desarrollamos una nueva generación de abrazaderas de derivación con homologación extendida para presiones de trabajo superiores a 16 bar en redes de agua potable.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    category: "Producción",
    date: "Mayo 2025",
    title: "Ampliación de capacidad productiva en Florencio Varela",
    excerpt: "Nueva línea de inyección incorporada para responder a la demanda creciente del mercado regional.",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    category: "Exportación",
    date: "Abril 2025",
    title: "Prodelec consolida su presencia en Brasil y Uruguay",
    excerpt: "Acuerdos comerciales con operadores de infraestructura hídrica en Sudamérica.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop",
  },
];

// ─── Ventajas ─────────────────────────────────────────────────
const VENTAJAS = [
  {
    icon: ShieldCheck,
    num: "ISO",
    label: "Calidad Homologada",
    desc: "Certificación ISO 9001:2015. Productos aprobados por entes reguladores de Argentina, Brasil y Uruguay.",
  },
  {
    icon: Factory,
    num: "24/7",
    label: "Planta Propia",
    desc: "Capacidad productiva continua en planta propia en el Parque Industrial Good Park, Florencio Varela.",
  },
  {
    icon: Award,
    num: "100%",
    label: "Matricería Propia",
    desc: "Diseño y fabricación de matrices y moldes en nuestras instalaciones. Control total del proceso.",
  },
  {
    icon: Truck,
    num: "∞",
    label: "Stock Permanente",
    desc: "Disponibilidad inmediata de los principales productos del catálogo. Logística a todo el país.",
  },
];

// ─── Reveal hook ─────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ─── Component ────────────────────────────────────────────────
export default function Home() {
  const language = useStore(state => state.language);
  const t = useTranslation(language);

  const newProducts = products.filter(p => p.isNew).slice(0, 6);

  const [slideIndex, setSlideIndex] = useState(0);
  const nextSlide = () => setSlideIndex(i => (i + 1) % SLIDES.length);
  const prevSlide = () => setSlideIndex(i => (i - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, []);

  // Reveal refs
  const revealStats    = useReveal();
  const revealEmpresa  = useReveal();
  const revealVentajas = useReveal();
  const revealProd     = useReveal();
  const revealClientes = useReveal();
  const revealNoticias = useReveal();
  const revealPaises   = useReveal();

  return (
    <div className="flex flex-col min-h-screen">

      {/* ════════════════════════════════════════════════════
          1. HERO — Fotografía industrial full-viewport
      ════════════════════════════════════════════════════ */}
      <section
        className="relative w-full overflow-hidden bg-navy-950"
        style={{ minHeight: "100dvh", maxHeight: "960px" }}
      >
        {/* Imagen de fondo con transición */}
        {SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: idx === slideIndex ? 1 : 0 }}
            aria-hidden={idx !== slideIndex}
          >
            <img
              src={slide.image}
              alt={slide.label}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}

        {/* Overlay oscuro industrial */}
        <div className="hero-overlay absolute inset-0" />

        {/* Borde inferior horizontal — reemplaza olas */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary-600" />

        {/* Contenido */}
        <div
          className="relative z-10 flex items-center container-corp w-full"
          style={{ minHeight: "inherit", paddingTop: "96px", paddingBottom: "80px" }}
        >
          <div className="max-w-3xl">

            {/* Label industrial */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="inline-block w-8 h-[2px] bg-accent-400" />
              <span className="industrial-label">
                Producción Nacional · Desde 1986
              </span>
            </motion.div>

            {/* H1 — Grande, potente, sin glow */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-heading font-black text-white mb-6 leading-[1.0]"
              style={{ fontSize: "clamp(48px, 7vw, 96px)", letterSpacing: "-0.03em" }}
            >
              PRODUCCIÓN<br />
              <span style={{ color: "#4a9de0" }}>INDUSTRIAL</span><br />
              ARGENTINA
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="text-gray-200 mb-3 font-medium leading-snug"
              style={{ fontSize: "clamp(18px, 2.2vw, 24px)" }}
            >
              Soluciones para redes de agua y saneamiento
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="text-gray-400 mb-10 max-w-lg"
              style={{ fontSize: "clamp(14px, 1.4vw, 16px)", lineHeight: "1.65" }}
            >
              39 años desarrollando productos y soluciones de ingeniería
              para infraestructura hidráulica en Argentina y Latinoamérica.
            </motion.p>

            {/* CTAs — rectangulares, sin pills */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/empresa" className="btn-primary-corp">
                Conocer Prodelec
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/categorias" className="btn-outline-corp">
                Ver Catálogo
              </Link>
            </motion.div>

          </div>
        </div>

        {/* Slide indicator + controles */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-center gap-4">
          <button
            onClick={prevSlide}
            className="flex items-center justify-center w-9 h-9 border border-white/20 text-white/60 hover:text-white hover:border-white/50 transition-all"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className={`h-[2px] transition-all duration-300 ${
                  i === slideIndex ? "w-8 bg-white" : "w-4 bg-white/30"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="flex items-center justify-center w-9 h-9 border border-white/20 text-white/60 hover:text-white hover:border-white/50 transition-all"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          2. STATS BAR — Indicadores corporativos
      ════════════════════════════════════════════════════ */}
      <div
        ref={revealStats}
        className="reveal bg-primary-700"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="container-corp">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { num: "39+", label: "Años de Experiencia"   },
              { num: "24/7", label: "Capacidad Productiva" },
              { num: "ISO",  label: "9001:2015 Certificado"},
              { num: "200+", label: "Productos en Catálogo"},
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center py-8 px-4 text-center"
              >
                <span
                  className="font-heading font-black text-white leading-none mb-1"
                  style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
                >
                  {stat.num}
                </span>
                <span className="font-heading font-bold text-primary-400 uppercase tracking-widest"
                      style={{ fontSize: "10px" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          3. EMPRESA — Split asimétrico
      ════════════════════════════════════════════════════ */}
      <section ref={revealEmpresa} className="reveal bg-white" style={{ overflow: "hidden" }}>
        <div className="lg:flex">

          {/* Fotografía — 55% ancho en desktop, full en mobile */}
          <div
            className="relative w-full lg:w-[55%] shrink-0"
            style={{ minHeight: "480px", maxHeight: "640px" }}
          >
            <img
              src="/productos/Linea Prodelec SRL-1.jpg.jpeg"
              alt="Línea de producción Prodelec"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay lateral para conectar con texto */}
            <div className="hidden lg:block absolute inset-y-0 right-0 w-24"
                 style={{ background: "linear-gradient(to right, transparent, white)" }} />
          </div>

          {/* Contenido — 45% */}
          <div className="flex flex-col justify-center px-8 py-16 lg:px-16 lg:py-20 lg:w-[45%]">

            <span className="industrial-label mb-3">Nuestra Empresa</span>
            <h2
              className="font-heading font-black text-navy-950 mb-5"
              style={{ fontSize: "clamp(32px, 3.5vw, 52px)", letterSpacing: "-0.025em" }}
            >
              39 AÑOS DE<br />EXPERIENCIA
            </h2>
            <span className="section-rule mb-6" />
            <p className="text-gray-600 leading-relaxed mb-8"
               style={{ fontSize: "clamp(14px, 1.2vw, 16px)" }}>
              Somos una empresa argentina dedicada al diseño, fabricación y comercialización
              de soluciones de ingeniería para redes de agua potable, saneamiento y gas.
              Con planta propia en el Parque Industrial Good Park (Florencio Varela),
              producimos con estándares de calidad certificados ISO 9001:2015.
            </p>

            {/* Indicadores inline */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { num: "1986",  label: "Año de fundación"     },
                { num: "24/7",  label: "Capacidad productiva" },
                { num: "ISO",   label: "Certificación calidad"},
                { num: "5",     label: "Países de exportación"},
              ].map((s, i) => (
                <div key={i} className="flex flex-col gap-0.5"
                     style={{ borderLeft: "2px solid #1a65b5", paddingLeft: "12px" }}>
                  <span className="font-heading font-black text-navy-950 leading-none"
                        style={{ fontSize: "clamp(24px, 2.5vw, 36px)" }}>
                    {s.num}
                  </span>
                  <span className="font-heading font-bold text-gray-400 uppercase tracking-widest"
                        style={{ fontSize: "10px" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <Link href="/empresa" className="btn-primary-corp self-start">
              Conocer Prodelec <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          4. VENTAJAS COMPETITIVAS — Layout editorial
      ════════════════════════════════════════════════════ */}
      <section
        ref={revealVentajas}
        className="reveal bg-navy-950 py-20 lg:py-28"
        style={{ borderTop: "3px solid #1a65b5" }}
      >
        <div className="container-corp">

          {/* Header */}
          <div className="mb-16 lg:flex lg:items-end lg:justify-between">
            <div>
              <span className="industrial-label mb-3 block">Ventaja Competitiva</span>
              <h2
                className="font-heading font-black text-white"
                style={{ fontSize: "clamp(32px, 4vw, 56px)", letterSpacing: "-0.025em" }}
              >
                ¿POR QUÉ ELEGIR<br />
                <span style={{ color: "#4a9de0" }}>PRODELEC?</span>
              </h2>
            </div>
            <p className="text-gray-400 max-w-sm mt-4 lg:mt-0 text-sm leading-relaxed">
              Cuatro décadas de experiencia en soluciones para infraestructura hidráulica
              respaldan cada producto que fabricamos.
            </p>
          </div>

          {/* Grid asimétrico de ventajas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-navy-800">
            {VENTAJAS.map((v, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-navy-950 p-10 lg:p-12 group hover:bg-navy-900 transition-colors"
              >
                {/* Número / indicador grande */}
                <div
                  className="font-heading font-black text-primary-600 mb-4 leading-none group-hover:text-primary-500 transition-colors"
                  style={{ fontSize: "clamp(48px, 5vw, 72px)" }}
                >
                  {v.num}
                </div>
                <h3
                  className="font-heading font-bold text-white uppercase tracking-wide mb-3"
                  style={{ fontSize: "clamp(16px, 1.5vw, 20px)" }}
                >
                  {v.label}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          5. PRODUCTOS DESTACADOS
      ════════════════════════════════════════════════════ */}
      <section ref={revealProd} className="reveal bg-gray-50 py-20 lg:py-28">
        <div className="container-corp">

          {/* Header sección */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <span className="industrial-label mb-3 block">Catálogo Industrial</span>
              <h2
                className="font-heading font-black text-navy-950"
                style={{ fontSize: "clamp(28px, 3.5vw, 48px)", letterSpacing: "-0.025em" }}
              >
                PRODUCTOS DESTACADOS
              </h2>
              <span className="section-rule" />
            </div>
            <Link
              href="/categorias"
              className="mt-6 md:mt-0 flex items-center gap-2 font-heading font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider text-sm transition-colors"
            >
              Ver Catálogo Completo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Grilla productos — 3 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="product-card"
              >
                <Link
                  href={`/productos/${product.slug}`}
                  className="flex flex-col bg-white border border-gray-200 overflow-hidden group hover:border-primary-500 transition-colors h-full"
                >
                  {/* Imagen */}
                  <div className="relative bg-gray-100 overflow-hidden" style={{ height: "280px" }}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Categoría label */}
                    <div className="absolute top-0 left-0 bg-primary-700 text-white px-3 py-1">
                      <span className="font-heading font-bold uppercase tracking-wider"
                            style={{ fontSize: "10px" }}>
                        {categories.find(c => c.id === product.categoryId)?.name}
                      </span>
                    </div>
                    {product.homologado && (
                      <div className="absolute bottom-0 left-0 bg-navy-950 text-accent-400 px-3 py-1">
                        <span className="font-heading font-bold uppercase tracking-wider"
                              style={{ fontSize: "10px" }}>
                          Homologado
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6 flex-1 flex flex-col"
                       style={{ borderTop: "2px solid #f1f3f5" }}>
                    <h3
                      className="font-heading font-bold text-navy-950 mb-2 leading-tight group-hover:text-primary-600 transition-colors"
                      style={{ fontSize: "clamp(15px, 1.3vw, 18px)" }}
                    >
                      {product.name}
                    </h3>
                    <p className="text-gray-400 font-mono text-xs mb-3">
                      COD: {product.code}
                    </p>
                    {product.description && (
                      <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 font-heading font-bold text-primary-600 uppercase tracking-wider mt-auto"
                         style={{ fontSize: "11px" }}>
                      Ver detalles <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA catálogo completo */}
          <div className="mt-12 text-center"
               style={{ borderTop: "1px solid #e9ecef", paddingTop: "40px" }}>
            <p className="text-gray-500 text-sm mb-5">
              Más de 200 productos técnicos para infraestructura hidráulica y sanitaria
            </p>
            <Link href="/categorias" className="btn-primary-corp inline-flex">
              Ver Catálogo Completo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          6. CLIENTES / PARTNERS — Grilla limpia
      ════════════════════════════════════════════════════ */}
      <section
        ref={revealClientes}
        className="reveal py-16 lg:py-20"
        style={{ background: "#f1f3f5", borderTop: "1px solid #dee2e6" }}
      >
        <div className="container-corp">
          <div className="mb-10 text-center">
            <span className="industrial-label mb-3 block">Partners Estratégicos</span>
            <h2
              className="font-heading font-black text-navy-950 mb-3"
              style={{ fontSize: "clamp(24px, 3vw, 40px)" }}
            >
              NUESTROS CLIENTES
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Empresas y organismos de servicios de agua que confían en nuestras soluciones
              para sus redes de distribución e infraestructura.
            </p>
          </div>

          {/* Grilla logos — sin cards flotantes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-300">
            {CLIENTS.map((client, i) => (
              <div
                key={i}
                className="bg-white flex flex-col items-center justify-center py-8 px-4 text-center
                           opacity-60 hover:opacity-100 transition-opacity duration-300"
              >
                {/* Abbr como placeholder de logo */}
                <span
                  className="font-heading font-black text-navy-950 mb-1"
                  style={{ fontSize: "clamp(20px, 2vw, 28px)" }}
                >
                  {client.abbr}
                </span>
                <span className="text-gray-400 font-bold uppercase tracking-widest"
                      style={{ fontSize: "10px" }}>
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          7. NOVEDADES — Editorial con noticia principal
      ════════════════════════════════════════════════════ */}
      <section ref={revealNoticias} className="reveal bg-white py-20 lg:py-28">
        <div className="container-corp">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <span className="industrial-label mb-3 block">Novedades Corporativas</span>
              <h2
                className="font-heading font-black text-navy-950"
                style={{ fontSize: "clamp(28px, 3.5vw, 48px)", letterSpacing: "-0.025em" }}
              >
                NOTICIAS
              </h2>
              <span className="section-rule" />
            </div>
            <Link
              href="/novedades"
              className="mt-6 md:mt-0 flex items-center gap-2 font-heading font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider text-sm transition-colors"
            >
              Ver todas las noticias <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Layout editorial: noticia principal + secundarias */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">

            {/* Noticia principal — 7 cols */}
            <motion.article
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 group"
            >
              <Link href="/novedades" className="block">
                <div className="relative overflow-hidden" style={{ height: "clamp(280px, 35vw, 440px)" }}>
                  <img
                    src={NOTICIAS[0].image}
                    alt={NOTICIAS[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0"
                       style={{ background: "linear-gradient(to top, rgba(6,21,32,0.85) 0%, transparent 50%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-primary-600 text-white px-2 py-0.5 font-heading font-bold uppercase tracking-widest"
                            style={{ fontSize: "10px" }}>
                        {NOTICIAS[0].category}
                      </span>
                      <span className="text-gray-300 font-bold uppercase tracking-widest"
                            style={{ fontSize: "10px" }}>
                        {NOTICIAS[0].date}
                      </span>
                    </div>
                    <h3
                      className="font-heading font-black text-white group-hover:text-accent-400 transition-colors"
                      style={{ fontSize: "clamp(18px, 2vw, 26px)", letterSpacing: "-0.02em" }}
                    >
                      {NOTICIAS[0].title}
                    </h3>
                  </div>
                </div>
                <div className="py-5 border-b border-gray-200">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{NOTICIAS[0].excerpt}</p>
                  <span className="font-heading font-bold text-primary-600 uppercase tracking-wider text-xs
                                   flex items-center gap-1.5 hover:gap-2 transition-all">
                    Leer artículo <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.article>

            {/* Noticias secundarias — 5 cols */}
            <div className="lg:col-span-5 mt-8 lg:mt-0 flex flex-col justify-between gap-px bg-gray-200">
              {NOTICIAS.slice(1).map((news, i) => (
                <motion.article
                  key={news.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white group"
                >
                  <Link href="/novedades" className="flex gap-0 h-full">
                    <div className="relative shrink-0 overflow-hidden" style={{ width: "130px", minHeight: "130px" }}>
                      <img
                        src={news.image}
                        alt={news.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-5 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-primary-700 text-white px-2 py-0.5 font-heading font-bold uppercase tracking-widest"
                              style={{ fontSize: "9px" }}>
                          {news.category}
                        </span>
                        <span className="text-gray-400 font-bold uppercase"
                              style={{ fontSize: "9px" }}>
                          {news.date}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-navy-950 text-sm leading-tight mb-2
                                     group-hover:text-primary-600 transition-colors">
                        {news.title}
                      </h3>
                      <span className="font-heading font-bold text-primary-600 uppercase tracking-wider flex items-center gap-1"
                            style={{ fontSize: "10px" }}>
                        Leer <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          8. PRESENCIA INTERNACIONAL — Sección potente
      ════════════════════════════════════════════════════ */}
      <section
        ref={revealPaises}
        className="reveal py-20 lg:py-28 bg-navy-950"
        style={{ borderTop: "3px solid #1a65b5" }}
      >
        <div className="container-corp">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">

            {/* Copy — 5 cols */}
            <div className="lg:col-span-5 mb-12 lg:mb-0">
              <span className="industrial-label mb-4 block">Presencia Internacional</span>
              <h2
                className="font-heading font-black text-white mb-4"
                style={{ fontSize: "clamp(30px, 4vw, 52px)", letterSpacing: "-0.025em" }}
              >
                EXPORTAMOS<br />
                DESDE<br />
                <span style={{ color: "#4a9de0" }}>ARGENTINA</span>
              </h2>
              <span className="block w-12 h-[2px] bg-primary-600 mb-6" />
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8">
                Nuestras soluciones industriales llegan a operadores de infraestructura hídrica
                en toda América Latina. Calidad certificada, diseño argentino, escala regional.
              </p>
              <Link href="/contacto" className="btn-primary-corp inline-flex">
                Contactar Exportaciones <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Países — 7 cols */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-px bg-navy-800">
                {COUNTRIES.map((country, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-navy-950 flex flex-col items-center justify-center py-8 px-4 text-center
                               hover:bg-navy-900 transition-colors group"
                  >
                    <span className="text-4xl mb-3 group-hover:scale-110 transition-transform block">
                      {country.flag}
                    </span>
                    <span
                      className="font-heading font-bold text-white uppercase tracking-widest"
                      style={{ fontSize: "11px" }}
                    >
                      {country.name}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Nota corporativa */}
              <div className="mt-6 p-5 bg-navy-900 border-l-[3px] border-primary-600">
                <p className="text-gray-400 text-sm leading-relaxed">
                  <span className="font-heading font-bold text-white">Somos proveedores estratégicos</span> de
                  entes prestatarios de agua potable y empresas constructoras de infraestructura hidráulica
                  en la región latinoamericana.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          9. CTA FINAL — Contacto corporativo
      ════════════════════════════════════════════════════ */}
      <section
        className="bg-primary-700 py-14"
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="container-corp">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2
                className="font-heading font-black text-white mb-2"
                style={{ fontSize: "clamp(24px, 3vw, 40px)", letterSpacing: "-0.02em" }}
              >
                ¿NECESITÁS SOLUCIONES PARA TU RED?
              </h2>
              <p className="text-primary-400 text-sm">
                Asesoramiento técnico · Cotizaciones · Especificaciones de producto
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link href="/contacto" className="btn-outline-corp">
                Solicitar Cotización
              </Link>
              <Link href="/categorias"
                    className="btn-primary-corp"
                    style={{ background: "white", color: "#124d8f", borderColor: "white" }}>
                Ver Catálogo
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
