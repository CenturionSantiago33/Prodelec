"use client";

import React from "react";

export function HeroHydraulicWave() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 w-full overflow-hidden pointer-events-none select-none z-[5]"
      style={{
        height: "clamp(70px, 11vw, 150px)",
      }}
      aria-hidden="true"
    >
      {/* ── Layer 1: Fondo / Corriente Hidráulica Profunda ──────────────── */}
      <div className="absolute inset-0 w-[200%] h-full hydraulic-wave-layer hydraulic-wave-layer-1">
        <svg
          viewBox="0 0 2000 160"
          preserveAspectRatio="none"
          className="w-full h-full block"
        >
          <path
            d="M 0,90 C 250,130 350,50 500,85 C 650,120 750,55 1000,90 C 1250,130 1350,50 1500,85 C 1650,120 1750,55 2000,90 L 2000,160 L 0,160 Z"
            fill="#091e30"
            fillOpacity="0.5"
          />
        </svg>
      </div>

      {/* ── Layer 2: Flujo Intermedio / Azul PRODELEC con Transparencia ─── */}
      <div className="absolute inset-0 w-[200%] h-full hydraulic-wave-layer hydraulic-wave-layer-2">
        <svg
          viewBox="0 0 2000 160"
          preserveAspectRatio="none"
          className="w-full h-full block"
        >
          <defs>
            <linearGradient id="hydraulic-flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1a65b5" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#1a65b5" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <path
            d="M 0,105 C 200,65 400,135 600,95 C 800,60 900,125 1000,105 C 1200,65 1400,135 1600,95 C 1800,60 1900,125 2000,105 L 2000,160 L 0,160 Z"
            fill="url(#hydraulic-flow-grad)"
          />
        </svg>
      </div>

      {/* ── Layer 3: Superficie Frontal — Conecta directamente con la barra de stats (#124d8f) ── */}
      <div className="absolute inset-0 w-[200%] h-full hydraulic-wave-layer hydraulic-wave-layer-3">
        <svg
          viewBox="0 0 2000 160"
          preserveAspectRatio="none"
          className="w-full h-full block"
        >
          {/* Sutil cresta de agua iluminada (línea técnica superior) */}
          <path
            d="M 0,115 C 220,135 380,85 550,110 C 720,135 880,90 1000,115 C 1220,135 1380,85 1550,110 C 1720,135 1880,90 2000,115"
            fill="none"
            stroke="#00b8e6"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          {/* Cuerpo principal sólido que empalma con la siguiente sección */}
          <path
            d="M 0,115 C 220,135 380,85 550,110 C 720,135 880,90 1000,115 C 1220,135 1380,85 1550,110 C 1720,135 1880,90 2000,115 L 2000,160 L 0,160 Z"
            fill="#124d8f"
          />
        </svg>
      </div>
    </div>
  );
}
