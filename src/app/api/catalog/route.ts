import { NextResponse } from "next/server";
import { getCatalogData } from "@/lib/catalogStore";

export const runtime = "nodejs";

/** Catálogo público: categorías + productos + novedades (con los cambios del admin). */
export async function GET() {
  const { categories, products, novelties } = getCatalogData();
  return NextResponse.json({ categories, products, novelties });
}
