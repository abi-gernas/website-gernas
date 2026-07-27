import "server-only";
import { payloadPromise } from "./payload";
import type { Media, ModulPelatihan, Penggerak, Mitra, Video } from "@/payload-types";

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

export async function getPenggerak(): Promise<Penggerak[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "penggerak",
    depth: 1,
    limit: 200,
    sort: SORT,
    pagination: false,
  });
  return res.docs;
}

export async function getMitra(hanyaBeranda = false): Promise<Mitra[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "mitra",
    depth: 1,
    limit: 500,
    sort: SORT,
    pagination: false,
    ...(hanyaBeranda
      ? { where: { tampilDiBeranda: { equals: true } } }
      : {}),
  });
  return res.docs;
}

export async function getVideo(limit?: number | null): Promise<Video[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "video",
    depth: 1,
    limit: limit ?? 200,
    sort: SORT,
    pagination: false,
  });
  return res.docs;
}

export async function getModulPelatihan(
  program: "matematika" | "membaca",
): Promise<ModulPelatihan[]> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "modul-pelatihan",
    depth: 0,
    limit: 100,
    sort: SORT,
    pagination: false,
    where: { program: { equals: program } },
  });
  return res.docs;
}

/**
 * Judul kelompok mitra yang tampil di atas tiap grid pada halaman Mitra.
 * Nilai kuncinya harus sama dengan opsi `kelompok` di koleksi Mitra.
 */
export const kelompokMitraLabel: Record<string, string> = {
  pemerintah: "Mitra Kolaborasi Pemerintah Pusat & Daerah",
  korporasi: "Mitra Kolaborasi Korporasi & NGO",
  pendidikan: "Mitra Kolaborasi Pendidikan & Perguruan Tinggi",
};

/** Urutan kelompok saat ditampilkan berkelompok. */
export const urutanKelompokMitra = ["pemerintah", "korporasi", "pendidikan"];
