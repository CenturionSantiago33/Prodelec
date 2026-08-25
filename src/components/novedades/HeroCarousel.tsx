"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ArrowRight, Download, FileText, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const HERO_SLIDES = [
  {
    id: 1,
    title: "Nueva Línea de Cajas Base Abierta",
    desc: "Diseñadas para facilitar la instalación y soportar altas presiones. Certificadas y homologadas para obras públicas de máxima exigencia.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    badge: "🔥 Lanzamiento",
    btnText: "Conocer más",
    badgeColor: "bg-orange-500",
  },
  {
    id: 2,
    title: "Catálogo Técnico 2026",
    desc: "Descargá nuestra última versión con todas las especificaciones, dimensiones y materiales de nuestras 7 familias de productos plásticos.",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop",
    badge: "📄 Catálogo",
    btnText: "Descargar PDF",
    badgeColor: "bg-primary-500",
  },
  {
    id: 3,
    title: "Tecnología de Inyección Robótica",
    desc: "Incorporamos nueva maquinaria para triplicar la producción de abrazaderas de reparación, garantizando stock permanente a nivel nacional.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop",
    badge: "⭐ Destacado",
    btnText: "Ver novedades",
    badgeColor: "bg-accent-500",
  },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-navy-950">
      {/* Carrusel */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {HERO_SLIDES.map((slide, index) => (
            <div className="relative flex-[0_0_100%] min-w-0 h-full" key={slide.id}>
              {/* Imagen de fondo con overlay oscuro elegante */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-900/80 to-transparent" />
              <div className="absolute inset-0 bg-primary-600/10 mix-blend-multiply" />

              <div className="absolute inset-0 flex items-center">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
                  <div className="max-w-2xl">
                    <motion.div
                      key={`anim-${selectedIndex}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: index === selectedIndex ? 1 : 0, y: index === selectedIndex ? 0 : 30 }}
                      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                      <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider mb-6 shadow-lg ${slide.badgeColor}`}>
                        {slide.badge}
                      </div>
                      <h1 className="text-5xl md:text-6xl font-heading font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                        {slide.title}
                      </h1>
                      <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-xl font-medium">
                        {slide.desc}
                      </p>
                      <Button
                        size="lg"
                        className="h-14 px-8 text-base bg-white text-navy-950 hover:bg-gray-100 hover:scale-105 transition-all shadow-xl font-bold"
                      >
                        {slide.btnText} <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controles: Flechas minimalistas */}
      <div className="absolute bottom-12 right-6 md:right-12 flex items-center gap-4 z-20">
        <button
          onClick={scrollPrev}
          className="w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-navy-950 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={scrollNext}
          className="w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-navy-950 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Indicadores inferiores */}
      <div className="absolute bottom-12 left-6 md:left-12 flex gap-2 z-20">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === selectedIndex ? "w-10 bg-white" : "w-4 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
      
      {/* Gradiente inferior para fusionar con la siguiente sección */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent z-10 pointer-events-none" />
    </div>
  );
}
