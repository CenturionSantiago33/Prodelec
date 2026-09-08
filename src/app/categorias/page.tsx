"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { categories as rawCategories, products as rawProducts } from "@/data/mock";
import { Product, Category } from "@/types";
import { useStore } from "@/store/useStore";
import { useTranslation, getTranslatedCategory, getTranslatedProduct } from "@/i18n/translations";
import { ProductCard } from "@/components/product/ProductCard";
import {
  ShieldCheck, Download, BookOpen, Search, X,
  SlidersHorizontal, ArrowRight, Grid,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CategoriasPage() {
  const language = useStore((state) => state.language);
  const t = useTranslation(language);

  const categories = useMemo(() => {
    return rawCategories.map((c) => getTranslatedCategory(c, language));
  }, [language]);

  const allProducts = useMemo(() => {
    return rawProducts.map((p) => getTranslatedProduct(p, language));
  }, [language]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesCategory =
        selectedCategory === "all" || p.categoryId === selectedCategory;
      const matchesSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, allProducts]);

  const productCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    categories.forEach((cat) => {
      map[cat.id] = allProducts.filter((p) => p.categoryId === cat.id).length;
    });
    return map;
  }, [categories, allProducts]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800" style={{ paddingTop: "80px" }}>

      {/* ── HERO HEADER ─────────────────────────────────────────────── */}
      <section className="bg-navy-950 text-white" style={{ borderBottom: "3px solid #1a65b5" }}>
        <div className="container-corp py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

            <div className="max-w-2xl">
              <span className="industrial-label mb-4 block">
                Catálogo Técnico Industrial
              </span>
              <h1
                className="font-heading font-black text-white mb-4 leading-none"
                style={{ fontSize: "clamp(32px, 4.5vw, 60px)", letterSpacing: "-0.025em" }}
              >
                {t("catFamilyTitle")}
              </h1>
              <p className="text-gray-400 mb-6 max-w-lg" style={{ fontSize: "15px", lineHeight: "1.65" }}>
                {t("catSubtitle")}
              </p>

              {/* Stats — sin pills, sin borders decorativos */}
              <div className="flex flex-wrap gap-8">
                <div style={{ borderLeft: "2px solid #1a65b5", paddingLeft: "12px" }}>
                  <span className="font-heading font-black text-white text-2xl block leading-none">
                    {categories.length}
                  </span>
                  <span className="industrial-label" style={{ color: "#4a9de0" }}>
                    {t("catFamilies")}
                  </span>
                </div>
                <div style={{ borderLeft: "2px solid #1a65b5", paddingLeft: "12px" }}>
                  <span className="font-heading font-black text-white text-2xl block leading-none">
                    +{allProducts.length}
                  </span>
                  <span className="industrial-label" style={{ color: "#4a9de0" }}>
                    {t("catModels")}
                  </span>
                </div>
                <div style={{ borderLeft: "2px solid #1a65b5", paddingLeft: "12px" }}>
                  <span className="font-heading font-black text-white text-2xl block leading-none">
                    ISO
                  </span>
                  <span className="industrial-label" style={{ color: "#4a9de0" }}>
                    9001 / IRAM
                  </span>
                </div>
              </div>
            </div>

            {/* PDF Downloads — botones rectangulares */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <a
                href="/pdf/catalogo"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-corp text-sm py-3 px-6 justify-center"
              >
                <BookOpen className="h-4 w-4 shrink-0" />
                {t("catPdfCatalog")}
              </a>
              <a
                href="/pdf/ficha-tecnica"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-corp text-sm py-3 px-6 justify-center"
              >
                <Download className="h-4 w-4 shrink-0" />
                {t("catPdfSpecs")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTROLES — Búsqueda y Filtros ──────────────────────────── */}
      <div className="container-corp py-6">
        <div
          className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4"
          style={{ border: "1px solid #dee2e6" }}
        >
          {/* Búsqueda */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("catSearchPlaceholder")}
              className="w-full h-10 pl-9 pr-9 bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-primary-600 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              Mostrando <strong className="text-gray-800">{filteredProducts.length}</strong> productos
            </span>
            <Link
              href="/productos"
              className="flex items-center gap-1.5 font-heading font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider text-xs transition-colors"
              style={{ fontSize: "11px" }}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {t("catAdvancedFilters")}
            </Link>
          </div>
        </div>

        {/* Filtros de categoría — tabs horizontales limpios */}
        <div
          className="flex items-center gap-0 overflow-x-auto mt-px"
          style={{ borderBottom: "1px solid #dee2e6", background: "white" }}
        >
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "shrink-0 px-5 py-3 font-heading font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-colors border-b-2",
              selectedCategory === "all"
                ? "border-primary-600 text-navy-950 bg-white"
                : "border-transparent text-gray-500 hover:text-navy-950 hover:bg-gray-50"
            )}
          >
            Todas
            <span className="ml-2 text-[10px] font-mono text-gray-400">
              ({allProducts.length})
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = productCountMap[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "shrink-0 px-5 py-3 font-heading font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-colors border-b-2",
                  isSelected
                    ? "border-primary-600 text-navy-950 bg-white"
                    : "border-transparent text-gray-500 hover:text-navy-950 hover:bg-gray-50"
                )}
              >
                {cat.name}
                <span className="ml-2 text-[10px] font-mono text-gray-400">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── GRILLA DE FAMILIAS — visible cuando no hay filtro activo ── */}
      {selectedCategory === "all" && !searchTerm && (
        <section className="container-corp pb-12">

          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="industrial-label mb-2 block">Líneas de Producto</span>
              <h2
                className="font-heading font-black text-navy-950"
                style={{ fontSize: "clamp(22px, 2.5vw, 32px)", letterSpacing: "-0.02em" }}
              >
                {t("catFamiliesHeadline")}
              </h2>
            </div>
          </div>

          {/* Grid de categorías — limpio, sin badges de colores ni barras decorativas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-gray-200">
            {categories.map((cat, idx) => {
              const catProducts = allProducts.filter((p) => p.categoryId === cat.id);
              const sampleImage =
                catProducts.length > 0 && catProducts[0].images[0]
                  ? catProducts[0].images[0]
                  : cat.image;
              const count = productCountMap[cat.id] || 0;

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-white group hover:bg-gray-50 transition-colors flex flex-col"
                >
                  {/* Imagen */}
                  <div
                    className="relative bg-gray-100 overflow-hidden flex items-center justify-center p-8"
                    style={{ height: "200px" }}
                  >
                    <img
                      src={sampleImage}
                      alt={cat.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                      style={{ mixBlendMode: "multiply" }}
                    />
                  </div>

                  {/* Contenido */}
                  <div className="p-5 flex flex-col flex-1" style={{ borderTop: "2px solid #e9ecef" }}>

                    {/* Index técnico */}
                    <span
                      className="font-heading font-bold text-gray-400 uppercase tracking-widest mb-2"
                      style={{ fontSize: "10px" }}
                    >
                      Familia #{String(idx + 1).padStart(2, "0")}
                    </span>

                    <h3
                      className="font-heading font-bold text-navy-950 uppercase group-hover:text-primary-600 transition-colors mb-2 leading-tight"
                      style={{ fontSize: "15px" }}
                    >
                      {cat.name}
                    </h3>

                    <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1 line-clamp-3">
                      {cat.description}
                    </p>

                    {/* Subcategorías — etiquetas simples */}
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {cat.subcategories.map((sub) => (
                          <span
                            key={sub}
                            className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 uppercase tracking-wider"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    <button
                      onClick={() => setSelectedCategory(cat.id)}
                      className="w-full flex items-center justify-between py-2.5 px-4 bg-gray-50 hover:bg-navy-950 hover:text-white text-gray-700 font-heading font-bold uppercase tracking-wider transition-colors group/btn"
                      style={{ fontSize: "11px", border: "1px solid #dee2e6" }}
                    >
                      {t("catViewProducts")}
                      <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── GRILLA DE PRODUCTOS ──────────────────────────────────────── */}
      <section className="container-corp pb-16">
        {/* Header de la sección de productos */}
        <div
          className="flex items-center justify-between mb-6 pb-4 bg-white px-6 py-4"
          style={{ border: "1px solid #dee2e6", borderBottom: "2px solid #1a65b5" }}
        >
          <div>
            <h2
              className="font-heading font-bold text-navy-950 uppercase"
              style={{ fontSize: "clamp(16px, 1.8vw, 22px)", letterSpacing: "-0.01em" }}
            >
              {activeCategoryObj ? activeCategoryObj.name : t("catAllProductsTitle")}
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              {activeCategoryObj
                ? activeCategoryObj.description
                : t("catAllProductsSub")}
            </p>
          </div>

          {selectedCategory !== "all" && (
            <button
              onClick={() => setSelectedCategory("all")}
              className="text-xs font-heading font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider transition-colors flex items-center gap-1.5"
              style={{ fontSize: "11px" }}
            >
              ← {t("catBackToAll")}
            </button>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-200">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-16 text-center" style={{ border: "1px solid #dee2e6" }}>
            <p className="font-heading font-bold text-navy-950 text-lg mb-2">
              {t("catNoProductsFound")}
            </p>
            <p className="text-gray-400 text-sm mb-6">{t("catNoProductsSub")}</p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchTerm("");
              }}
              className="btn-primary-corp"
            >
              {t("catResetFilters")}
            </button>
          </div>
        )}
      </section>

    </div>
  );
}
