// v3 - inline styles build - 2026-08-17
"use client";

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  X,
  ShoppingCart,
  Ruler,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Tag,
  Wrench,
} from "lucide-react";
import { Product } from "@/types";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n/translations";
import { categories } from "@/data/mock";

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductQuickViewModal({ product, onClose }: ProductQuickViewModalProps) {
  const { addToCart, setCartOpen, language } = useStore();
  const t = useTranslation(language);
  const category = product ? categories.find((c) => c.id === product.categoryId) : null;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (product) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [product, handleKeyDown]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product) return;
    addToCart(product);
    setCartOpen(true);
    onClose();
  };

  const catColor = category?.color ?? "#1d70d8";

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9998,
              background: "rgba(0,0,0,0.82)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          />

          {/* ── Modal wrapper: centered on desktop, bottom on mobile ── */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            style={{
              position: "fixed",
              zIndex: 9999,
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              pointerEvents: "none",
            }}
            className="md:inset-0 md:items-center"
          >
            {/* ── The actual panel ── */}
            <div
              style={{
                pointerEvents: "auto",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxWidth: "1000px",
                maxHeight: "92vh",
                borderRadius: "24px 24px 0 0",
                overflow: "hidden",
                boxShadow: "0 -20px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
                background: "#0a0f1a",
              }}
              className="md:flex-row md:rounded-3xl md:max-h-[85vh]"
            >
              {/* Mobile drag bar */}
              <div
                className="md:hidden"
                style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}
              >
                <div style={{ width: 44, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.2)" }} />
              </div>

              {/* ════════════════════════════════
                  LEFT: image panel
              ════════════════════════════════ */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  flexShrink: 0,
                  width: "40%",
                  minWidth: 280,
                  background: `radial-gradient(ellipse at 55% 45%, ${catColor}28 0%, transparent 65%), #0d1b2e`,
                  borderRight: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Category color top stripe */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${catColor}, ${catColor}60)` }} />

                {/* Subtle grid texture */}
                <div style={{
                  position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none",
                  backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
                  backgroundSize: "32px 32px",
                }} />

                {/* Glow blob */}
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: `radial-gradient(circle at 50% 60%, ${catColor}22 0%, transparent 60%)`,
                }} />

                {/* NEW badge */}
                {product.isNew && (
                  <span style={{
                    position: "absolute", top: 20, left: 20, zIndex: 10,
                    fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em",
                    padding: "4px 12px", borderRadius: 99,
                    background: catColor, color: "#fff",
                    boxShadow: `0 4px 16px ${catColor}60`,
                  }}>
                    NUEVO
                  </span>
                )}

                {/* Product image */}
                <motion.img
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  src={product.images[0] || "https://placehold.co/600"}
                  alt={product.name}
                  style={{
                    position: "relative", zIndex: 10,
                    maxWidth: "75%", maxHeight: "55%",
                    objectFit: "contain",
                    filter: `drop-shadow(0 24px 48px rgba(0,0,0,0.5)) drop-shadow(0 0 40px ${catColor}30)`,
                  }}
                />

                {/* Category chip bottom */}
                <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
                    padding: "6px 12px", borderRadius: 99,
                    color: catColor,
                    background: `${catColor}18`,
                    border: `1px solid ${catColor}35`,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: catColor, display: "inline-block" }} />
                    {category?.name}
                  </span>
                </div>

                {/* Right fade blending into dark panel */}
                <div
                  style={{
                    position: "absolute", top: 0, right: 0, bottom: 0, width: 60, pointerEvents: "none",
                    background: "linear-gradient(to right, transparent, #0a0f1a)",
                  }}
                />
              </div>

              {/* ════════════════════════════════
                  RIGHT: info panel
              ════════════════════════════════ */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#0a0f1a" }}>

                {/* Close button */}
                <button
                  onClick={onClose}
                  aria-label="Cerrar"
                  style={{
                    position: "absolute", top: 16, right: 16, zIndex: 20,
                    padding: "8px", borderRadius: 12, cursor: "pointer",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.6)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.16)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                >
                  <X style={{ width: 16, height: 16 }} />
                </button>

                {/* Scrollable content */}
                <div style={{ flex: 1, overflowY: "auto", padding: "32px 32px 24px" }}>

                  {/* ── Header ── */}
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 10, fontFamily: "monospace", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                        SKU: {product.code}
                      </span>
                      {product.homologado && (
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "4px 10px", borderRadius: 99, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                          color: "#34d399", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)",
                        }}>
                          <ShieldCheck style={{ width: 11, height: 11 }} />
                          {t("catHomologatedBadge")}
                        </span>
                      )}
                    </div>
                    <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 12, fontFamily: "var(--font-heading)" }}>
                      {product.name}
                    </h2>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                      {product.description}
                    </p>
                  </div>

                  {/* ── Divider ── */}
                  <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 24 }} />

                  {/* ── Specs grid ── */}
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                      <Ruler style={{ width: 13, height: 13 }} />
                      Especificaciones Técnicas
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {product.sizeInfo && (
                        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 16px" }}>
                          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{t("catSizeInfo")}</p>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{product.sizeInfo}</p>
                        </div>
                      )}
                      {product.diameter && (
                        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 16px" }}>
                          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{t("catDiameter")}</p>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{product.diameter}</p>
                        </div>
                      )}
                      {product.specs?.map((spec, i) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 16px" }}>
                          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{spec.label}</p>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{spec.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Features ── */}
                  {product.features && product.features.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                        <Wrench style={{ width: 13, height: 13 }} />
                        Características
                      </p>
                      <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {product.features.map((f, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.07 }}
                            style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.7)" }}
                          >
                            <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0, color: catColor }} />
                            {f}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ── Applications ── */}
                  {product.architecture && product.architecture.length > 0 && (
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                        <Tag style={{ width: 13, height: 13 }} />
                        Aplicaciones
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {product.architecture.map((arch, i) => (
                          <span key={i} style={{
                            fontSize: 11, fontWeight: 600, padding: "6px 14px", borderRadius: 99,
                            color: catColor, background: `${catColor}14`, border: `1px solid ${catColor}35`,
                          }}>
                            {arch}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Sticky CTA footer ── */}
                <div style={{
                  flexShrink: 0, padding: "20px 28px 24px",
                  background: "#0a0f1a",
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  display: "flex", flexDirection: "column", gap: 10,
                }}
                  className="sm:flex-row"
                >
                  {/* Primary: add to quote */}
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    style={{
                      flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
                      padding: "14px 24px", borderRadius: 16,
                      fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                      color: "#fff", border: "none", cursor: "pointer",
                      background: `linear-gradient(135deg, ${catColor} 0%, ${catColor}bb 100%)`,
                      boxShadow: `0 8px 32px ${catColor}45`,
                      transition: "transform 0.15s, box-shadow 0.15s",
                      opacity: product.inStock ? 1 : 0.45,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 14px 40px ${catColor}55`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 32px ${catColor}45`; }}
                  >
                    <ShoppingCart style={{ width: 16, height: 16 }} />
                    {t("catAddToQuote")}
                  </button>

                  {/* Secondary: full details */}
                  <Link
                    href={`/productos/${product.slug}`}
                    onClick={onClose}
                    style={{
                      flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
                      padding: "14px 24px", borderRadius: 16,
                      fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                      color: "rgba(255,255,255,0.75)",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      textDecoration: "none", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
                  >
                    {t("catViewFull")}
                    <ArrowUpRight style={{ width: 15, height: 15 }} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
