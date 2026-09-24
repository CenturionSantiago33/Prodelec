"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { categories as rawCategories, products as rawProducts } from "@/data/products";
import { useStore } from "@/store/useStore";
import { useTranslation, getTranslatedCategory, getTranslatedProduct } from "@/i18n";
import { ProductCard } from "@/components/product/ProductCard";
import {
  Download, BookOpen, Search, X, SlidersHorizontal, ArrowRight, Filter, ChevronDown, Check,
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

  // Real multi-field search across name, code/SKU, category, description, features
  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return allProducts.filter((p) => {
      const matchesCategory =
        selectedCategory === "all" || p.categoryId === selectedCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      const nameMatch = p.name.toLowerCase().includes(q);
      const codeMatch = p.code.toLowerCase().includes(q);
      const descMatch = p.description.toLowerCase().includes(q);
      const categoryMatch = p.categoryId.toLowerCase().includes(q);
      const sizeMatch = p.sizeInfo ? p.sizeInfo.toLowerCase().includes(q) : false;
      const diameterMatch = p.diameter ? p.diameter.toLowerCase().includes(q) : false;

      return (
        nameMatch ||
        codeMatch ||
        descMatch ||
        categoryMatch ||
        sizeMatch ||
        diameterMatch
      );
    });
  }, [selectedCategory, searchTerm, allProducts]);

  // Product counts per category
  const productCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    categories.forEach((cat) => {
      map[cat.id] = allProducts.filter((p) => p.categoryId === cat.id).length;
    });
    return map;
  }, [categories, allProducts]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800" style={{ paddingTop: "72px" }}>

      {/* ── HERO HEADER ───────────────────────────────────────────────────── */}
      <section className="bg-navy-950 text-white" style={{ borderBottom: "3px solid #1a65b5" }}>
        <div className="container-corp py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="industrial-label mb-3 block text-sky-400">
                {t("catalog.eyebrow")}
              </span>
              <h1
                className="font-heading font-black text-white mb-3 leading-tight"
                style={{ fontSize: "clamp(28px, 4vw, 52px)", letterSpacing: "-0.025em" }}
              >
                {t("catalog.title")}
              </h1>
              <p className="text-slate-300 mb-6 max-w-xl text-sm sm:text-base leading-relaxed">
                {t("catalog.subtitle")}
              </p>

              {/* Technical Indicators */}
              <div className="flex flex-wrap gap-6 sm:gap-8">
                <div style={{ borderLeft: "2px solid #1a65b5", paddingLeft: "12px" }}>
                  <span className="font-heading font-black text-white text-2xl block leading-none">
                    {categories.length}
                  </span>
                  <span className="industrial-label" style={{ color: "#7dd3fc" }}>
                    {t("nav.catalog")}
                  </span>
                </div>
                <div style={{ borderLeft: "2px solid #1a65b5", paddingLeft: "12px" }}>
                  <span className="font-heading font-black text-white text-2xl block leading-none">
                    +{allProducts.length}
                  </span>
                  <span className="industrial-label" style={{ color: "#7dd3fc" }}>
                    {t("common.code")}
                  </span>
                </div>
                <div style={{ borderLeft: "2px solid #1a65b5", paddingLeft: "12px" }}>
                  <span className="font-heading font-black text-white text-2xl block leading-none">
                    ISO
                  </span>
                  <span className="industrial-label" style={{ color: "#7dd3fc" }}>
                    9001:2015
                  </span>
                </div>
              </div>
            </div>

            {/* Official PDF Downloads */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <a
                href="/pdf/catalogo"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-corp text-xs sm:text-sm py-3 px-5 justify-center"
              >
                <BookOpen className="h-4 w-4 shrink-0" />
                <span>{t("common.officialCatalog")}</span>
              </a>
              <a
                href="/pdf/ficha-tecnica"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-corp text-xs sm:text-sm py-3 px-5 justify-center"
              >
                <Download className="h-4 w-4 shrink-0" />
                <span>{t("common.unifiedSpecs")}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTROLS: BÚSQUEDA Y SELECTOR DE FAMILIAS (NO HORIZONTAL SCROLL) ── */}
      <div className="container-corp py-6">
        <div
          className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 border border-slate-200 shadow-xs mb-4"
        >
          {/* Input de Búsqueda multi-campo */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("catalog.searchPlaceholder")}
              className="w-full h-10 pl-9 pr-9 bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary-600 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Dynamic Counter & Secondary Links */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 text-sm text-slate-600">
            <span className="font-mono text-xs sm:text-sm">
              {t("catalog.showing")}{" "}
              <strong className="text-navy-950 font-bold font-sans text-sm">
                {filteredProducts.length}
              </strong>{" "}
              {t("catalog.productsWord")}
            </span>

            <Link
              href="/productos"
              className="flex items-center gap-1.5 font-heading font-bold text-primary-700 hover:text-primary-900 uppercase tracking-wider text-xs transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>{t("catalog.advancedFilters")}</span>
            </Link>
          </div>
        </div>

        {/* ── MOBILE COMPACT SELECTOR (Dropdown for mobile devices) ── */}
        <div className="block lg:hidden mb-4 bg-white p-3 border border-slate-200 shadow-xs">
          <label className="block text-[11px] font-heading font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            {t("catalog.selectFamily")}
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-11 bg-slate-50 border border-slate-300 text-slate-900 text-sm font-semibold px-3 pr-8 appearance-none focus:outline-none focus:border-primary-600 rounded-none cursor-pointer"
            >
              <option value="all">
                {t("catalog.allFamilies")} ({allProducts.length})
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({productCountMap[cat.id] || 0})
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* ── DESKTOP & TABLET CHIPS CON WRAP (AUTOMÁTICAMENTE EN VARIAS FILAS) ── */}
        <div className="hidden lg:block bg-white p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-2.5">
            <Filter className="h-3.5 w-3.5 text-primary-700" />
            <span className="text-[11px] font-heading font-bold text-slate-600 uppercase tracking-wider">
              {t("catalog.filterFamilies")}:
            </span>
          </div>

          {/* WRAP Container: wraps automatically in multiple lines, NO horizontal scroll */}
          <div className="flex flex-wrap gap-1.5">
            {/* Chip: Todas */}
            <button
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "px-3.5 py-1.5 font-heading font-bold text-xs uppercase tracking-wider transition-all border",
                selectedCategory === "all"
                  ? "bg-navy-950 text-white border-navy-950 shadow-xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-navy-950"
              )}
            >
              {t("catalog.allFamilies")}
              <span
                className={cn(
                  "ml-1.5 text-[10px] font-mono",
                  selectedCategory === "all" ? "text-sky-300" : "text-slate-400"
                )}
              >
                ({allProducts.length})
              </span>
            </button>

            {/* Chips por Categoría */}
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = productCountMap[cat.id] || 0;
              const catColor = cat.color || "#1a65b5";

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-3 py-1.5 font-heading font-bold text-xs uppercase tracking-wider transition-all border flex items-center gap-1.5",
                    isSelected
                      ? "bg-navy-950 text-white border-navy-950 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-navy-950"
                  )}
                  style={
                    isSelected
                      ? { borderTop: `2px solid ${catColor}` }
                      : undefined
                  }
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: catColor }}
                  />
                  <span>{cat.name}</span>
                  <span
                    className={cn(
                      "text-[10px] font-mono",
                      isSelected ? "text-sky-300" : "text-slate-400"
                    )}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── GRILLA DE FAMILIAS (VISIBLE CUANDO ESTÁ EN "TODAS" Y SIN BÚSQUEDA) ── */}
      {selectedCategory === "all" && !searchTerm && (
        <section className="container-corp pb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="industrial-label mb-1.5 block text-primary-700">
                {t("catalog.categoriesTitle")}
              </span>
              <h2
                className="font-heading font-black text-navy-950"
                style={{ fontSize: "clamp(20px, 2.5vw, 30px)", letterSpacing: "-0.02em" }}
              >
                {t("catalog.categoriesTitle")}
              </h2>
            </div>
          </div>

          {/* Grid de familias industriales sobrias */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((cat, idx) => {
              const catProducts = allProducts.filter((p) => p.categoryId === cat.id);
              const sampleImage =
                catProducts.length > 0 && catProducts[0].images[0]
                  ? catProducts[0].images[0]
                  : cat.image;
              const count = productCountMap[cat.id] || 0;
              const catColor = cat.color || "#1a65b5";

              return (
                <div
                  key={cat.id}
                  className="bg-white group hover:bg-slate-50/70 transition-all flex flex-col border border-slate-200 shadow-xs"
                  style={{ borderTop: `3px solid ${catColor}` }}
                >
                  {/* Imagen */}
                  <div
                    className="relative bg-slate-50 overflow-hidden flex items-center justify-center p-6 border-b border-slate-200"
                    style={{ height: "180px" }}
                  >
                    <img
                      src={sampleImage}
                      alt={cat.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      style={{ mixBlendMode: "multiply" }}
                    />
                  </div>

                  {/* Contenido */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="font-heading font-bold uppercase tracking-widest text-[10px]"
                        style={{ color: catColor }}
                      >
                        {t("catalog.familyNumber")} #{String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 border border-slate-200">
                        {count} {t("catalog.productsWord")}
                      </span>
                    </div>

                    <h3
                      className="font-heading font-bold text-navy-950 uppercase group-hover:text-primary-700 transition-colors mb-2 text-sm leading-snug line-clamp-1"
                    >
                      {cat.name}
                    </h3>

                    <p className="text-slate-600 text-xs leading-relaxed mb-3 flex-1 line-clamp-2">
                      {cat.description}
                    </p>

                    {/* Subcategorías / Variantes */}
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {cat.subcategories.slice(0, 3).map((sub) => (
                          <span
                            key={sub}
                            className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 uppercase tracking-wider border border-slate-200"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Botón de acción */}
                    <button
                      onClick={() => setSelectedCategory(cat.id)}
                      className="w-full flex items-center justify-between py-2 px-3 bg-slate-100 hover:bg-navy-950 hover:text-white text-slate-800 font-heading font-bold uppercase tracking-wider transition-colors text-[11px] border border-slate-200 group/btn"
                    >
                      <span>{t("catalog.viewProducts")}</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── LISTADO / GRILLA DE PRODUCTOS ─────────────────────────────────── */}
      <section className="container-corp pb-16">
        {/* Cabecera de la sección de productos */}
        <div
          className="flex items-center justify-between mb-6 pb-3 bg-white px-5 py-3.5 border border-slate-200"
          style={{
            borderLeft: `4px solid ${
              activeCategoryObj ? activeCategoryObj.color || "#1a65b5" : "#1a65b5"
            }`,
          }}
        >
          <div>
            <h2
              className="font-heading font-bold text-navy-950 uppercase text-sm sm:text-base"
              style={{ letterSpacing: "-0.01em" }}
            >
              {activeCategoryObj
                ? activeCategoryObj.name
                : t("catalog.allProductsTitle")}
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              {activeCategoryObj
                ? activeCategoryObj.description
                : t("catalog.allProductsSub")}
            </p>
          </div>

          {selectedCategory !== "all" && (
            <button
              onClick={() => setSelectedCategory("all")}
              className="text-xs font-heading font-bold text-primary-700 hover:text-primary-900 uppercase tracking-wider transition-colors flex items-center gap-1 shrink-0 ml-4"
            >
              ← {t("common.backToAll")}
            </button>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center border border-slate-200">
            <p className="font-heading font-bold text-navy-950 text-base mb-2">
              {t("catalog.noResultsTitle")}
            </p>
            <p className="text-slate-500 text-xs mb-6 max-w-sm mx-auto">
              {t("catalog.noResultsSub")}
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchTerm("");
              }}
              className="btn-primary-corp"
            >
              {t("catalog.resetFilters")}
            </button>
          </div>
        )}
      </section>

    </div>
  );
}
