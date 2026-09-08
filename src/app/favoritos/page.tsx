"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { ProductCard } from "@/components/product/ProductCard";
import { Heart, LayoutGrid, List } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/translations";

export default function FavoritesPage() {
  const { favorites } = useStore();
  const language = useStore(state => state.language);
  const t = useTranslation(language);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-gray-50 pt-[72px]">
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-2 font-medium">Inicio / {t("favorites")}</div>
              <h1 className="text-3xl font-bold font-heading text-gray-900 flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-500 fill-red-500" />
                {t("favTitle")}
              </h1>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-500">
              {favorites.length} {favorites.length === 1 ? 'producto guardado' : 'productos guardados'}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <Heart className="h-10 w-10 text-red-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("favEmptyTitle")}</h2>
            <p className="text-gray-500 mb-8 max-w-md text-center">
              {t("favEmptyDesc")}
            </p>
            <Button asChild size="lg" className="px-8">
              <Link href="/productos">{t("cartGoCatalog")}</Link>
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex justify-end mb-6">
              <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-100 shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-gray-100 shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
            >
              {favorites.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
