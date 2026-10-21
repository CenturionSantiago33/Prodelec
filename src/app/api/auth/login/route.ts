import { NextResponse } from "next/server";
import { scryptSync, timingSafeEqual } from "node:crypto";
import { createToken, ADMIN_USER } from "@/lib/auth";

export const runtime = "nodejs";

const SALT = "prodelec-admin-salt-v1";

function verifyPassword(input: string): boolean {
  try {
    const password = process.env.ADMIN_PASSWORD;
    if (!password) return false; // sin ADMIN_PASSWORD, el login queda deshabilitado
    const expected = scryptSync(password, SALT, 64);
    const hash = scryptSync(input, SALT, 64);
    return timingSafeEqual(expected, hash);
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const username = String(body?.username ?? "");
  const password = String(body?.password ?? "");

  if (username !== ADMIN_USER || !verifyPassword(password)) {
    return NextResponse.json(
      { ok: false, error: "Usuario o contraseña incorrectos" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true, user: ADMIN_USER });
  res.cookies.set("admin_session", await createToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
  return res;
}
