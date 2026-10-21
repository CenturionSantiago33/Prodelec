import { NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/apiAuth";
import { getCatalogData, saveCatalog } from "@/lib/catalogStore";

export const runtime = "nodejs";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const db = getCatalogData();
  const idx = db.novelties.findIndex((n) => n.id === id);
  if (idx === -1) {
    return NextResponse.json({ ok: false, error: "Novedad no encontrada" }, { status: 404 });
  }

  db.novelties[idx] = { ...db.novelties[idx], ...body, id };
  saveCatalog(db);
  return NextResponse.json({ ok: true, novelty: db.novelties[idx] });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;

  const db = getCatalogData();
  db.novelties = db.novelties.filter((n) => n.id !== id);
  saveCatalog(db);
  return NextResponse.json({ ok: true });
}
