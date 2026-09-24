"use client";

import React, { useState, useEffect } from "react";
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
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { getProductBySlug, getProducts, categories } from "@/data/mock";
import { Product } from "@/types";
import { useStore } from "@/store/useStore";
import {
  useTranslation,
  getTranslatedCategory,
  getTranslatedProduct,
  getTranslatedTag,
} from "@/i18n";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"specs" | "installation" | "downloads">("specs");

  const { addToCart, toggleFavorite, isFavorite, setCartOpen, language } = useStore();
  const t = useTranslation(language);

  const rawCategory = categories.find((c) => c.id === product?.categoryId || c.slug === product?.categoryId);

  const displayProduct = product ? getTranslatedProduct(product, language) : null;
  const displayCategory = rawCategory ? getTranslatedCategory(rawCategory.slug, language, rawCategory.name) : null;

  useEffect(() => {
    setIsLoading(true);
    getProductBySlug(slug).then((p) => {
      setProduct(p || null);
      if (p) {
        getProducts().then((all) => {
          setRelatedProducts(
            all.filter((x) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 4)
          );
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/70 pt-[80px] pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-1/2 space-y-4">
              <Skeleton className="h-[480px] w-full rounded-3xl" />
              <div className="flex gap-4">
                <Skeleton className="h-20 w-20 rounded-xl" />
                <Skeleton className="h-20 w-20 rounded-xl" />
              </div>
            </div>
            <div className="w-full lg:w-1/2 space-y-6 pt-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-950 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-primary-600 transition-all"
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

  // Technical sheet PDF link (official document from downloads/LP folder if exists)
  const techSheetUrl = currentProd.technicalSheet || "/pdf/ficha-tecnica";

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
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row gap-10 lg:gap-14">
          
          {/* Left Column: Image Gallery */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-square rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-8 overflow-hidden mb-4">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                src={currentProd.images[activeImage] || "https://placehold.co/800"}
                alt={currentProd.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
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
              </div>

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(currentProd)}
                className={cn(
                  "absolute top-4 right-4 p-2.5 rounded-full bg-white shadow-xs border border-slate-200 transition-all hover:scale-105",
                  favorite ? "text-red-500" : "text-slate-400 hover:text-slate-900"
                )}
                title={t("favorite")}
                aria-label={t("favorite")}
              >
                <Heart className={cn("h-4 w-4", favorite && "fill-current")} />
              </button>
            </div>

            {/* Thumbnails */}
            {currentProd.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {currentProd.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "relative shrink-0 w-18 h-18 rounded-lg border-2 overflow-hidden bg-slate-50 p-1.5 transition-all",
                      activeImage === idx
                        ? "border-primary-600 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                    )}
                  >
                    <img
                      src={img}
                      alt={`Vista ${idx + 1}`}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Detail */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-md border border-primary-100">
                  {categoryName}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  SKU: {currentProd.code}
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
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-navy-950 hover:bg-primary-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow-md disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4" />
                {t("addToQuote")}
              </button>

              <a
                href={techSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-300 hover:border-primary-600 bg-white text-navy-950 hover:text-primary-600 font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
              >
                <Download className="h-4 w-4 text-primary-600" />
                {t("techSheet")}
              </a>
            </div>
          </div>
        </div>

        {/* ── 3 INTERACTIVE TABS: SPECS / INSTALLATION / DOWNLOADS ── */}
        <div className="mt-10 bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-xs">
          <div className="border-b border-slate-200 mb-8 overflow-x-auto scrollbar-none">
            <nav className="flex space-x-8 min-w-max">
              <button
                onClick={() => setActiveTab("specs")}
                className={cn(
                  "py-3 px-1 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2",
                  activeTab === "specs"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-slate-400 hover:text-navy-950"
                )}
              >
                📊 {t("specs")}
              </button>
              <button
                onClick={() => setActiveTab("installation")}
                className={cn(
                  "py-3 px-1 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2",
                  activeTab === "installation"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-slate-400 hover:text-navy-950"
                )}
              >
                🛠️ {t("installationGuide")}
              </button>
              <button
                onClick={() => setActiveTab("downloads")}
                className={cn(
                  "py-3 px-1 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2",
                  activeTab === "downloads"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-slate-400 hover:text-navy-950"
                )}
              >
                📥 {t("techDocuments")}
              </button>
            </nav>
          </div>

          {/* TAB 1: SPECS & MODELS TABLE */}
          {activeTab === "specs" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-heading font-extrabold text-navy-950 uppercase tracking-wider mb-4">
                    {t("specsMatrix")}
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-3">
                    <div className="flex justify-between py-2 border-b border-slate-200 text-xs">
                      <span className="font-medium text-slate-500">{t("specsDimensions")}</span>
                      <span className="font-bold text-navy-950">{currentProd.sizeInfo || "Consulte plano técnico"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-200 text-xs">
                      <span className="font-medium text-slate-500">{t("specsDiameterRange")}</span>
                      <span className="font-bold text-primary-600">{currentProd.diameter || "DN 20 a DN 110 mm"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-200 text-xs">
                      <span className="font-medium text-slate-500">{t("specsPressure")}</span>
                      <span className="font-bold text-navy-950">PN 10 / PN 16 BAR</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-200 text-xs">
                      <span className="font-medium text-slate-500">{t("specsTorque")}</span>
                      <span className="font-mono font-bold text-emerald-600">25 N·m - 35 N·m</span>
                    </div>
                    {currentProd.specs?.map((spec, idx) => (
                      <div key={idx} className="flex justify-between py-2 border-b border-slate-200 text-xs last:border-0">
                        <span className="font-medium text-slate-500">{spec.label}</span>
                        <span className="font-bold text-navy-950">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-heading font-extrabold text-navy-950 uppercase tracking-wider mb-4">
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
                  <h3 className="text-sm font-heading font-extrabold text-navy-950 uppercase tracking-wider mb-3">
                    Modelos y Variantes Disponibles ({currentProd.models.length})
                  </h3>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-navy-950 text-white uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3">SKU</th>
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

          {/* TAB 2: INSTALLATION */}
          {activeTab === "installation" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                    <ShieldCheck className="h-3.5 w-3.5" /> {t("installProtocol")}
                  </span>
                  <h3 className="text-lg font-heading font-extrabold text-navy-950">
                    {t("installTitle")}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                  NTM-PROD-2026
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { step: "01", title: t("installStep1Title"), desc: t("installStep1Desc") },
                  { step: "02", title: t("installStep2Title"), desc: t("installStep2Desc") },
                  { step: "03", title: t("installStep3Title"), desc: t("installStep3Desc") },
                  { step: "04", title: t("installStep4Title"), desc: t("installStep4Desc") },
                ].map((s, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex gap-3">
                    <span className="w-8 h-8 rounded-lg bg-navy-950 text-white font-mono font-extrabold text-xs flex items-center justify-center shrink-0">
                      {s.step}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-navy-950 uppercase mb-1">{s.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DOWNLOADS */}
          {activeTab === "downloads" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={techSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-primary-600 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-950 group-hover:text-primary-600 transition-colors uppercase">
                      {t("techSheetUnified")}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tabla de dimensiones, plano y tolerancias de fábrica
                    </p>
                  </div>
                </div>
                <Download className="h-4 w-4 text-slate-400 group-hover:text-primary-600" />
              </a>

              <a
                href="/pdf/catalogo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-primary-600 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-navy-950 text-white flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-950 group-hover:text-primary-600 transition-colors uppercase">
                      {t("generalCatalogPdf")}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Catálogo completo con todas las familias y códigos
                    </p>
                  </div>
                </div>
                <Download className="h-4 w-4 text-slate-400 group-hover:text-primary-600" />
              </a>

              <a
                href="/certificados/PRODELEC-SRL-ISO-9001-2015.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-600 transition-all group sm:col-span-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    ISO
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-950 group-hover:text-emerald-700 transition-colors uppercase">
                      {t("isoCertPdf")} — PRODELEC S.R.L.
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Acreditación oficial OAA AR-O241697 v01
                    </p>
                  </div>
                </div>
                <Download className="h-4 w-4 text-slate-400 group-hover:text-emerald-600" />
              </a>
            </div>
          )}
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-14">
            <h2 className="text-lg font-heading font-extrabold text-navy-950 mb-6 uppercase tracking-wider">
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
