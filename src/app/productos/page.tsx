"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCatalog } from "@/components/system/CatalogProvider";
import { ProductCard } from "@/components/product/ProductCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer } from "@/components/ui/drawer";
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  Search,
  Download,
  BookOpen,
  X,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { useTranslation, getTranslatedCategory, getTranslatedProduct, TranslateFn } from "@/i18n";
import { cn } from "@/lib/utils";
import { NICHE_ORDER, type Niche } from "@/types";
import {
  DIAMETER_RANGES,
  SortKey,
  filterCatalog,
  sortCatalog,
} from "@/lib/catalog";

const SORT_OPTIONS: { key: SortKey; labelKey: string }[] = [
  { key: "relevance", labelKey: "catSortRel" },
  { key: "az", labelKey: "catSortAZ" },
  { key: "za", labelKey: "catSortZA" },
  { key: "new", labelKey: "catSortNew" },
];

interface FilterPanelProps {
  t: TranslateFn;
  categorySlugs: string[];
  categoryNames: { slug: string; name: string }[];
  onToggleCategory: (slug: string) => void;
  allSelected: boolean;
  onSelectAll: () => void;
  selectedNiches: Niche[];
  onToggleNiche: (niche: Niche) => void;
  homologadoOnly: boolean;
  onToggleHomologado: () => void;
  selectedDiameters: string[];
  onToggleDiameter: (range: string) => void;
  activeFiltersCount: number;
  onClear: () => void;
}

function FilterPanel({
  t,
  categorySlugs,
  categoryNames,
  onToggleCategory,
  allSelected,
  onSelectAll,
  selectedNiches,
  onToggleNiche,
  homologadoOnly,
  onToggleHomologado,
  selectedDiameters,
  onToggleDiameter,
  activeFiltersCount,
  onClear,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      {/* Nicho / Aplicación */}
      <div>
        <h3 className="industrial-label mb-3 block text-slate-500">{t("niche.filterLabel")}</h3>
        <div className="space-y-2">
          {NICHE_ORDER.map((n) => (
            <Checkbox
              key={n}
              label={t(`niche.${n}`)}
              checked={selectedNiches.includes(n)}
              onChange={() => onToggleNiche(n)}
            />
          ))}
        </div>
      </div>

      {/* Categorías */}
      <div>
        <h3 className="industrial-label mb-3 block text-slate-500">{t("catCategories")}</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          <Checkbox label={t("catAll")} checked={allSelected} onChange={onSelectAll} />
          {categoryNames.map((cat) => (
            <Checkbox
              key={cat.slug}
              label={cat.name}
              checked={categorySlugs.includes(cat.slug)}
              onChange={() => onToggleCategory(cat.slug)}
            />
          ))}
        </div>
      </div>

      {/* Norma / Homologación */}
      <div className="border-t border-slate-200 pt-5">
        <h3 className="industrial-label mb-3 block text-slate-500">{t("catNorms")}</h3>
        <Checkbox
          label={t("catHomologated")}
          checked={homologadoOnly}
          onChange={onToggleHomologado}
        />
      </div>

      {/* Diámetro */}
      <div className="border-t border-slate-200 pt-5">
        <h3 className="industrial-label mb-3 block text-slate-500">{t("catDiameter")}</h3>
        <div className="space-y-2">
          {DIAMETER_RANGES.map((range) => (
            <Checkbox
              key={range}
              label={range}
              checked={selectedDiameters.includes(range)}
              onChange={() => onToggleDiameter(range)}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-5">
        <button
          onClick={onClear}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 text-slate-700 hover:border-primary-600 hover:text-primary-700 font-semibold text-xs px-4 py-2.5 transition-colors"
        >
          {t("catClearFilters")}
          {activeFiltersCount > 0 && (
            <span className="h-5 min-w-5 px-1 rounded-sm bg-primary-600 text-white text-[10px] flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function CatalogContent() {
  const { categories: rawCategories, products: rawProducts } = useCatalog();
  const searchParams = useSearchParams();
  const router = useRouter();

  const language = useStore((state) => state.language);
  const t = useTranslation(language);

  const categories = useMemo(
    () => rawCategories.map((c) => getTranslatedCategory(c, language)),
    [language]
  );
  const products = useMemo(
    () => rawProducts.map((p) => getTranslatedProduct(p, language)),
    [language]
  );

  // ── Sincronización con la URL (patrón recomendado: ajustar estado en render) ──
  const urlQuery = searchParams.get("q") ?? "";
  const urlCategory = searchParams.get("categoria") ?? "";

  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    urlCategory ? [urlCategory] : []
  );
  const [lastUrl, setLastUrl] = useState({ q: urlQuery, c: urlCategory });

  if (lastUrl.q !== urlQuery || lastUrl.c !== urlCategory) {
    setLastUrl({ q: urlQuery, c: urlCategory });
    setSearchTerm(urlQuery);
    setSelectedCategories(urlCategory ? [urlCategory] : []);
  }

  // ── Filtros locales ──
  const [selectedNiches, setSelectedNiches] = useState<Niche[]>([]);
  const [selectedDiameters, setSelectedDiameters] = useState<string[]>([]);
  const [homologadoOnly, setHomologadoOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const toggleNiche = (niche: Niche) => {
    setSelectedNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    );
  };

  const toggleDiameter = (range: string) => {
    setSelectedDiameters((prev) =>
      prev.includes(range) ? prev.filter((d) => d !== range) : [...prev, range]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedNiches([]);
    setSelectedDiameters([]);
    setHomologadoOnly(false);
    setSortBy("relevance");
    router.replace("/productos");
  };

  const filteredProducts = useMemo(
    () =>
      sortCatalog(
        filterCatalog(products, categories, {
          query: searchTerm,
          categorySlugs: selectedCategories,
          niches: selectedNiches,
          diameters: selectedDiameters,
          homologadoOnly,
        }),
        sortBy
      ),
    [products, categories, searchTerm, selectedCategories, selectedNiches, selectedDiameters, homologadoOnly, sortBy]
  );

  const activeFiltersCount =
    selectedCategories.length +
    selectedNiches.length +
    selectedDiameters.length +
    (homologadoOnly ? 1 : 0) +
    (searchTerm ? 1 : 0);

  const categoryNames = categories.map((c) => ({ slug: c.slug, name: c.name }));

  const filterPanelProps: FilterPanelProps = {
    t,
    categorySlugs: selectedCategories,
    categoryNames,
    onToggleCategory: toggleCategory,
    allSelected: selectedCategories.length === 0,
    onSelectAll: () => setSelectedCategories([]),
    selectedNiches,
    onToggleNiche: toggleNiche,
    homologadoOnly,
    onToggleHomologado: () => setHomologadoOnly((prev) => !prev),
    selectedDiameters,
    onToggleDiameter: toggleDiameter,
    activeFiltersCount,
    onClear: clearFilters,
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      {/* ── Header corporativo ─────────────────────────────────────── */}
      <section className="bg-navy-950 text-white" style={{ borderBottom: "3px solid #1a65b5", paddingTop: "72px" }}>
        <div className="container-corp py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="industrial-label mb-3 block text-sky-400">{t("catAdvancedFilters")}</span>
              <h1
                className="font-heading font-black text-white mb-3 leading-tight"
                style={{ fontSize: "clamp(28px, 4vw, 52px)", letterSpacing: "-0.025em" }}
              >
                {t("catAllProductsTitle")}
              </h1>
              <p className="text-slate-300 max-w-xl text-sm sm:text-base leading-relaxed">
                {t("catAllProductsSub")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <a
                href="/pdf/catalogo"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-corp text-xs sm:text-sm py-3 px-5 justify-center"
              >
                <BookOpen className="h-4 w-4 shrink-0" />
                <span>{t("generalCatalogPdf")}</span>
              </a>
              <a
                href="/pdf/ficha-tecnica"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-corp text-xs sm:text-sm py-3 px-5 justify-center"
              >
                <Download className="h-4 w-4 shrink-0" />
                <span>{t("techSheetUnified")}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="container-corp py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Sidebar desktop ── */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sticky top-24">
              <FilterPanel {...filterPanelProps} />
            </div>
          </aside>

          {/* ── Drawer de filtros mobile ── */}
          <Drawer
            isOpen={isFilterDrawerOpen}
            onClose={() => setIsFilterDrawerOpen(false)}
            title={t("catFilters")}
            side="left"
          >
            <div className="p-6">
              <FilterPanel {...filterPanelProps} />
            </div>
          </Drawer>

          {/* ── Contenido ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="lg:hidden shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 font-semibold text-xs px-3 py-2.5 transition-colors"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {t("catFilters")}
                  {activeFiltersCount > 0 && (
                    <span className="h-5 min-w-5 px-1 rounded-sm bg-primary-600 text-white text-[10px] flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t("catSearchPlaceholder")}
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

                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:block">
                  {t("catShowing")}{" "}
                  <strong className="text-navy-950 font-bold">{filteredProducts.length}</strong>{" "}
                  {filteredProducts.length === 1 ? t("catResult") : t("catResults")}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      viewMode === "grid" ? "bg-white shadow-sm text-primary-600" : "text-slate-500 hover:text-navy-950"
                    )}
                    aria-label="Vista grilla"
                    aria-pressed={viewMode === "grid"}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      viewMode === "list" ? "bg-white shadow-sm text-primary-600" : "text-slate-500 hover:text-navy-950"
                    )}
                    aria-label="Vista lista"
                    aria-pressed={viewMode === "list"}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                <select
                  className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-slate-900 cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  aria-label={t("catSortRel")}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {t(opt.labelKey)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grilla de productos */}
            {filteredProducts.length > 0 ? (
              <div
                className={cn(
                  "grid gap-5",
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                )}
              >
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white border border-slate-200">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                  <Search className="h-7 w-7 text-slate-400" />
                </div>
                <p className="text-navy-950 text-lg font-bold mb-2">{t("catNotFound")}</p>
                <p className="text-slate-500 text-xs mb-6 max-w-sm mx-auto">{t("catNoProductsDesc")}</p>
                <button
                  onClick={clearFilters}
                  className="btn-primary-corp text-xs"
                >
                  {t("catClearFilters")}
                </button>
              </div>
            )}

            {/* Cargar más */}
            {visibleCount < filteredProducts.length && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="inline-flex items-center gap-2 rounded-xl border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold text-xs px-8 py-3.5 transition-colors"
                >
                  {t("catLoadMore")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  const language = useStore((state) => state.language);
  const t = useTranslation(language);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-[72px] flex items-center justify-center bg-slate-50">
          <p className="text-slate-500 text-xs font-semibold">
            {t("common.loading")}
          </p>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
