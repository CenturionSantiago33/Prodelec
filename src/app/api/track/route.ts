import { NextResponse } from "next/server";
import { trackView } from "@/lib/catalogStore";

export const runtime = "nodejs";

/** Registra una visita a una ruta. Lo llama el tracker del cliente en cada navegación. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const path = typeof body?.path === "string" ? body.path : "/";
  trackView(path);
  return NextResponse.json({ ok: true });
}
