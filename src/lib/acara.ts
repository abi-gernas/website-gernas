/**
 * Bahan bersama kartu acara (`JadwalAcara.tsx`) dan halaman detail acara
 * (`AcaraDetailContent.tsx`): tipe data, label, warna, dan hitungan hari.
 *
 * Tanpa `server-only`: dipakai komponen klien maupun komponen server.
 */

import type { Locale } from "./i18n";

/** Satu acara, sudah diratakan dari dokumen Payload. */
export type AcaraTampil = {
  /** Alamat detail `/acara/[slug]`; kosong = kartu tidak bisa dibuka. */
  slug?: string;
  judul: string;
  kategori: string;
  poster?: string;
  /** ISO string dari field `tanggal`. */
  tanggal: string;
  waktu?: string;
  format: string;
  lokasi?: string;
  /** Kosong = acara eksklusif, tombol Daftar tidak dirender. */
  tautanDaftar?: string;
};

export const ZONA = "Asia/Jakarta";

export const labelKategori: Record<Locale, Record<string, string>> = {
  id: {
    webinar: "Webinar",
    pelatihan: "Pelatihan",
    workshop: "Workshop",
    klubBuku: "Klub Buku",
    seminar: "Seminar",
  },
  en: {
    webinar: "Webinar",
    pelatihan: "Training",
    workshop: "Workshop",
    klubBuku: "Book Club",
    seminar: "Seminar",
  },
};

export const labelFormat: Record<Locale, Record<string, string>> = {
  id: { online: "Online", offline: "Tatap Muka", hybrid: "Hybrid" },
  en: { online: "Online", offline: "In-person", hybrid: "Hybrid" },
};

/** Warna pil kategori + latar kartu tanpa poster, mengikuti rujukan desain. */
export const warnaKategori: Record<string, { pil: string; latar: string }> = {
  webinar: { pil: "bg-brand-navy text-white", latar: "bg-brand-navy/[0.04]" },
  pelatihan: { pil: "bg-brand-yellow text-brand-navy", latar: "bg-brand-yellow/10" },
  workshop: { pil: "bg-brand-red text-white", latar: "bg-brand-red/[0.04]" },
  klubBuku: { pil: "bg-brand-blue text-white", latar: "bg-brand-blue/[0.05]" },
  seminar: {
    pil: "border border-brand-navy bg-white text-brand-navy",
    latar: "bg-surface",
  },
};
export const warnaBawaan = warnaKategori.webinar;

/**
 * Batas akhir hari acara (23:59:59 WIB) dalam milidetik. Tanggal dari Payload
 * disimpan sebagai waktu UTC, jadi harinya dibaca ulang di zona Jakarta dulu —
 * tanpa itu acara pukul 00.00 WIB bisa tergeser ke hari sebelumnya.
 */
export function akhirHari(iso: string): number {
  const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: ZONA }).format(new Date(iso));
  return Date.parse(`${ymd}T23:59:59+07:00`);
}

