import { NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/apiAuth";
import { getCatalogData } from "@/lib/catalogStore";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) return unauthorized();

  const db = getCatalogData();
  const views = db.analytics.views;

  const today = new Date().toISOString().slice(0, 10);
  const total = views.length;
  const todayCount = views.filter((v) => v.date === today).length;

  // Serie de los últimos 14 días
  const days: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    days.push({ date: ds, count: views.filter((v) => v.date === ds).length });
  }

  // Páginas más visitadas
  const byPage: Record<string, number> = {};
  for (const v of views) {
    byPage[v.path] = (byPage[v.path] ?? 0) + 1;
  }
  const topPages = Object.entries(byPage)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  return NextResponse.json({
    total,
    today: todayCount,
    days,
    topPages,
    catalog: {
      products: db.products.length,
      categories: db.categories.length,
      novelties: db.novelties.length,
    },
  });
}
