import "server-only";
import { cache } from "react";
import { payloadPromise } from "./payload";
import { DEFAULT_LOCALE, type Locale } from "./i18n";
import { LIBRARY_PAGE_SIZE, buildLibraryWhere } from "./library";
import type { AlatPeraga as PayloadAlatPeraga, Media } from "@/payload-types";

/** Akses koleksi Alat Peraga lewat Local API — lihat pola yang sama di `content.ts`. */

export type AlatPeragaView = {
  id: string;
  judul: string;
  slug: string;
  subjudul: string | null;
  jenjang: string[];
  mapel: string[];
  cover: { url: string; width?: number; height?: number } | null;
  galeriFoto: { url: string; width?: number; height?: number }[];
  deskripsi: string | null;
  isiPaket: string[];
};

function toImage(value: unknown): { url: string; width?: number; height?: number } | null {
  if (!value || typeof value !== "object") return null;
  const m = value as Media;
  if (!m.url) return null;
  return { url: m.url, width: m.width ?? undefined, height: m.height ?? undefined };
}

function toView(doc: PayloadAlatPeraga): AlatPeragaView {
  return {
    id: String(doc.id),
    judul: doc.judul,
    slug: doc.slug,
    subjudul: doc.subjudul ?? null,
    jenjang: doc.jenjang ?? [],
    mapel: doc.mapel ?? [],
    cover: toImage(doc.cover),
    galeriFoto: (doc.galeriFoto ?? []).map((g) => toImage(g.gambar)).filter((v) => v !== null),
    deskripsi: doc.deskripsi ?? null,
    isiPaket: (doc.isiPaket ?? []).map((i) => i.teks),
  };
}

export type AlatPeragaListParams = {
  q?: string;
  jenjang?: string[];
  mapel?: string[];
  page?: number;
  locale?: Locale;
};

export const getAlatPeragaList = cache(async function getAlatPeragaList({
  q,
  jenjang,
  mapel,
  page = 1,
  locale = DEFAULT_LOCALE,
}: AlatPeragaListParams): Promise<{ docs: AlatPeragaView[]; totalDocs: number; totalPages: number; page: number }> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "alat-peraga",
    depth: 1,
    limit: LIBRARY_PAGE_SIZE,
    page,
    sort: "urutan",
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    where: buildLibraryWhere({ q, jenjang, mapel }),
  });
  return {
    docs: res.docs.map(toView),
    totalDocs: res.totalDocs,
    totalPages: res.totalPages,
    page: res.page ?? 1,
  };
});

export const getAlatPeragaBySlug = cache(async function getAlatPeragaBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<AlatPeragaView | null> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "alat-peraga",
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

/** Slug seluruh Alat Peraga — untuk `generateStaticParams`. */
export async function getAlatPeragaSlugs(): Promise<string[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "alat-peraga",
    depth: 0,
    limit: 1000,
    pagination: false,
    select: { slug: true },
  });
  return res.docs.map((d) => d.slug);
}
