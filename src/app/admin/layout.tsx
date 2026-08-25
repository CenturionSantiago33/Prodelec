import React from "react";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, Mail, Image } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-950 text-white flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-navy-900">
          <span className="text-xl font-heading font-bold tracking-wider">PRODELEC Admin</span>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-600/10 text-primary-400">
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/productos" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition-colors">
            <Package className="h-5 w-5" />
            <span className="font-medium">Productos</span>
          </Link>
          <Link href="/admin/cotizaciones" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition-colors">
            <ShoppingCart className="h-5 w-5" />
            <span className="font-medium">Cotizaciones</span>
          </Link>
          <Link href="/admin/clientes" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition-colors">
            <Users className="h-5 w-5" />
            <span className="font-medium">Clientes</span>
          </Link>
          <Link href="/admin/mailing" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition-colors">
            <Mail className="h-5 w-5" />
            <span className="font-medium">Mailing</span>
          </Link>
          <Link href="/admin/imagenes" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition-colors">
            <Image className="h-5 w-5" />
            <span className="font-medium">Imágenes</span>
          </Link>
          <Link href="/admin/configuracion" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition-colors">
            <Settings className="h-5 w-5" />
            <span className="font-medium">Configuración</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Panel de Control</h2>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
              AD
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
