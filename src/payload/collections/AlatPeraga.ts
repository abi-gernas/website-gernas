import type { CollectionConfig } from "payload";
import { terapkanReferensiLokal } from "../fields/localeReference";
import { judulBaris } from "../fields/rowLabel";
import { slugField } from "../fields/slug";
import { urutanField } from "../fields/urutan";
import { revalidateSemua, revalidateSemuaAfterDelete } from "../hooks/revalidate";

/**
 * Katalog Alat Peraga — PRD Fase 2 v1.2 FR-106.
 *
 * Showcase only: tidak ada field harga/checkout. Tombol di halaman publik
 * cuma "Detail", bukan "Beli Sekarang". Kalau nanti alat peraga mau dijual
 * online, itu FR baru (perlu stok + ongkir) — jangan tambah field harga ke
 * sini diam-diam sebelum itu diputuskan.
 */
export const AlatPeraga: CollectionConfig = {
  slug: "alat-peraga",
  admin: {
    useAsTitle: "judul",
    defaultColumns: ["judul", "jenjang", "urutan"],
    group: "Data Situs",
    description: "Katalog Alat Peraga. Tanpa unduhan atau pembelian online — cuma halaman detail informasi produk.",
  },
  labels: { singular: "Alat Peraga", plural: "Alat Peraga" },
  hooks: {
    afterChange: [revalidateSemua],
    afterDelete: [revalidateSemuaAfterDelete],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: terapkanReferensiLokal([
    {
      name: "judul",
      type: "text",
      required: true,
      localized: true,
      label: "Judul produk",
    },
    ...slugField("judul"),
    {
      name: "subjudul",
      type: "text",
      localized: true,
      label: "Subjudul",
      admin: {
        description: "Teks kecil di bawah judul kartu, mis. “untuk SD Kelas 1–3”.",
      },
    },
    {
      name: "jenjang",
      type: "select",
      required: true,
      hasMany: true,
      label: "Jenjang",
      options: [
        { label: "PAUD", value: "paud" },
        { label: "TK", value: "tk" },
        { label: "SD", value: "sd" },
        { label: "SMP", value: "smp" },
        { label: "SMA", value: "sma" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "mapel",
      type: "select",
      required: true,
      hasMany: true,
      label: "Mapel/Program",
      defaultValue: ["matematika"],
      options: [
        { label: "Matematika (Gernas Tastaka)", value: "matematika" },
        { label: "Membaca/Literasi (Gernas Tastaba)", value: "membaca" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Gambar sampul",
    },
    {
      name: "galeriFoto",
      type: "array",
      label: "Galeri foto",
      labels: { singular: "Foto", plural: "Foto" },
      fields: [{ name: "gambar", type: "upload", relationTo: "media", required: true, label: "Gambar" }],
    },
    {
      name: "deskripsi",
      type: "textarea",
      localized: true,
      label: "Deskripsi",
      admin: { description: "Tampil di halaman detail produk." },
    },
    {
      name: "isiPaket",
      type: "array",
      label: "Isi paket",
      labels: { singular: "Item", plural: "Item" },
      admin: {
        components: judulBaris,
        description: "Daftar isi 1 paket, mis. “5 bentuk bangun ruang”.",
      },
      fields: [{ name: "teks", type: "text", required: true, localized: true, label: "Item" }],
    },
    urutanField(),
  ]),
};
