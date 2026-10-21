"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Newspaper,
  LogOut,
  ArrowLeft,
  ExternalLink,
  Menu,
  X,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/novedades", label: "Novedades", icon: Newspaper },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.user ?? null))
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/admin/login");
    router.refresh();
  };

  // El login se muestra a pantalla completa, sin sidebar.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-800">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 bg-navy-950 text-white flex-col shrink-0 border-r border-navy-900 shadow-xl">
        <div className="h-20 flex items-center justify-between px-6 border-b border-navy-900">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center font-bold text-white shadow-xs">
              P
            </div>
            <div>
              <span className="font-heading font-black tracking-wider text-sm block">PRODELEC</span>
              <span className="text-[10px] text-sky-400 font-mono font-bold uppercase tracking-widest block">ADMIN PANEL</span>
            </div>
          </Link>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Sistema Activo" />
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all",
                  isActive
                    ? "bg-primary-600 text-white shadow-md shadow-primary-900/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-navy-900 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all border border-white/5"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="h-3.5 w-3.5 text-sky-400" />
              <span>Ver Sitio Público</span>
            </span>
            <ExternalLink className="h-3 w-3 text-slate-500" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-white text-xs font-bold transition-all border border-white/5"
          >
            <span className="flex items-center gap-2">
              <LogOut className="h-3.5 w-3.5 text-red-400" />
              <span>Cerrar sesión</span>
            </span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-8 shrink-0 shadow-xs z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-black text-navy-950 uppercase tracking-tight">
                Panel de Administración
              </h2>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Catálogo, novedades y estadísticas en tiempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Ver Sitio Público
            </Link>
            <div className="h-9 w-9 rounded-full bg-navy-950 text-white font-black text-xs flex items-center justify-center shadow-xs">
              {user ? user.slice(0, 2).toUpperCase() : "AD"}
            </div>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-navy-950 text-white p-4 space-y-1.5 border-b border-navy-800 shadow-xl">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-heading font-bold uppercase",
                    isActive ? "bg-primary-600 text-white" : "text-slate-300 hover:bg-white/5"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 font-bold border-t border-navy-800 pt-3 mt-2"
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
