"use server";

import { payloadPromise } from "@/lib/payload";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";

/**
 * Kirim ulasan/rating untuk satu materi — cuma dipanggil sesudah pengunjung
 * berhasil membuka materinya (lihat `FormUlasan`, dirender di dalam state
 * `hasil` milik `UnduhMateriGate`). Penegakan itu di sisi UI saja, bukan di
 * sini — action ini sendiri tidak memeriksa riwayat unduhan.
 *
 * Ulasan masuk dgn `status: "menunggu"` — baru tampil di halaman publik
 * sesudah staf menyetujuinya lewat dasbor (lihat `Ulasan.ts`).
 */

export type HasilKirimUlasan =
  | { ok: true }
  | { ok: false; pesan: "data-kurang" | "tidak-ditemukan" | "gagal" };

export type DataUlasan = {
  nama: string;
  rating: number;
  komentar?: string;
};

const MAKS_NAMA = 200;
const MAKS_KOMENTAR = 2000;

function bersihkan(nilai: unknown, maks: number): string {
  return typeof nilai === "string" ? nilai.trim().slice(0, maks) : "";
}

export async function kirimUlasan(
  slug: string,
  data: DataUlasan,
  locale: Locale = DEFAULT_LOCALE,
): Promise<HasilKirimUlasan> {
  const nama = bersihkan(data.nama, MAKS_NAMA);
  const komentar = bersihkan(data.komentar, MAKS_KOMENTAR);
  const rating = Math.round(Number(data.rating));

  if (!slug || !nama || !Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { ok: false, pesan: "data-kurang" };
  }

  try {
    const payload = await payloadPromise;

    const res = await payload.find({
      collection: "produk",
      where: { slug: { equals: slug } },
      limit: 1,
      pagination: false,
      depth: 0,
    });

    const produk = res.docs[0];
    if (!produk) return { ok: false, pesan: "tidak-ditemukan" };

    await payload.create({
      collection: "ulasan",
      data: {
        produkRef: produk.id,
        nama,
        rating,
        komentar: komentar || undefined,
        status: "menunggu",
        locale: LOCALES.includes(locale) ? locale : DEFAULT_LOCALE,
      },
    });

    return { ok: true };
  } catch (err) {
    console.error("[kirimUlasan] gagal:", err);
    return { ok: false, pesan: "gagal" };
  }
}
