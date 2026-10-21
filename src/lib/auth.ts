/**
 * Token de sesión del panel (firmado con HMAC-SHA256 vía Web Crypto).
 *
 * - Funciona tanto en Edge (middleware) como en Node (rutas API).
 * - La contraseña se verifica por separado en la ruta de login (scrypt, solo Node).
 *
 * En producción cambiá `ADMIN_SECRET` por un valor fuerte (variable de entorno).
 */

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error(
      "Falta configurar ADMIN_SECRET. Creá un archivo .env.local con las variables de entorno."
    );
  }
  return secret;
}

export const ADMIN_USER = process.env.ADMIN_USER || "admin";

const enc = new TextEncoder();

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createToken(): Promise<string> {
  const payload = Date.now().toString();
  return `${payload}.${await hmac(payload)}`;
}

export async function verifyToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = await hmac(payload);
  if (sig.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
