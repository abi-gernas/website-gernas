import "server-only";
import { cache } from "react";
import { payloadPromise } from "./payload";
import { DEFAULT_LOCALE, type Locale } from "./i18n";
import { LIBRARY_PAGE_SIZE, buildLibraryWhere } from "./library";
import type { VideoPembelajaran as PayloadVideoPembelajaran, Media } from "@/payload-types";

/** Akses koleksi Video Pembelajaran lewat Local API — lihat pola yang sama di `alatPeraga.ts`. */

export type VideoPembelajaranView = {
  id: string;
  judul: string;
  jenjang: string[];
  mapel: string[];
  thumbnail: { url: string; width?: number; height?: number } | null;
  sumberTipe: "youtube" | "upload";
  tautanYoutube: string | null;
  berkasVideo: { url: string; width?: number; height?: number } | null;
  durasi: string | null;
};

function toImage(value: unknown): { url: string; width?: number; height?: number } | null {
  if (!value || typeof value !== "object") return null;
  const m = value as Media;
  if (!m.url) return null;
  return { url: m.url, width: m.width ?? undefined, height: m.height ?? undefined };
}

/** Alamat yang dibuka tombol "Tonton" — YouTube apa adanya, atau berkas Media untuk sumber "upload" (belum ada player sendiri). */
export function videoPembelajaranTontonHref(item: VideoPembelajaranView): string | null {
  if (item.sumberTipe === "youtube") return item.tautanYoutube;
  return item.berkasVideo?.url ?? null;
}

function toView(doc: PayloadVideoPembelajaran): VideoPembelajaranView {
  return {
    id: String(doc.id),
    judul: doc.judul,
    jenjang: doc.jenjang ?? [],
    mapel: doc.mapel ?? [],
    thumbnail: toImage(doc.thumbnail),
    sumberTipe: doc.sumberTipe,
    tautanYoutube: doc.tautanYoutube ?? null,
    berkasVideo: toImage(doc.berkasVideo),
    durasi: doc.durasi ?? null,
  };
}

export type VideoPembelajaranListParams = {
  q?: string;
  jenjang?: string[];
  mapel?: string[];
  page?: number;
  locale?: Locale;
};

export const getVideoPembelajaranList = cache(async function getVideoPembelajaranList({
  q,
  jenjang,
  mapel,
  page = 1,
  locale = DEFAULT_LOCALE,
}: VideoPembelajaranListParams): Promise<{
  docs: VideoPembelajaranView[];
  totalDocs: number;
  totalPages: number;
  page: number;
}> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "video-pembelajaran",
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
