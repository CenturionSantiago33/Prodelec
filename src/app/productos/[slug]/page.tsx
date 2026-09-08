"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Heart,
  Download,
  Check,
  ShieldCheck,
  Share2,
  Search,
  CheckCircle2,
  ArrowLeft,
  ShoppingCart,
  Ruler,
  Layers,
  FileText,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { getProductBySlug, getProducts, categories } from "@/data/mock";
import { Product } from "@/types";
import { useStore } from "@/store/useStore";
import { getTranslatedCategory, getTranslatedProduct } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const rawCategory = categories.find((c) => c.id === product?.categoryId);

  const displayProduct = product ? getTranslatedProduct(product, language) : null;
  const displayCategory = rawCategory ? getTranslatedCategory(rawCategory, language) : null;

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
        <h1 className="text-3xl font-heading font-extrabold text-navy-950 mb-4">
          Producto no encontrado
        </h1>
        <p className="text-sm text-slate-500 mb-8 max-w-md">
          El producto que buscas no existe en el catálogo o ha sido renombrado.
        </p>
        <Link
          href="/categorias"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-950 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-primary-600 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  const favorite = isFavorite(product.id);
  const currentProd = displayProduct || product;
  const category = displayCategory;

  return (
    <div className="min-h-screen bg-slate-50/70 pt-[80px] pb-24 font-sans text-slate-900">
      
      {/* ── BREADCRUMB ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center text-xs font-medium text-slate-500 flex-wrap gap-1.5">
          <Link href="/" className="hover:text-primary-600 transition-colors">
            Inicio
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <Link href="/categorias" className="hover:text-primary-600 transition-colors">
            Catálogo
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <Link
            href={`/categorias`}
            className="hover:text-primary-600 transition-colors capitalize font-semibold text-slate-700"
          >
            {category?.name || currentProd.categoryId}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-navy-950 font-bold truncate max-w-xs">
            {currentProd.name}
          </span>
        </nav>
      </div>

      {/* ── MAIN PRODUCT SECTION ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm flex flex-col lg:flex-row gap-10 lg:gap-14">
          
          {/* Left Column: Image Gallery */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-square rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-center p-8 overflow-hidden mb-4 shadow-inner">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={currentProd.images[activeImage] || "https://placehold.co/800"}
                alt={currentProd.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {currentProd.isNew && (
                  <span className="bg-electric text-navy-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-xs">
                    NUEVO
                  </span>
                )}
                {currentProd.homologado && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-[10px] font-bold uppercase rounded-full shadow-xs">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Homologado IRAM
                  </span>
                )}
              </div>

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(currentProd)}
                className={cn(
                  "absolute top-4 right-4 p-3 rounded-full bg-white shadow-md border border-slate-100 transition-all hover:scale-105",
                  favorite ? "text-red-500" : "text-slate-400 hover:text-slate-900"
                )}
                title="Guardar en Favoritos"
              >
                <Heart className={cn("h-5 w-5", favorite && "fill-current")} />
              </button>
            </div>

            {/* Thumbnails */}
            {currentProd.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {currentProd.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "relative shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden bg-slate-50 p-2 transition-all",
                      activeImage === idx
                        ? "border-primary-600 shadow-sm"
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
                <span className="text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                  {category?.name || currentProd.categoryId}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-400">
                  SKU: {currentProd.code}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-navy-950 leading-tight mb-4">
                {currentProd.name}
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {currentProd.description}
              </p>

              {/* Key Specs Pills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {currentProd.sizeInfo && (
                  <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                    <Ruler className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Medida / Dimensiones
                      </p>
                      <p className="text-sm font-semibold text-navy-950">
                        {currentProd.sizeInfo}
                      </p>
                    </div>
                  </div>
                )}
                {currentProd.diameter && (
                  <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                    <Layers className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Diámetro Nominal (DN)
                      </p>
                      <p className="text-sm font-semibold text-navy-950">
                        {currentProd.diameter}
                      </p>
                    </div>
                  </div>
                )}
                {currentProd.specs?.slice(0, 2).map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-slate-50 rounded-xl p-3.5 border border-slate-100"
                  >
                    <div className="h-4 w-4 shrink-0 mt-0.5 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {spec.label}
                      </p>
                      <p className="text-sm font-semibold text-navy-950">
                        {spec.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Features List */}
              {currentProd.features && currentProd.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Características Principales
                  </h3>
                  <ul className="space-y-2">
                    {currentProd.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2.5 text-sm text-slate-700"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
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
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-navy-950 hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4" />
                Agregar a Cotización
              </button>

              <a
                href="/pdf/ficha-tecnica"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all"
              >
                <Download className="h-4 w-4" />
                Ficha PDF
              </a>
            </div>
          </div>
        </div>

        {/* ── 3 INTERACTIVE TABS: SPECS / INSTALLATION / DOWNLOADS ── */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
          <div className="border-b border-slate-200 mb-8 overflow-x-auto scrollbar-none">
            <nav className="flex space-x-8 min-w-max">
              <button
                onClick={() => setActiveTab("specs")}
                className={cn(
                  "py-4 px-1 text-xs sm:text-sm font-extrabold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2",
                  activeTab === "specs"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-slate-400 hover:text-navy-950"
                )}
              >
                📊 Medidas y Especificaciones
              </button>
              <button
                onClick={() => setActiveTab("installation")}
                className={cn(
                  "py-4 px-1 text-xs sm:text-sm font-extrabold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2",
                  activeTab === "installation"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-slate-400 hover:text-navy-950"
                )}
              >
                🛠️ Guía Técnica de Instalación
              </button>
              <button
                onClick={() => setActiveTab("downloads")}
                className={cn(
                  "py-4 px-1 text-xs sm:text-sm font-extrabold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2",
                  activeTab === "downloads"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-slate-400 hover:text-navy-950"
                )}
              >
                📥 Documentación PDF
              </button>
            </nav>
          </div>

          {/* TAB 1: SPECS */}
          {activeTab === "specs" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <h3 className="text-base font-heading font-extrabold text-navy-950 uppercase mb-4">
                  Matriz de Dimensiones Técnicas
                </h3>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-200 text-xs">
                    <span className="font-medium text-slate-500">Medida / Dimensiones Físicas</span>
                    <span className="font-bold text-navy-950">{currentProd.sizeInfo || "Consulte plano técnico"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200 text-xs">
                    <span className="font-medium text-slate-500">Rango de Diámetro Nominal (DN)</span>
                    <span className="font-bold text-primary-600">{currentProd.diameter || "DN 20 a DN 110 mm"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200 text-xs">
                    <span className="font-medium text-slate-500">Presión Nominal Admisible</span>
                    <span className="font-bold text-navy-950">PN 10 / PN 16 BAR</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200 text-xs">
                    <span className="font-medium text-slate-500">Torque de Ajuste Recomendado</span>
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
                <h3 className="text-base font-heading font-extrabold text-navy-950 uppercase mb-4">
                  Estándares y Homologación
                </h3>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-navy-950 uppercase">Norma IRAM / ISO 9001</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Fabricación bajo estándares internacionales con polímeros vírgenes de alta densidad y filtro UV.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                      💧
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-navy-950 uppercase">Apto para Agua Potable</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Compatible con redes de distribución domiciliaria e industrial de prestatarias sanitarias.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3D VIEWER */}
          {/* TAB 2: INSTALLATION */}
          {activeTab === "installation" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                    <ShieldCheck className="h-3.5 w-3.5" /> Protocolo de Obra Prodelec
                  </span>
                  <h3 className="text-xl font-heading font-extrabold text-navy-950">
                    Guía Técnica de Instalación Certificada
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                  Norma NTM-PROD-2026
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { step: "01", title: "Inspección y Preparación del Tubo", desc: "Verificar cañería libre de rebabas. Biselar el extremo del tubo a 15° para preservar el sello de goma." },
                  { step: "02", title: "Limpieza y Lubricación Atóxica", desc: "Limpiar zona de asiento con paño seco. Aplicar lubricante atóxico de silicona certificado NSF/ANSI 61." },
                  { step: "03", title: "Alineación Axial", desc: "Presentar la pieza con alineación axial directa. Verificar la inserción del sello sin arrugas." },
                  { step: "04", title: "Ajuste de Bulonería y Torque", desc: "Ajustar alternadamente en cruz con llave dinamométrica entre 25 N·m y 35 N·m." },
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
                href="/pdf/ficha-tecnica"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-primary-600 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-950 group-hover:text-primary-600 transition-colors uppercase">
                      Ficha Técnica Unificada
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tabla de dimensiones y tolerancias
                    </p>
                  </div>
                </div>
                <Download className="h-4 w-4 text-slate-400 group-hover:text-primary-600" />
              </a>

              <a
                href="/pdf/catalogo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-primary-600 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-950 text-white flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-950 group-hover:text-primary-600 transition-colors uppercase">
                      Catálogo General Prodelec
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Catálogo completo de 10 familias
                    </p>
                  </div>
                </div>
                <Download className="h-4 w-4 text-slate-400 group-hover:text-primary-600" />
              </a>

              <a
                href="/certificados/PRODELEC-SRL-ISO-9001-2015.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-600 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    ISO
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-950 group-hover:text-emerald-700 transition-colors uppercase">
                      Certificado ISO 9001:2015 — PRODELEC S.R.L.
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
          <div className="mt-16">
            <h2 className="text-xl font-heading font-extrabold text-navy-950 mb-6 uppercase">
              Productos Relacionados de esta Familia
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
