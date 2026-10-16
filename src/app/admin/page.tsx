"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  TrendingUp,
  AlertCircle,
  Clock,
  Eye,
  Mail,
  ArrowRight,
  DollarSign,
  FileSpreadsheet,
  X,
  Building,
} from "lucide-react";
import { products } from "@/data/mock";

interface QuoteItem {
  id: string;
  cliente: string;
  empresa: string;
  email: string;
  telefono: string;
  fecha: string;
  productosCount: number;
  totalEstimado: number;
  estado: "pendiente" | "cotizada" | "aprobada" | "rechazada";
  detalle: string[];
}

const INITIAL_QUOTES: QuoteItem[] = [
  {
    id: "COT-0041",
    cliente: "Lic. María García",
    empresa: "Municipalidad de Morón",
    email: "compras@moron.gob.ar",
    telefono: "11-4480-0000",
    fecha: "14/10/2026",
    productosCount: 4,
    totalEstimado: 1850000,
    estado: "pendiente",
    detalle: ["Caja de Conexión C400 CS x 50 u", "Abrazadera Derivación DN 110 x 80 u"],
  },
  {
    id: "COT-0040",
    cliente: "Ing. Pablo Ruiz",
    empresa: "AySA S.A. (Licitación ET-15)",
    email: "licitaciones@aysa.com.ar",
    telefono: "11-6394-0000",
    fecha: "13/10/2026",
    productosCount: 8,
    totalEstimado: 4920000,
    estado: "cotizada",
    detalle: ["Abrazadera de Reparación Inox 1 Banda x 120 u", "Unión Universal DN 63 x 200 u"],
  },
  {
    id: "COT-0039",
    cliente: "Arq. Luis Pereyra",
    empresa: "Construcciones Del Sur S.R.L.",
    email: "admin@cdelsur.com",
    telefono: "351-421-0000",
    fecha: "12/10/2026",
    productosCount: 2,
    totalEstimado: 680000,
    estado: "aprobada",
    detalle: ["Caja Vereda Antivandálica C300 x 30 u"],
  },
  {
    id: "COT-0038",
    cliente: "Sr. Jorge Méndez",
    empresa: "ABSA Aguas Bonaerenses",
    email: "compras@absa.com.ar",
    telefono: "221-450-0000",
    fecha: "11/10/2026",
    productosCount: 12,
    totalEstimado: 8350000,
    estado: "rechazada",
    detalle: ["Abrazadera con Inserto de Bronce DN 75 x 300 u"],
  },
  {
    id: "COT-0037",
    cliente: "Sra. Ana Fernández",
    empresa: "Cooperativa de Agua El Progreso",
    email: "info@elprogreso.coop",
    telefono: "236-442-0000",
    fecha: "10/10/2026",
    productosCount: 3,
    totalEstimado: 940000,
    estado: "pendiente",
    detalle: ["Válvula Esférica de Polipropileno 1\" x 60 u"],
  },
  {
    id: "COT-0036",
    cliente: "Ing. Roberto Díaz",
    empresa: "Obras Sanitarias Luján",
    email: "osluj@lujan.gov.ar",
    telefono: "2323-420-000",
    fecha: "09/10/2026",
    productosCount: 6,
    totalEstimado: 1710000,
    estado: "aprobada",
    detalle: ["Kit Conexión Flexible Termofusión x 150 u"],
  },
];

const LOW_STOCK_ITEMS = [
  { sku: "PROD-CX-400", nombre: "Caja de Conexión C400 CS Antivandálica", stock: 4, min: 20, estado: "critico" },
  { sku: "PROD-AB-110", nombre: "Abrazadera Derivación con Inserto DN 110", stock: 0, min: 50, estado: "agotado" },
  { sku: "PROD-REP-INOX", nombre: "Abrazadera Reparación 1 Banda AISI 304", stock: 8, min: 30, estado: "critico" },
];

export default function AdminDashboard() {
  const [quotes, setQuotes] = useState<QuoteItem[]>(INITIAL_QUOTES);
  const [filterEstado, setFilterEstado] = useState<string>("todas");
  const [selectedQuote, setSelectedQuote] = useState<QuoteItem | null>(null);
  const [stockList, setStockList] = useState(LOW_STOCK_ITEMS);

  const handleStatusChange = (id: string, newStatus: QuoteItem["estado"]) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, estado: newStatus } : q))
    );
    if (selectedQuote && selectedQuote.id === id) {
      setSelectedQuote((prev) => (prev ? { ...prev, estado: newStatus } : null));
    }
  };

  const handleRestock = (sku: string) => {
    setStockList((prev) =>
      prev.map((item) =>
        item.sku === sku ? { ...item, stock: item.stock + 50, estado: "normal" } : item
      )
    );
  };

  const handleExportCsv = () => {
    const headers = ["ID", "Cliente", "Empresa", "Email", "Telefono", "Fecha", "Productos", "Total Estimado", "Estado"];
    const rows = quotes.map((q) => [
      q.id,
      q.cliente,
      q.empresa,
      q.email,
      q.telefono,
      q.fecha,
      q.productosCount,
      q.totalEstimado,
      q.estado,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cotizaciones_prodelec_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredQuotes = quotes.filter((q) => {
    if (filterEstado === "todas") return true;
    return q.estado === filterEstado;
  });

  const totalVolumenEstimado = quotes.reduce((acc, q) => acc + q.totalEstimado, 0);
  const pendientesCount = quotes.filter((q) => q.estado === "pendiente").length;

  return (
    <div className="space-y-8 font-sans">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-navy-950 uppercase tracking-tight">
            Dashboard General
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Resumen operativo y comercial en tiempo real · Período Actual 2026
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Exportar CSV</span>
          </button>

          <Link
            href="/admin/cotizaciones"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-950 hover:bg-primary-600 text-white text-xs font-bold transition-all shadow-md"
          >
            <span>Ver Cotizaciones</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Cotizaciones Pendientes
            </span>
            <span className="text-3xl font-heading font-black text-navy-950 block mt-1">
              {pendientesCount}
            </span>
            <span className="text-[11px] font-bold text-amber-600 inline-flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" /> Requieren atención hoy
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Volumen en Cotizaciones
            </span>
            <span className="text-2xl font-heading font-black text-navy-950 block mt-1">
              ${(totalVolumenEstimado / 1000000).toFixed(1)}M
            </span>
            <span className="text-[11px] font-bold text-emerald-600 inline-flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> +14.2% este mes
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Catálogo de Productos
            </span>
            <span className="text-3xl font-heading font-black text-navy-950 block mt-1">
              {products.length}
            </span>
            <span className="text-[11px] font-bold text-primary-600 inline-flex items-center gap-1 mt-1">
              100% Homologados
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <Package className="h-6 w-6" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Alertas de Stock
            </span>
            <span className="text-3xl font-heading font-black text-red-600 block mt-1">
              {stockList.filter((s) => s.stock <= s.min).length}
            </span>
            <span className="text-[11px] font-bold text-red-500 inline-flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" /> 1 producto agotado
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Quotes Table & Stock Alert Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Interactive Quotes Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-heading font-extrabold text-navy-950 uppercase tracking-wider">
                Últimas Solicitudes de Cotización
              </h2>
              <p className="text-xs text-slate-500">
                Cambie el estado en 1 clic o visualice el detalle técnico
              </p>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {[
                { id: "todas", label: "Todas" },
                { id: "pendiente", label: "Pendientes" },
                { id: "cotizada", label: "Cotizadas" },
                { id: "aprobada", label: "Aprobadas" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterEstado(f.id)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filterEstado === f.id
                      ? "bg-white text-navy-950 shadow-xs"
                      : "text-slate-500 hover:text-navy-950"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Cliente / Empresa</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Monto Est.</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQuotes.map((q) => {
                  const statusColors: Record<string, string> = {
                    pendiente: "bg-amber-100 text-amber-800 border-amber-300",
                    cotizada: "bg-blue-100 text-blue-800 border-blue-300",
                    aprobada: "bg-emerald-100 text-emerald-800 border-emerald-300",
                    rechazada: "bg-red-100 text-red-800 border-red-300",
                  };

                  return (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-navy-950">
                        {q.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-navy-950 block">{q.empresa}</span>
                        <span className="text-[11px] text-slate-400 block">{q.cliente}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {q.fecha}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        ${q.totalEstimado.toLocaleString("es-AR")}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={q.estado}
                          onChange={(e) =>
                            handleStatusChange(q.id, e.target.value as QuoteItem["estado"])
                          }
                          className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md border cursor-pointer ${statusColors[q.estado]}`}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="cotizada">Cotizada</option>
                          <option value="aprobada">Aprobada</option>
                          <option value="rechazada">Rechazada</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedQuote(q)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-navy-950 transition-colors"
                          title="Ver Detalle de Cotización"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500">
            <span>Mostrando {filteredQuotes.length} de {quotes.length} cotizaciones</span>
            <Link href="/admin/cotizaciones" className="font-bold text-primary-600 hover:underline">
              Gestionar todas las cotizaciones →
            </Link>
          </div>
        </div>

        {/* Right Column (1 col): Critical Stock Monitor & Quick Tools */}
        <div className="space-y-6">
          {/* Inventory Alert Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-sm font-heading font-extrabold text-navy-950 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Monitoreo de Stock Crítico
              </h2>
              <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-md">
                Urgente
              </span>
            </div>

            <div className="space-y-3">
              {stockList.map((item) => (
                <div
                  key={item.sku}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-primary-600 block">
                        Código: {item.sku}
                      </span>
                      <h3 className="text-xs font-bold text-navy-950 leading-tight">
                        {item.nombre}
                      </h3>
                    </div>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md shrink-0 ${
                        item.stock === 0
                          ? "bg-red-600 text-white"
                          : item.stock <= item.min
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {item.stock === 0 ? "Agotado" : `${item.stock} u disponibles`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-500">Mínimo sugerido: {item.min} u</span>
                    <button
                      onClick={() => handleRestock(item.sku)}
                      className="px-2.5 py-1 rounded bg-navy-950 hover:bg-primary-600 text-white text-[10px] font-bold uppercase transition-colors"
                    >
                      +50 u Reingreso
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/admin/productos"
              className="mt-4 block text-center py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
            >
              Ver Inventario Completo
            </Link>
          </div>

          {/* Quick Access Tiles */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h2 className="text-xs font-heading font-extrabold text-navy-950 uppercase tracking-wider mb-2">
              Accesos Rápidos
            </h2>
            <Link
              href="/admin/productos"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-primary-50 hover:border-primary-200 border border-slate-200 transition-all text-xs font-bold text-navy-950 group"
            >
              <div className="flex items-center gap-2.5">
                <Package className="h-4 w-4 text-primary-600" />
                <span>Actualizar Precios y Productos</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/mailing"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-primary-50 hover:border-primary-200 border border-slate-200 transition-all text-xs font-bold text-navy-950 group"
            >
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-purple-600" />
                <span>Enviar Campaña de Mailing</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/clientes"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-primary-50 hover:border-primary-200 border border-slate-200 transition-all text-xs font-bold text-navy-950 group"
            >
              <div className="flex items-center gap-2.5">
                <Building className="h-4 w-4 text-emerald-600" />
                <span>Directorio de Clientes</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono font-bold text-primary-600 uppercase">
                  Detalle de Solicitud #{selectedQuote.id}
                </span>
                <h3 className="text-lg font-heading font-black text-navy-950">
                  {selectedQuote.empresa}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-navy-950 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Contacto</span>
                  <span className="font-bold text-navy-950">{selectedQuote.cliente}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Teléfono</span>
                  <span className="font-mono font-bold text-navy-950">{selectedQuote.telefono}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Email</span>
                  <span className="font-mono text-slate-700">{selectedQuote.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Fecha</span>
                  <span className="font-mono text-slate-700">{selectedQuote.fecha}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-navy-950 uppercase tracking-wider text-[11px] mb-2">
                  Ítems Solicitados:
                </h4>
                <div className="space-y-1.5">
                  {selectedQuote.detalle.map((item, i) => (
                    <div key={i} className="flex justify-between p-2 bg-slate-50 rounded-lg text-slate-700 font-medium">
                      <span>• {item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">Valor Estimado:</span>
                <span className="font-heading font-black text-primary-600 text-base">
                  ${selectedQuote.totalEstimado.toLocaleString("es-AR")}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  handleStatusChange(selectedQuote.id, "aprobada");
                  setSelectedQuote(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Aprobar Cotización
              </button>
              <button
                onClick={() => setSelectedQuote(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
