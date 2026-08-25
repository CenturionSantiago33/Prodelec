import React from "react";
import { UserCircle, Mail, Phone, Building2 } from "lucide-react";

const mockClientes = [
  { id: 1, nombre: "Municipalidad de Morón", contacto: "Lic. María García", email: "compras@moron.gob.ar", telefono: "+54 11 4480-0000", tipo: "Gobierno", cotizaciones: 3 },
  { id: 2, nombre: "AySA S.A.", contacto: "Ing. Pablo Ruiz", email: "licitaciones@aysa.com.ar", telefono: "+54 11 6394-0000", tipo: "Empresa", cotizaciones: 8 },
  { id: 3, nombre: "Construcciones Del Sur", contacto: "Arq. Luis Pereyra", email: "admin@cdelsur.com", telefono: "+54 351 421-0000", tipo: "Empresa", cotizaciones: 2 },
  { id: 4, nombre: "ABSA Aguas Bonaerenses", contacto: "Sr. Jorge Méndez", email: "compras@absa.com.ar", telefono: "+54 221 450-0000", tipo: "Empresa pública", cotizaciones: 1 },
  { id: 5, nombre: "Cooperativa El Progreso", contacto: "Sra. Ana Fernández", email: "info@elprogreso.coop", telefono: "+54 236 442-0000", tipo: "Cooperativa", cotizaciones: 3 },
  { id: 6, nombre: "Obras Sanitarias Luján", contacto: "Ing. Roberto Díaz", email: "osluj@lujan.gov.ar", telefono: "+54 2323 420-000", tipo: "Gobierno", cotizaciones: 6 },
];

const tipoBadge: Record<string, string> = {
  "Gobierno": "bg-blue-100 text-blue-700",
  "Empresa": "bg-purple-100 text-purple-700",
  "Empresa pública": "bg-indigo-100 text-indigo-700",
  "Cooperativa": "bg-teal-100 text-teal-700",
};

export default function ClientesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500 mt-1">{mockClientes.length} clientes registrados</p>
        </div>
      </div>

      {/* Grid de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockClientes.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Building2 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{c.nombre}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{c.contacto}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${tipoBadge[c.tipo] ?? "bg-gray-100 text-gray-600"}`}>
                  {c.tipo}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{c.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span>{c.telefono}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{c.cotizaciones} cotización{c.cotizaciones !== 1 ? "es" : ""}</span>
              </div>
            </div>

            <button className="mt-4 w-full py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Ver detalle
            </button>
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-gray-400 py-2">
        Datos de ejemplo — conectá tu base de datos para ver clientes reales
      </div>
    </div>
  );
}
