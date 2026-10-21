"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Newspaper } from "lucide-react";
import type { Novelty } from "@/data/novelties";

interface FormState {
  id?: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
}

const EMPTY: FormState = {
  category: "Innovación",
  date: new Date().getFullYear().toString(),
  title: "",
  excerpt: "",
  image: "/carousel-2.jpg",
};

export default function AdminNovedadesPage() {
  const [novelties, setNovelties] = useState<Novelty[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => {
    fetch("/api/admin/novelties")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setNovelties(d?.novelties ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const notify = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2500);
  };

  const openCreate = () => {
    setForm(EMPTY);
    setShowForm(true);
  };

  const openEdit = (n: Novelty) => {
    setForm({
      id: n.id,
      category: n.category,
      date: n.date,
      title: n.title,
      excerpt: n.excerpt,
      image: n.image,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const url = form.id ? `/api/admin/novelties/${form.id}` : "/api/admin/novelties";
    const method = form.id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setShowForm(false);
      notify(form.id ? "Novedad actualizada" : "Novedad creada");
      load();
    } else {
      notify("No se pudo guardar la novedad");
    }
  };

  const handleDelete = async (n: Novelty) => {
    if (!confirm(`¿Eliminar "${n.title}"?`)) return;
    await fetch(`/api/admin/novelties/${n.id}`, { method: "DELETE" });
    notify("Novedad eliminada");
    load();
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-navy-950 uppercase tracking-tight">
            Novedades
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {novelties.length} novedades · aparecen en la home y en /novedades
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-950 hover:bg-primary-600 text-white text-xs font-bold transition-all shadow-md"
        >
          <Plus className="h-4 w-4" /> Agregar novedad
        </button>
      </div>

      {message && (
        <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
          {message}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex items-center justify-center text-slate-400 gap-2">
          <Loader2 className="h-5 w-5 animate-spin" /> Cargando novedades...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {novelties.map((n) => (
            <div key={n.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
              <div className="h-32 bg-slate-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={n.image} alt={n.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase bg-primary-50 text-primary-700 px-2 py-0.5 rounded-md">
                    {n.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                </div>
                <h3 className="text-sm font-bold text-navy-950 leading-tight">{n.title}</h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 flex-1">{n.excerpt}</p>
                <div className="flex justify-end gap-1 mt-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => openEdit(n)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(n)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-slate-600 hover:text-red-600"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {novelties.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <Newspaper className="h-8 w-8 mx-auto mb-2 opacity-40" />
              No hay novedades. Agregá la primera.
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-heading font-black text-navy-950">
                {form.id ? "Editar novedad" : "Nueva novedad"}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Categoría">
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="admin-input"
                  placeholder="Innovación"
                />
              </Field>
              <Field label="Fecha / Año">
                <input
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="admin-input"
                  placeholder="2026"
                />
              </Field>
              <Field label="Título" className="col-span-2">
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="admin-input"
                  placeholder="Título de la novedad"
                />
              </Field>
              <Field label="Resumen" className="col-span-2">
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="admin-input min-h-20"
                  placeholder="Breve descripción..."
                />
              </Field>
              <Field label="Imagen (ruta)" className="col-span-2">
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="admin-input"
                  placeholder="/carousel-2.jpg"
                />
              </Field>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
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
