import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isAdmin, unauthorized } from "@/lib/apiAuth";
import { getCatalogData, saveCatalog } from "@/lib/catalogStore";
import type { Novelty } from "@/data/novelties";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  const { novelties } = getCatalogData();
  return NextResponse.json({ novelties });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  const body = await req.json().catch(() => ({}));
  const db = getCatalogData();

  const novelty: Novelty = {
    id: body?.id || randomUUID(),
    category: body?.category ?? "Novedad",
    date: body?.date ?? new Date().getFullYear().toString(),
    title: body?.title ?? "Nueva novedad",
    excerpt: body?.excerpt ?? "",
    image: body?.image ?? "/carousel-2.jpg",
  };

  db.novelties = [novelty, ...db.novelties];
  saveCatalog(db);
  return NextResponse.json({ ok: true, novelty });
}
