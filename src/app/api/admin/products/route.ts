import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isAdmin, unauthorized } from "@/lib/apiAuth";
import { getCatalogData, saveCatalog } from "@/lib/catalogStore";
import type { Product } from "@/types";

export const runtime = "nodejs";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  const { products, categories } = getCatalogData();
  return NextResponse.json({ products, categories });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  const body = await req.json().catch(() => ({}));
  const db = getCatalogData();

  const name = String(body?.name ?? "Producto nuevo");
  const product: Product = {
    id: body?.id || randomUUID(),
    name,
    slug: body?.slug || slugify(name) || "producto",
    code: body?.code ?? "",
    categoryId: body?.categoryId || db.categories[0]?.id || "",
    description: body?.description ?? "",
    features: Array.isArray(body?.features) ? body.features : [],
    specs: Array.isArray(body?.specs) ? body.specs : [],
    images: Array.isArray(body?.images) ? body.images : [],
    isNew: !!body?.isNew,
    inStock: body?.inStock !== false,
    homologado: body?.homologado !== undefined ? !!body.homologado : undefined,
    diameter: body?.diameter ?? undefined,
    sizeInfo: body?.sizeInfo ?? undefined,
    tags: Array.isArray(body?.tags) ? body.tags : undefined,
  };

  db.products = [product, ...db.products];
  saveCatalog(db);
  return NextResponse.json({ ok: true, product });
}
