"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Rotate3d, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TranslateFn } from "@/i18n";

/**
 * Vista 3D del producto, montada sobre la FOTO REAL.
 *
 * ── Qué es ───────────────────────────────────────────────────────────────────
 * La foto del producto presentada como una lámina en el espacio: se inclina en
 * perspectiva siguiendo el arrastre, con sombra de piso y un reflejo que acompaña
 * el movimiento. Todo sale de la foto real: no hay geometría, medidas ni
 * materiales inventados.
 *
 * ── Por qué no gira 360° ─────────────────────────────────────────────────────
 * Se probó generar el sólido extruyendo el recorte de la foto (proyección de un
 * prisma de sección constante): se generaron los 27 recortes y se probó con las
 * fotos reales. No se sostiene; queda documentado en `docs/CAMBIOS_REALIZADOS.md`
 * §20:
 *   · las fotos son vistas 3/4 de estudio, no frontales;
 *   · el recorte automático no limpia los fondos claros: el fondo queda dentro
 *     de la máscara y al girar se extruye como un manchón;
 *   · pasando los 90° la cara de atrás muestra el logo espejado ("augA");
 *   · el reflejo y el chorro de agua decorativos de la foto también se extruyen.
 * El 360° de verdad necesita la secuencia de fotos del producto (o el modelo 3D
 * de fábrica). El pipeline para armarlo ya está listo: `scripts/preparar-360.js`
 * y `docs/GUIA_FOTOS_360.md`.
 */
/** Inclinación máxima aceptable antes de que la lámina se lea como un cartón. */
const MAX_Y = 32;
const MAX_X = 16;
/** Grados por píxel arrastrado. */
const DRAG_Y = 0.3;
const DRAG_X = 0.18;
/** Postura de reposo: apenas inclinada, se entiende que hay perspectiva. */
const HOME_Y = -16;
const HOME_X = -6;

export interface Product3DViewerProps {
  /** Foto real del producto. */
  src: string;
  /** Texto alternativo (nombre del producto). */
  alt: string;
  t: TranslateFn;
  className?: string;
  /** Contenido superpuesto (badges, favorito). */
  overlay?: React.ReactNode;
}

const limitar = (v: number, max: number) => Math.max(-max, Math.min(max, v));

/**
 * Postura de la lámina para un ángulo dado. La usan el primer render (para que
 * la inclinación inicial ya venga en el HTML) y el arrastre.
 */
function posar(y: number, x: number) {
  const ry = Math.abs(y) / MAX_Y;
  return {
    lamina: `rotateX(${-x}deg) rotateY(${y}deg) translateZ(18px)`,
    // El reflejo corre al lado opuesto del giro.
    brillo: `translateX(${(-y / MAX_Y) * 60}%)`,
    brilloOp: (0.12 + 0.34 * ry).toFixed(3),
    // La sombra se corre al lado contrario y se acorta al inclinarse.
    sombra: `translateX(calc(-50% + ${((y / MAX_Y) * 14).toFixed(2)}%)) scaleX(${(
      1 - 0.2 * ry
    ).toFixed(3)})`,
    sombraOp: (0.5 - 0.24 * ry).toFixed(3),
  };
}
const INICIAL = posar(HOME_Y, HOME_X);

export function Product3DViewer({ src, alt, t, className, overlay }: Product3DViewerProps) {
  const laminaRef = useRef<HTMLDivElement>(null);
  const brilloRef = useRef<HTMLDivElement>(null);
  const sombraRef = useRef<HTMLDivElement>(null);
  // El ángulo vive en el ref: se aplica escribiendo en el DOM, sin re-render.
  const ang = useRef({ y: HOME_Y, x: HOME_X });
  const drag = useRef<{ x: number; y: number; y0: number; x0: number } | null>(null);

  const [dragging, setDragging] = useState(false);
  const [playing, setPlaying] = useState(false);

  /** Vuelca el ángulo al DOM. Solo transform y opacity: no dispara layout. */
  const aplicar = useCallback(() => {
    const { y, x } = ang.current;
    const p = posar(y, x);
    if (laminaRef.current) laminaRef.current.style.transform = p.lamina;
    if (brilloRef.current) {
      brilloRef.current.style.transform = p.brillo;
      brilloRef.current.style.opacity = p.brilloOp;
    }
    if (sombraRef.current) {
      sombraRef.current.style.transform = p.sombra;
      sombraRef.current.style.opacity = p.sombraOp;
    }
  }, []);

  useEffect(() => {
    aplicar();
  }, [aplicar]);

  // Demostración automática: vaivén suave.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = now - t0;
      ang.current = { y: 24 * Math.sin(t * 0.0009), x: HOME_X + 7 * Math.cos(t * 0.0006) };
      aplicar();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, aplicar]);

  // Flechas del teclado.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") ang.current.y = limitar(ang.current.y - 6, MAX_Y);
      else if (e.key === "ArrowRight") ang.current.y = limitar(ang.current.y + 6, MAX_Y);
      else return;
      aplicar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aplicar]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, y0: ang.current.y, x0: ang.current.x };
    setDragging(true);
    setPlaying(false);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    ang.current = {
      y: limitar(d.y0 + (e.clientX - d.x) * DRAG_Y, MAX_Y),
      x: limitar(d.x0 - (e.clientY - d.y) * DRAG_X, MAX_X),
    };
    aplicar();
  };
  const onPointerUp = () => {
    drag.current = null;
    setDragging(false);
  };

  const reset = () => {
    ang.current = { y: HOME_Y, x: HOME_X };
    setPlaying(false);
    aplicar();
  };

  return (
    <div
      className={cn(
        "relative aspect-square rounded-xl bg-slate-50 border border-slate-200/80 overflow-hidden mb-4",
        className
      )}
    >
      <div className="absolute inset-0" style={{ perspective: "1500px" }}>
        {/* Sombra de piso: no rota, es el piso. */}
        <div
          ref={sombraRef}
          className="pointer-events-none absolute bottom-[7%] left-1/2 h-[4.5%] w-[54%] rounded-[50%] bg-navy-950/30 blur-lg"
          style={{ transform: INICIAL.sombra, opacity: INICIAL.sombraOp }}
        />

        {/* La lámina. El transition da la vuelta elástica al soltar. */}
        <div
          ref={laminaRef}
          style={{
            transform: INICIAL.lamina,
            transformStyle: "preserve-3d",
            willChange: "transform",
            transition: dragging || playing ? "none" : "transform 600ms cubic-bezier(.22,1,.36,1)",
          }}
          className="absolute inset-0"
        >
          <div className="absolute inset-[9%] overflow-hidden rounded-xl bg-white ring-1 ring-slate-900/10 shadow-[0_30px_60px_-24px_rgba(2,15,43,0.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              draggable={false}
              className="h-full w-full object-contain p-4 select-none"
            />
            {/* Reflejo: pasa de un borde al otro acompañando el giro. */}
            <div
              ref={brilloRef}
              aria-hidden="true"
              className="pointer-events-none absolute -inset-y-1/4 left-0 w-2/3 bg-gradient-to-r from-transparent via-white to-transparent blur-2xl"
              style={{ transform: INICIAL.brillo, opacity: INICIAL.brilloOp }}
            />
          </div>
        </div>
      </div>

      {/* Superficie de arrastre */}
      <div
        className="absolute inset-0 touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ cursor: dragging ? "grabbing" : "grab" }}
      />

      {/* Indicador de modo */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-navy-950/75 text-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
        <Rotate3d className="h-3.5 w-3.5" />
        {t("viewer.tilt")}
      </div>

      {/* Controles */}
      <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
        {overlay}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            title={playing ? t("viewer.pause") : t("viewer.auto")}
            aria-label={playing ? t("viewer.pause") : t("viewer.auto")}
            className="h-9 w-9 rounded-lg bg-white/90 border border-slate-200 text-slate-600 hover:text-navy-950 hover:border-slate-300 transition-colors flex items-center justify-center shadow-xs"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={reset}
            title={t("viewer.reset")}
            aria-label={t("viewer.reset")}
            className="h-9 w-9 rounded-lg bg-white/90 border border-slate-200 text-slate-600 hover:text-navy-950 hover:border-slate-300 transition-colors flex items-center justify-center shadow-xs"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
