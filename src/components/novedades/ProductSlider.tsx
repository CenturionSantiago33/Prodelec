"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { products, categories } from "@/data/mock";

interface ProductSliderProps {
  title: string;
  subtitle: string;
  filterByNew?: boolean;
  filterByViews?: boolean;
}

export function ProductSlider({ title, subtitle, filterByNew, filterByViews }: ProductSliderProps) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  let displayProducts = [...products];
  if (filterByNew) displayProducts = displayProducts.filter((p) => p.isNew);
  // Simulación de "Lo más visto" (sólo para demo, tomamos algunos productos al azar o por ID)
  if (filterByViews) displayProducts = displayProducts.slice(0, 5).reverse();

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 mb-10">
        <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-navy-950 tracking-tight mb-3">
          {title}
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl">{subtitle}</p>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="overflow-visible" ref={emblaRef}>
          <div className="flex gap-6">
            {displayProducts.map((product) => {
              const category = categories.find((c) => c.id === product.categoryId);
              return (
                <div
                  className="relative flex-[0_0_85%] sm:flex-[0_0_45%] md:flex-[0_0_35%] lg:flex-[0_0_28%] min-w-0"
                  key={product.id}
                >
                  <Link
                    href={`/productos/${product.slug}`}
                    className="group block h-full bg-white rounded-3xl border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative"
                  >
                    {/* Badge Nuevo / Top */}
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      {product.isNew && filterByNew && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-[10px] font-bold text-blue-800 uppercase tracking-wider backdrop-blur-md bg-opacity-80">
                          Nuevo
                        </span>
                      )}
                      {filterByViews && (
                        <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold text-orange-800 uppercase tracking-wider backdrop-blur-md bg-opacity-80">
                          Top #1
                        </span>
                      )}
                    </div>

                    <div className="relative h-64 bg-gray-50/50 flex items-center justify-center p-8 border-b border-gray-100 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-700 ease-out group-hover:scale-110 relative z-10"
                      />
                      {product.homologado && (
                        <div className="absolute bottom-4 left-4 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700 uppercase tracking-wider border border-green-200 z-10">
                          <ShieldCheck className="h-3 w-3 mr-1" /> Homologado
                        </div>
                      )}
                    </div>

                    <div className="p-6 relative bg-white">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                        {category?.name}
                      </span>
                      <h3 className="text-xl font-bold text-navy-950 mb-2 leading-tight transition-colors group-hover:text-primary-600">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono mb-6">SKU: {product.code}</p>

                      <div className="inline-flex items-center text-sm font-bold text-white bg-navy-950 px-5 py-2.5 rounded-full transition-all duration-300 group-hover:bg-primary-600 group-hover:px-6 shadow-md">
                        Ver producto <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
