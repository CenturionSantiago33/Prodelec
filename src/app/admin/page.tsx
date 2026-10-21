"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Package,
  Newspaper,
  Layers,
  TrendingUp,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

interface DayStat {
  date: string;
  count: number;
}

interface Stats {
  total: number;
  today: number;
  days: DayStat[];
  topPages: { path: string; count: number }[];
  catalog: { products: number; categories: number; novelties: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setStats(d))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const maxDay = Math.max(1, ...(stats?.days ?? []).map((d) => d.count));

  const kpis = [
    {
      label: "Visitas hoy",
      value: loading ? "—" : String(stats?.today ?? 0),
      icon: Eye,
      color: "text-sky-600 bg-sky-50",
      hint: "En tiempo real",
    },
    {
      label: "Visitas totales",
      value: loading ? "—" : String(stats?.total ?? 0),
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50",
      hint: "Desde que se habilitó el registro",
    },
    {
      label: "Productos",
      value: loading ? "—" : String(stats?.catalog.products ?? 0),
      icon: Package,
      color: "text-primary-600 bg-primary-50",
      hint: "En el catálogo",
    },
    {
      label: "Categorías",
      value: loading ? "—" : String(stats?.catalog.categories ?? 0),
      icon: Layers,
      color: "text-amber-600 bg-amber-50",
      hint: "Líneas de producto",
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-navy-950 uppercase tracking-tight">
            Dashboard General
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visitas reales al sitio, catálogo y novedades · Actualizado en vivo
          </p>
        </div>
        <div className="flex gap-2.5">
          <Link
            href="/admin/productos"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs"
          >
            <Package className="h-4 w-4 text-primary-600" /> Gestionar productos
          </Link>
          <Link
            href="/admin/novedades"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-950 hover:bg-primary-600 text-white text-xs font-bold transition-all shadow-md"
          >
            <Newspaper className="h-4 w-4" /> Novedades
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {k.label}
              </span>
              <span className="text-3xl font-heading font-black text-navy-950 block mt-1">
                {k.value}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 block mt-1">{k.hint}</span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${k.color}`}>
              <k.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de visitas (últimos 14 días) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h2 className="text-base font-heading font-extrabold text-navy-950 uppercase tracking-wider flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary-600" />
              Visitas por día
            </h2>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
              últimos 14 días
            </span>
          </div>

          <div className="flex items-end gap-1.5 h-48">
            {(stats?.days ?? []).map((d) => {
              const h = d.count === 0 ? 4 : Math.max(8, (d.count / maxDay) * 100);
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[9px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.count}
                  </span>
                  <div
                    className="w-full rounded-t-md bg-primary-600 group-hover:bg-primary-500 transition-colors"
                    style={{ height: `${h}%` }}
                    title={`${d.date}: ${d.count} visitas`}
                  />
                  <span className="text-[8px] text-slate-400 font-mono">
                    {d.date.slice(8)}/{d.date.slice(5, 7)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Páginas más visitadas */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <h2 className="text-sm font-heading font-extrabold text-navy-950 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Eye className="h-4 w-4 text-sky-600" /> Páginas más visitadas
          </h2>
          <div className="space-y-2">
            {(stats?.topPages ?? []).length === 0 && !loading && (
              <p className="text-xs text-slate-400">
                Todavía no hay visitas registradas. Navegá el sitio público para empezar a ver datos acá.
              </p>
            )}
            {(stats?.topPages ?? []).map((p, i) => (
              <div key={p.path} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50">
                <span className="w-5 h-5 rounded bg-navy-950 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-xs font-mono text-slate-700 truncate flex-1">{p.path}</span>
                <span className="text-xs font-bold text-navy-950">{p.count}</span>
              </div>
            ))}
          </div>

          <Link
            href="/admin/novedades"
            className="mt-4 flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-primary-50 border border-slate-200 transition-all text-xs font-bold text-navy-950"
          >
            <span className="flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-primary-600" />
              {stats?.catalog.novelties ?? 0} novedades publicadas
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
