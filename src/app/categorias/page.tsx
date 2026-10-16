"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { categories as rawCategories, products as rawProducts } from "@/data/products";
import { useStore } from "@/store/useStore";
import { useTranslation, getTranslatedCategory, getTranslatedProduct } from "@/i18n";
import { ProductCard } from "@/components/product/ProductCard";
import {
  Download, BookOpen, Search, X, SlidersHorizontal, ArrowRight, Filter, ChevronDown,
  FileText, FileDown, Droplets, Waves, Flame, Home, Layers,
} from "lucide-react";
import { productMatchesQuery } from "@/lib/catalog";
import { NICHE_ORDER, type Niche } from "@/types";
import { cn } from "@/lib/utils";

function CategoriasContent() {
  const language = useStore((state) => state.language);
  const t = useTranslation(language);
  const searchParams = useSearchParams();

  const categories = useMemo(() => {
    return rawCategories.map((c) => getTranslatedCategory(c, language));
  }, [language]);

  const allProducts = useMemo(() => {
    return rawProducts.map((p) => getTranslatedProduct(p, language));
  }, [language]);

  // ── Sincronización con la URL (deep links del navbar: /categorias?categoria=...) ──
  const urlCategory = searchParams.get("categoria") ?? "all";
  const urlQuery = searchParams.get("q") ?? "";

  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [searchTerm, setSearchTerm] = useState<string>(urlQuery);
  // Filtro por nicho de aplicación (Agua / Saneamiento / Gas / Domiciliaria)
  const [selectedNiche, setSelectedNiche] = useState<Niche | "all">("all");
  const [lastUrl, setLastUrl] = useState({ c: urlCategory, q: urlQuery });

  if (lastUrl.c !== urlCategory || lastUrl.q !== urlQuery) {
    setLastUrl({ c: urlCategory, q: urlQuery });
    setSelectedCategory(urlCategory);
    setSearchTerm(urlQuery);
    setSelectedNiche("all");
  }

  const nicheTabs: Array<Niche | "all"> = ["all", ...NICHE_ORDER];

  // Búsqueda multi-campo compartida con /productos
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      if (selectedNiche !== "all") {
        const cat = categories.find((c) => c.id === p.categoryId);
        if (!cat?.niches?.includes(selectedNiche)) return false;
      }
      return (
        (selectedCategory === "all" || p.categoryId === selectedCategory) &&
        productMatchesQuery(p, searchTerm)
      );
    });
  }, [selectedCategory, searchTerm, selectedNiche, allProducts, categories]);

  // Product counts per category
  const productCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    categories.forEach((cat) => {
      map[cat.id] = allProducts.filter((p) => p.categoryId === cat.id).length;
    });
    return map;
  }, [categories, allProducts]);

  // Íconos por nicho (decorativos: la etiqueta siempre va acompañada de texto).
  const nicheIcons: Record<Niche, typeof Droplets> = {
    agua: Droplets,
    saneamiento: Waves,
    gas: Flame,
    domiciliaria: Home,
  };

  // Tarjeta de categoría: una sola definición para todas las secciones de nicho.
  const renderCategoryCard = (cat: (typeof categories)[number]) => {
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
        className="bg-white group rounded-2xl overflow-hidden flex flex-col border border-slate-200/80 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-slate-300"
        style={{ borderTop: `3px solid ${catColor}` }}
      >
        {/* Imagen */}
        <div
          className="relative bg-slate-50 overflow-hidden flex items-center justify-center p-6 border-b border-slate-100"
          style={{ height: "190px" }}
        >
          <img
            src={sampleImage}
            alt={cat.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>

        {/* Contenido */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-heading font-bold text-navy-950 text-base leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors mb-1.5">
            {cat.name}
          </h3>

          <p className="text-slate-600 text-xs leading-relaxed mb-4 flex-1 line-clamp-2">
            {cat.description}
          </p>

          {/* Subcategorías / Variantes */}
          {cat.subcategories && cat.subcategories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {cat.subcategories.slice(0, 3).map((sub) => (
                <span
                  key={sub}
                  className="text-[9px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 uppercase tracking-wide rounded-full"
                >
                  {sub}
                </span>
              ))}
            </div>
          )}

          {/* Acciones */}
          <div className="flex items-center justify-between gap-2 pt-3 mt-auto border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500">
              {count} {t("catalog.productsWord")}
            </span>
            <div className="flex items-center gap-2">
              <a
                href={`/pdf/catalogo?categoria=${cat.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg bg-slate-100 hover:bg-primary-600 hover:text-white text-slate-600 transition-colors flex items-center justify-center shrink-0"
                title={`Descargar catálogo PDF de ${cat.name}`}
              >
                <Download className="h-4 w-4" />
              </a>
              <button
                onClick={() => setSelectedCategory(cat.id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs px-3.5 h-9 transition-colors group/btn"
              >
                <span>{t("catalog.viewProducts")}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-4"
        >
          {/* Búsqueda + selector de categoría: dos controles compactos, nada más */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Input de Búsqueda multi-campo */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("catalog.searchPlaceholder")}
                className="w-full h-11 pl-10 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
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

            {/* Selector de categoría: reemplaza la fila de 17 chips por un solo
                control plegable. Las flechas del teclado recorren las categorías. */}
            <div className="relative w-full sm:w-72">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label={t("catalog.selectFamily")}
                className="w-full h-11 pl-10 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 appearance-none focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
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
              className="flex items-center gap-1.5 font-semibold text-primary-700 hover:text-primary-900 text-xs transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>{t("catalog.advancedFilters")}</span>
            </Link>
          </div>
        </div>

        {/* ── FILTRO POR NICHO DE APLICACIÓN (agua / saneamiento / gas / domiciliaria) ── */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 inline-flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            {t("niche.filterLabel")}
          </span>
          {nicheTabs.map((niche) => {
            const active = selectedNiche === niche;
            const count =
              niche === "all"
                ? categories.length
                : categories.filter((c) => c.niches?.includes(niche)).length;
            return (
              <button
                key={niche}
                type="button"
                onClick={() => setSelectedNiche(niche)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 h-8 text-xs font-semibold transition-colors",
                  active
                    ? "bg-navy-950 border-navy-950 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-navy-950"
                )}
              >
                {t(niche === "all" ? "niche.all" : `niche.${niche}`)}
                <span className={active ? "text-white/60" : "text-slate-400"}>{count}</span>
              </button>
            );
          })}
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

          {/* Categorías agrupadas por nicho de aplicación (aprobado por el cliente).
              Una categoría puede aparecer en más de un nicho. */}
          <div className="space-y-14">
            {NICHE_ORDER.filter((n) => selectedNiche === "all" || selectedNiche === n).map((niche) => {
              const list = categories.filter((c) => c.niches?.includes(niche));
              if (list.length === 0) return null;
              const Icon = nicheIcons[niche];
              const productCount = allProducts.filter((p) =>
                list.some((c) => c.id === p.categoryId)
              ).length;

              return (
                <div key={niche} id={`nicho-${niche}`} className="scroll-mt-24">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-navy-950 text-white flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading font-black text-navy-950 text-xl leading-tight">
                        {t(`niche.${niche}`)}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {productCount} {t("catalog.productsWord")}
                      </p>
                    </div>
                    <span className="flex-1 h-px bg-slate-200" aria-hidden="true" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {list.map(renderCategoryCard)}
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
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white px-5 py-4 rounded-2xl border border-slate-200 shadow-sm"
          style={{
            borderLeft: `4px solid ${
              activeCategoryObj ? activeCategoryObj.color || "#1a65b5" : "#1a65b5"
            }`,
          }}
        >
          <div>
            <h2
              className="font-heading font-bold text-navy-950 text-sm sm:text-base"
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

          {selectedCategory !== "all" && activeCategoryObj && (
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`/pdf/catalogo?categoria=${activeCategoryObj.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-corp py-1.5 px-3 text-xs flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>PDF Categoría</span>
              </a>
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-xs font-semibold text-primary-700 hover:text-primary-900 transition-colors flex items-center gap-1 shrink-0"
              >
                ← {t("common.backToAll")}
              </button>
            </div>
          )}
        </div>

        {/* Fichas técnicas de los modelos de la categoría que todavía no están
            publicados como producto (la línea real de PRODELEC es más amplia
            que el catálogo). Se ofrecen igual, a nivel de categoría. */}
        {activeCategoryObj?.technicalSheets && activeCategoryObj.technicalSheets.length > 0 && (
          <div className="mb-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1.5">
              <FileText className="h-4 w-4 text-primary-700 shrink-0" aria-hidden />
              <h3 className="font-heading font-bold text-navy-950 text-sm">
                {t("catalog.lineSheetsTitle")}
              </h3>
              <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                {activeCategoryObj.technicalSheets.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">{t("catalog.lineSheetsSub")}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {activeCategoryObj.technicalSheets.map((sheet) => (
                <li key={sheet.url}>
                  <a
                    href={sheet.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2.5 h-full rounded-xl border border-slate-200 px-3 py-2.5 hover:border-primary-300 hover:bg-primary-50/40 transition-colors"
                  >
                    <FileDown className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" aria-hidden />
                    <span className="text-xs font-semibold text-navy-950 leading-snug group-hover:text-primary-700">
                      {sheet.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
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

export default function CategoriasPage() {
  const language = useStore((state) => state.language);
  const t = useTranslation(language);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-[72px]">
          <p className="text-slate-500 text-xs font-semibold">
            {t("common.loading")}
          </p>
        </div>
      }
    >
      <CategoriasContent />
    </Suspense>
  );
}
