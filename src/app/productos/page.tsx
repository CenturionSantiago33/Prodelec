"use client";

import React, { useState, useEffect, Suspense } from "react";
import { getProducts, getCategories, architectureFilters } from "@/data/mock";
import { Product, Category } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer } from "@/components/ui/drawer";
import { LayoutGrid, List, SlidersHorizontal, Search, ShieldCheck, Download, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n/translations";
import { cn } from "@/lib/utils";

// Available diameter ranges derived from products
const DIAMETER_RANGES = [
  "15mm a 25mm",
  "20mm a 50mm",
  "50mm a 110mm",
  "63mm a 110mm",
  "63mm a 160mm",
  "50mm a 1200mm",
  "110mm a 315mm",
  "160mm a 400mm",
  "DN110",
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const language = useStore(state => state.language);
  const t = useTranslation(language);

  const initialSearch = searchParams.get("q") || "";
  const initialCategory = searchParams.get("categoria") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedDiameters, setSelectedDiameters] = useState<string[]>([]);
  const [selectedArchitectures, setSelectedArchitectures] = useState<string[]>([]);
  const [homologadoOnly, setHomologadoOnly] = useState(false);
  const [sortBy, setSortBy] = useState(t("catSortRel"));
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([p, c]) => {
      setProducts(p);
      setCategories(c);
      setIsLoading(false);
    });
  }, []);

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    );
  };

  const toggleDiameter = (range: string) => {
    setSelectedDiameters(prev =>
      prev.includes(range) ? prev.filter(d => d !== range) : [...prev, range]
    );
  };

  const toggleArchitecture = (arch: string) => {
    setSelectedArchitectures(prev =>
      prev.includes(arch) ? prev.filter(a => a !== arch) : [...prev, arch]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedDiameters([]);
    setSelectedArchitectures([]);
    setHomologadoOnly(false);
    setSortBy(t("catSortRel"));
    router.replace("/productos");
  };

  // Filter Logic with multi-field search
  const qLower = searchTerm.toLowerCase().trim();
  let filteredProducts = products.filter(p => {
    const matchesSearch = !qLower ||
      p.name.toLowerCase().includes(qLower) ||
      p.code.toLowerCase().includes(qLower) ||
      (p.family && p.family.toLowerCase().includes(qLower)) ||
      (p.tags && p.tags.some(tag => tag.toLowerCase().includes(qLower))) ||
      (p.models && p.models.some(m => m.code.toLowerCase().includes(qLower) || m.name.toLowerCase().includes(qLower)));

    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.some(catSlug => {
        const cat = categories.find(c => c.slug === catSlug);
        return p.categoryId === cat?.id || p.categoryId === catSlug;
      });
    const matchesDiameter = selectedDiameters.length === 0 ||
      (p.diameter && selectedDiameters.some(d => p.diameter?.includes(d.split(" ")[0]) || d === p.diameter));
    const matchesArchitecture = selectedArchitectures.length === 0 ||
      (p.architecture && selectedArchitectures.some(a => p.architecture?.includes(a))) ||
      selectedArchitectures.length === 0;
    const matchesHomologado = !homologadoOnly || p.homologado === true;

    return matchesSearch && matchesCategory && matchesDiameter && matchesArchitecture && matchesHomologado;
  });

  // Sort
  if (sortBy === t("catSortAZ") || sortBy === "Nombre (A-Z)") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === t("catSortZA") || sortBy === "Nombre (Z-A)") {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy === t("catSortNew") || sortBy === "Más recientes") {
    filteredProducts.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
  }

  const activeFiltersCount = selectedCategories.length + selectedDiameters.length + selectedArchitectures.length + (homologadoOnly ? 1 : 0) + (searchTerm ? 1 : 0);

  const Sidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t("catCategories")}</h3>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <Checkbox
              key={cat.id}
              label={cat.name}
              checked={selectedCategories.includes(cat.slug)}
              onChange={() => toggleCategory(cat.slug)}
            />
          ))}
        </div>
      </div>

      {/* Homologado Filter */}
      <div className="border-t border-gray-100 pt-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t("catNorms")}</h3>
        <Checkbox
          label={t("catHomologated")}
          checked={homologadoOnly}
          onChange={() => setHomologadoOnly(prev => !prev)}
        />
      </div>

      {/* Diameter Filter */}
      <div className="border-t border-gray-100 pt-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t("catDiameter")}</h3>
        <div className="space-y-2">
          {DIAMETER_RANGES.map((range) => (
            <Checkbox
              key={range}
              label={range}
              checked={selectedDiameters.includes(range)}
              onChange={() => toggleDiameter(range)}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-wider" onClick={clearFilters}>
          {t("catClearFilters")}
          {activeFiltersCount > 0 && (
            <span className="ml-2 h-5 w-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Corporate Blue Header ───────────────────── */}
      <div className="relative overflow-hidden pt-[72px]">
        <div className="bg-gradient-to-br from-navy-950 via-primary-800 to-primary-700 relative">
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          />
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-accent-400/20 blur-[80px]" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-primary-500/10 blur-[60px]" />

          <div className="relative mx-auto max-w-[1600px] px-6 lg:px-10 xl:px-16 py-14">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="text-xs text-blue-200 mb-2 font-mono uppercase tracking-wider">
                  {t("navHome")} / {t("navCatalog")}
                </div>
                <h1 className="text-3xl md:text-5xl font-heading font-black text-white mb-3 tracking-tight">
                  {t("catTitle")}
                </h1>
                <p className="text-blue-100 text-sm md:text-base max-w-xl leading-relaxed">
                  {t("catSubtitle")}
                </p>
              </div>

              {/* Technical Master Downloads */}
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href="/pdf/catalogo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-navy-950 text-xs font-extrabold uppercase tracking-wider hover:bg-primary-50 transition-all shadow-md"
                >
                  <BookOpen className="h-4 w-4 text-primary-600" />
                  {t("generalCatalogPdf")}
                </a>
                <a
                  href="/pdf/ficha-tecnica"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-600 text-white text-xs font-extrabold uppercase tracking-wider hover:bg-primary-500 transition-all shadow-md"
                >
                  <Download className="h-4 w-4 text-white" />
                  {t("techSheetUnified")}
                </a>
              </div>
            </div>

            {/* Category wrapped chips (no horizontal scrollbar) */}
            <div className="flex flex-wrap gap-2 mt-8">
              <button
                onClick={() => setSelectedCategories([])}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all duration-150",
                  selectedCategories.length === 0
                    ? "bg-white text-primary-700 border-white shadow-sm"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                )}
              >
                {t("catAll")}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.slug)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all duration-150",
                    selectedCategories.includes(cat.slug)
                      ? "bg-white text-primary-700 border-white shadow-sm"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────── */}
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 xl:px-16 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Desktop */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 sticky top-24">
              <Sidebar />
            </div>
          </div>

          {/* Filter Drawer Mobile */}
          <Drawer isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)} title={t("catFilters")} side="left">
            <div className="p-6">
              <Sidebar />
            </div>
          </Drawer>

          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs">
              <div className="flex items-center gap-3 flex-1">
                <Button variant="outline" size="sm" className="lg:hidden shrink-0 text-xs font-bold" onClick={() => setIsFilterDrawerOpen(true)}>
                  <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                  {t("catFilters")}
                  {activeFiltersCount > 0 && (
                    <span className="ml-1.5 h-5 w-5 rounded-full bg-primary-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>

                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9 h-9 text-xs"
                    placeholder={t("catSearchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <span className="text-xs font-semibold text-gray-500 whitespace-nowrap hidden sm:block">
                  {t("catShowing")} <strong className="text-navy-950 font-bold">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? t("catResult") : t("catResults")}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center border border-gray-200 rounded-lg p-1 bg-gray-50">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-xs text-primary-600 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                    aria-label="Vista grilla"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-xs text-primary-600 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                    aria-label="Vista lista"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                <select
                  className="text-xs font-bold bg-white border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-600 outline-none text-gray-900"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option>{t("catSortRel")}</option>
                  <option>{t("catSortAZ")}</option>
                  <option>{t("catSortZA")}</option>
                  <option>{t("catSortNew")}</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200">
                    <div className="animate-pulse flex flex-col gap-4">
                      <div className="h-48 bg-gray-100 rounded-xl" />
                      <div className="h-4 bg-gray-100 rounded w-1/4" />
                      <div className="h-6 bg-gray-100 rounded w-3/4" />
                      <div className="h-4 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.slice(0, visibleCount).map((product) => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-gray-200">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                      <Search className="h-7 w-7 text-gray-400" />
                    </div>
                    <p className="text-navy-950 text-lg font-bold mb-2">{t("catNotFound")}</p>
                    <p className="text-gray-500 text-xs mb-6 max-w-sm mx-auto">{t("catNoProductsDesc")}</p>
                    <Button variant="outline" className="text-xs font-bold uppercase tracking-wider" onClick={clearFilters}>
                      {t("catClearFilters")}
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Load More */}
            {!isLoading && visibleCount < filteredProducts.length && (
              <div className="mt-12 flex justify-center">
                <Button
                  variant="outline"
                  className="px-8 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white text-xs font-extrabold uppercase tracking-wider"
                  onClick={() => setVisibleCount(prev => prev + 12)}
                >
                  {t("catLoadMore")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  const language = useStore(state => state.language);
  const t = useTranslation(language);

  return (
    <Suspense fallback={
      <div className="min-h-screen pt-[72px] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-3 border-primary-600 border-t-transparent animate-spin" />
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t("loadingProducts")}</p>
        </div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
