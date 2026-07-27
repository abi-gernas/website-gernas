"use client";

import { useRowLabel } from "@payloadcms/ui";

/**
 * Judul baris pada field array di dasbor.
 *
 * Tanpa ini setiap baris hanya berbunyi "Slide 01", "Kartu 02", dan seterusnya
 * — staf harus membuka satu per satu untuk tahu isinya, dan setelah baris
 * ditutup tidak ada cara membedakannya. Komponen ini menampilkan isi baris
 * sendiri sebagai judulnya.
 *
 * Sengaja dibuat satu komponen untuk semua array, bukan satu per field: nama
 * field penanda isi di proyek ini terbatas dan berulang, jadi cukup dicari
 * berurutan. Menambah array baru tidak menuntut komponen baru selama field
 * judulnya bernama salah satu dari daftar di bawah.
 */

/** Urutan pencarian: yang lebih menandai identitas baris didahulukan. */
const FIELD_JUDUL = [
  "judul",
  "title",
  "nama",
  "label",
  "platform",
  "kutipan",
  "teks",
  "heading",
] as const;

const POTONG = 60;

/** Ambil nilai teks pertama yang terisi dari `FIELD_JUDUL`. */
function judulBaris(data: Record<string, unknown>): string | null {
  for (const field of FIELD_JUDUL) {
    const nilai = data?.[field];
    if (typeof nilai === "string" && nilai.trim()) return nilai.trim();
  }
  return null;
}

function ringkas(teks: string): string {
  return teks.length > POTONG ? `${teks.slice(0, POTONG - 1)}…` : teks;
}

export const RowLabel = () => {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>();

  const nomor = (rowNumber ?? 0) + 1;
  const judul = judulBaris(data ?? {});

  // Linimasa: tahun saja terlalu sedikit untuk membedakan baris, sedangkan
  // peristiwanya panjang — jadi keduanya digabung.
  const tahun = typeof data?.tahun === "string" ? data.tahun.trim() : "";
  if (tahun) {
    return <span>{ringkas(judul ? `${tahun} — ${judul}` : tahun)}</span>;
  }

  // Baris yang belum diisi tetap perlu penanda posisi.
  return <span>{judul ? ringkas(judul) : `Baris ${nomor}`}</span>;
};
