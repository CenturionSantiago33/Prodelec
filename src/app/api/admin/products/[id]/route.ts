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
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ ok: false, error: "Producto no encontrado" }, { status: 404 });
  }

  db.products[idx] = { ...db.products[idx], ...body, id };
  saveCatalog(db);
  return NextResponse.json({ ok: true, product: db.products[idx] });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;

  const db = getCatalogData();
  db.products = db.products.filter((p) => p.id !== id);
  saveCatalog(db);
  return NextResponse.json({ ok: true });
}
