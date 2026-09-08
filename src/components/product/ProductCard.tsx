"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Ruler, ArrowRight } from "lucide-react";
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

  // ── LIST VIEW ──────────────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <Link
        href={`/productos/${product.slug}`}
        className="group flex flex-col sm:flex-row gap-0 bg-white hover:bg-gray-50 transition-colors"
        style={{ border: "1px solid #dee2e6" }}
      >
        {/* Imagen */}
        <div
          className="relative shrink-0 w-full sm:w-48 bg-gray-100 flex items-center justify-center p-6 overflow-hidden"
          style={{ minHeight: "160px" }}
        >
          <img
            src={product.images[0] || "https://placehold.co/400"}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            style={{ mixBlendMode: "multiply", maxHeight: "140px" }}
          />
          {product.homologado && (
            <div className="absolute top-0 left-0 bg-navy-950 text-accent-400 px-2 py-1"
                 style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Homologado
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 justify-between p-5" style={{ borderLeft: "1px solid #dee2e6" }}>
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="font-heading font-bold text-gray-400 uppercase tracking-widest"
                    style={{ fontSize: "10px" }}>
                {category?.name || product.categoryId}
              </span>
              <span className="font-mono text-gray-400" style={{ fontSize: "10px" }}>
                COD: {product.code}
              </span>
            </div>

            <h3 className="font-heading font-bold text-navy-950 mb-2 leading-tight group-hover:text-primary-600 transition-colors"
                style={{ fontSize: "16px" }}>
              {product.name}
            </h3>

            {product.sizeInfo && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                <Ruler className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                {product.sizeInfo}
              </div>
            )}

            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{product.description}</p>
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: "1px solid #e9ecef" }}>
            <span className="text-xs font-heading font-bold text-primary-600 flex items-center gap-1 uppercase tracking-wider">
              {t("catViewFull")} <ArrowRight className="h-3.5 w-3.5" />
            </span>
            <button
              className="ml-auto btn-primary-corp py-2 px-4 text-xs"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {t("catAddToQuote")}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // ── GRID VIEW ──────────────────────────────────────────────────
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group flex flex-col h-full bg-white hover:bg-gray-50 transition-colors product-card"
    >
      {/* Imagen */}
      <div
        className="relative bg-gray-100 overflow-hidden flex items-center justify-center p-6"
        style={{ height: "200px" }}
      >
        <img
          src={product.images[0] || "https://placehold.co/400"}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          style={{ mixBlendMode: "multiply" }}
        />

        {/* Badge homologado — rectangular, sin pills */}
        {product.homologado && (
          <div
            className="absolute top-0 left-0 bg-navy-950 text-accent-400 px-2.5 py-1 font-heading font-bold uppercase"
            style={{ fontSize: "9px", letterSpacing: "0.1em" }}
          >
            Homologado
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1" style={{ borderTop: "2px solid #e9ecef" }}>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <span
            className="font-heading font-bold text-gray-400 uppercase tracking-widest leading-tight"
            style={{ fontSize: "10px" }}
          >
            {category?.name || product.categoryId}
          </span>
          <span className="font-mono text-gray-400 shrink-0" style={{ fontSize: "10px" }}>
            {product.code}
          </span>
        </div>

        <h3
          className="font-heading font-bold text-navy-950 leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors mb-2"
          style={{ fontSize: "14px" }}
        >
          {product.name}
        </h3>

        {product.sizeInfo && (
          <div className="flex items-center gap-1.5 text-gray-400 mb-3" style={{ fontSize: "11px" }}>
            <Ruler className="h-3 w-3 shrink-0" />
            <span className="truncate">{product.sizeInfo}</span>
          </div>
        )}

        {/* CTA */}
        <div
          className="mt-auto pt-3 flex items-center justify-between"
          style={{ borderTop: "1px solid #e9ecef" }}
        >
          <span
            className="font-heading font-bold text-primary-600 uppercase tracking-wider flex items-center gap-1"
            style={{ fontSize: "10px" }}
          >
            {t("catViewFull")} <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </span>

          <button
            className="flex items-center gap-1.5 bg-navy-950 hover:bg-primary-600 text-white font-heading font-bold uppercase px-3 py-1.5 transition-colors"
            style={{ fontSize: "10px", letterSpacing: "0.08em" }}
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-3 w-3" />
            Cotizar
          </button>
        </div>
      </div>
    </Link>
  );
}
