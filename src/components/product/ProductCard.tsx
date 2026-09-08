"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, ShieldCheck, Ruler, ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { useStore } from "@/store/useStore";
import { useTranslation, getTranslatedCategory, getTranslatedProduct } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { categories as rawCategories } from "@/data/mock";

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    setCartOpen(true);
  };

  // ── LIST VIEW (Sobrio & Minimalista) ──────────────────────────
  if (viewMode === "list") {
    return (
      <Link
        href={`/productos/${product.slug}`}
        className="group flex flex-col sm:flex-row gap-6 p-5 bg-white border border-gray-200/80 rounded-2xl hover:border-gray-300 hover:shadow-md transition-all duration-300"
      >
        {/* Image */}
        <div className="relative shrink-0 w-full sm:w-48 h-48 bg-slate-50/70 rounded-xl overflow-hidden border border-gray-100 p-5 flex items-center justify-center">
          <img
            src={product.images[0] || "https://placehold.co/400"}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          />
          {product.homologado && (
            <div className="absolute top-3 left-3 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold uppercase rounded-md shadow-xs">
              ✓ Homologado
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 justify-between py-1">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider">
                {category?.name || product.categoryId}
              </span>
              <span className="text-xs font-mono text-gray-400">· SKU: {product.code}</span>
            </div>
            
            <h3 className="text-lg font-heading font-extrabold text-navy-950 mb-2 leading-tight group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
            
            {product.sizeInfo && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-3">
                <Ruler className="h-3.5 w-3.5 text-gray-400" />
                {product.sizeInfo}
              </div>
            )}
            
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{product.description}</p>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
            <span className="text-xs font-bold text-navy-950 group-hover:text-primary-600 flex items-center gap-1 transition-colors">
              {t("catViewFull")} <ArrowRight className="h-3.5 w-3.5" />
            </span>
            <Button
              size="sm"
              className="ml-auto bg-navy-950 hover:bg-primary-600 text-white font-bold text-xs px-5 h-9 rounded-xl transition-all"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
              {t("catAddToQuote")}
            </Button>
          </div>
        </div>
      </Link>
    );
  }

  // ── GRID VIEW (Sobrio & Minimalista) ──────────────────────────
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group flex flex-col h-full bg-white border-2 border-slate-300 rounded-2xl overflow-hidden hover:border-primary-600 hover:shadow-2xl transition-all duration-300 shadow-md"
    >
      {/* Image container */}
      <div className="relative aspect-square bg-slate-50/90 flex items-center justify-center border-b-2 border-slate-100 p-6 overflow-hidden">
        <img
          src={product.images[0] || "https://placehold.co/400"}
          alt={product.name}
          className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
        />

        {/* Clean Homologado Badge */}
        {product.homologado && (
          <div className="absolute top-3 left-3 bg-emerald-50 text-emerald-700 border border-emerald-300 px-2.5 py-1 text-[10px] font-bold uppercase rounded-md shadow-xs">
            ✓ Homologado
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider truncate">
            {category?.name || product.categoryId}
          </span>
          <span className="text-[11px] font-mono text-slate-400 shrink-0">SKU: {product.code}</span>
        </div>

        <h3 className="text-base font-heading font-extrabold text-navy-950 mb-2 leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        {product.sizeInfo && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-4">
            <Ruler className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{product.sizeInfo}</span>
          </div>
        )}

        <div className="mt-auto pt-4 border-t-2 border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-navy-950 group-hover:text-primary-600 flex items-center gap-1 transition-colors">
            {t("catViewFull")} <ArrowRight className="h-3.5 w-3.5" />
          </span>

          <Button
            size="sm"
            className="bg-navy-950 hover:bg-primary-600 text-white font-bold text-xs px-4 h-9 rounded-xl transition-all"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
            {t("catAddToQuote")}
          </Button>
        </div>
      </div>
    </Link>
  );
}
