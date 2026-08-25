"use client";

import { HeroCarousel } from "@/components/novedades/HeroCarousel";
import { ProductSlider } from "@/components/novedades/ProductSlider";
import { NewsTimeline } from "@/components/novedades/NewsTimeline";
import { DocumentCards } from "@/components/novedades/DocumentCards";
import { AnimatedStats } from "@/components/novedades/AnimatedStats";
import { NewsletterCTA } from "@/components/novedades/NewsletterCTA";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n/translations";

export default function NovedadesPage() {
  const language = useStore(state => state.language);
  const t = useTranslation(language);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pt-[80px] font-sans">
      {/* 1. Hero / Featured News Carousel */}
      <HeroCarousel />

      {/* 2. Estadísticas Animadas (Numbers) */}
      <AnimatedStats />

      {/* 3. Nuevos Lanzamientos (Product Slider Horizontal) */}
      <ProductSlider 
        title={t("newsLaunches")} 
        subtitle={t("newsLaunchesSub") || "Descubrí la última tecnología en uniones y accesorios incorporada a nuestro catálogo."}
        filterByNew={true}
      />

      {/* 4. Descargas de Catálogos (Document Cards) */}
      <DocumentCards />

      {/* 5. Lo Más Visto (Product Slider Horizontal) */}
      <ProductSlider 
        title={t("newsMostViewed") || "Lo más visto"} 
        subtitle={t("newsMostViewedSub") || "Los componentes preferidos por los profesionales y empresas del sector."}
        filterByViews={true}
      />

      {/* 6. Timeline de Novedades */}
      <NewsTimeline />

      {/* 7. Newsletter CTA */}
      <NewsletterCTA />
    </div>
  );
}
