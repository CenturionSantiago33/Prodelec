"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Images,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Rotate3d,
  RotateCcw,
  X,
  ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TranslateFn } from "@/i18n";
import { Product3DViewer } from "@/components/product/Product3DViewer";

/**
 * Visor de producto: usa SIEMPRE las fotos reales del catálogo. No dibuja
 * geometría inventada ni especificaciones que no estén en los datos.
 *
 * Tres modos, elegidos por la cantidad de material real disponible:
 *
 *  - `turntable`: cuando existe una secuencia 360 (`frames`, 12 o más tomas
 *    ordenadas). Se gira arrastrando y se puede reproducir solo.
 *  - `spin`: cuando el producto tiene 3 o más fotos. Se gira arrastrando entre
 *    las vistas reales disponibles.
 *  - `gallery`: con 1 o 2 fotos. Foto grande + miniaturas + zoom.
 *
 * En los tres modos se puede ampliar haciendo clic sobre la foto y abrir en
 * pantalla completa. El zoom se ancla al punto donde se hace clic.
 */
export interface ProductPhotoViewerProps {
  /** Fotos reales del producto, en orden. */
  images: string[];
  /** Texto alternativo (nombre del producto). */
  alt: string;
  /**
   * Secuencia ordenada para el 360 real: `/productos/360/<slug>/01.jpg … NN.jpg`.
   * Ver `docs/GUIA_FOTOS_360.md`. Si no hay, se usan `images`.
   */
  frames?: string[];
  /** Contenido superpuesto sobre la foto (badges, favorito). */
  overlay?: React.ReactNode;
  /** Traductor, para no duplicar textos en el componente. */
  t: TranslateFn;
  className?: string;
}

type Mode = "turntable" | "spin" | "gallery";

export function ProductPhotoViewer({
  images,
  alt,
  frames,
  overlay,
  t,
  className,
}: ProductPhotoViewerProps) {
  const spinFrames = useMemo(
    () => (frames && frames.length >= 12 ? frames : null),
    [frames]
  );

  const views = useMemo(() => {
    const base = spinFrames ?? images;
    return base.filter((src) => Boolean(src));
  }, [spinFrames, images]);

  const mode: Mode = spinFrames ? "turntable" : views.length >= 3 ? "spin" : "gallery";
  const canSpin = mode !== "gallery";
  /** La vista 3D se arma con la foto real; alcanza con que haya una. */
  const tiene3d = views.length > 0;

  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [full, setFull] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState<"3d" | "fotos">("3d");
  const is3d = tiene3d && tab === "3d";

  const drag = useRef<{ x: number; index: number; moved: number } | null>(null);
  const count = views.length;
  const current = views[index] ?? views[0];

  // ── Girar automáticamente (solo en el 360 real) ──
  useEffect(() => {
    if (!playing || mode !== "turntable" || count === 0) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 90);
    return () => window.clearInterval(id);
  }, [playing, mode, count]);

  const go = useCallback(
    (delta: number) => {
      if (count === 0) return;
      setIndex((i) => (i + delta + count) % count);
    },
    [count]
  );

  // ── Teclado ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "Escape") {
        setFull(false);
        setZoom(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // ── Arrastre / deslizamiento ──
  const step = count > 12 ? 14 : 30;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canSpin) return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, index, moved: 0 };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || !canSpin) return;
    const dx = e.clientX - d.x;
    d.moved = Math.max(d.moved, Math.abs(dx));
    const shift = Math.round(dx / step);
    setIndex((((d.index - shift) % count) + count) % count);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    setDragging(false);
    // Si casi no se movió, se interpreta como clic: ampliar sobre ese punto.
    if (d && d.moved < 6) {
      const box = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - box.left) / box.width) * 100;
      const y = ((e.clientY - box.top) / box.height) * 100;
      setOrigin(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
      setZoom((z) => !z);
    }
  };

  const reset = () => {
    setZoom(false);
    setPlaying(false);
    setIndex(0);
  };

  const frame = (
    <div
      className="relative h-full w-full touch-none select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        drag.current = null;
        setDragging(false);
      }}
      style={{
        cursor: canSpin ? (dragging ? "grabbing" : "grab") : zoom ? "zoom-out" : "zoom-in",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={current}
        src={current}
        alt={alt}
        draggable={false}
        className={cn(
          "h-full w-full object-contain mix-blend-multiply transition-transform duration-200 ease-out",
          zoom ? "scale-[2.2]" : "scale-100"
        )}
        style={{ transformOrigin: origin }}
      />
    </div>
  );

  const controls = (
    <div className="flex items-center gap-1.5">
      {mode === "turntable" && (
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          title={playing ? t("viewer.pause") : t("viewer.auto")}
          aria-label={playing ? t("viewer.pause") : t("viewer.auto")}
          className="h-9 w-9 rounded-lg bg-white/90 border border-slate-200 text-slate-600 hover:text-navy-950 hover:border-slate-300 transition-colors flex items-center justify-center shadow-xs"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      )}
      <button
        type="button"
        onClick={reset}
        title={t("viewer.reset")}
        aria-label={t("viewer.reset")}
        className="h-9 w-9 rounded-lg bg-white/90 border border-slate-200 text-slate-600 hover:text-navy-950 hover:border-slate-300 transition-colors flex items-center justify-center shadow-xs"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => setFull(true)}
        title={t("viewer.fullscreen")}
        aria-label={t("viewer.fullscreen")}
        className="h-9 w-9 rounded-lg bg-white/90 border border-slate-200 text-slate-600 hover:text-navy-950 hover:border-slate-300 transition-colors flex items-center justify-center shadow-xs"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className={className}>
      {/* Selector 3D / Fotos */}
      {tiene3d && (
        <div className="mb-3 inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-xs">
          <button
            type="button"
            onClick={() => setTab("3d")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors",
              tab === "3d" ? "bg-navy-950 text-white" : "text-slate-500 hover:text-navy-950"
            )}
          >
            <Rotate3d className="h-3.5 w-3.5" />
            {t("viewer.tab3d")}
          </button>
          <button
            type="button"
            onClick={() => setTab("fotos")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors",
              tab === "fotos" ? "bg-navy-950 text-white" : "text-slate-500 hover:text-navy-950"
            )}
          >
            <Images className="h-3.5 w-3.5" />
            {t("viewer.tabPhotos")}
          </button>
        </div>
      )}

      {/* Vista 3D */}
      {tiene3d && (
        <div className={cn(is3d ? "block" : "hidden")}>
          <Product3DViewer src={current} alt={alt} t={t} overlay={overlay} />
          <p className="mb-4 text-[11px] leading-snug text-slate-400">
            {t("viewer.model3dNote")}
          </p>
        </div>
      )}

      <div
        className={cn(
          "relative aspect-square rounded-xl bg-slate-50 border border-slate-200/80 overflow-hidden mb-4",
          is3d && "hidden"
        )}
      >
        <div className="absolute inset-0 p-8" style={{ touchAction: "none" }}>
          {frame}
        </div>

        {/* Indicador de modo */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-navy-950/75 text-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
          {canSpin ? (
            <>
              <Rotate3d className="h-3.5 w-3.5" />
              {spinFrames ? "360°" : t("viewer.drag")}
            </>
          ) : (
            <>
              <ZoomIn className="h-3.5 w-3.5" />
              {t("viewer.zoom")}
            </>
          )}
        </div>

        {/* Controles */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          {overlay}
          {controls}
        </div>
      </div>

      {/* Miniaturas: en modo 360 real no aportan, así que se ocultan */}
      {count > 1 && !spinFrames && !is3d && (
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {views.map((src, idx) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(idx)}
              aria-label={`${t("viewer.view")} ${idx + 1}`}
              className={cn(
                "relative shrink-0 w-18 h-18 rounded-lg border-2 overflow-hidden bg-slate-50 p-1.5 transition-all",
                index === idx
                  ? "border-primary-600 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}

      {/* Pantalla completa */}
      {full && (
        <div
          className="fixed inset-0 z-[100] bg-navy-950/95 backdrop-blur-sm flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <div className="flex items-center justify-between px-5 py-4 text-white">
            <span className="text-xs font-bold uppercase tracking-wider text-white/70">
              {alt}
            </span>
            <button
              type="button"
              onClick={() => setFull(false)}
              className="h-10 w-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
              title={t("viewer.close")}
              aria-label={t("viewer.close")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center gap-2 sm:gap-4 px-2 sm:px-6 pb-6 min-h-0">
            <button
              type="button"
              onClick={() => go(-1)}
              className="h-11 w-11 shrink-0 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
              aria-label={`${t("viewer.view")} -1`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="relative flex-1 h-full min-w-0">
              <div
                className="absolute inset-0 touch-none select-none"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={() => {
        drag.current = null;
        setDragging(false);
      }}
                style={{ cursor: canSpin ? "grab" : "default" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current}
                  alt={alt}
                  draggable={false}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              className="h-11 w-11 shrink-0 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
              aria-label={`${t("viewer.view")} +1`}
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="px-5 pb-5 text-center">
            <span className="inline-flex items-center gap-2 text-white/70 text-xs font-semibold">
              <Minimize2 className="h-3.5 w-3.5" />
              {canSpin ? t("viewer.drag") : `${t("viewer.view")} ${index + 1} / ${count}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
