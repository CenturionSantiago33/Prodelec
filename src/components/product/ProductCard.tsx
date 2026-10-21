"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Ruler, ArrowRight, FileText, Check } from "lucide-react";
import { Product } from "@/types";
import { useStore } from "@/store/useStore";
import { useTranslation, getTranslatedCategory, getTranslatedProduct } from "@/i18n";
import { useCatalog } from "@/components/system/CatalogProvider";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product: rawProduct, viewMode = "grid" }: ProductCardProps) {
  const { addToCart, setCartOpen, language } = useStore();
  const { categories: rawCategories } = useCatalog();
  const t = useTranslation(language);

  const product = getTranslatedProduct(rawProduct, language);
  const rawCategory = rawCategories.find((c) => c.id === product.categoryId);
  const category = rawCategory ? getTranslatedCategory(rawCategory, language) : null;

  const familyColor = product.familyColor || category?.color || "#1a65b5";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setCartOpen(true);
  };

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <div className="group relative flex flex-col sm:flex-row overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md">
        {/* Imagen */}
        <Link
          href={`/productos/${product.slug}`}
          className="relative flex shrink-0 items-center justify-center border-b border-slate-100 bg-white p-6 sm:w-56 sm:border-b-0 sm:border-r"
          style={{ minHeight: "170px" }}
        >
          <img
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.name}
            className="max-h-[150px] max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {product.homologado && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-navy-950 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
              <Check className="h-3 w-3" />
              {t("badge.homologado")}
            </span>
          )}
        </Link>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span
                className="font-heading font-semibold text-[11.5px] leading-tight"
                style={{ color: familyColor }}
              >
                {category?.name || product.categoryId}
              </span>
              <span className="font-mono text-[11px] font-medium text-slate-400">
                {product.code}
              </span>
            </div>

            <Link href={`/productos/${product.slug}`}>
              <h3 className="mb-2 font-heading font-bold leading-snug text-navy-950 text-base transition-colors group-hover:text-primary-700">
                {product.name}
              </h3>
            </Link>

            <p className="mb-3 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
              {product.description}
            </p>

            {(product.sizeInfo || product.diameter) && (
              <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-500">
                {product.sizeInfo && (
                  <span className="inline-flex items-center gap-1.5">
                    <Ruler className="h-3.5 w-3.5 text-slate-400" />
                    {product.sizeInfo}
                  </span>
                )}
                {product.diameter && (
                  <span className="font-mono">DN {product.diameter}</span>
                )}
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-4">
              <Link
                href={`/productos/${product.slug}`}
                className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-primary-700 transition-colors hover:text-primary-900"
              >
                {t("common.viewFull")} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              {product.technicalSheet && (
                <a
                  href={product.technicalSheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-slate-500 transition-colors hover:text-navy-950"
                >
                  <FileText className="h-3.5 w-3.5" />
                  {t("common.technicalSheet")}
                </a>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="btn-primary-corp px-4 py-2 text-xs"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {t("nav.quote")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── GRID VIEW ──────────────────────────────────────────────────────────────
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md">
      {/* Imagen */}
      <Link
        href={`/productos/${product.slug}`}
        className="relative flex items-center justify-center border-b border-slate-100 bg-white p-5"
        style={{ height: "196px" }}
      >
        <img
          src={product.images[0] || "/placeholder.jpg"}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {product.homologado && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-navy-950 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
            <Check className="h-3 w-3" />
            {t("badge.homologado")}
          </span>
        )}

        {product.isNew && (
          <span className="absolute right-3 top-3 rounded-md bg-primary-600 px-2 py-0.5 text-[10px] font-semibold text-white">
            {t("badge.new")}
          </span>
        )}
      </Link>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <span
            className="line-clamp-1 font-heading font-semibold text-[11px] leading-tight"
            style={{ color: familyColor }}
          >
            {category?.name || product.categoryId}
          </span>
          <span className="shrink-0 font-mono text-[11px] font-medium text-slate-400">
            {product.code}
          </span>
        </div>

        <Link href={`/productos/${product.slug}`} className="mb-2 block">
          <h3 className="line-clamp-2 font-heading font-bold leading-snug text-navy-950 text-[14px] transition-colors group-hover:text-primary-700">
            {product.name}
          </h3>
        </Link>

        {product.sizeInfo && (
          <div className="mb-2 flex items-center gap-1.5 text-[12px] text-slate-500">
            <Ruler className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{product.sizeInfo}</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <Link
            href={`/productos/${product.slug}`}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary-700 transition-colors hover:text-primary-900"
          >
            {t("common.viewFull")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="btn-primary-corp px-3 py-1.5 text-[11.5px]"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>{t("nav.quote")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
