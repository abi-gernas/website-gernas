import "server-only";
import { payloadPromise } from "./payload";
import { DEFAULT_LOCALE, type Locale } from "./i18n";
import type { Media, ModulPelatihan, Penggerak, Mitra, Video, SiteSetting } from "@/payload-types";

/**
 * Akses koleksi "Data Situs" — daftar berulang yang dipakai blok halaman.
 *
 * Berbeda dari isi yang diketik langsung di dalam blok, data di sini bisa
 * muncul di beberapa halaman sekaligus. Semua fungsi mengurutkan menurut
 * `urutan` lebih dulu supaya susunan yang diatur staf konsisten di mana pun
 * dipakai; `payload.find` tanpa `sort` akan memakai urutan penambahan.
 */

/** Ambil URL dari relasi upload yang sudah ter-populate. */
export function mediaURL(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  return (value as Media).url ?? undefined;
}

/** Urutkan menurut `urutan`, lalu nama, agar hasilnya stabil antar-permintaan. */
const SORT = "urutan";

export async function getPenggerak(locale: Locale = DEFAULT_LOCALE): Promise<Penggerak[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "penggerak",
    depth: 1,
    limit: 200,
    sort: SORT,
    pagination: false,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
  });
  return res.docs;
}

export async function getMitra(
  hanyaBeranda = false,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Mitra[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "mitra",
    depth: 1,
    limit: 500,
    sort: SORT,
    pagination: false,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    ...(hanyaBeranda
      ? { where: { tampilDiBeranda: { equals: true } } }
      : {}),
  });
  return res.docs;
}

export async function getVideo(
  limit?: number | null,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Video[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "video",
    depth: 1,
    limit: limit ?? 200,
    sort: SORT,
    pagination: false,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
  });
  return res.docs;
}

export async function getModulPelatihan(
  program: "matematika" | "membaca",
  locale: Locale = DEFAULT_LOCALE,
): Promise<ModulPelatihan[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "modul-pelatihan",
    depth: 0,
    limit: 100,
    sort: SORT,
    pagination: false,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    where: { program: { equals: program } },
  });
  return res.docs;
}

/**
 * Judul kelompok mitra yang tampil di atas tiap grid pada halaman Mitra.
 * Nilai kuncinya harus sama dengan opsi `kelompok` di koleksi Mitra.
 */
export const kelompokMitraLabel: Record<Locale, Record<string, string>> = {
  id: {
    pemerintah: "Mitra Kolaborasi Pemerintah Pusat & Daerah",
    korporasi: "Mitra Kolaborasi Korporasi & NGO",
    pendidikan: "Mitra Kolaborasi Pendidikan & Perguruan Tinggi",
  },
  en: {
    pemerintah: "Central & Regional Government Partners",
    korporasi: "Corporate & NGO Partners",
    pendidikan: "Education & University Partners",
  },
};

/** Urutan kelompok saat ditampilkan berkelompok. */
export const urutanKelompokMitra = ["pemerintah", "korporasi", "pendidikan"];

export async function getSiteSettings(locale: Locale = DEFAULT_LOCALE): Promise<SiteSetting> {
  const payload = await payloadPromise;
  return payload.findGlobal({
    slug: "site-settings",
    depth: 0,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
  });
}
