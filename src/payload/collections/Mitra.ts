import type { CollectionConfig } from "payload";
import { urutanField } from "../fields/urutan";
import { revalidateSemua, revalidateSemuaAfterDelete } from "../hooks/revalidate";

/**
 * Logo mitra kolaborasi.
 *
 * Alasan utama ini jadi koleksi tersendiri: logo yang sama muncul di dua
 * tempat — barisan berjalan di beranda dan grid berkelompok di halaman Mitra.
 * Bila disimpan di dalam blok, staf harus mengunggah dan memperbarui logo yang
 * sama dua kali, dan keduanya bisa jadi tidak sinkron.
 */
export const Mitra: CollectionConfig = {
  slug: "mitra",
  admin: {
    useAsTitle: "nama",
    defaultColumns: ["nama", "kelompok", "tampilDiBeranda", "urutan"],
    group: "Data Situs",
    description:
      "Logo mitra. Dipakai blok “Logo Mitra” di halaman Mitra (dikelompokkan) dan di beranda (barisan berjalan).",
  },
  labels: { singular: "Mitra", plural: "Mitra" },
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
  fields: [
    {
      name: "nama",
      type: "text",
      required: true,
      label: "Nama mitra",
      admin: {
        description:
          "Dipakai sebagai teks alternatif logo, jadi tetap isi walau logonya sudah memuat nama.",
      },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Logo",
      admin: {
        description: "Sebaiknya PNG berlatar transparan.",
      },
    },
    {
      name: "kelompok",
      type: "select",
      required: true,
      label: "Kelompok",
      defaultValue: "pemerintah",
      options: [
        { label: "Pemerintah Pusat & Daerah", value: "pemerintah" },
        { label: "Korporasi & NGO", value: "korporasi" },
        { label: "Pendidikan & Perguruan Tinggi", value: "pendidikan" },
      ],
      admin: {
        description: "Menentukan di bawah judul mana logo ini dikelompokkan.",
      },
    },
    {
      name: "tampilDiBeranda",
      type: "checkbox",
      label: "Tampilkan di beranda",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Bila dicentang, logo ikut pada barisan mitra yang berjalan di beranda.",
      },
    },
    urutanField(),
  ],
};
