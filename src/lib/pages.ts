import "server-only";
import { cache } from "react";
import { payloadPromise } from "./payload";
import { DEFAULT_LOCALE, type Locale } from "./i18n";
import type { Page } from "@/payload-types";

/**
 * Akses koleksi Halaman untuk route publik `[...slug]` — sisi baca dari US-002
 * ("staf menyusun halaman memakai Blocks tanpa menulis kode").
 *
 * Berbeda dari `content.ts`, di sini dokumen Payload tidak dipetakan ke bentuk
 * lain: <RenderBlocks> membaca `layout` apa adanya, sehingga menambah blok baru
 * cukup menyentuh definisi blok + komponennya, tanpa lapisan konversi di tengah.
 */

/**
 * Kedalaman populate relasi. 2 diperlukan karena gambar berada satu tingkat di
 * dalam blok (mis. layout[].slides[].image), bukan di akar dokumen.
 */
const DEPTH = 2;

/**
 * Satu halaman berdasarkan slug. Mengembalikan null bila tidak ada.
 *
 * `draft` hanya boleh bernilai true bila draft mode Next menyala — lihat
 * `src/app/(frontend)/next/preview/route.ts`, yang memastikan pemanggilnya
 * staf yang sudah masuk. Saat aktif, filter `_status` dilepas agar halaman
 * yang belum pernah diterbitkan pun bisa dipratinjau, dan `draft: true`
 * membuat Payload mengembalikan versi tersimpan terakhir alih-alih versi
 * terbit.
 */
export const getPageBySlug = cache(async function getPageBySlug(
  slug: string,
  draft = false,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Page | null> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "pages",
    depth: DEPTH,
    limit: 1,
    draft,
    /**
     * Field yang ditandai `localized: true` (judul halaman, judul bagian tiap
     * blok, judul kartu) diambil sesuai bahasa; `fallbackLocale` membuat field
     * Inggris yang belum diisi staf jatuh ke versi Indonesia alih-alih kosong.
     */
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    where: {
      slug: { equals: slug },
      ...(draft ? {} : { _status: { equals: "published" } }),
    },
    pagination: false,
  });
  return res.docs[0] ?? null;
});

/**
 * Benar bila slug ini ada di CMS tapi belum diterbitkan.
 *
 * Dipakai route publik untuk membedakan dua hal yang dari luar tampak sama:
 * halaman yang memang belum ada (404 sungguhan) dan halaman yang sudah
 * disiapkan staf tapi masih draf — yang terakhir ditampilkan sebagai
 * "Segera Hadir", karena tautannya bisa saja sudah terpasang di menu.
 *
 * Local API Payload melewati `access.read`, jadi dokumen draf tetap terbaca
 * di sini meski pengunjungnya anonim; yang dikembalikan hanya statusnya,
 * bukan isinya.
 *
 * Panggil HANYA setelah `getPageBySlug` mengembalikan null — fungsi ini tidak
 * memeriksa `_status`, jadi di luar urutan itu ia juga bernilai true untuk
 * halaman yang sebenarnya sudah terbit.
 */
export const halamanBelumTerbit = cache(async function halamanBelumTerbit(
  slug: string,
): Promise<boolean> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "pages",
    depth: 0,
    limit: 1,
    where: { slug: { equals: slug } },
    pagination: false,
    select: { slug: true },
  });
  return res.docs.length > 0;
});

/** Slug seluruh halaman terbit — untuk generateStaticParams & sitemap. */
export async function getPageSlugs(locale: Locale = DEFAULT_LOCALE): Promise<string[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "pages",
    depth: 0,
    limit: 1000,
    where: { _status: { equals: "published" } },
    pagination: false,
    select: { slug: true },
  });
  return res.docs.map((d) => d.slug);
}

/** Slug + waktu ubah terakhir — sitemap butuh keduanya. */
export async function getPageSitemapEntries(): Promise<
  { slug: string; updatedAt: string }[]
> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "pages",
    depth: 0,
    limit: 1000,
    where: { _status: { equals: "published" } },
    pagination: false,
    select: { slug: true, updatedAt: true },
  });
  return res.docs.map((d) => ({ slug: d.slug, updatedAt: d.updatedAt }));
}
