import type { Field } from "payload";
import { judulBaris } from "../fields/rowLabel";

/**
 * Field yang dipakai berulang di banyak blok. Dikumpulkan di sini supaya label
 * dan teks bantuannya persis sama di mana pun muncul — staf tidak perlu
 * menebak apakah "Tautan" di satu blok berarti hal yang sama dengan di blok
 * lain.
 */

/** Tombol ajakan: pasangan teks + alamat tujuan. */
export const ctaField = (name = "cta", label = "Tombol"): Field => ({
  name,
  type: "group",
  label,
  fields: [
    { name: "label", type: "text", localized: true, label: "Teks tombol" },
    {
      name: "href",
      type: "text",
      label: "Tautan",
      admin: { description: "Contoh: /tumbuh-bersama atau https://…" },
    },
  ],
  admin: {
    description: "Kosongkan keduanya bila blok ini tidak perlu tombol.",
  },
});

/** Daftar angka statistik — dipakai blok Baris Statistik dan Peta Indonesia. */
export const statsArrayField = (): Field => ({
  name: "stats",
  type: "array",
  label: "Angka statistik",
  labels: { singular: "Angka", plural: "Angka" },
  admin: { components: judulBaris },
  maxRows: 6,
  fields: [
    {
      name: "value",
      type: "number",
      required: true,
      label: "Angka",
      admin: { description: "Angka saja, tanpa titik/koma. Mis. 16000" },
    },
    {
      name: "suffix",
      type: "text",
      localized: true,
      label: "Akhiran",
      admin: { description: "Mis. “+” atau “ribu”. Boleh dikosongkan." },
    },
    { name: "label", type: "text", required: true, localized: true, label: "Keterangan" },
  ],
});

/**
 * Penanda tujuan tautan dalam halaman (mis. `/mitra#hubungi`).
 *
 * Hanya dipasang pada blok yang memang sudah menjadi tujuan tautan di menu
 * atau footer. Bila penanda ini dikosongkan, tautan lama seperti
 * `/tentang-gernas-tastaka#penggerak` akan berhenti melompat ke bagiannya.
 */
export const anchorField = (contoh: string): Field => ({
  type: "collapsible",
  label: "Pengaturan lanjutan",
  admin: { initCollapsed: true },
  fields: [
    {
      name: "anchor",
      type: "text",
      label: "Penanda tautan",
      admin: {
        description:
          `Membuat bagian ini bisa dituju langsung lewat alamat, mis. “${contoh}”. ` +
          "Hanya huruf kecil dan tanda hubung. Jangan diubah bila sudah dipakai di menu.",
      },
    },
  ],
});

/** Pilihan jumlah kolom grid — dipakai beberapa blok kartu. */
export const kolomField = (defaultValue: "2" | "3" | "4" = "3"): Field => ({
  name: "kolom",
  type: "select",
  label: "Jumlah kolom",
  defaultValue,
  options: [
    { label: "2 kolom", value: "2" },
    { label: "3 kolom", value: "3" },
    { label: "4 kolom", value: "4" },
  ],
  admin: {
    description: "Di layar ponsel semua blok tetap turun menjadi satu kolom.",
  },
});

/** Warna latar kotak/kartu, mengikuti palet Design System v2.0. */
export const warnaOptions = [
  { label: "Putih", value: "putih" },
  { label: "Abu muda", value: "abu" },
  { label: "Biru tua", value: "navy" },
  { label: "Merah", value: "merah" },
  { label: "Kuning", value: "kuning" },
];
