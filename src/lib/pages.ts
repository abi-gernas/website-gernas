import "server-only";
import { payloadPromise } from "./payload";
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
export async function getPageBySlug(
  slug: string,
  draft = false,
): Promise<Page | null> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "pages",
    depth: DEPTH,
    limit: 1,
    draft,
    where: {
      slug: { equals: slug },
      ...(draft ? {} : { _status: { equals: "published" } }),
    },
    pagination: false,
  });
  return res.docs[0] ?? null;
}

/** Slug seluruh halaman terbit — untuk generateStaticParams & sitemap. */
export async function getPageSlugs(): Promise<string[]> {
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
