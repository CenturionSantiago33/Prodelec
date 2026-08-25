"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rotate3d,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Info,
  ShieldCheck,
  Ruler,
  CheckCircle2,
  Box,
  Eye,
  Sliders,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n/translations";
import { cn } from "@/lib/utils";

interface Model3DItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  type: "box" | "clamp" | "repair" | "valve";
  color: string;
  hotspots: {
    id: number;
    title: string;
    description: string;
    norm: string;
    x: number; // percent position relative to 3D center
    y: number;
    z: number;
  }[];
  specs: { label: string; value: string }[];
}

const MODELS_3D: Model3DItem[] = [
  {
    id: "caja-c400",
    name: "Caja de Conexión Domiciliaria C-Series",
    category: "Cajas de Conexión",
    sku: "PROD-CX-400",
    type: "box",
    color: "#0284c7",
    hotspots: [
      {
        id: 1,
        title: "Cuerpo de Polipropileno Reforzado UV",
        description: "Inyectado en copolímero sintético con alta resistencia al impacto y protección ante radiación UV en intemperie.",
        norm: "Norma IRAM / AySA",
        x: -25,
        y: -15,
        z: 0,
      },
      {
        id: 2,
        title: "Cierre Antivandálico de Seguridad",
        description: "Sistema de traba mediante tornillo de cabeza especial pentagonal o llave de llave codificada.",
        norm: "Pliego Técnico B2B",
        x: 30,
        y: 20,
        z: 10,
      },
      {
        id: 3,
        title: "Paso de Cañería con Junta Flexible",
        description: "Abertura reforzada con pasamuros elásticos para sellado sin filtraciones en acometidas domiciliarias.",
        norm: "Apto DN 20 a DN 40 mm",
        x: -35,
        y: 15,
        z: -10,
      },
    ],
    specs: [
      { label: "Material", value: "PP Copolímero UV" },
      { label: "Resistencia de Carga", value: "Clase A15 (1.5 Tn)" },
      { label: "Protección UV", value: "Grado 8 (ASTM G154)" },
      { label: "Homologación", value: "IRAM / AySA / ABSA" },
    ],
  },
  {
    id: "abrazadera-derivacion",
    name: "Abrazadera de Derivación con Inserto de Bronce",
    category: "Abrazaderas de Derivación",
    sku: "PROD-AB-110",
    type: "clamp",
    color: "#0284c7",
    hotspots: [
      {
        id: 1,
        title: "Cuerpo Principal en Polímero de Alta Presión",
        description: "Matrizado en cuerpo partido articulado para abrace perfecto sobre tubos de PEAD y PVC.",
        norm: "Presión PN 16 BAR",
        x: 0,
        y: -25,
        z: 0,
      },
      {
        id: 2,
        title: "Inserto de Bronce Estampado C-37700",
        description: "Rosca hembra BSP cónica integrada con tratamiento anticorrosión para conexión de llave corporativa.",
        norm: "Rosca ISO 7/1",
        x: 0,
        y: 28,
        z: 15,
      },
      {
        id: 3,
        title: "Junta Toroidal EPDM Grado Alimentario",
        description: "Empaque perfilado que garantiza estanqueidad 100% permanente libre de fuga de agua potable.",
        norm: "Apto Agua Potable IRAM",
        x: -25,
        y: 0,
        z: 0,
      },
    ],
    specs: [
      { label: "Diámetros Tubo", value: "DN 50 mm a DN 200 mm" },
      { label: "Salida Roscada", value: '1/2" a 2" BSP' },
      { label: "Presión Admisible", value: "PN 16 BAR (230 PSI)" },
      { label: "Bulonería", value: "Acero Inoxidable AISI 304" },
    ],
  },
  {
    id: "abrazadera-reparacion",
    name: "Abrazadera de Reparación AISI 304 (1 Banda)",
    category: "Abrazaderas de Reparación",
    sku: "PROD-REP-110",
    type: "repair",
    color: "#10b981",
    hotspots: [
      {
        id: 1,
        title: "Banda Flexible Acero Inox AISI 304",
        description: "Lámina de acero inoxidable laminado en frío con acabado pasivado que evita corrosión química en suelo húmedo.",
        norm: "Acero AISI 304 L",
        x: -30,
        y: -10,
        z: 0,
      },
      {
        id: 2,
        title: "Malla de Sello NBR/EPDM Cuadriculado",
        description: "Superficie gofrada con relieve tipo nido de abeja para auto-sellado sobre fisuras o roturas de cañería.",
        norm: "Rango -10°C a +80°C",
        x: 10,
        y: -15,
        z: -10,
      },
      {
        id: 3,
        title: "Mandíbulas de Fundición Dúctil con Revestimiento Epoxy",
        description: "Zapatas de ajuste con pernos recubiertos en teflón para apriete parejo sin deformación.",
        norm: "Torque 35 N·m",
        x: 35,
        y: 20,
        z: 15,
      },
    ],
    specs: [
      { label: "Rango de Diámetro", value: "DN 60 mm a DN 350 mm" },
      { label: "Ancho de Banda", value: "150 mm / 200 mm / 300 mm" },
      { label: "Presión Máxima", value: "PN 16 BAR" },
      { label: "Empaque", value: "Elastómero Cuadriculado" },
    ],
  },
];

export function Product3DViewer() {
  const language = useStore((state) => state.language);
  const t = useTranslation(language);

  // Viewer State
  const [selectedModel, setSelectedModel] = useState<Model3DItem>(MODELS_3D[0]);
  const [renderMode, setRenderMode] = useState<"realistic" | "cad" | "section">("realistic");
  const [rotationX, setRotationX] = useState(15);
  const [rotationY, setRotationY] = useState(45);
  const [zoom, setZoom] = useState(1);
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Dragging State
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-Spin animation loop
  useEffect(() => {
    if (!isAutoSpin) return;
    const interval = setInterval(() => {
      setRotationY((prev) => (prev + 0.6) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, [isAutoSpin]);

  // Canvas 3D Rendering Engine (HTML5 WebGL/Canvas Matrix Projection)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radX = (rotationX * Math.PI) / 180;
    const radY = (rotationY * Math.PI) / 180;

    // Helper 3D Projection math
    const project = (x: number, y: number, z: number) => {
      // Rotate Y
      const x1 = x * Math.cos(radY) + z * Math.sin(radY);
      const z1 = -x * Math.sin(radY) + z * Math.cos(radY);
      // Rotate X
      const y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
      const z2 = y * Math.sin(radX) + z1 * Math.cos(radX);
      // Perspective
      const scale = (400 / (400 + z2)) * zoom;
      return {
        px: centerX + x1 * scale,
        py: centerY + y2 * scale,
        scale,
        z: z2,
      };
    };

    // Draw background grid in CAD mode
    if (renderMode === "cad") {
      ctx.strokeStyle = "rgba(2, 132, 199, 0.15)";
      ctx.lineWidth = 1;
      for (let i = -200; i <= 200; i += 40) {
        const p1 = project(i, 80, -200);
        const p2 = project(i, 80, 200);
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }
    }

    // Generate model geometry nodes based on type
    const drawModel = () => {
      ctx.save();

      if (selectedModel.type === "box") {
        // Draw 3D Box geometry
        const sizeX = 90;
        const sizeY = 60;
        const sizeZ = 80;

        const vertices = [
          [-sizeX, -sizeY, -sizeZ],
          [sizeX, -sizeY, -sizeZ],
          [sizeX, sizeY, -sizeZ],
          [-sizeX, sizeY, -sizeZ],
          [-sizeX, -sizeY, sizeZ],
          [sizeX, -sizeY, sizeZ],
          [sizeX, sizeY, sizeZ],
          [-sizeX, sizeY, sizeZ],
        ];

        const projected = vertices.map((v) => project(v[0], v[1], v[2]));

        // Render Style based on renderMode
        if (renderMode === "realistic") {
          // Faces shading
          const faces = [
            [0, 1, 2, 3], // Back
            [4, 5, 6, 7], // Front
            [0, 1, 5, 4], // Top
            [2, 3, 7, 6], // Bottom
            [0, 3, 7, 4], // Left
            [1, 2, 6, 5], // Right
          ];

          faces.forEach((face, idx) => {
            ctx.beginPath();
            ctx.moveTo(projected[face[0]].px, projected[face[0]].py);
            for (let i = 1; i < face.length; i++) {
              ctx.lineTo(projected[face[i]].px, projected[face[i]].py);
            }
            ctx.closePath();

            const grad = ctx.createLinearGradient(
              projected[face[0]].px,
              projected[face[0]].py,
              projected[face[2]].px,
              projected[face[2]].py
            );
            if (idx === 1 || idx === 2) {
              grad.addColorStop(0, "#0369a1");
              grad.addColorStop(1, "#0284c7");
            } else {
              grad.addColorStop(0, "#0f172a");
              grad.addColorStop(1, "#1e293b");
            }
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          });
        } else if (renderMode === "cad") {
          // Electric CAD wireframe
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 2;
          const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
          ];
          edges.forEach(([u, v]) => {
            ctx.beginPath();
            ctx.moveTo(projected[u].px, projected[u].py);
            ctx.lineTo(projected[v].px, projected[v].py);
            ctx.stroke();
          });

          // Draw Glowing Vertices
          projected.forEach((p) => {
            ctx.fillStyle = "#38bdf8";
            ctx.beginPath();
            ctx.arc(p.px, p.py, 4, 0, Math.PI * 2);
            ctx.fill();
          });
        } else {
          // Section / Cut Mode
          ctx.fillStyle = "rgba(14, 165, 233, 0.3)";
          ctx.strokeStyle = "#0284c7";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(projected[0].px, projected[0].py);
          projected.forEach((p) => ctx.lineTo(p.px, p.py));
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      } else {
        // Draw 3D Cylindrical Clamp Geometry
        const radius = 70;
        const h = 80;
        const steps = 16;

        for (let i = 0; i < steps; i++) {
          const a1 = (i / steps) * Math.PI * 2;
          const a2 = ((i + 1) / steps) * Math.PI * 2;

          const p1 = project(Math.cos(a1) * radius, -h / 2, Math.sin(a1) * radius);
          const p2 = project(Math.cos(a2) * radius, -h / 2, Math.sin(a2) * radius);
          const p3 = project(Math.cos(a2) * radius, h / 2, Math.sin(a2) * radius);
          const p4 = project(Math.cos(a1) * radius, h / 2, Math.sin(a1) * radius);

          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.lineTo(p3.px, p3.py);
          ctx.lineTo(p4.px, p4.py);
          ctx.closePath();

          if (renderMode === "cad") {
            ctx.strokeStyle = "#34d399";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          } else {
            const grad = ctx.createLinearGradient(p1.px, p1.py, p3.px, p3.py);
            grad.addColorStop(0, i % 2 === 0 ? "#0f172a" : "#1e293b");
            grad.addColorStop(1, "#0284c7");
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.2)";
            ctx.stroke();
          }
        }
      }

      ctx.restore();
    };

    drawModel();
  }, [rotationX, rotationY, zoom, renderMode, selectedModel]);

  // Mouse / Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
    setIsAutoSpin(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    setRotationY((prev) => (prev + deltaX * 0.7) % 360);
    setRotationX((prev) => Math.max(-60, Math.min(60, prev - deltaY * 0.7)));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleReset = () => {
    setRotationX(15);
    setRotationY(45);
    setZoom(1);
    setActiveHotspot(null);
    setIsAutoSpin(true);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-navy-950 rounded-3xl overflow-hidden border border-navy-900 shadow-2xl transition-all duration-500 font-sans text-white",
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-0" : "w-full my-8"
      )}
    >
      {/* Background Tech Glow & Grid */}
      <div className="absolute inset-0 bg-radial from-primary-600/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-electric/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Controls Bar */}
      <div className="relative z-20 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 bg-electric/20 text-electric text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-electric/30">
              <Rotate3d className="h-3.5 w-3.5" /> Visor 3D Interactivo
            </span>
            <span className="text-xs font-mono text-slate-400">SKU: {selectedModel.sku}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight uppercase">
            {selectedModel.name}
          </h2>
        </div>

        {/* Model Switcher Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {MODELS_3D.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedModel(m);
                setActiveHotspot(null);
              }}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border",
                selectedModel.id === m.id
                  ? "bg-primary-600 border-primary-400 text-white shadow-lg shadow-primary-600/30"
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
              )}
            >
              {m.name.split(" ")[0]} {m.name.split(" ")[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Canvas Area */}
      <div
        className="relative h-[480px] sm:h-[550px] w-full cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={550}
          className="max-w-full max-h-full object-contain pointer-events-none"
        />

        {/* 3D Hotspots Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {selectedModel.hotspots.map((hs) => {
            // Compute projected 2D position for hotspot based on rotation
            const radX = (rotationX * Math.PI) / 180;
            const radY = (rotationY * Math.PI) / 180;

            const x1 = hs.x * Math.cos(radY) + hs.z * Math.sin(radY);
            const z1 = -hs.x * Math.sin(radY) + hs.z * Math.cos(radY);
            const y2 = hs.y * Math.cos(radX) - z1 * Math.sin(radX);

            const scale = (400 / (400 + z1)) * zoom;
            const posX = 50 + (x1 * scale) / 8;
            const posY = 50 + (y2 * scale) / 8;

            return (
              <div
                key={hs.id}
                style={{ top: `${posY}%`, left: `${posX}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-30"
              >
                <button
                  onClick={() => setActiveHotspot(activeHotspot === hs.id ? null : hs.id)}
                  className={cn(
                    "relative group flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 shadow-xl",
                    activeHotspot === hs.id
                      ? "bg-electric text-navy-950 border-white scale-125 shadow-electric/50"
                      : "bg-navy-950/90 text-white border-electric hover:scale-110"
                  )}
                >
                  <span className="text-xs font-mono font-extrabold">{hs.id}</span>
                  
                  {/* Ping Animation */}
                  <span className="absolute inset-0 rounded-full bg-electric/40 animate-ping pointer-events-none" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Active Hotspot Info Card Modal (Glassmorphism Overlay) */}
        <AnimatePresence>
          {activeHotspot !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-40 bg-navy-950/90 backdrop-blur-xl border border-white/20 p-5 rounded-2xl shadow-2xl"
            >
              {(() => {
                const hs = selectedModel.hotspots.find((h) => h.id === activeHotspot);
                if (!hs) return null;
                return (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-electric bg-white/10 px-2.5 py-1 rounded-md border border-white/15">
                        Punto Técnico #{hs.id} · {hs.norm}
                      </span>
                      <button
                        onClick={() => setActiveHotspot(null)}
                        className="text-slate-400 hover:text-white text-xs font-mono"
                      >
                        ✕
                      </button>
                    </div>
                    <h4 className="text-base font-heading font-extrabold text-white mb-2 leading-snug">
                      {hs.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {hs.description}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Ensayado según Estándares IRAM
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Floating Render Mode Selector */}
        <div className="absolute top-6 left-6 z-30 flex items-center gap-1.5 bg-navy-950/80 backdrop-blur-md p-1.5 rounded-xl border border-white/15 shadow-xl">
          <button
            onClick={() => setRenderMode("realistic")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5",
              renderMode === "realistic"
                ? "bg-primary-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Box className="h-3.5 w-3.5" /> 3D Realista
          </button>
          <button
            onClick={() => setRenderMode("cad")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5",
              renderMode === "cad"
                ? "bg-electric text-navy-950 shadow-md"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Layers className="h-3.5 w-3.5" /> Estructura CAD
          </button>
          <button
            onClick={() => setRenderMode("section")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5",
              renderMode === "section"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Eye className="h-3.5 w-3.5" /> Corte
          </button>
        </div>

        {/* Bottom Drag Instruction Badge */}
        <div className="absolute bottom-6 left-6 pointer-events-none hidden sm:flex items-center gap-2 bg-navy-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-[11px] text-slate-300">
          <Rotate3d className="h-4 w-4 text-electric animate-spin" />
          <span>Arrastrar para rotar 360° | Hacer clic en los puntos numerados</span>
        </div>
      </div>

      {/* Bottom Technical Specifications & Interactive Control Dock */}
      <div className="p-5 sm:p-6 border-t border-white/10 bg-white/5 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Specs Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
          {selectedModel.specs.map((sp, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                {sp.label}
              </span>
              <span className="text-xs font-extrabold text-white block truncate">
                {sp.value}
              </span>
            </div>
          ))}
        </div>

        {/* Control Action Buttons Dock */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className={cn(
              "p-3 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold",
              isAutoSpin
                ? "bg-electric text-navy-950 border-electric shadow-lg shadow-electric/20"
                : "bg-white/10 border-white/15 text-white hover:bg-white/20"
            )}
            title={isAutoSpin ? "Pausar Giro Automático" : "Activar Giro Automático"}
          >
            {isAutoSpin ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span className="hidden sm:inline">{isAutoSpin ? "Auto Giro ON" : "Auto Giro OFF"}</span>
          </button>

          <button
            onClick={() => setZoom((z) => Math.min(1.5, z + 0.15))}
            className="p-3 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-all"
            title="Acercar Zoom"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          <button
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
            className="p-3 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-all"
            title="Alejar Zoom"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-3 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-all"
            title="Reiniciar Vista"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-3 rounded-xl bg-primary-600 border border-primary-400 text-white hover:bg-primary-500 transition-all shadow-md"
            title={isFullscreen ? "Salir de Pantalla Completa" : "Ver en Pantalla Completa"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
