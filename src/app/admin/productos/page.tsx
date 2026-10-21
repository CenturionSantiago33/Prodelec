"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Search,
  Package,
} from "lucide-react";
import type { Product, Category } from "@/types";

interface FormState {
  id?: string;
  name: string;
  code: string;
  categoryId: string;
  description: string;
  price: string;
  sizeInfo: string;
  diameter: string;
  images: string;
  inStock: boolean;
  homologado: boolean;
  isNew: boolean;
}

const EMPTY: FormState = {
  name: "",
  code: "",
  categoryId: "",
  description: "",
  price: "",
  sizeInfo: "",
  diameter: "",
  images: "",
  inStock: true,
  homologado: false,
  isNew: false,
};

function categoryLabel(c: Category): string {
  return c.nameI18n?.es || c.name;
}

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => {
    fetch("/api/admin/products")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setProducts(d.products ?? []);
          setCategories(d.categories ?? []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q)
    );
  }, [products, search]);

  const notify = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2500);
  };

  const openCreate = () => {
    setForm({ ...EMPTY, categoryId: categories[0]?.id ?? "" });
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      id: p.id,
      name: p.name,
      code: p.code,
      categoryId: p.categoryId,
      description: p.description,
      price: p.price != null ? String(p.price) : "",
      sizeInfo: p.sizeInfo ?? "",
      diameter: p.diameter ?? "",
      images: (p.images ?? []).join(", "),
      inStock: p.inStock,
      homologado: !!p.homologado,
      isNew: p.isNew,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      name: form.name,
      code: form.code,
      categoryId: form.categoryId,
      description: form.description,
      price: form.price ? Number(form.price) : undefined,
      sizeInfo: form.sizeInfo || undefined,
      diameter: form.diameter || undefined,
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      inStock: form.inStock,
      homologado: form.homologado,
      isNew: form.isNew,
    };
    const url = form.id ? `/api/admin/products/${form.id}` : "/api/admin/products";
    const method = form.id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setShowForm(false);
      notify(form.id ? "Producto actualizado" : "Producto creado");
      load();
    } else {
      notify("No se pudo guardar el producto");
    }
  };

  const handleDelete = async (p: Product) => {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    notify("Producto eliminado");
    load();
  };

  const handleToggle = async (p: Product, field: "inStock" | "homologado" | "isNew", value: boolean) => {
    // actualización optimista
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, [field]: value } : x)));
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    }).catch(() => {});
    load();
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-navy-950 uppercase tracking-tight">
            Productos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {products.length} productos · editá datos, estados y stock del catálogo
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-950 hover:bg-primary-600 text-white text-xs font-bold transition-all shadow-md"
        >
          <Plus className="h-4 w-4" /> Agregar producto
        </button>
      </div>

      {message && (
        <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-sm">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o código..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center text-slate-400 gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Cargando productos...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                <tr>
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-center">Homologado</th>
                  <th className="py-3 px-4 text-center">Nuevo</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-navy-950 block">{p.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {p.code || "sin código"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {categoryLabel(categories.find((c) => c.id === p.categoryId) ?? ({} as Category))}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Toggle on={p.inStock} onChange={(v) => handleToggle(p, "inStock", v)} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Toggle on={!!p.homologado} onChange={(v) => handleToggle(p, "homologado", v)} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Toggle on={p.isNew} onChange={(v) => handleToggle(p, "isNew", v)} />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-slate-600 hover:text-red-600 ml-1"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      No se encontraron productos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-heading font-black text-navy-950">
                {form.id ? "Editar producto" : "Nuevo producto"}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre" className="col-span-2">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="admin-input"
                  placeholder="Caja de Conexión Compacta"
                />
              </Field>
              <Field label="Código">
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="admin-input"
                  placeholder="C1400CS"
                />
              </Field>
              <Field label="Categoría">
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="admin-input"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {categoryLabel(c)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Precio (ARS)" >
                <input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="admin-input"
                  type="number"
                  placeholder="Opcional"
                />
              </Field>
              <Field label="Medidas (sizeInfo)">
                <input
                  value={form.sizeInfo}
                  onChange={(e) => setForm({ ...form, sizeInfo: e.target.value })}
                  className="admin-input"
                  placeholder="400 × 200 × 180 mm"
                />
              </Field>
              <Field label="Diámetro">
                <input
                  value={form.diameter}
                  onChange={(e) => setForm({ ...form, diameter: e.target.value })}
                  className="admin-input"
                  placeholder="DN15 a DN25"
                />
              </Field>
              <Field label="Descripción" className="col-span-2">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="admin-input min-h-20"
                  placeholder="Descripción del producto..."
                />
              </Field>
              <Field label="Imágenes (separadas por coma)" className="col-span-2">
                <input
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  className="admin-input"
                  placeholder="/productos/fotos/..., /productos/fotos/..."
                />
              </Field>
            </div>

            <div className="flex gap-4 pt-1">
              <CheckRow
                label="En stock"
                checked={form.inStock}
                onChange={(v) => setForm({ ...form, inStock: v })}
              />
              <CheckRow
                label="Homologado"
                checked={form.homologado}
                onChange={(v) => setForm({ ...form, homologado: v })}
              />
              <CheckRow
                label="Nuevo"
                checked={form.isNew}
                onChange={(v) => setForm({ ...form, isNew: v })}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim()}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-navy-950 hover:bg-primary-600 text-white text-sm font-bold disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Guardar
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`w-9 h-5 rounded-full relative transition-colors ${on ? "bg-emerald-500" : "bg-slate-300"}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`}
      />
    </button>
  );
}

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
      />
      {label}
    </label>
  );
}
