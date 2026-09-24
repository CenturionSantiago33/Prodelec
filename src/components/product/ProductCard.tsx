"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Ruler, ArrowRight, FileText, CheckCircle2 } from "lucide-react";
import { Product } from "@/types";
import { useStore } from "@/store/useStore";
import { useTranslation, getTranslatedCategory, getTranslatedProduct, getTranslatedTag } from "@/i18n";
import { categories as rawCategories } from "@/data/products";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product: rawProduct, viewMode = "grid" }: ProductCardProps) {
  const { addToCart, setCartOpen, language } = useStore();
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
      <div
        className="group relative flex flex-col sm:flex-row bg-white hover:bg-slate-50/80 transition-colors border border-slate-200 shadow-xs"
        style={{ borderTop: `3px solid ${familyColor}` }}
      >
        {/* Imagen */}
        <Link
          href={`/productos/${product.slug}`}
          className="relative shrink-0 w-full sm:w-56 bg-slate-50 flex items-center justify-center p-6 overflow-hidden border-b sm:border-b-0 sm:border-r border-slate-200"
          style={{ minHeight: "170px" }}
        >
          <img
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            style={{ mixBlendMode: "multiply", maxHeight: "150px" }}
          />
          {product.homologado && (
            <div
              className="absolute top-2 left-2 bg-navy-950 text-sky-300 px-2 py-0.5 font-heading font-extrabold uppercase text-[9px] tracking-wider border border-sky-400/30 shadow-xs"
            >
              {t("badge.homologado")}
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex flex-col flex-1 justify-between p-5">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span
                className="font-heading font-bold uppercase tracking-wider text-[11px]"
                style={{ color: familyColor }}
              >
                {category?.name || product.categoryId}
              </span>
              <span className="font-mono text-slate-500 font-semibold text-[11px] bg-slate-100 px-2 py-0.5 border border-slate-200">
                {product.code}
              </span>
            </div>

            <Link href={`/productos/${product.slug}`}>
              <h3 className="font-heading font-bold text-navy-950 text-base mb-2 group-hover:text-primary-700 transition-colors leading-snug">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">
              {product.description}
            </p>

            {/* Spec pills & tags */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {product.sizeInfo && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 border border-slate-200">
                  <Ruler className="h-3 w-3 text-slate-400" />
                  {product.sizeInfo}
                </span>
              )}
              {product.diameter && (
                <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 border border-slate-200 font-mono">
                  DN: {product.diameter}
                </span>
              )}

              {/* Data-driven tags */}
              {product.tags &&
                product.tags.map((tagKey) => (
                  <span
                    key={tagKey}
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {getTranslatedTag(tagKey, language)}
                  </span>
                ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 mt-2">
            <div className="flex items-center gap-3">
              <Link
                href={`/productos/${product.slug}`}
                className="text-xs font-heading font-bold text-primary-700 hover:text-primary-900 uppercase tracking-wider flex items-center gap-1 transition-colors"
              >
                {t("common.viewFull")} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              {product.technicalSheet && (
                <a
                  href={product.technicalSheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-navy-950 transition-colors"
                >
                  <FileText className="h-3 w-3 text-red-600" />
                  {t("common.technicalSheet")}
                </a>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="btn-primary-corp py-2 px-4 text-xs font-heading"
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
              {t("nav.quote")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── GRID VIEW ──────────────────────────────────────────────────────────────
  return (
    <div
      className="group relative flex flex-col h-full bg-white hover:bg-slate-50/60 transition-colors border border-slate-200 shadow-xs"
      style={{ borderTop: `3px solid ${familyColor}` }}
    >
      {/* Product Image */}
      <Link
        href={`/productos/${product.slug}`}
        className="relative bg-slate-50 flex items-center justify-center p-6 overflow-hidden border-b border-slate-200"
        style={{ height: "210px" }}
      >
        <img
          src={product.images[0] || "/placeholder.jpg"}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          style={{ mixBlendMode: "multiply" }}
        />

        {/* Badge Homologado */}
        {product.homologado && (
          <div
            className="absolute top-2.5 left-2.5 bg-navy-950 text-sky-300 px-2 py-0.5 font-heading font-extrabold uppercase text-[9px] tracking-wider border border-sky-400/30 shadow-xs"
          >
            {t("badge.homologado")}
          </div>
        )}

        {/* New badge */}
        {product.isNew && (
          <div className="absolute top-2.5 right-2.5 bg-primary-600 text-white px-2 py-0.5 font-heading font-bold uppercase text-[9px] tracking-wider">
            {t("badge.new")}
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Header: Family & Code */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <span
            className="font-heading font-bold uppercase tracking-wider text-[10px] leading-tight line-clamp-1"
            style={{ color: familyColor }}
          >
            {category?.name || product.categoryId}
          </span>
          <span className="font-mono text-slate-500 font-semibold text-[10px] shrink-0 bg-slate-100 px-1.5 py-0.5 border border-slate-200">
            {product.code}
          </span>
        </div>

        {/* Name */}
        <Link href={`/productos/${product.slug}`} className="block mb-2">
          <h3 className="font-heading font-bold text-navy-950 text-[14px] leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Dimensions / Size info */}
        {product.sizeInfo && (
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-2 font-mono">
            <Ruler className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="truncate">{product.sizeInfo}</span>
          </div>
        )}

        {/* Data-driven translated tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tagKey) => (
              <span
                key={tagKey}
                className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200"
              >
                {getTranslatedTag(tagKey, language)}
              </span>
            ))}
          </div>
        )}

        {/* Card Action Footer */}
        <div className="mt-auto pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
          <Link
            href={`/productos/${product.slug}`}
            className="text-[11px] font-heading font-bold text-primary-700 hover:text-primary-900 uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            {t("common.viewFull")} <ArrowRight className="h-3 w-3" />
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="btn-primary-corp py-1.5 px-3 text-[11px] font-heading flex items-center gap-1"
          >
            <ShoppingCart className="h-3 w-3" />
            <span>{t("nav.quote")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
