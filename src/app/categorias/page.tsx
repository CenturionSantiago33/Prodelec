"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { categories as rawCategories, products as rawProducts } from "@/data/products";
import { useStore } from "@/store/useStore";
import { useTranslation, getTranslatedCategory, getTranslatedProduct } from "@/i18n";
import { ProductCard } from "@/components/product/ProductCard";
import {
  Download, BookOpen, Search, X, ArrowRight, FileText, FileDown,
  Droplets, Waves, Flame, Home,
} from "lucide-react";
import { productMatchesQuery } from "@/lib/catalog";
import { NICHE_ORDER, type Niche } from "@/types";
import { cn } from "@/lib/utils";

// Íconos por nicho (acompañan siempre a la etiqueta de texto).
const NICHE_ICONS: Record<Niche, typeof Droplets> = {
  agua: Droplets,
  saneamiento: Waves,
  domiciliaria: Home,
  gas: Flame,
};

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

  // Conteo de productos por categoría
  const productCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    categories.forEach((cat) => {
      map[cat.id] = allProducts.filter((p) => p.categoryId === cat.id).length;
    });
    return map;
  }, [categories, allProducts]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);
  const showingCategoryView = selectedCategory !== "all";

  const resetToCategories = () => {
    setSelectedCategory("all");
    setSelectedNiche("all");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800" style={{ paddingTop: "72px" }}>

      {/* ── HERO HEADER ───────────────────────────────────────────────────── */}
      <section className="bg-navy-950 text-white" style={{ borderBottom: "3px solid #1a65b5" }}>
        <div className="container-corp py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="industrial-label mb-3 block text-sky-400">
                {t("catalog.eyebrow")}
              </span>
              <h1
                className="font-heading font-black text-white mb-3 leading-tight"
                style={{ fontSize: "clamp(28px, 4vw, 46px)", letterSpacing: "-0.025em" }}
              >
                {t("catalog.title")}
              </h1>
              <p className="text-slate-300 max-w-xl text-sm sm:text-[15px] leading-relaxed">
                {t("catalog.subtitle")}
              </p>
            </div>

            {/* Documentación oficial */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <a
                href="/pdf/catalogo"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-corp text-xs sm:text-[13px] py-3 px-5 justify-center"
              >
                <BookOpen className="h-4 w-4 shrink-0" />
                <span>{t("common.officialCatalog")}</span>
              </a>
              <a
                href="/pdf/ficha-tecnica"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-corp text-xs sm:text-[13px] py-3 px-5 justify-center"
              >
                <Download className="h-4 w-4 shrink-0" />
                <span>{t("common.unifiedSpecs")}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── BARRA DE EXPLORACIÓN: búsqueda + nichos de aplicación ── */}
      <div className="container-corp py-6">
        <div className="flex flex-col gap-5">

          {/* Búsqueda */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value) setSelectedCategory("all");
                }}
                placeholder={t("catalog.searchPlaceholder")}
                className="w-full h-11 pl-10 pr-9 bg-white border border-slate-200 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
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
            <span className="text-[13px] text-slate-500 sm:ml-1">
              {t("catalog.showing")}{" "}
              <strong className="text-navy-950 font-semibold">{filteredProducts.length}</strong>{" "}
              {t("catalog.productsWord")}
            </span>
          </div>

          {/* Selector de aplicación (nicho) — control principal */}
          {!showingCategoryView && (
            <nav
              className="flex flex-wrap gap-2"
              aria-label={t("niche.filterLabel")}
            >
              {nicheTabs.map((niche) => {
                const active = selectedNiche === niche;
                const count =
                  niche === "all"
                    ? categories.length
                    : categories.filter((c) => c.niches?.includes(niche)).length;
                const Icon = niche !== "all" ? NICHE_ICONS[niche] : null;
                return (
                  <button
                    key={niche}
                    type="button"
                    onClick={() => setSelectedNiche(niche)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-md border px-4 h-10 text-[13px] font-semibold transition-colors",
                      active
                        ? "border-navy-950 bg-navy-950 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-navy-950"
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {t(niche === "all" ? "niche.all" : `niche.${niche}`)}
                    <span className={cn("text-[11px] font-medium tabular-nums", active ? "text-white/60" : "text-slate-400")}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </div>

      {/* ── GRILLA DE CATEGORÍAS POR NICHO ───────────────────────────────── */}
      {!showingCategoryView && (
        <section className="container-corp pb-16">
          <div className="space-y-14">
            {NICHE_ORDER.filter((n) => selectedNiche === "all" || selectedNiche === n).map((niche) => {
              const list = categories.filter((c) => c.niches?.includes(niche));
              if (list.length === 0) return null;
              const Icon = NICHE_ICONS[niche];
              const productCount = allProducts.filter((p) =>
                list.some((c) => c.id === p.categoryId)
              ).length;

              return (
                <div key={niche} id={`nicho-${niche}`} className="scroll-mt-24">
                  {/* Encabezado de sección */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-navy-950 text-white">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-heading font-bold text-navy-950 text-xl leading-tight">
                        {t(`niche.${niche}`)}
                      </h2>
                      <p className="text-[12.5px] text-slate-500">
                        {productCount} {t("catalog.productsWord")}
                      </p>
                    </div>
                    <span className="flex-1 h-px bg-slate-200" aria-hidden="true" />
                  </div>

                  {/* Tarjetas de categoría */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {list.map((cat) => {
                      const count = productCountMap[cat.id] || 0;
                      return (
                        <Link
                          key={cat.id}
                          href={`/categorias?categoria=${cat.id}`}
                          className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md"
                        >
                          {/* Imagen */}
                          <div className="flex h-[188px] items-center justify-center border-b border-slate-100 bg-white p-4">
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                          </div>

                          {/* Contenido */}
                          <div className="flex flex-1 flex-col p-5">
                            <h3 className="font-heading font-bold text-navy-950 text-[15px] leading-snug group-hover:text-primary-700 transition-colors">
                              {cat.name}
                            </h3>
                            {cat.description && (
                              <p className="mt-1.5 mb-4 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
                                {cat.description}
                              </p>
                            )}

                            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                              <span className="text-[12px] font-medium text-slate-400">
                                {count} {t("catalog.productsWord")}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary-700 transition-colors group-hover:text-primary-900">
                                {t("catalog.viewProducts")}
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── VISTA DE PRODUCTOS DE UNA CATEGORÍA ───────────────────────────── */}
      {showingCategoryView && (
        <section className="container-corp pb-16">
          {/* Cabecera de la categoría */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-white px-5 py-4 rounded-xl border border-slate-200">
            <div className="min-w-0">
              <button
                onClick={resetToCategories}
                className="mb-2 inline-flex items-center gap-1 text-[12.5px] font-semibold text-primary-700 hover:text-primary-900 transition-colors"
              >
                ← {t("common.backToAll")}
              </button>
              <h2 className="font-heading font-bold text-navy-950 text-lg leading-tight">
                {activeCategoryObj?.name}
              </h2>
              {activeCategoryObj?.description && (
                <p className="mt-1 text-[13px] text-slate-500 max-w-2xl">
                  {activeCategoryObj.description}
                </p>
              )}
            </div>

            {activeCategoryObj && (
              <a
                href={`/pdf/catalogo?categoria=${activeCategoryObj.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-corp py-2 px-4 text-xs shrink-0"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>{t("common.technicalSheet")}</span>
              </a>
            )}
          </div>

          {/* Fichas técnicas de modelos de la categoría aún no publicados como producto */}
          {activeCategoryObj?.technicalSheets && activeCategoryObj.technicalSheets.length > 0 && (
            <div className="mb-6 bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-1.5">
                <FileText className="h-4 w-4 text-primary-700 shrink-0" aria-hidden />
                <h3 className="font-heading font-bold text-navy-950 text-[15px]">
                  {t("catalog.lineSheetsTitle")}
                </h3>
              </div>
              <p className="text-[13px] text-slate-500 mb-4">{t("catalog.lineSheetsSub")}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {activeCategoryObj.technicalSheets.map((sheet) => (
                  <li key={sheet.url}>
                    <a
                      href={sheet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-2.5 h-full rounded-md border border-slate-200 px-3 py-2.5 hover:border-primary-300 hover:bg-primary-50/40 transition-colors"
                    >
                      <FileDown className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" aria-hidden />
                      <span className="text-[13px] font-medium text-navy-950 leading-snug group-hover:text-primary-700">
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
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
              <p className="font-heading font-bold text-navy-950 text-base mb-2">
                {t("catalog.noResultsTitle")}
              </p>
              <p className="text-slate-500 text-[13px] mb-6 max-w-sm mx-auto">
                {t("catalog.noResultsSub")}
              </p>
              <button onClick={resetToCategories} className="btn-primary-corp">
                {t("catalog.resetFilters")}
              </button>
            </div>
          )}
        </section>
      )}
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
