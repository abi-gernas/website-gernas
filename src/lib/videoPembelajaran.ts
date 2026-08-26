import "server-only";
import { cache } from "react";
import { payloadPromise } from "./payload";
import { DEFAULT_LOCALE, type Locale } from "./i18n";
import { LIBRARY_PAGE_SIZE, buildLibraryWhere } from "./library";
import type { VideoPembelajaran as PayloadVideoPembelajaran, Media } from "@/payload-types";

/** Akses koleksi Video Pembelajaran lewat Local API — lihat pola yang sama di `alatPeraga.ts`. */

export type VideoPembelajaranView = {
  id: string;
  slug: string;
  judul: string;
  deskripsi: string | null;
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

/**
 * Alamat sumber video aslinya (YouTube / berkas Media).
 *
 * Bukan lagi tujuan tombol "Tonton" — sejak keputusan QA 26 Agu 2026 tombol itu
 * mengarah ke halaman detail internal `video-pembelajaran/[slug]` yang memutar
 * videonya di situs ini. Fungsi ini dipakai halaman detail sebagai tautan
 * cadangan ("Buka di YouTube") kalau pengunjung mau ke sumbernya.
 */
export function videoPembelajaranSumberHref(item: VideoPembelajaranView): string | null {
  if (item.sumberTipe === "youtube") return item.tautanYoutube;
  return item.berkasVideo?.url ?? null;
}

/**
 * Id video YouTube dari berbagai bentuk tautan yang mungkin diketik staf
 * (`watch?v=`, `youtu.be/`, `/embed/`, `/shorts/`). `null` kalau tidak dikenali
 * — halaman detail lalu jatuh ke tautan biasa, bukan iframe kosong.
 */
export function youtubeVideoId(url: string | null): string | null {
  if (!url) return null;
  const cocok =
    url.match(/[?&]v=([A-Za-z0-9_-]{6,})/) ??
    url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/) ??
    url.match(/\/embed\/([A-Za-z0-9_-]{6,})/) ??
    url.match(/\/shorts\/([A-Za-z0-9_-]{6,})/);
  return cocok ? cocok[1] : null;
}

function toView(doc: PayloadVideoPembelajaran): VideoPembelajaranView {
  return {
    id: String(doc.id),
    slug: doc.slug,
    judul: doc.judul,
    deskripsi: doc.deskripsi ?? null,
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

export const getVideoPembelajaranBySlug = cache(async function getVideoPembelajaranBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<VideoPembelajaranView | null> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "video-pembelajaran",
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

/** Slug seluruh video — untuk `generateStaticParams`. */
export async function getVideoPembelajaranSlugs(): Promise<string[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "video-pembelajaran",
    depth: 0,
    limit: 1000,
    pagination: false,
    select: { slug: true },
  });
  return res.docs.map((d) => d.slug);
}

/**
 * Video sematan (urutan terkecil) untuk korsel "Video Pilihan" di hero.
 * Pola yang sama dengan `getAlatPeragaSematan()`/`getProdukTerbaru()`: mockup
 * memperlihatkan deretan video pilihan di atas daftar, dan staf menentukan
 * isinya lewat kolom Urutan — belum ada field "unggulan" tersendiri.
 */
export const getVideoPembelajaranPilihan = cache(async function getVideoPembelajaranPilihan(
  locale: Locale = DEFAULT_LOCALE,
  limit = 6,
): Promise<VideoPembelajaranView[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "video-pembelajaran",
    depth: 1,
    limit,
    sort: "urutan",
    locale,
    fallbackLocale: DEFAULT_LOCALE,
  });
  return res.docs.map(toView);
});
