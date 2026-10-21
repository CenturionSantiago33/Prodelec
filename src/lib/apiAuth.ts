import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "./auth";

/** Devuelve true si la petición trae una sesión de admin válida. */
export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  return verifyToken(c.get("admin_session")?.value);
}

export function unauthorized() {
  return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
}
