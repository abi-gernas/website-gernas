import "server-only";
import { cache } from "react";
import { payloadPromise } from "./payload";
import { mediaURL } from "./datasitus";
import type { Locale } from "./i18n";
import {
  alatPeragaListPath,
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

const koleksi = {
  produk: { slug: "produk", gambar: "cover" },
  alatPeraga: { slug: "alat-peraga", gambar: "cover" },
  videoPembelajaran: { slug: "video-pembelajaran", gambar: "thumbnail" },
  mediaInteraktif: { slug: "media-interaktif", gambar: "thumbnail" },
} as const;

const alamat: Record<KatalogGuru, (locale: Locale) => string> = {
  produk: produkListPath,
  alatPeraga: alatPeragaListPath,
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
      const { totalDocs } = await payload.count({ collection: koleksi[k].slug });
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
  const { slug, gambar } = koleksi[katalog];
  const res = await payload.find({
    collection: slug,
    depth: 1,
    limit: 1,
    sort: "urutan",
    pagination: false,
  });
  const doc = res.docs[0] as unknown as Record<string, unknown> | undefined;
  return mediaURL(doc?.[gambar]) ?? null;
});
