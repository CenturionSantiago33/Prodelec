"use client";

import { useState } from "react";
import {
  Send,
  Users,
  Tag,
  Megaphone,
  CheckCircle2,
  Mail,
  Sparkles,
  Eye,
  BarChart3,
  Clock,
  ShieldCheck,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const LISTS = [
  {
    id: "all",
    label: "Todos los Clientes Registrados",
    desc: "Base de datos unificada de empresas y sanitaristas",
    count: 1280,
    icon: Users,
    color: "text-blue-600 bg-blue-50",
    defaultSubject: "Boletín Oficial Prodelec — Soluciones de Ingeniería e Infraestructura",
    defaultBody: "Estimado cliente,\n\nLe enviamos el boletín oficial con el resumen consolidado de productos homologados, fichas técnicas y novedades operativas de Prodelec S.A.\n\nConsulte nuestro catálogo en línea para más información o solicitar cotización.",
    defaultCta: "Ver Catálogo Completo",
  },
  {
    id: "prices",
    label: "Lista de Precios & Cotizaciones",
    desc: "Clientes corporativos con listas activas",
    count: 420,
    icon: Tag,
    color: "text-emerald-600 bg-emerald-50",
    defaultSubject: "Actualización de Lista de Precios Oficial Prodelec - Agosto 2026",
    defaultBody: "Estimado departamento de compras,\n\nLe enviamos la actualización de nuestra Lista de Precios Oficial y condiciones comerciales de despacho para toda la línea de accesorios de agua potable y saneamiento.\n\nConsulte con su asesor comercial asignado o descargue el archivo consolidado directamente desde nuestra plataforma.",
    defaultCta: "Descargar Lista de Precios PDF",
  },
  {
    id: "offers",
    label: "Ofertas y Descuentos Especiales",
    desc: "Contactos suscritos a bonificaciones por volumen",
    count: 650,
    icon: Megaphone,
    color: "text-amber-600 bg-amber-50",
    defaultSubject: "Bonificación Especial: 15% OFF en Abrazaderas de Reparación y Accesorios",
    defaultBody: "Estimado cliente,\n\nDurante este mes contamos con un 15% de bonificación exclusiva en pedidos por volumen de la línea de Abrazaderas de Reparación en Acero Inoxidable AISI 304.\n\nUnidades con stock permanente y entrega inmediata en planta Florencio Varela.",
    defaultCta: "Aprovechar Bonificación",
  },
  {
    id: "news",
    label: "Nuevos Lanzamientos & Pliegos",
    desc: "Ingenieros y contratistas de obras públicas",
    count: 890,
    icon: Mail,
    color: "text-purple-600 bg-purple-50",
    defaultSubject: "Novedad Prodelec: Lanzamiento oficial de Cajas C400 CS Homologadas 2026",
    defaultBody: "Estimado cliente,\n\nNos complace anunciar la incorporación inmediata a nuestro catálogo oficial de las nuevas Cajas de Conexión C400 CS Homologadas por prestatarias.\n\nConstruidas en polipropileno de alta densidad con protección UV y resistencia a la carga, diseñadas para responder en las instalaciones más exigentes del país.\n\nDescargá la ficha técnica completa y solicitá tu cotización por volumen en nuestra web.",
    defaultCta: "Ver Producto en el Catálogo",
  },
];

const PRESET_TEMPLATES = [
  {
    id: "lanzamiento",
    name: "📦 Lanzamiento de Producto",
    subject: "Novedad Prodelec: Lanzamiento oficial de Cajas C400 CS Homologadas 2026",
    body: "Estimado cliente,\n\nNos complace anunciar la incorporación inmediata a nuestro catálogo oficial de las nuevas Cajas de Conexión C400 CS Homologadas por prestatarias.\n\nConstruidas en polipropileno de alta densidad con protección UV y resistencia a la carga, diseñadas para responder en las instalaciones más exigentes del país.\n\nDescargá la ficha técnica completa y solicitá tu cotización por volumen en nuestra web.",
    ctaText: "Ver Producto en el Catálogo",
  },
  {
    id: "precios",
    name: "🏷️ Lista de Precios Vigente",
    subject: "Actualización de Lista de Precios Oficial Prodelec - Agosto 2026",
    body: "Estimado departamento de compras,\n\nLe enviamos la actualización de nuestra Lista de Precios Oficial y condiciones comercial de despacho para toda la línea de accesorios de agua potable y saneamiento.\n\nConsulte con su asesor comercial asignado o descargue el archivo consolidado directamente desde nuestra plataforma.",
    ctaText: "Descargar Lista de Precios PDF",
  },
  {
    id: "oferta",
    name: "⚡ Oferta y Bonificación",
    subject: "Bonificación Especial: 15% OFF en Abrazaderas de Reparación de 1 Banda",
    body: "Estimado cliente,\n\nDurante este mes contamos con un 15% de bonificación exclusiva en pedidos por volumen de la línea de Abrazaderas de Reparación en Acero Inoxidable AISI 304.\n\nUnidades con stock permanente y entrega inmediata en planta Florencio Varela.",
    ctaText: "Aprovechar Bonificación",
  },
];

export default function MailingPage() {
  const [selectedList, setSelectedList] = useState("all");
  const [subject, setSubject] = useState(LISTS[0].defaultSubject);
  const [body, setBody] = useState(LISTS[0].defaultBody);
  const [ctaText, setCtaText] = useState(LISTS[0].defaultCta);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const selectedListData = LISTS.find((l) => l.id === selectedList);

  const handleSelectList = (listId: string) => {
    setSelectedList(listId);
    const targetList = LISTS.find((l) => l.id === listId);
    if (targetList) {
      setSubject(targetList.defaultSubject);
      setBody(targetList.defaultBody);
      setCtaText(targetList.defaultCta);
    }
  };

  const applyTemplate = (template: typeof PRESET_TEMPLATES[0]) => {
    setSubject(template.subject);
    setBody(template.body);
    setCtaText(template.ctaText);
  };

  const handleSend = () => {
    if (!selectedList || !subject || !body) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-8 font-sans text-slate-900">
      {/* Header Corporativo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-950 text-white p-8 rounded-3xl border border-navy-900 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-electric/15 text-electric text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-electric/30 mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Módulo Oficial de Comunicados Automatizados
          </div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Sistema de Mailing Automatizado Prodelec</h1>
          <p className="text-gray-300 text-sm mt-1">
            El asunto del correo se ajusta automáticamente según la lista o sección seleccionada.
          </p>
        </div>
      </div>

      {/* Alerta de confirmación */}
      {sent && (
        <div className="flex items-center gap-4 bg-emerald-500/10 border-2 border-emerald-500 rounded-2xl p-5 text-emerald-950 shadow-lg animate-fade-in">
          <CheckCircle2 className="h-7 w-7 text-emerald-600 shrink-0" />
          <div>
            <h4 className="font-extrabold text-base text-emerald-900">Campaña Despachada Exitosamente</h4>
            <p className="text-xs text-emerald-700 mt-0.5">
              El correo se ha enviado a {selectedListData?.count} destinatarios de la lista &quot;{selectedListData?.label}&quot; con el asunto: <strong>&quot;{subject}&quot;</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary-600 flex items-center justify-center font-bold">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-mono font-extrabold text-navy-950">1.280</span>
            <span className="text-xs font-bold text-gray-400 block uppercase">Clientes Suscritos</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-mono font-extrabold text-navy-950">68.4%</span>
            <span className="text-xs font-bold text-gray-400 block uppercase">Tasa de Apertura</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-mono font-extrabold text-navy-950">En 1 Clic</span>
            <span className="text-xs font-bold text-gray-400 block uppercase">Envío Automático</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-mono font-extrabold text-navy-950">100% SSL</span>
            <span className="text-xs font-bold text-gray-400 block uppercase">Servidor Seguro</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Formulario y Selección de Audiencia (Columna 7) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Selector de Lista de Clientes con Asunto Automático */}
          <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-navy-950 mb-2 uppercase tracking-wider flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-600" /> 1. Seleccionar Sección / Lista de Destinatarios
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Al seleccionar una sección, el Asunto del Correo se configura automáticamente.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LISTS.map((list) => (
                <button
                  key={list.id}
                  onClick={() => handleSelectList(list.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    selectedList === list.id
                      ? "border-primary-600 bg-sky-50/80 shadow-md"
                      : "border-sky-100 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-navy-950">{list.label}</span>
                    <span className="text-xs font-mono font-extrabold text-primary-600 bg-white px-2.5 py-1 rounded-full border border-sky-200">{list.count}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-2">{list.desc}</p>
                  <span className="text-[10px] font-bold text-primary-700 bg-white px-2 py-0.5 rounded border border-slate-200 block truncate">
                    Asunto: {list.defaultSubject}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Plantillas rápidas */}
          <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-navy-950 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-600" /> Plantillas Pre-diseñadas Alternativas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRESET_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => applyTemplate(tmpl)}
                  className="p-3.5 rounded-xl border border-sky-100 hover:border-primary-500 bg-sky-50/50 hover:bg-sky-50 text-left transition-all group"
                >
                  <p className="font-extrabold text-xs text-navy-950 group-hover:text-primary-600 transition-colors">{tmpl.name}</p>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">Cargar texto rápido</p>
                </button>
              ))}
            </div>
          </div>

          {/* Formulario de Contenido del Email */}
          <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-navy-950 uppercase tracking-wider flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary-600" /> 2. Redactor del Comunicado (Configurado por Sección)
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Asunto del Correo (Configurado según la sección elegida) *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ej: Novedad Prodelec — Lanzamiento Oficial"
                className="w-full rounded-xl border-2 border-primary-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-600 outline-none font-bold text-navy-950 bg-sky-50/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Texto Principal del Email *</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={7}
                placeholder="Escribí el mensaje para los clientes..."
                className="w-full rounded-xl border border-sky-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-600 outline-none resize-none font-sans leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Texto del Botón de Acción (CTA)</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Ej: Ver en el Catálogo"
                className="w-full rounded-xl border border-sky-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-600 outline-none font-medium"
              />
            </div>

            <Button
              onClick={handleSend}
              disabled={!selectedList || !subject || !body || sending}
              className="w-full h-14 text-base font-extrabold bg-gradient-to-r from-primary-600 to-electric hover:from-primary-700 hover:to-primary-600 text-white rounded-2xl shadow-xl shadow-primary-600/30 transition-all"
            >
              {sending ? (
                <span>🚀 Despachando email a {selectedListData?.count} clientes...</span>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  🚀 Disparar Campaña Automática ({selectedListData?.count} contactos)
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Vista Previa en Tiempo Real (Columna 5) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xl sticky top-24">
            <h2 className="text-base font-extrabold text-navy-950 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary-600" /> Vista Previa del Email a Enviar
            </h2>

            {/* Email Box Mock Executive */}
            <div className="border border-sky-200 rounded-2xl overflow-hidden shadow-md bg-white">
              {/* Header membrete Prodelec */}
              <div className="bg-navy-950 p-5 flex items-center justify-between border-b border-navy-900">
                <div>
                  <span className="text-lg font-heading font-extrabold tracking-widest text-white block">PRODELEC</span>
                  <span className="text-[9px] font-bold text-electric tracking-widest uppercase">SOLUCIONES INDUSTRIALES</span>
                </div>
                <span className="text-[10px] font-mono bg-white/10 text-gray-300 px-2.5 py-1 rounded-md">prodelec@prodelec.com.ar</span>
              </div>

              {/* Asunto y Contenido */}
              <div className="p-6 bg-white space-y-4">
                <div className="pb-3 border-b border-sky-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Sección elegida: {selectedListData?.label}
                  </span>
                  <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest block mb-1">
                    Asunto que les llegará:
                  </span>
                  <h3 className="text-sm font-extrabold text-navy-950 leading-snug">{subject || "Sin asunto"}</h3>
                </div>

                <div className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {body || "El contenido del correo se visualizará aquí en tiempo real..."}
                </div>

                {/* Botón CTA dentro del mail */}
                {ctaText && (
                  <div className="pt-4 text-center">
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-extrabold text-xs shadow-md">
                      {ctaText} <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                )}
              </div>

              {/* Pie de email institucional */}
              <div className="bg-sky-50/80 p-4 text-center border-t border-sky-100">
                <p className="text-[10px] text-gray-500 font-medium">
                  PRODELEC S.A. — Parque Industrial Good Park, Florencio Varela.<br/>
                  Este correo automático fue enviado a la lista de clientes seleccionada.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
