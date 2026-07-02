import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ExpiryState = "none" | "expired" | "urgent" | "upcoming" | "ok";

export interface ExpiryInfo {
  state: ExpiryState;
  label: string;
  daysLeft: number | null;
}

/** Computes the "還有 N 天 / 今天截止 / 已截止" badge state for a reward. */
export function getExpiryInfo(expiryDate: string | null): ExpiryInfo {
  if (!expiryDate) return { state: "none", label: "", daysLeft: null };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(expiryDate);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  const daysLeft = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return { state: "expired", label: "已截止", daysLeft };
  if (daysLeft === 0) return { state: "urgent", label: "今天截止", daysLeft };
  if (daysLeft <= 7) return { state: "urgent", label: `即將截止・還有 ${daysLeft} 天`, daysLeft };
  if (daysLeft <= 30) return { state: "upcoming", label: `還有 ${daysLeft} 天`, daysLeft };
  return { state: "ok", label: `還有 ${daysLeft} 天`, daysLeft };
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export function storeInitial(name: string): string {
  return name.trim().charAt(0) || "?";
}

export function debounce<T extends (...args: any[]) => void>(fn: T, delayMs: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}
