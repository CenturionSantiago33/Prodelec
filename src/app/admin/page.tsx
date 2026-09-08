import React from "react";
import { Package, TrendingUp, AlertCircle, Clock } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-heading text-gray-900">Resumen</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Cotizaciones Pendientes", value: "12", icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
          { title: "Productos Activos", value: "145", icon: Package, color: "text-primary-600", bg: "bg-primary-100" },
          { title: "Visitas del mes", value: "8.4k", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100" },
          { title: "Sin Stock", value: "3", icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm min-h-[400px]">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Últimas cotizaciones solicitadas</h2>
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
           {/* Placeholder for Data Table */}
           <p>Conecte su API o Base de datos (ej. Supabase, Prisma) para cargar datos reales.</p>
        </div>
      </div>
    </div>
  );
}
