/**
 * Pemetaan dokumen Payload → alamat publiknya.
 *
 * Sengaja tanpa `server-only` dan tanpa impor apa pun: berkas ini dipakai dua
 * sisi yang berjalan di runtime berbeda — route front-end (Next) dan
 * payload.config (juga dimuat CLI `payload migrate` di luar Next). Menaruh
 * aturan alamat di satu tempat mencegah tombol "Pratinjau" di dasbor menunjuk
 * ke URL yang berbeda dari yang benar-benar dilayani.
 */

import { localizedPath, type Locale } from "./i18n";

/**
 * Slug dokumen Halaman yang melayani beranda.
 *
 * Beranda tidak bisa ikut route catch-all `[...slug]` (tidak ada segmen yang
 * bisa dicocokkan), jadi `src/app/(frontend)/page.tsx` mengambil dokumen ini
 * secara khusus. Mengubah nilainya berarti mengubah slug dokumennya juga.
 */
export const HOME_SLUG = "beranda";

/** Alamat publik satu dokumen Halaman. */
export function pagePath(slug: string, locale?: Locale): string {
  const path = slug === HOME_SLUG ? "/" : `/${slug}`;
  return locale ? localizedPath(path, locale) : path;
}

/** Alamat publik satu dokumen Artikel. */
export function articlePath(slug: string, locale?: Locale): string {
  const path = `/berita/${slug}`;
  return locale ? localizedPath(path, locale) : path;
}

/** Alamat publik daftar/detail Alat Peraga — lihat `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md` §2.1. */
export function alatPeragaListPath(locale?: Locale): string {
  return locale ? localizedPath("/alat-peraga", locale) : "/alat-peraga";
}

export function alatPeragaPath(slug: string, locale?: Locale): string {
  const path = `/alat-peraga/${slug}`;
  return locale ? localizedPath(path, locale) : path;
}

/** Alamat publik daftar Media Digital Interaktif — tidak ada halaman detail, lihat `MediaInteraktif.ts`. */
export function mediaInteraktifListPath(locale?: Locale): string {
  return locale ? localizedPath("/media-interaktif", locale) : "/media-interaktif";
}

/** Alamat publik daftar/detail Video Pembelajaran — videonya diputar di halaman detail kita sendiri, bukan dilempar ke YouTube. */
export function videoPembelajaranListPath(locale?: Locale): string {
  return locale ? localizedPath("/video-pembelajaran", locale) : "/video-pembelajaran";
}

export function videoPembelajaranPath(slug: string, locale?: Locale): string {
  const path = `/video-pembelajaran/${slug}`;
  return locale ? localizedPath(path, locale) : path;
}

/** Alamat publik daftar/detail Buku, Bahan Ajar & Modul — lihat `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md` §2.1. */
export function produkListPath(locale?: Locale): string {
  return locale ? localizedPath("/buku-bahan-ajar-modul", locale) : "/buku-bahan-ajar-modul";
}

export function produkPath(slug: string, locale?: Locale): string {
  const path = `/buku-bahan-ajar-modul/${slug}`;
  return locale ? localizedPath(path, locale) : path;
}

/**
 * Benar bila `path` menunjuk ke alamat di situs ini sendiri.
 *
 * Dipakai route `/next/preview` dan `/next/exit-preview`, yang keduanya
 * meneruskan pengunjung ke alamat dari query string. Tanpa penjagaan ini isinya
 * bisa diisi `//situs-lain.com` atau `/\situs-lain.com` — keduanya diperlakukan
 * browser sebagai alamat absolut, sehingga route itu menjadi open redirect yang
 * tampak berasal dari domain kita.
 */
export function jalurInternal(path: unknown): path is string {
  return (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.startsWith("/\\")
  );
}

/** Koleksi yang punya halaman publik, karena itu bisa dipratinjau. */
export type PreviewableCollection = "pages" | "articles";

/** Alamat publik sebuah dokumen, dipilih berdasarkan koleksinya. */
export function publicPath(
  collection: PreviewableCollection,
  slug: string,
  locale?: Locale,
): string {
  return collection === "articles" ? articlePath(slug, locale) : pagePath(slug, locale);
}
