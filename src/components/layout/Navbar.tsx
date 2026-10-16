"use client";

import React, { useState, useEffect, useRef, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, ShoppingCart, Menu, ChevronRight, ChevronDown, ArrowRight, Download, LayoutGrid,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Drawer } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/translations";
import { categories as rawCategories, products as rawProducts } from "@/data/products";
import { getTranslatedCategory } from "@/i18n";

const emptySubscribe = () => () => {};
/** true solo en el cliente, sin setState en efectos (evita mismatch de hidratación). */
const useIsMounted = () =>
  useSyncExternalStore(emptySubscribe, () => true, () => false);

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const mounted = useIsMounted();
  const [scrolled, setScrolled] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string>(rawCategories[0]?.id || "cajas-conexion");
  const [isMobileProductsExpanded, setIsMobileProductsExpanded] = useState(false);
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  const cartItemsCount = useStore((state) => state.cartTotalItems());
  const setCartOpen = useStore((state) => state.setCartOpen);
  const language = useStore((state) => state.language);
  const setLanguage = useStore((state) => state.setLanguage);

  const t = useTranslation(language);

  const categories = useMemo(() => {
    return rawCategories.map((c) => getTranslatedCategory(c, language));
  }, [language]);

  const productCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    rawCategories.forEach((cat) => {
      map[cat.id] = rawProducts.filter((p) => p.categoryId === cat.id).length;
    });
    return map;
  }, []);

  const activeHoveredCategory = useMemo(() => {
    return categories.find((c) => c.id === hoveredCategoryId) || categories[0];
  }, [categories, hoveredCategoryId]);

  const NAV_LINKS = [
    { name: t("navHome"),    href: "/" },
    { name: t("navCompany"), href: "/empresa" },
    { name: t("navCatalog"), href: "/categorias" },
    { name: t("navNews"),    href: "/novedades" },
    { name: t("navEquipment"), href: "/equipos" },
    { name: t("navLocation") || "Ubicación", href: "/ubicacion" },
    { name: t("navContact"), href: "/contacto" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDropdownEnter = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
      dropdownTimerRef.current = null;
    }
    setIsProductsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setIsProductsDropdownOpen(false);
    }, 220);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/productos?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
      setIsProductsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-navy-950 shadow-lg shadow-navy-950/50"
            : "bg-navy-950/97"
        )}
        style={{ borderBottom: "1px solid rgba(26,101,181,0.35)" }}
      >
        <div className="container-corp flex items-center justify-between h-[72px] lg:h-[80px]">

          {/* ── Logo ──────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src="/logo-clean.png"
              alt="Prodelec"
              className="h-10 w-auto object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="font-heading font-extrabold tracking-widest text-white text-[17px] group-hover:text-accent-400 transition-colors">
                PRODELEC
              </span>
              <span className="text-accent-400 font-bold uppercase tracking-[0.2em] text-[8px] hidden min-[480px]:block mt-0.5">
                Soluciones Industriales
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ────────────────────────────────────── */}
          <nav className="hidden min-[900px]:flex items-center gap-0.5" aria-label="Navegación principal">
            {NAV_LINKS.map((link) => {
              const isCatalog = link.href === "/categorias";
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              if (isCatalog) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsProductsDropdownOpen(false)}
                      className={cn(
                        "relative px-3.5 py-2 font-heading font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-200 flex items-center gap-1.5 text-[11.5px] group",
                        isActive || isProductsDropdownOpen
                          ? "text-white"
                          : "text-gray-300 hover:text-white"
                      )}
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        className={cn(
                          "h-3 w-3 text-gray-400 group-hover:text-primary-400 transition-transform duration-200",
                          isProductsDropdownOpen && "rotate-180 text-primary-400"
                        )}
                      />
                      {isActive && (
                        <span
                          className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-accent-500"
                          aria-hidden="true"
                        />
                      )}
                    </Link>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isProductsDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="absolute top-full left-0 z-50 w-[min(940px,calc(100vw-40px))] pt-2"
                        >
                          <div
                            className="overflow-hidden rounded-2xl border border-navy-800 bg-navy-950/98 backdrop-blur-xl"
                            style={{
                              boxShadow:
                                "0 40px 80px -28px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04) inset",
                            }}
                          >
                            {/* Encabezado del panel */}
                            <div className="relative flex items-center justify-between gap-4 border-b border-navy-800 bg-gradient-to-r from-primary-950 via-navy-900 to-navy-900 px-5 py-4">
                              <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary-500 via-sky-400 to-accent-400" />
                              <Link
                                href="/categorias"
                                onClick={() => setIsProductsDropdownOpen(false)}
                                className="group flex items-center gap-3"
                              >
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600/20 text-sky-300 ring-1 ring-inset ring-primary-500/30 transition-colors group-hover:bg-primary-600/30">
                                  <LayoutGrid className="h-[18px] w-[18px]" />
                                </span>
                                <span className="leading-tight">
                                  <span className="block font-heading text-[16px] font-bold text-white">
                                    Catálogo completo
                                  </span>
                                  <span className="block text-[12px] text-slate-400">
                                    {rawProducts.length} productos en {categories.length} categorías
                                  </span>
                                </span>
                              </Link>
                              <Link
                                href="/categorias"
                                onClick={() => setIsProductsDropdownOpen(false)}
                                className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                              >
                                <span>Ver todas las categorías</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>

                          {/* Dos columnas: categorías (izq.) + vista previa (der.) */}
                          <div className="flex h-[min(462px,calc(100vh-200px))]">
                            {/* Columna izquierda: categorías */}
                            <div className="dd-scroll w-[372px] shrink-0 overflow-y-auto border-r border-navy-800 p-2.5">
                              <p className="px-3 pb-1.5 pt-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                Categorías de productos
                              </p>
                              {categories.map((cat) => {
                                const isHovered = hoveredCategoryId === cat.id;
                                const count = productCountMap[cat.id] || 0;
                                const catColor = cat.color || "#1a65b5";

                                return (
                                  <Link
                                    key={cat.id}
                                    href={`/categorias?categoria=${cat.id}`}
                                    onMouseEnter={() => setHoveredCategoryId(cat.id)}
                                    onClick={() => setIsProductsDropdownOpen(false)}
                                    className={cn(
                                      "flex items-center gap-3 rounded-xl px-3 py-3 transition-colors",
                                      isHovered ? "bg-navy-800" : "hover:bg-navy-900/70"
                                    )}
                                  >
                                    <span
                                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                                      style={{ backgroundColor: catColor }}
                                    />
                                    <span
                                      className={cn(
                                        "min-w-0 flex-1 text-[13.5px] font-medium leading-snug",
                                        isHovered ? "text-white" : "text-slate-200"
                                      )}
                                    >
                                      {cat.name}
                                    </span>
                                    <span
                                      className={cn(
                                        "shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[11px] tabular-nums",
                                        isHovered
                                          ? "bg-navy-950 text-sky-300"
                                          : "bg-navy-900 text-slate-400"
                                      )}
                                    >
                                      {count}
                                    </span>
                                    <ChevronRight
                                      className={cn(
                                        "h-4 w-4 shrink-0 transition-transform",
                                        isHovered
                                          ? "translate-x-0.5 text-accent-400"
                                          : "text-navy-700"
                                      )}
                                    />
                                  </Link>
                                );
                              })}
                            </div>

                            {/* Columna derecha: vista previa de la categoría */}
                            <div className="flex flex-1 flex-col justify-between bg-navy-900/50 p-5">
                              {activeHoveredCategory ? (
                                <>
                                  <div>
                                    {/* Imagen de la categoría */}
                                    <div className="group relative mb-4 h-[236px] w-full overflow-hidden rounded-xl bg-white ring-1 ring-inset ring-white/10">
                                      <img
                                        src={activeHoveredCategory.image}
                                        alt={activeHoveredCategory.name}
                                        className="h-full w-full object-contain p-8 transition-transform duration-300 group-hover:scale-105"
                                      />
                                      <span className="absolute right-3 top-3 rounded-full bg-navy-950/85 px-2.5 py-1 text-[11px] font-semibold text-sky-300 ring-1 ring-inset ring-white/10">
                                        {productCountMap[activeHoveredCategory.id] || 0} modelos
                                      </span>
                                    </div>

                                    {/* Título de la categoría */}
                                    <h3
                                      className="font-heading text-[19px] font-bold leading-snug"
                                      style={{ color: activeHoveredCategory.color || "#38bdf8" }}
                                    >
                                      {activeHoveredCategory.name}
                                    </h3>

                                    {/* Descripción */}
                                    <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-slate-300">
                                      {activeHoveredCategory.description}
                                    </p>

                                    {/* Líneas y variantes */}
                                    {activeHoveredCategory.subcategories &&
                                      activeHoveredCategory.subcategories.length > 0 && (
                                        <div className="mt-4">
                                          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                                            Líneas y variantes
                                          </span>
                                          <div className="flex flex-wrap gap-1.5">
                                            {activeHoveredCategory.subcategories
                                              .slice(0, 8)
                                              .map((sub) => (
                                                <span
                                                  key={sub}
                                                  className="rounded-full border border-navy-800 bg-navy-950 px-2.5 py-1 text-[11.5px] font-medium text-slate-300"
                                                >
                                                  {sub}
                                                </span>
                                              ))}
                                            {activeHoveredCategory.subcategories.length > 8 && (
                                              <span className="px-1.5 py-1 text-[11.5px] text-slate-500">
                                                +{activeHoveredCategory.subcategories.length - 8}{" "}
                                                más
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                  </div>

                                  {/* Acciones */}
                                  <div className="mt-4 flex items-center gap-2.5 border-t border-navy-800 pt-4">
                                    <Link
                                      href={`/categorias?categoria=${activeHoveredCategory.id}`}
                                      onClick={() => setIsProductsDropdownOpen(false)}
                                      className="btn-primary-corp h-11 flex-1 justify-center text-[13.5px]"
                                    >
                                      <span>Ver productos</span>
                                      <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <a
                                      href={`/pdf/catalogo?categoria=${activeHoveredCategory.id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-navy-700 bg-navy-800 text-slate-300 transition-colors hover:bg-navy-700 hover:text-white"
                                      title="Descargar catálogo de esta categoría (PDF)"
                                    >
                                      <Download className="h-4 w-4" />
                                    </a>
                                  </div>
                                </>
                              ) : (
                                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                  Seleccioná una categoría
                                </div>
                              )}
                            </div>
                          </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-2 font-heading font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-200",
                    "text-[11.5px]",
                    isActive
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                  )}
                >
                  {link.name}
                  {/* Active indicator underline */}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-accent-500"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Acciones Desktop ───────────────────────────────── */}
          <div className="hidden min-[900px]:flex items-center gap-2 shrink-0">

            {/* Search expandible */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchExpanded && (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 180, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSearch}
                    className="overflow-hidden mr-1"
                  >
                    <input
                      type="text"
                      placeholder={t("searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 w-full border border-navy-700 bg-navy-900 px-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500"
                      autoFocus
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              <button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>

            {/* Clean Segmented Language Selector */}
            <div className="flex items-center border border-white/20 rounded-lg p-0.5 bg-navy-900/80 shrink-0">
              {(["ES", "EN", "PT", "ZH"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "px-2 py-1 rounded text-[10px] font-mono font-extrabold uppercase transition-all duration-150 leading-none",
                    language === lang
                      ? "bg-primary-600 text-white shadow-xs"
                      : "text-gray-400 hover:text-white"
                  )}
                  aria-label={`Seleccionar idioma ${lang}`}
                  aria-pressed={language === lang}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Carrito de cotización"
            >
              <ShoppingCart className="h-4 w-4" />
              <AnimatePresence>
                {mounted && cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center bg-accent-500 text-[9px] font-extrabold text-white"
                    style={{ borderRadius: "50%" }}
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* CTA Cotizar — rectangular, corporativo */}
            <button
              onClick={() => setCartOpen(true)}
              className="btn-primary-corp ml-2 text-[11px] py-2.5 px-5"
            >
              {t("quote")}
            </button>
          </div>

          {/* ── Mobile Hamburger ─────────────────────────────── */}
          <div className="min-[900px]:hidden flex items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Carrito"
            >
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center bg-accent-500 text-[9px] font-extrabold text-white rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <button
              className="p-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        side="left"
        title="Menú"
      >
        <div className="flex flex-col p-6">
          {NAV_LINKS.map((link) => {
            const isCatalog = link.href === "/categorias";
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            if (isCatalog) {
              return (
                <div key={link.href} className="border-b border-gray-100">
                  <div className="flex items-center justify-between py-4">
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "font-heading font-bold uppercase tracking-wider text-sm flex-1",
                        isActive ? "text-primary-600" : "text-gray-700 hover:text-primary-600"
                      )}
                    >
                      {link.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setIsMobileProductsExpanded(!isMobileProductsExpanded)}
                      className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
                      aria-label="Desplegar categorías"
                    >
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          isMobileProductsExpanded && "rotate-180 text-primary-600"
                        )}
                      />
                    </button>
                  </div>

                  <AnimatePresence>
                    {isMobileProductsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-slate-50 border-t border-slate-100 px-3 py-2 mb-2"
                      >
                        <Link
                          href="/categorias"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between py-2 text-xs font-heading font-bold text-primary-700 uppercase"
                        >
                          <span>★ Ver Todo el Catálogo</span>
                          <span className="font-mono text-[10px] text-slate-400">({rawProducts.length})</span>
                        </Link>
                        <div className="space-y-1 mt-1 max-h-56 overflow-y-auto">
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/categorias?categoria=${cat.id}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center justify-between py-1.5 px-2 hover:bg-slate-200/60 rounded text-xs text-slate-700 font-medium"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span
                                  className="w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{ backgroundColor: cat.color || "#1a65b5" }}
                                />
                                <span className="truncate">{cat.name}</span>
                              </div>
                              <span className="font-mono text-[10px] text-slate-400 shrink-0 ml-1">
                                ({productCountMap[cat.id] || 0})
                              </span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between border-b border-gray-100 py-4 font-heading font-bold uppercase tracking-wider text-sm",
                  isActive ? "text-primary-600" : "text-gray-700 hover:text-primary-600"
                )}
              >
                {link.name}
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            );
          })}

          <div className="pt-6 space-y-3">
            <button
              className="btn-primary-corp w-full justify-center"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setCartOpen(true);
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              {t("quote")}
            </button>

            <div className="flex items-center justify-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              {(["ES", "EN", "PT", "ZH"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "flex-1 py-2 text-xs font-mono font-extrabold uppercase rounded-lg transition-all",
                    language === lang
                      ? "bg-navy-950 text-white shadow-xs"
                      : "text-slate-600 hover:text-navy-950"
                  )}
                  aria-pressed={language === lang}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}
