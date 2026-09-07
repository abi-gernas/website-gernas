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

/**
 * Alias kata kunci -> nilai `jenjang`/`mapel`, supaya mengetik "SD" atau
 * "numerasi" di kotak pencarian ikut menyaring jenjang/mapel walau kata itu
 * tidak ada di judul/deskripsi mana pun.
 */
const JENJANG_ALIAS: Record<string, string> = {
  paud: "paud",
  tk: "tk",
  sd: "sd",
  smp: "smp",
  sma: "sma",
  smk: "sma",
};

const MAPEL_ALIAS: Record<string, string> = {
  matematika: "matematika",
  mtk: "matematika",
  numerasi: "matematika",
  tastaka: "matematika",
  membaca: "membaca",
  baca: "membaca",
  literasi: "membaca",
  tastaba: "membaca",
};

/** Maksimal kata yang dipakai dari satu kotak pencarian — sisanya diabaikan. */
const MAKS_KATA = 6;

/**
 * Pecah isi kotak pencarian jadi kata kunci: huruf kecil, tanpa duplikat,
 * tanpa tanda baca, dan kata 1 huruf dibuang (kecuali angka, mis. "3").
 */
export function pecahKataKunci(q: string | undefined): string[] {
  if (!q) return [];
  const kata = q
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((k) => k.length > 1 || /\d/.test(k));
  return [...new Set(kata)].slice(0, MAKS_KATA);
}

/**
 * Klausa untuk satu kata kunci: cocok kalau kata itu ada di **salah satu**
 * field teks yang diberikan (`or`). Pemanggil menggabungkan hasilnya dengan
 * `and` supaya "pecahan campuran" hanya memunculkan dokumen yang memuat kedua
 * kata, bukan salah satunya.
 *
 * `contains` di adapter Postgres jadi `ILIKE %kata%` — jadi pencarian tidak
 * peka huruf besar/kecil dan potongan kata ("pecah") tetap kena.
 */
export function klausaKataKunci(kata: string, fields: string[]): Where {
  return { or: fields.map((field) => ({ [field]: { contains: kata } })) };
}

/**
 * Klausa `where` bersama untuk 3 koleksi Library yang punya `jenjang`/`mapel`
 * (Alat Peraga, Video Pembelajaran, Buku/Bahan Ajar/Modul).
 *
 * `fields` menentukan kolom teks mana yang ikut dicari; bawaannya cuma
 * `judul`. Sejak 7 Sep 2026 tiap halaman mengirim daftarnya sendiri
 * (deskripsi/ringkasan/penulis ikut dicari) — sebelumnya pencarian cuma
 * mencocokkan seluruh kalimat ke `judul`, jadi mengetik "kpk pecahan" atau
 * kata yang cuma ada di deskripsi selalu nihil.
 */
export function buildLibraryWhere({
  q,
  jenjang,
  mapel,
  fields = ["judul"],
}: {
  q?: string;
  jenjang?: string[];
  mapel?: string[];
  fields?: string[];
}): Where {
  const where: Where = {};

  const kataKunci = pecahKataKunci(q);
  if (kataKunci.length > 0) {
    where.and = kataKunci.map((kata) => {
      const klausa = klausaKataKunci(kata, fields);
      const or = klausa.or as Where[];
      if (JENJANG_ALIAS[kata]) or.push({ jenjang: { in: [JENJANG_ALIAS[kata]] } });
      if (MAPEL_ALIAS[kata]) or.push({ mapel: { in: [MAPEL_ALIAS[kata]] } });
      return klausa;
    });
  }

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
