"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingCart, Menu, X, ChevronRight, Globe, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Drawer } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useTranslation, LanguageCode } from "@/i18n/translations";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const cartItemsCount = useStore((state) => state.cartTotalItems());
  const setCartOpen = useStore((state) => state.setCartOpen);
  const language = useStore((state) => state.language);
  const setLanguage = useStore((state) => state.setLanguage);

  const t = useTranslation(language);

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
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/productos?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
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
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
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

            {/* Language Selector */}
            <div className="relative flex items-center gap-1 px-2 py-1.5 text-gray-400 hover:text-white transition-colors">
              <Globe className="h-3.5 w-3.5" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-[11px] font-bold focus:ring-0 outline-none cursor-pointer appearance-none pr-3 text-current uppercase [&>option]:text-gray-900"
              >
                <option value="ES">ES</option>
                <option value="EN">EN</option>
                <option value="PT">PT</option>
                <option value="ZH">ZH</option>
              </select>
              <ChevronDown className="h-3 w-3 absolute right-0 pointer-events-none" />
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
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
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

            <div className="flex items-center justify-center gap-2 text-gray-500 pt-2">
              <Globe className="h-4 w-4" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="text-sm font-semibold bg-transparent border border-gray-200 rounded px-2 py-1"
              >
                <option value="ES">Español</option>
                <option value="EN">English</option>
                <option value="PT">Português</option>
                <option value="ZH">中文</option>
              </select>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}
