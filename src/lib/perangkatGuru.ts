import "server-only";
import { cache } from "react";
import { payloadPromise } from "./payload";
import { mediaURL } from "./datasitus";
import type { Where } from "payload";
import type { Locale } from "./i18n";
import {
  mediaInteraktifListPath,
  produkListPath,
  videoPembelajaranListPath,
} from "./routes";

/**
 * Data blok Perangkat Guru (`perangkatGuru`) — sesi 5D di
 * `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md` §4.5.
 *
 * Kunci katalog di sini WAJIB sama dengan `options` field `katalog` & `sumber`
 * blok itu (`src/payload/blocks/koleksi.ts`) dan dengan `labelKatalogGuru` di
 * `Breadcrumb.tsx`.
 */
export type KatalogGuru = "produk" | "alatPeraga" | "videoPembelajaran" | "mediaInteraktif";

export const KATALOG_GURU: KatalogGuru[] = ["produk", "alatPeraga", "videoPembelajaran", "mediaInteraktif"];

/**
 * Alat peraga tidak punya koleksi & halaman sendiri sejak 22 Sep 2026: isinya
 * Produk berjenis "Alat Peraga", dan kartunya membuka katalog Buku yang sudah
 * tersaring. Kartu Buku sebaliknya tidak menghitung alat peraga, supaya angka
 * "semua materi" tidak dobel.
 */
const ALAT_PERAGA: Where = { kategoriProduk: { equals: "alat-peraga" } };

type SumberKatalog = {
  slug: "produk" | "video-pembelajaran" | "media-interaktif";
  gambar: string;
  where?: Where;
};

const koleksi: Record<KatalogGuru, SumberKatalog> = {
  produk: { slug: "produk", gambar: "cover", where: { kategoriProduk: { not_equals: "alat-peraga" } } },
  alatPeraga: { slug: "produk", gambar: "cover", where: ALAT_PERAGA },
  videoPembelajaran: { slug: "video-pembelajaran", gambar: "thumbnail" },
  mediaInteraktif: { slug: "media-interaktif", gambar: "thumbnail" },
};

const alamat: Record<KatalogGuru, (locale: Locale) => string> = {
  produk: produkListPath,
  alatPeraga: (locale) => `${produkListPath(locale)}?kategori=alat-peraga`,
  videoPembelajaran: videoPembelajaranListPath,
  mediaInteraktif: mediaInteraktifListPath,
};

export const katalogGuruPath = (katalog: KatalogGuru, locale: Locale): string =>
  alamat[katalog](locale);

/**
 * Jumlah dokumen tiap katalog, dihitung saat halaman dirender — angka statistik
 * panel tidak diketik staf supaya tidak pernah basi. Dokumen uji `[QA] ` ikut
 * terhitung (belum ada penandanya di skema, lihat §6).
 */
export const getJumlahKatalogGuru = cache(async function getJumlahKatalogGuru(): Promise<
  Record<KatalogGuru, number>
> {
  const payload = await payloadPromise;
  const hasil = await Promise.all(
    KATALOG_GURU.map(async (k) => {
      const { totalDocs } = await payload.count({ collection: koleksi[k].slug, where: koleksi[k].where });
      return [k, totalDocs] as const;
    }),
  );
  return Object.fromEntries(hasil) as Record<KatalogGuru, number>;
});

/**
 * Sampul/thumbnail materi pertama (Urutan terkecil) sebuah katalog — gambar
 * bawaan kartu bila staf belum mengunggah gambar khusus.
 */
export const getGambarKatalogGuru = cache(async function getGambarKatalogGuru(
  katalog: KatalogGuru,
): Promise<string | null> {
  const payload = await payloadPromise;
  const { slug, gambar, where } = koleksi[katalog];
  const res = await payload.find({
    collection: slug,
    where,
    depth: 1,
    limit: 1,
    sort: "urutan",
    pagination: false,
  });
  const doc = res.docs[0] as unknown as Record<string, unknown> | undefined;
  return mediaURL(doc?.[gambar]) ?? null;
});
