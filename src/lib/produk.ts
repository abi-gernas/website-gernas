import "server-only";
import { cache } from "react";
import { payloadPromise } from "./payload";
import { DEFAULT_LOCALE, type Locale } from "./i18n";
import { LIBRARY_PAGE_SIZE, buildLibraryWhere } from "./library";
import type { Produk as PayloadProduk, Media } from "@/payload-types";

/**
 * Akses koleksi Buku, Bahan Ajar & Modul lewat Local API — pola sama
 * `alatPeraga.ts`. Koleksi ini punya `jenjang`/`mapel` seperti Alat Peraga
 * (jadi tetap pakai `buildLibraryWhere`) plus satu filter tambahan
 * `kategoriProduk`, lihat `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md` §2.2.
 */

export type KategoriProduk = PayloadProduk["kategoriProduk"];
export type FormatProduk = PayloadProduk["format"][number];

export type ProdukView = {
  id: string;
  judul: string;
  slug: string;
  kategoriProduk: KategoriProduk;
  jenjang: string[];
  mapel: string[];
  cover: { url: string; width?: number; height?: number } | null;
  ringkasan: string | null;
  fiturUnggulan: string[];
  format: FormatProduk[];
  status: "gratis" | "berbayar";
  harga: number | null;
  tautanDrive: string | null;
};

/** Label kartu kategori — nilainya harus sama dengan `options` di `Produk.ts`. */
export const KATEGORI_PRODUK_LABELS: Record<KategoriProduk, { id: string; en: string }> = {
  modul: { id: "Modul", en: "Modules" },
  buku: { id: "Buku", en: "Books" },
  "bahan-ajar": { id: "Bahan Ajar", en: "Teaching Materials" },
  lks: { id: "LKS/Worksheet", en: "Worksheets" },
};

/** Label panjang, dipakai di bagian "Produk Terbaru" & halaman detail. */
export const FORMAT_LABELS: Record<FormatProduk, { id: string; en: string }> = {
  pdf: { id: "PDF & Panduan Guru", en: "PDF & Teacher Guide" },
  cetak: { id: "Versi Cetak", en: "Print Edition" },
};

/** Label pendek untuk kartu katalog — mockup menulisnya "PDF" / "PDF+Cetak". */
export const FORMAT_LABELS_PENDEK: Record<FormatProduk, { id: string; en: string }> = {
  pdf: { id: "PDF", en: "PDF" },
  cetak: { id: "Cetak", en: "Print" },
};

export function formatLabelPendek(format: FormatProduk[], locale: Locale = DEFAULT_LOCALE): string {
  return format.map((f) => FORMAT_LABELS_PENDEK[f]?.[locale] ?? f).join("+");
}

/** "Rp20.000". Angka tanpa desimal — harga produk selalu bulat di dasbor. */
export function formatHarga(harga: number, locale: Locale = DEFAULT_LOCALE): string {
  return `Rp${harga.toLocaleString(locale === "en" ? "en-US" : "id-ID")}`;
}

function toImage(value: unknown): { url: string; width?: number; height?: number } | null {
  if (!value || typeof value !== "object") return null;
  const m = value as Media;
  if (!m.url) return null;
  return { url: m.url, width: m.width ?? undefined, height: m.height ?? undefined };
}

function toView(doc: PayloadProduk): ProdukView {
  return {
    id: String(doc.id),
    judul: doc.judul,
    slug: doc.slug,
    kategoriProduk: doc.kategoriProduk,
    jenjang: doc.jenjang ?? [],
    mapel: doc.mapel ?? [],
    cover: toImage(doc.cover),
    ringkasan: doc.ringkasan ?? null,
    fiturUnggulan: (doc.fiturUnggulan ?? []).map((f) => f.teks),
    format: doc.format ?? [],
    status: doc.status,
    harga: doc.harga ?? null,
    tautanDrive: doc.tautanDrive ?? null,
  };
}

export type ProdukListParams = {
  q?: string;
  jenjang?: string[];
  mapel?: string[];
  kategori?: string[];
  page?: number;
  locale?: Locale;
};

export const getProdukList = cache(async function getProdukList({
  q,
  jenjang,
  mapel,
  kategori,
  page = 1,
  locale = DEFAULT_LOCALE,
}: ProdukListParams): Promise<{
  docs: ProdukView[];
  totalDocs: number;
  totalPages: number;
  page: number;
}> {
  const payload = await payloadPromise;
  const where = buildLibraryWhere({ q, jenjang, mapel });
  if (kategori && kategori.length > 0) where.kategoriProduk = { in: kategori };

  const res = await payload.find({
    collection: "produk",
    depth: 1,
    limit: LIBRARY_PAGE_SIZE,
    page,
    sort: "urutan",
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    where,
  });
  return {
    docs: res.docs.map(toView),
    totalDocs: res.totalDocs,
    totalPages: res.totalPages,
    page: res.page ?? 1,
  };
});

/**
 * Produk yang tampil di bagian "Produk Terbaru" (kartu besar di atas katalog).
 *
 * Dipilih dari `urutan` terkecil, bukan tanggal buat: staf sudah terbiasa
 * memakai field itu untuk menyematkan produk di posisi teratas, dan cara ini
 * tidak menuntut field `unggulan` baru + migrasi skema. Konsekuensinya
 * "terbaru" di sini berarti "yang disematkan staf", bukan otomatis dokumen
 * termuda — lihat `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md` §5.
 */
export const getProdukTerbaru = cache(async function getProdukTerbaru(
  locale: Locale = DEFAULT_LOCALE,
): Promise<ProdukView | null> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "produk",
    depth: 1,
    limit: 1,
    sort: "urutan",
    locale,
    fallbackLocale: DEFAULT_LOCALE,
  });
  const doc = res.docs[0];
  return doc ? toView(doc) : null;
});

export const getProdukBySlug = cache(async function getProdukBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<ProdukView | null> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "produk",
    depth: 1,
    limit: 1,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    where: { slug: { equals: slug } },
    pagination: false,
  });
  const doc = res.docs[0];
  return doc ? toView(doc) : null;
});

/** Slug seluruh Produk — untuk `generateStaticParams`. */
export async function getProdukSlugs(): Promise<string[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "produk",
    depth: 0,
    limit: 1000,
    pagination: false,
    select: { slug: true },
  });
  return res.docs.map((d) => d.slug);
}
