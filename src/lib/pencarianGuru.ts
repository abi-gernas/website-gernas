import "server-only";
import { cache } from "react";
import { DEFAULT_LOCALE, type Locale } from "./i18n";
import { getMediaInteraktifList, type MediaInteraktifView } from "./mediaInteraktif";
import { getPageBySlug } from "./pages";
import { getProdukList, type ProdukView } from "./produk";
import { POJOK_GURU_SLUG } from "./routes";
import { getVideoPembelajaranList, type VideoPembelajaranView } from "./videoPembelajaran";

/**
 * Pencarian lintas 3 katalog Library untuk `/pojok-guru/cari` — sesi 5B di
 * `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md` §4.5.
 *
 * Sengaja memanggil fungsi daftar milik tiap katalog apa adanya (halaman 1),
 * bukan menulis query sendiri: kolom yang dicari, alias kata kunci ("sd",
 * "numerasi"), dan urutannya jadi persis sama dengan katalognya. Akibatnya
 * tombol "Lihat semua N hasil" ke `katalog?q=` selalu menampilkan jumlah yang
 * sama dengan yang dijanjikan di sini.
 */

export type HasilKatalog<T> = { docs: T[]; totalDocs: number };

export type HasilPencarianGuru = {
  produk: HasilKatalog<ProdukView>;
  videoPembelajaran: HasilKatalog<VideoPembelajaranView>;
  mediaInteraktif: HasilKatalog<MediaInteraktifView>;
  total: number;
};

function ringkas<T>(hasil: { docs: T[]; totalDocs: number }): HasilKatalog<T> {
  return { docs: hasil.docs, totalDocs: hasil.totalDocs };
}

export const cariPerangkatGuru = cache(async function cariPerangkatGuru(
  q: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<HasilPencarianGuru> {
  const [produk, videoPembelajaran, mediaInteraktif] = await Promise.all([
    getProdukList({ q, locale }),
    getVideoPembelajaranList({ q, locale }),
    getMediaInteraktifList({ q, locale }),
  ]);

  return {
    produk: ringkas(produk),
    videoPembelajaran: ringkas(videoPembelajaran),
    mediaInteraktif: ringkas(mediaInteraktif),
    total:
      produk.totalDocs + videoPembelajaran.totalDocs + mediaInteraktif.totalDocs,
  };
});

/**
 * Kata kunci "Pencarian Populer", dibaca dari blok Hero Pencarian pertama di
 * halaman Pojok Guru — satu sumber dengan hero-nya, jadi staf cukup mengubah
 * di satu tempat.
 */
export const getTagPopulerPojokGuru = cache(async function getTagPopulerPojokGuru(
  locale: Locale = DEFAULT_LOCALE,
): Promise<string[]> {
  const page = await getPageBySlug(POJOK_GURU_SLUG, false, locale);
  for (const blok of page?.layout ?? []) {
    if (blok.blockType === "pencarianCepat") {
      return (blok.tagPopuler ?? []).map((t) => t.label).filter(Boolean);
    }
  }
  return [];
});
