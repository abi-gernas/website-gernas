import "server-only";
import { cache } from "react";
import { payloadPromise } from "./payload";
import { DEFAULT_LOCALE, type Locale } from "./i18n";
import { LIBRARY_PAGE_SIZE, klausaKataKunci, pecahKataKunci } from "./library";
import type { Where } from "payload";
import type { MediaInteraktif as PayloadMediaInteraktif, Media } from "@/payload-types";

/**
 * Akses koleksi Media Digital Interaktif lewat Local API — pola sama
 * `alatPeraga.ts`. Koleksi ini tidak punya `jenjang`/`mapel` (cuma `tags`
 * bebas) jadi tidak pakai `buildLibraryWhere` dari `library.ts` — lihat
 * `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md` §5. Yang dipakai bersama cuma
 * pemecah kata kuncinya, supaya perilaku kotak pencarian tetap sama dengan
 * 3 halaman Library lain.
 */

export type MediaInteraktifView = {
  id: string;
  slug: string;
  judul: string;
  deskripsi: string | null;
  thumbnail: { url: string; width?: number; height?: number } | null;
  tags: string[];
  kontenHtml: string | null;
  tautan: string;
};

function toImage(value: unknown): { url: string; width?: number; height?: number } | null {
  if (!value || typeof value !== "object") return null;
  const m = value as Media;
  if (!m.url) return null;
  return { url: m.url, width: m.width ?? undefined, height: m.height ?? undefined };
}

function toView(doc: PayloadMediaInteraktif): MediaInteraktifView {
  return {
    id: String(doc.id),
    slug: doc.slug,
    judul: doc.judul,
    deskripsi: doc.deskripsi ?? null,
    thumbnail: toImage(doc.thumbnail),
    tags: (doc.tags ?? []).map((t) => t.label),
    kontenHtml: doc.kontenHtml ?? null,
    tautan: doc.tautan,
  };
}

export type MediaInteraktifListParams = {
  q?: string;
  tag?: string;
  page?: number;
  locale?: Locale;
};

export const getMediaInteraktifList = cache(async function getMediaInteraktifList({
  q,
  tag,
  page = 1,
  locale = DEFAULT_LOCALE,
}: MediaInteraktifListParams): Promise<{
  docs: MediaInteraktifView[];
  totalDocs: number;
  totalPages: number;
  page: number;
}> {
  const payload = await payloadPromise;
  const where: Where = {};
  const kataKunci = pecahKataKunci(q);
  if (kataKunci.length > 0) {
    where.and = kataKunci.map((kata) =>
      klausaKataKunci(kata, ["judul", "deskripsi", "tags.label"]),
    );
  }
  if (tag) where["tags.label"] = { equals: tag };

  const res = await payload.find({
    collection: "media-interaktif",
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

export const getMediaInteraktifBySlug = cache(async function getMediaInteraktifBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<MediaInteraktifView | null> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "media-interaktif",
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

/** Beberapa Media Interaktif terurut — untuk panel "Media Lainnya" di halaman detail. */
export const getMediaInteraktifPilihan = cache(async function getMediaInteraktifPilihan(
  locale: Locale = DEFAULT_LOCALE,
  limit = 6,
): Promise<MediaInteraktifView[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "media-interaktif",
    depth: 1,
    limit,
    sort: "urutan",
    locale,
    fallbackLocale: DEFAULT_LOCALE,
  });
  return res.docs.map(toView);
});

/** Slug seluruh Media Interaktif — untuk `generateStaticParams`. */
export async function getMediaInteraktifSlugs(): Promise<string[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "media-interaktif",
    depth: 0,
    limit: 1000,
    pagination: false,
    select: { slug: true },
  });
  return res.docs.map((d) => d.slug);
}

/**
 * 3 tag terpakai terbanyak, untuk "Pencarian Populer" di hero. Ambil semua
 * dokumen (koleksi ini kecil, showcase-only) lalu hitung frekuensi label di
 * memori — tidak ada agregasi tag bawaan di Payload local API.
 */
export const getPopularMediaInteraktifTags = cache(async function getPopularMediaInteraktifTags(
  locale: Locale = DEFAULT_LOCALE,
): Promise<string[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "media-interaktif",
    depth: 0,
    limit: 200,
    pagination: false,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    select: { tags: true },
  });

  const counts = new Map<string, number>();
  for (const doc of res.docs) {
    for (const t of doc.tags ?? []) {
      counts.set(t.label, (counts.get(t.label) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label]) => label);
});
