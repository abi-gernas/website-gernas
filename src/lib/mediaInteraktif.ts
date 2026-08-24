import "server-only";
import { cache } from "react";
import { payloadPromise } from "./payload";
import { DEFAULT_LOCALE, type Locale } from "./i18n";
import { LIBRARY_PAGE_SIZE } from "./library";
import type { Where } from "payload";
import type { MediaInteraktif as PayloadMediaInteraktif, Media } from "@/payload-types";

/**
 * Akses koleksi Media Digital Interaktif lewat Local API — pola sama
 * `alatPeraga.ts`. Koleksi ini tidak punya `jenjang`/`mapel` (cuma `tags`
 * bebas) jadi tidak pakai `buildLibraryWhere` dari `library.ts` — lihat
 * `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md` §5.
 */

export type MediaInteraktifView = {
  id: string;
  judul: string;
  deskripsi: string | null;
  thumbnail: { url: string; width?: number; height?: number } | null;
  tags: string[];
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
    judul: doc.judul,
    deskripsi: doc.deskripsi ?? null,
    thumbnail: toImage(doc.thumbnail),
    tags: (doc.tags ?? []).map((t) => t.label),
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
  if (q) where.judul = { contains: q };
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
