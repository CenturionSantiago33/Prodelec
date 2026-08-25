import React from "react";
import { Globe, Mail, Lock, Bell, Database, Palette } from "lucide-react";

const sections = [
  {
    icon: Globe,
    title: "Información del sitio",
    color: "text-blue-600 bg-blue-50",
    fields: [
      { label: "Nombre del sitio", value: "PRODELEC - Soluciones Industriales", type: "text" },
      { label: "Dominio", value: "prodelec.com.ar", type: "text" },
      { label: "Descripción SEO", value: "Soluciones industriales en plásticos para redes de agua potable", type: "textarea" },
    ],
  },
  {
    icon: Mail,
    title: "Correo y notificaciones",
    color: "text-emerald-600 bg-emerald-50",
    fields: [
      { label: "Email de contacto", value: "contacto@prodelec.com.ar", type: "email" },
      { label: "Email de cotizaciones", value: "ventas@prodelec.com.ar", type: "email" },
    ],
  },
  {
    icon: Bell,
    title: "Notificaciones",
    color: "text-amber-600 bg-amber-50",
    fields: [
      { label: "Notificar nuevas cotizaciones por email", value: "on", type: "toggle" },
      { label: "Resumen semanal de visitas", value: "off", type: "toggle" },
    ],
  },
  {
    icon: Lock,
    title: "Seguridad",
    color: "text-red-600 bg-red-50",
    fields: [
      { label: "Autenticación de doble factor (2FA)", value: "off", type: "toggle" },
      { label: "Cambiar contraseña de administrador", value: "", type: "password" },
    ],
  },
  {
    icon: Database,
    title: "Base de datos",
    color: "text-purple-600 bg-purple-50",
    fields: [
      { label: "Proveedor", value: "Supabase (no configurado)", type: "text" },
      { label: "URL de conexión", value: "", type: "text" },
    ],
  },
];

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-500 mt-1">Ajustes generales del panel y del sitio</p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Section header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${section.color}`}>
                <section.icon className="h-4 w-4" />
              </div>
              <h2 className="font-semibold text-gray-900 text-sm">{section.title}</h2>
            </div>

            {/* Fields */}
            <div className="divide-y divide-gray-50">
              {section.fields.map((field) => (
                <div key={field.label} className="flex items-center justify-between px-6 py-4 gap-6">
                  <label className="text-sm text-gray-600 shrink-0">{field.label}</label>
                  {field.type === "toggle" ? (
                    <div className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${field.value === "on" ? "bg-primary-500" : "bg-gray-200"}`}>
                      <div className={`absolute top-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform ${field.value === "on" ? "translate-x-5" : "translate-x-0.5"}`} />
                    </div>
                  ) : field.type === "textarea" ? (
                    <textarea
                      defaultValue={field.value}
                      rows={2}
                      className="w-full max-w-sm text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-gray-700"
                    />
                  ) : (
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      placeholder={field.type === "password" ? "••••••••" : ""}
                      className="w-full max-w-sm text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-700"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm">
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
