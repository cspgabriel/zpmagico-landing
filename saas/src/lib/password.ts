import bcrypt from "bcryptjs";

const COST = 12; // bcrypt cost factor (10 = rápido, 12 = seguro, 14 = overkill)

/**
 * Hash de senha com bcrypt cost 12.
 */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, COST);
}

/**
 * Compara senha plain com hash bcrypt.
 */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Gera API Key pro cliente.
 * Formato: `zap_<24 random chars>_<8 random chars>`. Total ~40 chars.
 * Retorna a chave em plain (mostrar pro cliente UMA VEZ) + o hash (salvar no banco).
 */
export function generateApiKey(): { plain: string; hash: string; prefix: string } {
  const randomBytes = (bytes: number) =>
    Array.from({ length: bytes }, () => Math.floor(Math.random() * 256))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  const plain = `zap_${randomBytes(15)}_${randomBytes(4)}`;
  const prefix = plain.slice(0, 12);
  // SHA-256 simples do node crypto (bcrypt é overkill pra API keys)
  const { createHash } = require("node:crypto");
  const hash = createHash("sha256").update(plain).digest("hex");

  return { plain, hash, prefix };
}

export function hashApiKey(plain: string): string {
  const { createHash } = require("node:crypto");
  return createHash("sha256").update(plain).digest("hex");
}