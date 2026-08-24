import type { Where } from "payload";

/**
 * Kontrak query parameter bersama untuk 4 halaman Library (Alat Peraga, Media
 * Interaktif, Video Pembelajaran, Buku/Bahan Ajar/Modul) — lihat
 * `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md` §2.2.
 */

export const LIBRARY_PAGE_SIZE = 12;

/** Label tampil untuk value `jenjang`/`mapel` — sama di 4 koleksi Library. */
export const JENJANG_LABELS: Record<string, string> = {
  paud: "PAUD",
  tk: "TK",
  sd: "SD",
  smp: "SMP",
  sma: "SMA",
};

export const MAPEL_LABELS: Record<string, string> = {
  matematika: "Matematika",
  membaca: "Membaca",
};

export type LibrarySearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** `?jenjang=sd,smp` -> `["sd", "smp"]`. Dipakai juga untuk `mapel`. */
export function parseListParam(value: string | string[] | undefined): string[] {
  const raw = firstValue(value);
  if (!raw) return [];
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function parsePageParam(value: string | string[] | undefined): number {
  const n = Number(firstValue(value));
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

export function parseQueryParam(value: string | string[] | undefined): string {
  return firstValue(value)?.trim() ?? "";
}

/** Klausa `where` yang sama untuk field `judul`/`jenjang`/`mapel` di 4 koleksi. */
export function buildLibraryWhere({
  q,
  jenjang,
  mapel,
}: {
  q?: string;
  jenjang?: string[];
  mapel?: string[];
}): Where {
  const where: Where = {};
  if (q) where.judul = { contains: q };
  if (jenjang && jenjang.length > 0) where.jenjang = { in: jenjang };
  if (mapel && mapel.length > 0) where.mapel = { in: mapel };
  return where;
}

/**
 * Bangun query string dari `searchParams`, timpa satu key (mis. `page`), dan
 * buang key yang jadi kosong — dipakai `LibraryPagination` supaya filter lain
 * (`q`, `jenjang`, dst.) tetap terjaga saat pindah halaman.
 */
export function withParam(
  searchParams: LibrarySearchParams,
  overrides: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();
  const merged = { ...searchParams, ...overrides };
  for (const [key, value] of Object.entries(merged)) {
    const v = firstValue(value);
    if (v) params.set(key, v);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
