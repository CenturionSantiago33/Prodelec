"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingCart, Menu, ChevronRight, Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation, LanguageCode } from "@/i18n/translations";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const cartItemsCount = useStore((state) => state.cartTotalItems());
  const setCartOpen = useStore((state) => state.setCartOpen);
  const language = useStore((state) => state.language);
  const setLanguage = useStore((state) => state.setLanguage);

  const t = useTranslation(language);

  const NAV_LINKS = [
    { name: t("navHome"), href: "/" },
    { name: t("navCompany"), href: "/empresa" },
    { name: t("navCatalog"), href: "/categorias" },
    { name: t("navNews"), href: "/novedades" },
    { name: t("navEquipment"), href: "/equipos" },
    { name: t("navLocation") || "Ubicación", href: "/ubicacion" },
    { name: t("navContact"), href: "/contacto" },
  ];

  useEffect(() => {
    setMounted(true);
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
      <header className="fixed top-0 left-0 right-0 z-40 bg-navy-900/95 backdrop-blur-md border-b border-primary-600/30 shadow-lg shadow-navy-950/50">
        {/* 
          Un único layout. El menú desktop siempre se muestra (min-width: 600px).
          Solo en phones reales (<600px) se muestra el hamburger.
          Los tamaños usan clamp() para que escalen suavemente SIN cruzar breakpoints al hacer zoom.
        */}
        <div className="w-full flex items-center justify-between px-6 h-[80px]">

          {/* ── Logo ─────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/logo-clean.png"
              alt="Prodelec Logo"
              style={{ height: "44px" }}
              className="w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-md"
            />
            <div className="flex flex-col">
              <span
                className="font-heading font-extrabold tracking-widest text-white leading-none group-hover:text-electric transition-colors"
                style={{ fontSize: "18px" }}
              >
                PRODELEC
              </span>
              <span
                className="font-bold text-electric tracking-[0.2em] uppercase mt-0.5 hidden min-[480px]:block"
                style={{ fontSize: "9px" }}
              >
                Soluciones Industriales
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav (visible en ≥600px) ──────────────── */}
          <nav className="hidden min-[600px]:flex items-center gap-1 flex-shrink min-w-0 overflow-hidden">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "whitespace-nowrap font-extrabold uppercase tracking-wide rounded-lg border transition-all duration-200 hover:scale-105",
                    "px-3 py-2",
                    isActive
                      ? "bg-primary-600 text-white border-primary-400 shadow-md shadow-primary-600/40"
                      : "bg-navy-950/60 border-white/10 text-gray-200 hover:text-white hover:bg-white/15 hover:border-primary-500/50"
                  )}
                  style={{ fontSize: "12px" }}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* ── Acciones Desktop (visible en ≥600px) ─────────── */}
          <div className="hidden min-[600px]:flex items-center gap-2 shrink-0">
            {/* Search */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchExpanded && (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 160, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    onSubmit={handleSearch}
                    className="overflow-hidden mr-2"
                  >
                    <input
                      type="text"
                      placeholder={t("searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 w-full rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-electric"
                      autoFocus
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              <button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="p-2 text-gray-200 hover:text-white hover:bg-white/15 border border-white/10 rounded-lg transition-all bg-navy-950/60"
                aria-label="Buscar"
              >
                <Search className="h-[18px] w-[18px] text-electric" />
              </button>
            </div>

            {/* Language Selector */}
            <div className="relative flex items-center px-3 py-2 rounded-lg border border-white/10 bg-navy-950/60 text-gray-200 hover:bg-white/15 transition-all">
              <Globe className="h-[16px] w-[16px] mr-1.5 text-electric" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-xs font-extrabold focus:ring-0 outline-none cursor-pointer appearance-none pr-4 text-white [&>option]:text-gray-900 uppercase"
              >
                <option value="ES">ES</option>
                <option value="EN">EN</option>
                <option value="PT">PT</option>
                <option value="ZH">ZH</option>
              </select>
              <ChevronDown className="h-3 w-3 absolute right-2 pointer-events-none opacity-80" />
            </div>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-gray-200 hover:text-white hover:bg-white/15 border border-white/10 rounded-lg transition-all bg-navy-950/60"
              aria-label="Carrito de cotización"
            >
              <ShoppingCart className="h-[18px] w-[18px] text-electric" />
              <AnimatePresence>
                {mounted && cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-electric text-[9px] font-extrabold text-navy-950 shadow-lg shadow-electric/50"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* CTA Cotizar */}
            <Button
              className="bg-gradient-to-r from-primary-500 to-electric hover:from-primary-600 hover:to-electric text-navy-950 font-extrabold rounded-lg shadow-md shadow-electric/30 hover:scale-105 transition-all uppercase tracking-wide"
              style={{ fontSize: "13px", height: "36px", paddingLeft: "16px", paddingRight: "16px" }}
              onClick={() => setCartOpen(true)}
            >
              {t("quote")}
            </Button>
          </div>

          {/* ── Mobile Hamburger (solo <600px = phones reales) ── */}
          <button
            className="min-[600px]:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        side="left"
        title="Menú"
      >
        <div className="flex flex-col space-y-2 p-6">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between border-b border-gray-100 py-3 text-base font-medium",
                  isActive ? "text-primary-600" : "text-gray-900"
                )}
              >
                {link.name}
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            );
          })}

          <div className="pt-6 space-y-3">
            <Button
              className="w-full"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setCartOpen(true);
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> {t("quote")}
            </Button>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Globe className="h-4 w-4" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="text-sm font-semibold bg-transparent border border-gray-200 rounded-md px-2 py-1"
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
