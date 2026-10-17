"use client";

import React, { useState, useEffect, useRef, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, ShoppingCart, Menu, ChevronRight, ChevronDown, ArrowRight, FileText,
  Droplets, Waves, Flame, Home,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Drawer } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/translations";
import { categories as rawCategories, products as rawProducts } from "@/data/products";
import { getTranslatedCategory } from "@/i18n";
import { NICHE_ORDER, type Niche } from "@/types";

const emptySubscribe = () => () => {};
/** true solo en el cliente, sin setState en efectos (evita mismatch de hidratación). */
const useIsMounted = () =>
  useSyncExternalStore(emptySubscribe, () => true, () => false);

const NICHE_ICONS: Record<Niche, typeof Droplets> = {
  agua: Droplets,
  saneamiento: Waves,
  domiciliaria: Home,
  gas: Flame,
};

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
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  // Categorías agrupadas por nicho de aplicación (una columna por nicho).
  const nicheGroups = useMemo(() => {
    return NICHE_ORDER.map((niche) => ({
      niche,
      label: t(`niche.${niche}`),
      Icon: NICHE_ICONS[niche],
      categories: categories.filter((c) => c.niches?.includes(niche)),
    })).filter((group) => group.categories.length > 0);
  }, [categories, t]);

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

  // Cierre por click fuera y tecla Escape
  useEffect(() => {
    if (!isProductsDropdownOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsProductsDropdownOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProductsDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [isProductsDropdownOpen]);

  const clearDropdownTimer = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
      dropdownTimerRef.current = null;
    }
  };

  const handleDropdownEnter = () => {
    clearDropdownTimer();
    setIsProductsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    clearDropdownTimer();
    dropdownTimerRef.current = setTimeout(() => {
      setIsProductsDropdownOpen(false);
    }, 180);
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

  const closeDropdown = () => setIsProductsDropdownOpen(false);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-colors duration-300",
          scrolled ? "bg-navy-950 shadow-lg shadow-navy-950/40" : "bg-navy-950"
        )}
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="container-corp flex items-center justify-between h-[72px] lg:h-[80px] gap-4">

          {/* ── Logo ──────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src="/logo-clean.png"
              alt="Prodelec"
              className="h-9 lg:h-10 w-auto object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="font-heading font-extrabold tracking-[0.14em] text-white text-[16px] lg:text-[17px] group-hover:text-accent-400 transition-colors">
                PRODELEC
              </span>
              <span className="text-accent-400 font-semibold uppercase tracking-[0.2em] text-[7.5px] hidden min-[480px]:block mt-0.5">
                Soluciones Industriales
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ────────────────────────────────────── */}
          <nav className="hidden min-[900px]:flex items-center gap-1" aria-label="Navegación principal">
            {NAV_LINKS.map((link) => {
              const isCatalog = link.href === "/categorias";
              const isActive =
                link.href !== "/" &&
                (pathname === link.href ||
                  pathname.startsWith(link.href) ||
                  (isCatalog && pathname.startsWith("/productos")));

              if (isCatalog) {
                return (
                  <div
                    key={link.href}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {/* "Productos" navega a /categorias y despliega el menú al pasar el cursor */}
                    <Link
                      href={link.href}
                      onClick={closeDropdown}
                      onFocus={handleDropdownEnter}
                      className={cn(
                        "relative flex items-center gap-1.5 px-3.5 py-2 font-heading font-semibold text-[15.5px] whitespace-nowrap transition-colors duration-200",
                        isActive || isProductsDropdownOpen
                          ? "text-white"
                          : "text-gray-300 hover:text-white"
                      )}
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 text-gray-400 transition-transform duration-200",
                          isProductsDropdownOpen && "rotate-180 text-accent-400"
                        )}
                      />
                      {isActive && (
                        <span
                          className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-accent-500"
                          aria-hidden="true"
                        />
                      )}
                    </Link>

                    {/* Menú desplegable: nichos en columnas horizontales */}
                    <AnimatePresence>
                      {isProductsDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.16, ease: "easeOut" }}
                          className="absolute top-full left-1/2 -translate-x-1/2 z-50 w-[min(1060px,calc(100vw-32px))] pt-2"
                        >
                          <div
                            className="overflow-hidden rounded-xl border border-navy-800 bg-navy-950"
                            style={{ boxShadow: "0 30px 70px -24px rgba(0,0,0,0.75)" }}
                          >
                            {/* Encabezado del panel */}
                            <div
                              className="flex items-center justify-between gap-4 border-b border-navy-800 px-6 py-4"
                              style={{ borderTop: "3px solid var(--color-primary-600)" }}
                            >
                              <div className="flex items-baseline gap-2.5">
                                <span className="font-heading text-[16px] font-bold text-white">
                                  {t("catalog.dropdownTitle")}
                                </span>
                                <span className="text-[12px] text-slate-400">
                                  {rawProducts.length} {t("catalog.productsWord")}
                                </span>
                              </div>
                              <Link
                                href="/categorias"
                                onClick={closeDropdown}
                                className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary-600 px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-primary-500"
                              >
                                <span>{t("common.backToAll")}</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>

                            {/* Cuerpo: una columna por nicho (horizontal) */}
                            <div className="dd-scroll grid max-h-[calc(100vh-240px)] grid-cols-4 gap-x-6 gap-y-2 overflow-y-auto px-6 py-5">
                              {nicheGroups.map((group) => (
                                <div key={group.niche}>
                                  <p className="mb-2 flex items-center gap-1.5 text-[10.5px] font-heading font-bold uppercase tracking-[0.14em] text-accent-400">
                                    <group.Icon className="h-3.5 w-3.5" />
                                    {group.label}
                                  </p>
                                  <ul>
                                    {group.categories.map((cat) => {
                                      const count = productCountMap[cat.id] || 0;
                                      const isHovered = hoveredCategoryId === cat.id;
                                      return (
                                        <li key={`${group.niche}-${cat.id}`}>
                                          <Link
                                            href={`/categorias?categoria=${cat.id}`}
                                            onMouseEnter={() => setHoveredCategoryId(cat.id)}
                                            onFocus={() => setHoveredCategoryId(cat.id)}
                                            onClick={closeDropdown}
                                            className={cn(
                                              "flex items-center justify-between rounded-md px-2 py-1.5 text-[14px] transition-colors",
                                              isHovered
                                                ? "bg-navy-800 text-white"
                                                : "text-slate-300 hover:bg-navy-900 hover:text-white"
                                            )}
                                          >
                                            <span className="min-w-0 truncate">{cat.name}</span>
                                            {count > 0 && (
                                              <span className="ml-2 shrink-0 text-[11px] tabular-nums text-slate-500">
                                                {count}
                                              </span>
                                            )}
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              ))}
                            </div>

                            {/* Pie: vista previa compacta de la categoría bajo el cursor */}
                            {activeHoveredCategory && (
                              <div className="flex items-center gap-4 border-t border-navy-800 px-6 py-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white p-1.5">
                                  <img
                                    src={activeHoveredCategory.image}
                                    alt={activeHoveredCategory.name}
                                    className="max-h-full max-w-full object-contain"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-[13.5px] font-semibold text-white">
                                    {activeHoveredCategory.name}
                                  </p>
                                  {activeHoveredCategory.description && (
                                    <p className="truncate text-[12px] text-slate-400">
                                      {activeHoveredCategory.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                  <Link
                                    href={`/categorias?categoria=${activeHoveredCategory.id}`}
                                    onClick={closeDropdown}
                                    className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary-600 px-4 text-[12.5px] font-semibold text-white transition-colors hover:bg-primary-500"
                                  >
                                    <span>{t("catalog.viewProducts")}</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  </Link>
                                  <a
                                    href={`/pdf/catalogo?categoria=${activeHoveredCategory.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-navy-700 px-3.5 text-[12.5px] font-semibold text-slate-200 transition-colors hover:border-navy-600 hover:text-white"
                                  >
                                    <FileText className="h-3.5 w-3.5" />
                                    <span>{t("common.technicalSheet")}</span>
                                  </a>
                                </div>
                              </div>
                            )}
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
                    "relative px-3.5 py-2 font-heading font-semibold text-[15.5px] whitespace-nowrap transition-colors duration-200",
                    isActive ? "text-white" : "text-gray-300 hover:text-white"
                  )}
                >
                  {link.name}
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
          <div className="hidden min-[900px]:flex items-center gap-1.5 shrink-0">

            {/* Search expandible */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchExpanded && (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    onSubmit={handleSearch}
                    className="overflow-hidden mr-1"
                  >
                    <input
                      type="text"
                      placeholder={t("searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 w-full rounded-md border border-navy-700 bg-navy-900 px-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500"
                      autoFocus
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              <button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label={t("nav.search")}
                aria-expanded={isSearchExpanded}
              >
                <Search className="h-[18px] w-[18px]" />
              </button>
            </div>

            {/* Selector de idioma */}
            <div className="flex items-center rounded-md border border-white/15 bg-navy-900/70 p-0.5 shrink-0">
              {(["ES", "EN", "PT", "ZH"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "px-2 py-1 rounded text-[10.5px] font-heading font-bold uppercase transition-colors leading-none",
                    language === lang
                      ? "bg-white text-navy-950"
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
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
              aria-label={t("nav.cart")}
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              <AnimatePresence>
                {mounted && cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center bg-accent-500 px-1 text-[9px] font-bold text-white"
                    style={{ borderRadius: "9999px" }}
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* CTA Cotizar */}
            <button
              onClick={() => setCartOpen(true)}
              className="btn-primary-corp ml-1.5 text-[12px] py-2.5 px-4"
            >
              {t("quote")}
            </button>
          </div>

          {/* ── Mobile Hamburger ─────────────────────────────── */}
          <div className="min-[900px]:hidden flex items-center gap-1">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
              aria-label={t("nav.cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center bg-accent-500 px-1 text-[9px] font-bold text-white rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <button
              className="p-2 text-gray-200 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label={t("nav.menu")}
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
        title={t("nav.menu")}
      >
        <div className="flex flex-col p-6">
          {NAV_LINKS.map((link) => {
            const isCatalog = link.href === "/categorias";
            const isActive =
              link.href !== "/" &&
              (pathname === link.href || pathname.startsWith(link.href));

            if (isCatalog) {
              return (
                <div key={link.href} className="border-b border-gray-100">
                  <div className="flex items-center justify-between py-4">
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "font-heading font-semibold text-[15px] flex-1",
                        isActive ? "text-primary-600" : "text-gray-800 hover:text-primary-600"
                      )}
                    >
                      {link.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setIsMobileProductsExpanded(!isMobileProductsExpanded)}
                      className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
                      aria-label="Desplegar categorías"
                      aria-expanded={isMobileProductsExpanded}
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
                        className="overflow-hidden bg-slate-50 border-t border-slate-100 px-2 py-2 mb-2"
                      >
                        <Link
                          href="/categorias"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between px-2 py-2 text-[13px] font-heading font-bold text-primary-700"
                        >
                          <span>{t("common.viewAll")}</span>
                        </Link>
                        {nicheGroups.map((group) => (
                          <div key={group.niche} className="mt-1">
                            <p className="px-2 pt-2 pb-1 text-[10px] font-heading font-bold uppercase tracking-[0.14em] text-slate-400">
                              {group.label}
                            </p>
                            <div className="space-y-0.5 max-h-72 overflow-y-auto">
                              {group.categories.map((cat) => (
                                <Link
                                  key={`${group.niche}-${cat.id}`}
                                  href={`/categorias?categoria=${cat.id}`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center justify-between px-2 py-1.5 rounded-md text-[13px] text-slate-700 font-medium hover:bg-slate-200/60"
                                >
                                  <span className="truncate">{cat.name}</span>
                                  <span className="text-[11px] text-slate-400 shrink-0 ml-2">
                                    {productCountMap[cat.id] || 0}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
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
                  "flex items-center justify-between border-b border-gray-100 py-4 font-heading font-semibold text-[15px]",
                  isActive ? "text-primary-600" : "text-gray-800 hover:text-primary-600"
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

            <div className="flex items-center justify-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
              {(["ES", "EN", "PT", "ZH"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "flex-1 py-2 text-xs font-heading font-bold rounded-md transition-colors",
                    language === lang
                      ? "bg-navy-950 text-white"
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
