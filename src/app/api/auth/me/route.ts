import { NextResponse } from "next/server";
import { ADMIN_USER } from "@/lib/auth";
import { isAdmin } from "@/lib/apiAuth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true, user: ADMIN_USER });
}
