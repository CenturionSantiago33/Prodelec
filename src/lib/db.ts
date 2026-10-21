/**
 * Mini "base de datos" en JSON (sin dependencias).
 *
 * Persiste el estado del panel (productos, novedades y analítica) en `data/db.json`.
 * Está pensada para desarrollo local y demo. Para producción serverless (Render/Vercel)
 * el sistema de archivos no persiste entre deploys; el camino es migrar a una base
 * real (ver docs/PROPUESTA_BACKEND.md, opción Supabase).
 */
import fs from "node:fs";
import path from "node:path";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

export function readDB<T>(fallback: T): T {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeDB(data: unknown): void {
  try {
    fs.mkdirSync(DB_DIR, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("[db] No se pudo escribir data/db.json:", err);
  }
}
