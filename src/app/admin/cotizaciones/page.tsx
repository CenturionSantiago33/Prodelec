"use client";

import React, { useState } from "react";
import { Clock, CheckCircle, XCircle, Eye, Download, MessageSquare, Send } from "lucide-react";

interface Cotizacion {
  id: string;
  cliente: string;
  email: string;
  telefono: string;
  fecha: string;
  productos: number;
  estado: "pendiente" | "cotizada" | "aprobada" | "rechazada";
}

const initialCotizaciones: Cotizacion[] = [
  { id: "COT-0041", cliente: "Municipalidad de Morón", email: "compras@moron.gob.ar", telefono: "1123413935", fecha: "12/08/2026", productos: 4, estado: "pendiente" },
  { id: "COT-0040", cliente: "AySA S.A.", email: "licitaciones@aysa.com.ar", telefono: "1198765432", fecha: "11/08/2026", productos: 8, estado: "cotizada" },
  { id: "COT-0039", cliente: "Construcciones Del Sur", email: "admin@cdelsur.com", telefono: "1155443322", fecha: "10/08/2026", productos: 2, estado: "aprobada" },
  { id: "COT-0038", cliente: "ABSA Aguas Bonaerenses", email: "compras@absa.com.ar", telefono: "1166778899", fecha: "09/08/2026", productos: 12, estado: "rechazada" },
  { id: "COT-0037", cliente: "Cooperativa El Progreso", email: "info@elprogreso.coop", telefono: "1133221100", fecha: "08/08/2026", productos: 3, estado: "pendiente" },
  { id: "COT-0036", cliente: "Obras Sanitarias Luján", email: "osluj@lujan.gov.ar", telefono: "1144332211", fecha: "07/08/2026", productos: 6, estado: "aprobada" },
];

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>(initialCotizaciones);

  const updateEstado = (id: string, nuevoEstado: Cotizacion["estado"]) => {
    setCotizaciones(prev =>
      prev.map(c => (c.id === id ? { ...c, estado: nuevoEstado } : c))
    );
  };

  const counts = {
    pendiente: cotizaciones.filter(c => c.estado === "pendiente").length,
    cotizada: cotizaciones.filter(c => c.estado === "cotizada").length,
    aprobada: cotizaciones.filter(c => c.estado === "aprobada").length,
    rechazada: cotizaciones.filter(c => c.estado === "rechazada").length,
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Cotizaciones</h1>
          <p className="text-sm text-gray-500 mt-1">
            Administrá solicitudes de cotización y cambiá su estado con 1 solo clic.
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-navy-950 text-white rounded-xl text-sm font-bold hover:bg-primary-600 transition-colors shadow-md">
          <Download className="h-4 w-4" /> Exportar a Excel/CSV
        </button>
      </div>

      {/* Tarjetas de Estados Rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: "pendiente", label: "Pendientes", val: counts.pendiente, color: "text-amber-700 bg-amber-50 border-amber-200" },
          { key: "cotizada", label: "Cotizadas", val: counts.cotizada, color: "text-blue-700 bg-blue-50 border-blue-200" },
          { key: "aprobada", label: "Aprobadas", val: counts.aprobada, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
          { key: "rechazada", label: "Rechazadas", val: counts.rechazada, color: "text-red-700 bg-red-50 border-red-200" },
        ].map(s => (
          <div key={s.key} className={`rounded-2xl border p-5 ${s.color}`}>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">{s.label}</p>
            <p className="text-3xl font-extrabold mt-1">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Tabla Interactiva */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80 text-gray-600">
                <th className="text-left px-6 py-4 font-bold uppercase text-[11px] tracking-wider">ID</th>
                <th className="text-left px-6 py-4 font-bold uppercase text-[11px] tracking-wider">Cliente</th>
                <th className="text-left px-6 py-4 font-bold uppercase text-[11px] tracking-wider">Email</th>
                <th className="text-left px-6 py-4 font-bold uppercase text-[11px] tracking-wider">Fecha</th>
                <th className="text-center px-6 py-4 font-bold uppercase text-[11px] tracking-wider">Productos</th>
                <th className="text-left px-6 py-4 font-bold uppercase text-[11px] tracking-wider">Estado (Click para cambiar)</th>
                <th className="text-right px-6 py-4 font-bold uppercase text-[11px] tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cotizaciones.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">{c.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{c.cliente}</td>
                  <td className="px-6 py-4 text-gray-500">{c.email}</td>
                  <td className="px-6 py-4 text-gray-500">{c.fecha}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-800">{c.productos}</td>
                  
                  {/* Selector de Estado en 1 Clic */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => updateEstado(c.id, "pendiente")}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all ${
                          c.estado === "pendiente"
                            ? "bg-amber-500 text-white shadow-md scale-105"
                            : "bg-gray-100 text-gray-500 hover:bg-amber-100 hover:text-amber-800"
                        }`}
                      >
                        🟡 Pendiente
                      </button>
                      <button
                        onClick={() => updateEstado(c.id, "cotizada")}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all ${
                          c.estado === "cotizada"
                            ? "bg-blue-600 text-white shadow-md scale-105"
                            : "bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-800"
                        }`}
                      >
                        🔵 Cotizada
                      </button>
                      <button
                        onClick={() => updateEstado(c.id, "aprobada")}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all ${
                          c.estado === "aprobada"
                            ? "bg-emerald-600 text-white shadow-md scale-105"
                            : "bg-gray-100 text-gray-500 hover:bg-emerald-100 hover:text-emerald-800"
                        }`}
                      >
                        🟢 Aprobada
                      </button>
                      <button
                        onClick={() => updateEstado(c.id, "rechazada")}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all ${
                          c.estado === "rechazada"
                            ? "bg-red-600 text-white shadow-md scale-105"
                            : "bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-800"
                        }`}
                      >
                        🔴 Rechazada
                      </button>
                    </div>
                  </td>

                  {/* Acciones directas (WhatsApp) */}
                  <td className="px-6 py-4 text-right">
                    <a
                      href={`https://wa.me/549${c.telefono}?text=Hola%20${encodeURIComponent(c.cliente)},%20te%20contactamos%20de%20Prodelec%20sobre%20tu%20cotizaci%C3%B3n%20${c.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 font-bold text-xs hover:bg-green-600 hover:text-white transition-all"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      WhatsApp
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
