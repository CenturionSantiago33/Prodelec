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
  ShieldCheck,
  Download,
  BookOpen,
  Search,
  X,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Grid,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CategoriasPage() {
  const language = useStore((state) => state.language);
  const t = useTranslation(language);

  // Dynamic translated categories & products
  const categories = useMemo(() => {
    return rawCategories.map((c) => getTranslatedCategory(c, language));
  }, [language]);

  const allProducts = useMemo(() => {
    return rawProducts.map((p) => getTranslatedProduct(p, language));
  }, [language]);

  // Selected category filter: "all" or specific category ID
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filtered products calculation
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

  // Product count map per category
  const productCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    categories.forEach((cat) => {
      map[cat.id] = allProducts.filter((p) => p.categoryId === cat.id).length;
    });
    return map;
  }, [categories, allProducts]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-200/80 pt-[80px] pb-24 font-sans text-slate-900">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO HEADER — Corporate Industrial Navy Header
      ────────────────────────────────────────────────────────────── */}
      <section className="relative bg-navy-950 text-white overflow-hidden border-b-2 border-navy-800 shadow-lg">
        {/* Background ambient lighting & grid texture */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-primary-600/15 blur-[120px]" />
          <div className="absolute bottom-0 left-10 w-[400px] h-[400px] rounded-full bg-electric/10 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3.5 py-1 text-xs font-bold text-electric uppercase tracking-widest mb-4 shadow-sm">
                <ShieldCheck className="h-4 w-4" />
                {t("catPortfolio")}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold uppercase tracking-tight text-white leading-tight mb-4">
                {t("catFamilyTitle")}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
                {t("catSubtitle")}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <div className="flex items-center gap-2.5 bg-white/10 border border-white/15 rounded-xl px-4 py-2 shadow-xs">
                  <span className="text-lg font-extrabold text-electric">10</span>
                  <span className="text-xs text-slate-200 uppercase font-semibold tracking-wider">
                    {t("catFamilies")}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/10 border border-white/15 rounded-xl px-4 py-2 shadow-xs">
                  <span className="text-lg font-extrabold text-electric">+{allProducts.length}</span>
                  <span className="text-xs text-slate-200 uppercase font-semibold tracking-wider">
                    {t("catModels")}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/10 border border-white/15 rounded-xl px-4 py-2 shadow-xs">
                  <span className="text-lg font-extrabold text-emerald-400">✓</span>
                  <span className="text-xs text-slate-200 uppercase font-semibold tracking-wider">
                    ISO 9001 / IRAM
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action PDF Downloads */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <a
                href="/pdf/catalogo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-navy-950 text-xs font-extrabold uppercase tracking-wider hover:bg-slate-100 transition-all shadow-lg hover:shadow-white/10"
              >
                <BookOpen className="h-4 w-4 text-primary-600" />
                {t("catPdfCatalog")}
              </a>
              <a
                href="/pdf/ficha-tecnica"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg hover:shadow-primary-600/30"
              >
                <Download className="h-4 w-4" />
                {t("catPdfSpecs")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CATALOG BODY — Clean B2B Explorer
      ────────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">

        {/* ── SEARCH & FILTER CONTROLS ── */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md border-2 border-slate-300 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("catSearchPlaceholder")}
              className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick stats & status */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end text-xs font-medium text-slate-500">
            <span>
              {t("catFamilyShowing")} <strong className="text-slate-900">{filteredProducts.length}</strong> {t("catProductsWord")}
            </span>

            <Link
              href="/productos"
              className="inline-flex items-center gap-1.5 font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider text-xs bg-primary-50 px-3 py-2 rounded-lg border-2 border-primary-200 transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {t("catAdvancedFilters")}
            </Link>
          </div>
        </div>

        {/* ── CATEGORY TAB FILTER CHIPS (Strongly Bordered Selector) ── */}
        <div className="mb-10 bg-white p-4 rounded-2xl border-2 border-slate-300 shadow-md">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-primary-600" /> {t("catSelectFamily")}
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-none">
            {/* "Todas" Chip */}
            <button
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border-2",
                selectedCategory === "all"
                  ? "bg-navy-950 text-white border-navy-950 shadow-md ring-2 ring-navy-950/20"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-100"
              )}
            >
              <Grid className="h-3.5 w-3.5" />
              {t("catAllFamiliesChip")}
              <span
                className={cn(
                  "ml-1 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold",
                  selectedCategory === "all"
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 text-slate-700"
                )}
              >
                {allProducts.length}
              </span>
            </button>

            {/* Individual Category Chips */}
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = productCountMap[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border-2",
                    isSelected
                      ? "bg-navy-950 text-white border-navy-950 shadow-md ring-2 ring-navy-950/20"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-100"
                  )}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0 border border-black/10"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                  <span
                    className={cn(
                      "ml-1 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold",
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3. VISUAL CATEGORY SHOWCASE CARDS — Remarcados & Estructurados ── */}
        {selectedCategory === "all" && !searchTerm && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-heading font-extrabold uppercase tracking-tight text-navy-950 flex items-center gap-2">
                  <span className="h-6 w-1.5 bg-primary-600 rounded-full" />
                  {t("catFamiliesHeadline")}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {t("catFamiliesSubheadline")}
                </p>
              </div>
            </div>

            {/* Responsive Grid of Category Family Cards — Strong Borders & Dividers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((cat, idx) => {
                const count = productCountMap[cat.id] || 0;
                const catProducts = allProducts.filter((p) => p.categoryId === cat.id);
                const sampleImage =
                  catProducts.length > 0 && catProducts[0].images[0]
                    ? catProducts[0].images[0]
                    : cat.image;

                return (
                  <motion.div
                    key={cat.id}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="group bg-white rounded-2xl border-2 border-slate-300 overflow-hidden shadow-md hover:shadow-2xl hover:border-primary-600 transition-all duration-300 flex flex-col relative"
                  >
                    {/* Top color banner with accent gradient */}
                    <div
                      className="h-3.5 w-full flex items-center justify-end px-3"
                      style={{
                        background: `linear-gradient(90deg, ${cat.color}, ${cat.color}dd)`,
                      }}
                    />

                    {/* Category index & count header */}
                    <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                        {t("catFamilyWord")} #{String(idx + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white shadow-xs"
                        style={{ backgroundColor: cat.color }}
                      >
                        {count > 0 ? `${count} ${t("catModels")}` : t("catPermanentProd")}
                      </span>
                    </div>

                    {/* Preview Image Frame */}
                    <div className="relative aspect-[16/10] bg-slate-50 p-6 flex items-center justify-center overflow-hidden border-b-2 border-slate-100">
                      <img
                        src={sampleImage}
                        alt={cat.name}
                        className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <h3 className="text-base font-heading font-extrabold uppercase text-navy-950 group-hover:text-primary-600 transition-colors leading-snug">
                            {cat.name}
                          </h3>
                        </div>
                        
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                          {cat.description}
                        </p>

                        {/* Subcategories tags */}
                        {cat.subcategories && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {cat.subcategories.map((sub) => (
                              <span
                                key={sub}
                                className="text-[10px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => setSelectedCategory(cat.id)}
                        className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-navy-950 hover:text-white text-slate-900 text-xs font-bold uppercase tracking-wider border border-slate-200 transition-all duration-200"
                      >
                        {t("catViewProducts")}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── 4. PRODUCT EXPLORER GRID — Structured Category Section ── */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-300 shadow-md">
          {/* Header of Grid Section with strong left border bar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-200">
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-8 rounded-full"
                style={{
                  backgroundColor: activeCategoryObj?.color || "#071724",
                }}
              />
              <div>
                <h2 className="text-xl font-heading font-extrabold uppercase tracking-tight text-navy-950">
                  {activeCategoryObj ? activeCategoryObj.name : t("catAllProductsTitle")}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeCategoryObj
                    ? activeCategoryObj.description
                    : t("catAllProductsSub")}
                </p>
              </div>
            </div>

            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider inline-flex items-center gap-1 bg-primary-50 px-3.5 py-2 rounded-xl border border-primary-200 transition-all"
              >
                {t("catBackToAll")}
              </button>
            )}
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-12 text-center border-2 border-slate-200 my-4">
              <p className="text-base font-bold text-navy-950 mb-2">
                {t("catNoProductsFound")}
              </p>
              <p className="text-xs text-slate-500 mb-6">
                {t("catNoProductsSub")}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchTerm("");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-950 text-white font-bold text-xs uppercase tracking-wider"
              >
                {t("catResetFilters")}
              </button>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
