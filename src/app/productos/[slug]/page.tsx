"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Heart,
  Download,
  ShieldCheck,
  ArrowLeft,
  ShoppingCart,
  Ruler,
  Layers,
  CheckCircle2,
  Table2,
  FileDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { products as allProducts, categories } from "@/data/mock";
import { useStore } from "@/store/useStore";
import {
  useTranslation,
  getTranslatedCategory,
  getTranslatedProduct,
  getTranslatedTag,
} from "@/i18n";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductPhotoViewer } from "@/components/product/ProductPhotoViewer";
import { PANORAMAS } from "@/data/panoramas";
import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [activeTab, setActiveTab] = useState<"specs" | "downloads">("specs");

  const { addToCart, toggleFavorite, isFavorite, setCartOpen, language } = useStore();
  const t = useTranslation(language);

  // Catálogo local y sincrónico: no se necesita estado de carga ni efectos.
  const product = useMemo(
    () => allProducts.find((p) => p.slug === slug) ?? null,
    [slug]
  );

  const relatedProducts = useMemo(
    () =>
      product
        ? allProducts
            .filter((x) => x.categoryId === product.categoryId && x.id !== product.id)
            .slice(0, 4)
        : [],
    [product]
  );

  const rawCategory = categories.find(
    (c) => c.id === product?.categoryId || c.slug === product?.categoryId
  );

  const displayProduct = product ? getTranslatedProduct(product, language) : null;
  const displayCategory = rawCategory
    ? getTranslatedCategory(rawCategory.slug, language, rawCategory.name)
    : null;

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 text-center px-4 pt-20">
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy-950 mb-3">
          {t("catNotFound")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-8 max-w-md">
          {t("catNoProductsDesc")}
        </p>
        <Link
          href="/categorias"
          className="btn-primary-corp"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToCatalog")}
        </Link>
      </div>
    );
  }

  const favorite = isFavorite(product.id);
  const currentProd = displayProduct || product;
  const categoryName = displayCategory || rawCategory?.name || currentProd.categoryId;

  // Ficha técnica específica del producto. Si el código no tiene ficha propia,
  // el botón NO se muestra (evita contenido genérico). La ficha general siempre está disponible.
  const productSheet = currentProd.technicalSheet;
  const generalSheetUrl = "/pdf/ficha-tecnica";

  return (
    <div className="min-h-screen bg-slate-50/70 pt-[80px] pb-24 font-sans text-slate-900">
      
      {/* ── BREADCRUMB ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <nav className="flex items-center text-xs font-semibold text-slate-500 flex-wrap gap-1.5 uppercase tracking-wider">
          <Link href="/" className="hover:text-primary-600 transition-colors">
            {t("navHome")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <Link href="/categorias" className="hover:text-primary-600 transition-colors">
            {t("navCatalog")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <Link
            href={`/categorias`}
            className="hover:text-primary-600 transition-colors font-bold text-slate-700"
          >
            {categoryName}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-navy-950 font-bold truncate max-w-xs">
            {currentProd.name}
          </span>
        </nav>
      </div>

      {/* ── MAIN PRODUCT SECTION ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-sm flex flex-col lg:flex-row gap-10 lg:gap-14">
          
          {/* Left Column: visor con las fotos reales (giro arrastrando / 360) */}
          <div className="w-full lg:w-1/2">
            <ProductPhotoViewer
              images={currentProd.images}
              alt={currentProd.name}
              frames={PANORAMAS[currentProd.slug]}
              t={t}
              overlay={
                <>
                  {currentProd.isNew && (
                    <span className="bg-accent-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-md shadow-xs">
                      {t("badgeNew")}
                    </span>
                  )}
                  {currentProd.homologado && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 text-[10px] font-bold uppercase rounded-md shadow-xs">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      {t("catHomologated")}
                    </span>
                  )}
                  <button
                    onClick={() => toggleFavorite(currentProd)}
                    className={cn(
                      "h-9 w-9 rounded-lg bg-white/90 border border-slate-200 shadow-xs transition-all hover:scale-105 flex items-center justify-center",
                      favorite ? "text-red-500" : "text-slate-400 hover:text-slate-900"
                    )}
                    title={t("favorite")}
                    aria-label={t("favorite")}
                  >
                    <Heart className={cn("h-4 w-4", favorite && "fill-current")} />
                  </button>
                </>
              }
            />
          </div>

          {/* Right Column: Product Detail */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-md border border-primary-100">
                  {categoryName}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {t("product.code")}: {currentProd.code}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-navy-950 leading-tight mb-3">
                {currentProd.name}
              </h1>

              {/* Data-Driven Translated Tags */}
              {currentProd.tags && currentProd.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {currentProd.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {getTranslatedTag(tag, language)}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {currentProd.description}
              </p>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {currentProd.sizeInfo && (
                  <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
                    <Ruler className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {t("prodDimensions")}
                      </p>
                      <p className="text-xs font-bold text-navy-950">
                        {currentProd.sizeInfo}
                      </p>
                    </div>
                  </div>
                )}
                {currentProd.diameter && (
                  <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
                    <Layers className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {t("prodDiameter")}
                      </p>
                      <p className="text-xs font-bold text-navy-950">
                        {currentProd.diameter}
                      </p>
                    </div>
                  </div>
                )}
                {currentProd.specs?.slice(0, 2).map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-slate-50 rounded-xl p-3.5 border border-slate-200/80"
                  >
                    <div className="h-4 w-4 shrink-0 mt-0.5 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {spec.label}
                      </p>
                      <p className="text-xs font-bold text-navy-950">
                        {spec.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Features List */}
              {currentProd.features && currentProd.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                    {t("prodFeatures")}
                  </h3>
                  <ul className="space-y-2">
                    {currentProd.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-xs text-slate-700 font-medium"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  addToCart(currentProd);
                  setCartOpen(true);
                }}
                disabled={!currentProd.inStock}
                className="btn-primary-corp flex-1 h-12"
              >
                <ShoppingCart className="h-4 w-4" />
                {t("addToQuote")}
              </button>

              {productSheet && (
                <a
                  href={productSheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-corp h-12"
                >
                  <Download className="h-4 w-4 text-primary-600" />
                  {t("techSheet")}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── 3 INTERACTIVE TABS: SPECS / INSTALLATION / DOWNLOADS ── */}
        <div className="mt-10 bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
          <div className="border-b border-slate-200 mb-8 overflow-x-auto scrollbar-none">
            <nav className="flex space-x-8 min-w-max">
              <button
                onClick={() => setActiveTab("specs")}
                className={cn(
                  "py-3 px-1 text-xs font-bold border-b-2 transition-colors flex items-center gap-2",
                  activeTab === "specs"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-slate-400 hover:text-navy-950"
                )}
              >
                <Table2 className="h-3.5 w-3.5" />
                {t("specs")}
              </button>
              <button
                onClick={() => setActiveTab("downloads")}
                className={cn(
                  "py-3 px-1 text-xs font-bold border-b-2 transition-colors flex items-center gap-2",
                  activeTab === "downloads"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-slate-400 hover:text-navy-950"
                )}
              >
                <FileDown className="h-3.5 w-3.5" />
                {t("techDocuments")}
              </button>
            </nav>
          </div>

          {/* TAB 1: SPECS & MODELS TABLE */}
          {activeTab === "specs" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-heading font-extrabold text-navy-950 mb-4">
                    {t("specsMatrix")}
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-3">
                    {currentProd.sizeInfo ? (
                      <div className="flex justify-between py-2 border-b border-slate-200 text-xs">
                        <span className="font-medium text-slate-500">{t("specsDimensions")}</span>
                        <span className="font-bold text-navy-950">{currentProd.sizeInfo}</span>
                      </div>
                    ) : null}
                    {currentProd.diameter ? (
                      <div className="flex justify-between py-2 border-b border-slate-200 text-xs">
                        <span className="font-medium text-slate-500">{t("specsDiameterRange")}</span>
                        <span className="font-bold text-primary-600">{currentProd.diameter}</span>
                      </div>
                    ) : null}
                    {currentProd.specs?.map((spec, idx) => (
                      <div key={idx} className="flex justify-between py-2 border-b border-slate-200 text-xs last:border-0">
                        <span className="font-medium text-slate-500">{spec.label}</span>
                        <span className="font-bold text-navy-950">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
                    {t("product.specsNote")}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-heading font-extrabold text-navy-950 mb-4">
                    {t("standardsTitle")}
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-navy-950 uppercase">{t("standardsIram")}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Fabricación bajo estándares internacionales con polímeros vírgenes de alta densidad y filtro UV.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                        💧
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-navy-950 uppercase">{t("standardsPotableWater")}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Compatible con redes de distribución domiciliaria e industrial de prestatarias sanitarias.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Models Matrix Table if present */}
              {currentProd.models && currentProd.models.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-heading font-extrabold text-navy-950 mb-3">
                    Modelos y Variantes Disponibles ({currentProd.models.length})
                  </h3>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-navy-950 text-white uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3">{t("common.code")}</th>
                          <th className="py-2.5 px-3">Modelo</th>
                          {currentProd.models.some(m => m.diameter) && <th className="py-2.5 px-3">Diámetro</th>}
                          {currentProd.models.some(m => m.material) && <th className="py-2.5 px-3">Material</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {currentProd.models.map((mod, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-mono font-bold text-primary-600">{mod.code}</td>
                            <td className="py-2.5 px-3 font-semibold text-navy-950">{mod.name}</td>
                            {currentProd.models?.some(m => m.diameter) && (
                              <td className="py-2.5 px-3 text-slate-600">{mod.diameter || "—"}</td>
                            )}
                            {currentProd.models?.some(m => m.material) && (
                              <td className="py-2.5 px-3 text-slate-600">{mod.material || "—"}</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DOWNLOADS */}
          {activeTab === "downloads" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ficha técnica específica de este producto (solo si el código tiene PDF propio) */}
              {productSheet && (
                <a
                  href={productSheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-primary-600 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                      PDF
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-navy-950 group-hover:text-primary-600 transition-colors">
                        {t("techSheet")}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {currentProd.code} · Especificaciones de este producto
                      </p>
                    </div>
                  </div>
                  <Download className="h-4 w-4 text-slate-400 group-hover:text-primary-600" />
                </a>
              )}

              {/* Ficha técnica general (disponible para todos los productos) */}
              <a
                href={generalSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-primary-600 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-950 group-hover:text-primary-600 transition-colors">
                      {t("techSheetGeneral")}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {t("techSheetGeneralDesc")}
                    </p>
                  </div>
                </div>
                <Download className="h-4 w-4 text-slate-400 group-hover:text-primary-600" />
              </a>

            </div>
          )}
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-14">
            <h2 className="text-lg font-heading font-extrabold text-navy-950 mb-6">
              {t("relatedProducts")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
