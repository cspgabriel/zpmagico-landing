import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Helper `cn` (className) — combina clsx + tailwind-merge pra resolver
 * conflitos entre classes Tailwind de forma inteligente.
 *
 * @example
 *   cn("p-4 text-red-500", condition && "bg-blue-500", "p-6") // → "text-red-500 bg-blue-500 p-6"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata valor em centavos pra BRL.
 * @example formatBRL(9990) // → "R$ 99,90"
 */
export function formatBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

/**
 * Formata data relativa tipo "há 5 minutos", "ontem", "há 3 dias".
 */
export function formatRelative(date: Date | string | number): string {
  const d = typeof date === "object" ? date : new Date(date);
  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "agora";
  if (diffMin < 60) return `há ${diffMin} min`;
  if (diffHour < 24) return `há ${diffHour}h`;
  if (diffDay === 1) return "ontem";
  if (diffDay < 7) return `há ${diffDay} dias`;
  if (diffDay < 30) return `há ${Math.floor(diffDay / 7)} sem`;
  return d.toLocaleDateString("pt-BR");
}

/**
 * Iniciais do nome (avatar fallback).
 * @example initials("Gabriel Silva") // → "GS"
 */
export function initials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}

/**
 * Saudação por hora.
 */
export function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "Boa madrugada";
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

/**
 * Status visual do WhatsApp Instance → label + cor.
 */
export function instanceStatusInfo(status: string): {
  label: string;
  color: "green" | "amber" | "red" | "gray";
  pulse: boolean;
} {
  switch (status) {
    case "CONNECTED":
    case "connected":
      return { label: "Online", color: "green", pulse: true };
    case "CONNECTING":
    case "connecting":
      return { label: "Conectando", color: "amber", pulse: true };
    case "ERROR":
    case "error":
      return { label: "Erro", color: "red", pulse: false };
    default:
      return { label: "Desconectado", color: "gray", pulse: false };
  }
}