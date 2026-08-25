"use client";

import React, { useState } from "react";
import {
  Plus, Search, Package, Tag, CheckCircle, XCircle,
  Pencil, X, DollarSign, ShoppingCart, BarChart2,
  TrendingUp, Save, AlertTriangle, ToggleLeft, ToggleRight,
} from "lucide-react";
import { products as initialProducts, categories } from "@/data/mock";
import { Product } from "@/types";

// ── Tipos internos ──────────────────────────────────────────────
interface ProductExtra {
  precioVenta: number;
  precioCosto: number;
  stockCantidad: number;
  proveedor: string;
  descuento: number; // %
  inStock: boolean;
  isNew: boolean;
}

type EditableProduct = Product & ProductExtra;

// ── Estado inicial con datos extra de ejemplo ────────────────────
function enrichProduct(p: Product, i: number): EditableProduct {
  const costos = [1200, 3400, 870, 2100, 6800, 4500, 9200, 2900, 5100, 3700, 4200, 1600, 980, 760, 1100];
  const ventas = [2200, 5900, 1450, 3800, 12500, 7800, 15900, 4900, 8700, 6400, 7200, 2700, 1750, 1300, 1900];
  return {
    ...p,
    precioVenta: ventas[i] ?? 2000,
    precioCosto: costos[i] ?? 1000,
    stockCantidad: Math.floor(Math.random() * 120) + 5,
    proveedor: ["Prodelec SA", "Proveedor Local"][i % 2],
    descuento: [0, 0, 5, 0, 10, 0, 0, 5, 0, 0, 0, 0, 5, 0, 10][i] ?? 0,
  };
}

const initial: EditableProduct[] = initialProducts.map(enrichProduct);

// ── Helpers ──────────────────────────────────────────────────────
function margen(venta: number, costo: number): number {
  if (!costo) return 0;
  return Math.round(((venta - costo) / venta) * 100);
}

function fmt(n: number) {
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 });
}

// ── Componente principal ─────────────────────────────────────────
export default function ProductosAdminPage() {
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const [prods, setProds] = useState<EditableProduct[]>(initial);
  const [selected, setSelected] = useState<EditableProduct | null>(null);
  const [draft, setDraft] = useState<EditableProduct | null>(null);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);

  const filtered = prods.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      categoryMap[p.categoryId]?.toLowerCase().includes(search.toLowerCase())
  );

  function openPanel(p: EditableProduct) {
    setSelected(p);
    setDraft({ ...p });
    setSaved(false);
  }

  function closePanel() {
    setSelected(null);
    setDraft(null);
    setSaved(false);
  }

  function handleChange(field: keyof EditableProduct, value: string | number | boolean) {
    if (!draft) return;
    setDraft({ ...draft, [field]: value });
  }

  function handleSave() {
    if (!draft) return;
    setProds((prev) => prev.map((p) => (p.id === draft.id ? draft : p)));
    setSelected(draft);
    setSaved(true);
  }

  const mg = draft ? margen(draft.precioVenta, draft.precioCosto) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500 mt-1">{prods.length} productos en el catálogo</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </button>
      </div>

      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Buscar por nombre, código o categoría..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Stats por categoría */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {categories.map((cat) => {
          const count = prods.filter((p) => p.categoryId === cat.id).length;
          return (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-500 leading-tight">{cat.name}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-4 font-semibold text-gray-600">Imagen</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">Nombre</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">Código</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">Categoría</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">P. Venta</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">Margen</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">Stock</th>
              <th className="px-6 py-4 font-semibold text-gray-600 text-right">Gestión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((p) => {
              const mg = margen(p.precioVenta, p.precioCosto);
              const isActive = selected?.id === p.id;
              return (
                <tr
                  key={p.id}
                  className={`hover:bg-gray-50/60 transition-colors ${isActive ? "bg-primary-50/40 ring-1 ring-inset ring-primary-200" : ""}`}
                >
                  <td className="px-6 py-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      {p.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-900 max-w-[180px] truncate">{p.name}</td>
                  <td className="px-6 py-3 font-mono text-xs text-gray-500">{p.code}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      <Tag className="h-3 w-3" />
                      {categoryMap[p.categoryId] ?? p.categoryId}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-semibold text-gray-800">{fmt(p.precioVenta)}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-bold ${mg >= 40 ? "text-emerald-600" : mg >= 20 ? "text-amber-600" : "text-red-500"}`}>
                      {mg}%
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {p.inStock ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                        <CheckCircle className="h-4 w-4" /> {p.stockCantidad} uds.
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-500 text-xs font-medium">
                        <XCircle className="h-4 w-4" /> Sin stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => openPanel(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700 transition-colors shadow-sm"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Gestionar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Slide-over Panel ── */}
      {/* Backdrop */}
      <div
        onClick={closePanel}
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${selected ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${selected ? "translate-x-0" : "translate-x-full"}`}
      >
        {draft && (
          <>
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-200 border border-gray-200 shrink-0">
                  {draft.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={draft.images[0]} alt={draft.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm leading-tight truncate max-w-[220px]">{draft.name}</p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{draft.code}</p>
                </div>
              </div>
              <button onClick={closePanel} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

              {/* Resumen de margen */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-blue-500 font-medium">Costo</p>
                  <p className="text-lg font-bold text-blue-800 mt-1">{fmt(draft.precioCosto)}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-emerald-500 font-medium">Venta</p>
                  <p className="text-lg font-bold text-emerald-800 mt-1">{fmt(draft.precioVenta)}</p>
                </div>
                <div className={`rounded-xl p-3 text-center ${mg >= 40 ? "bg-emerald-50" : mg >= 20 ? "bg-amber-50" : "bg-red-50"}`}>
                  <p className={`text-xs font-medium ${mg >= 40 ? "text-emerald-500" : mg >= 20 ? "text-amber-500" : "text-red-500"}`}>Margen</p>
                  <p className={`text-lg font-bold mt-1 ${mg >= 40 ? "text-emerald-800" : mg >= 20 ? "text-amber-800" : "text-red-700"}`}>{mg}%</p>
                </div>
              </div>

              {/* Sección: Precios */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-700">Precios</h3>
                </div>
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-xs font-medium text-gray-500 mb-1 block">Precio de venta (ARS)</span>
                    <input
                      type="number"
                      value={draft.precioVenta}
                      onChange={(e) => handleChange("precioVenta", Number(e.target.value))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-gray-500 mb-1 block">Precio de costo (ARS)</span>
                    <input
                      type="number"
                      value={draft.precioCosto}
                      onChange={(e) => handleChange("precioCosto", Number(e.target.value))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-gray-500 mb-1 block">Descuento especial (%)</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={draft.descuento}
                      onChange={(e) => handleChange("descuento", Number(e.target.value))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {draft.descuento > 0 && (
                      <p className="text-xs text-amber-600 mt-1">
                        Precio final con descuento: {fmt(draft.precioVenta * (1 - draft.descuento / 100))}
                      </p>
                    )}
                  </label>
                </div>
              </div>

              {/* Sección: Stock y compras */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingCart className="h-4 w-4 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-700">Stock y compras</h3>
                </div>
                <div className="space-y-3">
                  {/* Toggle en stock */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-sm text-gray-700 font-medium">Disponible en catálogo</span>
                    <button
                      onClick={() => handleChange("inStock", !draft.inStock)}
                      className="flex items-center gap-2"
                    >
                      {draft.inStock ? (
                        <ToggleRight className="h-7 w-7 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="h-7 w-7 text-gray-300" />
                      )}
                    </button>
                  </div>

                  {/* Toggle novedad */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-sm text-gray-700 font-medium">Marcar como "Novedad"</span>
                    <button
                      onClick={() => handleChange("isNew", !draft.isNew)}
                      className="flex items-center gap-2"
                    >
                      {draft.isNew ? (
                        <ToggleRight className="h-7 w-7 text-primary-500" />
                      ) : (
                        <ToggleLeft className="h-7 w-7 text-gray-300" />
                      )}
                    </button>
                  </div>

                  <label className="block">
                    <span className="text-xs font-medium text-gray-500 mb-1 block">Cantidad en stock (unidades)</span>
                    <input
                      type="number"
                      min={0}
                      value={draft.stockCantidad}
                      onChange={(e) => handleChange("stockCantidad", Number(e.target.value))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </label>

                  {draft.stockCantidad < 10 && draft.inStock && (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-700 text-xs">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      Stock bajo — considerar reposición
                    </div>
                  )}

                  <label className="block">
                    <span className="text-xs font-medium text-gray-500 mb-1 block">Proveedor</span>
                    <input
                      type="text"
                      value={draft.proveedor}
                      onChange={(e) => handleChange("proveedor", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </label>
                </div>
              </div>

              {/* Sección: Análisis rápido */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BarChart2 className="h-4 w-4 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-700">Análisis</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Ganancia por unidad</span>
                    <span className="font-semibold text-gray-900">{fmt(draft.precioVenta - draft.precioCosto)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Margen bruto</span>
                    <span className={`font-semibold ${mg >= 40 ? "text-emerald-600" : mg >= 20 ? "text-amber-600" : "text-red-500"}`}>{mg}%</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Valor total en stock</span>
                    <span className="font-semibold text-gray-900">{fmt(draft.precioVenta * draft.stockCantidad)}</span>
                  </div>
                  {draft.descuento > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Precio con {draft.descuento}% descuento</span>
                      <span className="font-semibold text-amber-700">{fmt(draft.precioVenta * (1 - draft.descuento / 100))}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              {saved && (
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium mb-3">
                  <CheckCircle className="h-4 w-4" />
                  Cambios guardados correctamente
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={closePanel}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
