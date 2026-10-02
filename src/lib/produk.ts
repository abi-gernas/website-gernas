import "server-only";
import type { Where } from "payload";
import { cache } from "react";
import { payloadPromise } from "./payload";
import { DEFAULT_LOCALE, type Locale } from "./i18n";
import { LIBRARY_PAGE_SIZE, buildLibraryWhere } from "./library";
import type {
  KategoriProduk as KategoriProdukDoc,
  Produk as PayloadProduk,
  TopikProduk as TopikProdukDoc,
  Media,
} from "@/payload-types";

/**
 * Akses koleksi Buku, Bahan Ajar & Modul lewat Local API. Koleksi ini punya `jenjang` dan
 * Kategori (jadi pakai `buildLibraryWhere`) plus filter tambahan Jenis materi
 * (`kategoriProduk`) dan Topik, lihat `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md` §2.2.
 */

/** Jenis materi (Modul/Buku/…), bukan Kategori katalog — lihat `KategoriKatalog`. */
export type KategoriProduk = PayloadProduk["kategoriProduk"];
export type IkonTopik = TopikProdukDoc["ikon"];
export type WarnaTopik = TopikProdukDoc["warna"];
export type FormatProduk = NonNullable<PayloadProduk["format"]>[number];

export type ProdukView = {
  id: string;
  judul: string;
  slug: string;
  kategoriProduk: KategoriProduk;
  /** Kategori → Topik: keduanya dikelola staf (koleksi Kategori Produk / Topik Produk). */
  kategori: { slug: string; nama: string } | null;
  topik: { slug: string; nama: string } | null;
  jenjang: string[];
  cover: { url: string; width?: number; height?: number } | null;
  ringkasan: string | null;
  penulis: string | null;
  fiturUnggulan: string[];
  format: FormatProduk[];
  status: "gratis" | "berbayar";
  harga: number | null;
  /**
   * Sengaja boolean, bukan URL-nya.
   *
   * Materi gratis di-gate formulir (FR-104): pengunjung mengisi nama + asal
   * instansi dulu baru tautannya diberikan. Berkas Drive-nya sendiri publik,
   * jadi gerbang ini memang tidak bisa dibuat rapat — tapi kalau URL-nya ikut
   * ter-render di HTML halaman, gerbangnya bukan sekadar longgar, melainkan
   * tidak ada sama sekali (cukup lihat source). Menyimpannya sbg boolean
   * membuat kebocoran itu mustahil secara struktural: URL-nya cuma dibaca di
   * server, di dalam `bukaMateri()` (src/lib/actions/unduh-materi.ts).
   */
  punyaTautan: boolean;
  /** Khusus alat peraga: pilihan kemasan + harga, dan tautan beli di marketplace. */
  varian: { nama: string; harga: number }[];
  tautanMarketplace: { platform: "shopee" | "tokopedia"; url: string }[];
};

/** Label jenis materi — nilainya harus sama dengan `options` di `Produk.ts`. */
export const KATEGORI_PRODUK_LABELS: Record<KategoriProduk, { id: string; en: string }> = {
  modul: { id: "Modul", en: "Modules" },
  buku: { id: "Buku", en: "Books" },
  "bahan-ajar": { id: "Bahan Ajar", en: "Teaching Materials" },
  lks: { id: "LKS/Worksheet", en: "Worksheets" },
  "alat-peraga": { id: "Alat Peraga", en: "Teaching Aids" },
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

/** Nilai relationship yang sudah terisi (depth ≥ 1); `null` bila masih id polos atau kosong. */
function terisi<T extends object>(value: unknown): T | null {
  return value && typeof value === "object" ? (value as T) : null;
}

function toView(doc: PayloadProduk): ProdukView {
  const kategori = terisi<KategoriProdukDoc>(doc.kategori);
  const topik = terisi<TopikProdukDoc>(doc.topik);
  return {
    id: String(doc.id),
    judul: doc.judul,
    slug: doc.slug,
    kategoriProduk: doc.kategoriProduk,
    kategori: kategori ? { slug: kategori.slug, nama: kategori.nama } : null,
    topik: topik ? { slug: topik.slug, nama: topik.nama } : null,
    jenjang: doc.jenjang ?? [],
    cover: toImage(doc.cover),
    ringkasan: doc.ringkasan ?? null,
    penulis: doc.penulis ?? null,
    fiturUnggulan: (doc.fiturUnggulan ?? []).map((f) => f.teks),
    format: doc.format ?? [],
    status: doc.status ?? "gratis",
    harga: doc.harga ?? null,
    punyaTautan: Boolean(doc.tautanDrive),
    varian: (doc.varian ?? []).map((v) => ({ nama: v.nama, harga: v.harga })),
    tautanMarketplace: (doc.tautanMarketplace ?? []).map((t) => ({ platform: t.platform, url: t.url })),
  };
}

export type ProdukListParams = {
  q?: string;
  jenjang?: string[];
  /** Slug Kategori katalog (mis. "matematika"). */
  kategori?: string[];
  /** Slug Jenis materi (mis. "alat-peraga"). */
  jenis?: string[];
  /** Slug Topik. */
  topik?: string[];
  /** "gratis" | "berbayar". Alat peraga dihitung berbayar: dijual lewat marketplace. */
  status?: string;
  page?: number;
  locale?: Locale;
};

export const getProdukList = cache(async function getProdukList({
  q,
  jenjang,
  kategori,
  jenis,
  topik,
  status,
  page = 1,
  locale = DEFAULT_LOCALE,
}: ProdukListParams): Promise<{
  docs: ProdukView[];
  totalDocs: number;
  totalPages: number;
  page: number;
}> {
  const payload = await payloadPromise;
  const where = buildLibraryWhere({
    q,
    jenjang,
    mapel: kategori,
    mapelPath: "kategori.slug",
    fields: ["judul", "ringkasan", "penulis", "topik.nama", "kategori.nama"],
    localized: ["judul", "ringkasan", "topik.nama", "kategori.nama"],
    locale,
  });
  if (jenis && jenis.length > 0) where.kategoriProduk = { in: jenis };
  if (topik && topik.length > 0) where["topik.slug"] = { in: topik };
  if (status === "gratis") {
    where.and = [
      ...((where.and as Where[] | undefined) ?? []),
      { status: { equals: "gratis" } },
      { kategoriProduk: { not_equals: "alat-peraga" } },
    ];
  } else if (status === "berbayar") {
    where.and = [
      ...((where.and as Where[] | undefined) ?? []),
      { or: [{ status: { equals: "berbayar" } }, { kategoriProduk: { equals: "alat-peraga" } }] },
    ];
  }

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

export type KategoriKatalog = { id: string; slug: string; nama: string };
export type TopikKatalog = {
  id: string;
  slug: string;
  nama: string;
  deskripsi: string | null;
  ikon: IkonTopik;
  warna: WarnaTopik;
  /** Slug Kategori induknya. */
  kategori: string | null;
};

/** Kategori katalog (Matematika, Membaca, …) berurutan menurut `urutan` yang diatur staf. */
export const getKategoriKatalog = cache(async function getKategoriKatalog(
  locale: Locale = DEFAULT_LOCALE,
): Promise<KategoriKatalog[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "kategori-produk",
    depth: 0,
    limit: 100,
    pagination: false,
    sort: "urutan",
    locale,
    fallbackLocale: DEFAULT_LOCALE,
  });
  return res.docs.map((d) => ({ id: String(d.id), slug: d.slug, nama: d.nama }));
});

/** Seluruh topik — penyaringan per kategori dilakukan pemanggil lewat `kategori` (slug induk). */
export const getTopikKatalog = cache(async function getTopikKatalog(
  locale: Locale = DEFAULT_LOCALE,
): Promise<TopikKatalog[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "topik-produk",
    depth: 1,
    limit: 500,
    pagination: false,
    sort: "urutan",
    locale,
    fallbackLocale: DEFAULT_LOCALE,
  });
  return res.docs.map((d) => ({
    id: String(d.id),
    slug: d.slug,
    nama: d.nama,
    deskripsi: d.deskripsi ?? null,
    ikon: d.ikon,
    warna: d.warna,
    kategori: terisi<KategoriProdukDoc>(d.kategori)?.slug ?? null,
  }));
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
    // Bagian ini berisi tombol unduh/beli, jadi alat peraga (cuma dipamerkan) dilewati.
    where: { kategoriProduk: { not_equals: "alat-peraga" } },
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

/** Satu Produk menurut id — dipakai blok Produk Sorotan. `null` bila sudah dihapus. */
export const getProdukById = cache(async function getProdukById(
  id: number | string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<ProdukView | null> {
  const payload = await payloadPromise;
  const doc = await payload.findByID({
    collection: "produk",
    id,
    depth: 1,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    disableErrors: true,
  });
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
