import type { CollectionConfig } from "payload";
import { revalidateSemua, revalidateSemuaAfterDelete } from "../hooks/revalidate";

/**
 * Ulasan/rating pengunjung untuk satu `produk` (Buku, Bahan Ajar & Modul).
 *
 * Cuma bisa dikirim sesudah pengunjung berhasil membuka materi lewat
 * `UnduhMateriGate` (lihat `FormUlasan`) — bukan formulir berdiri sendiri di
 * halaman. Penegakannya di sisi UI saja (formulir cuma dirender sesudah state
 * `hasil` terisi), sama longgarnya dengan gerbang unduh FR-104 — bukan celah,
 * cuma tidak dibuat lebih rapat dari yang dibutuhkan.
 *
 * Publik boleh mengirim (create), tapi ulasan baru tampil di halaman publik
 * sesudah staf menyetujuinya (`status: "disetujui"`) — `access.read` di bawah
 * menegakkan ini di level koleksi, bukan cuma di query halaman, supaya ulasan
 * "menunggu"/"ditolak" tidak bisa bocor lewat jalan lain.
 */
export const Ulasan: CollectionConfig = {
  slug: "ulasan",
  admin: {
    useAsTitle: "nama",
    defaultColumns: ["nama", "produkRef", "rating", "status", "createdAt"],
    group: "Pengaturan",
    description:
      "Ulasan & rating dari pengunjung yang sudah membuka materi gratis. Baru tampil di halaman publik sesudah statusnya diubah jadi \"Disetujui\".",
  },
  labels: { singular: "Ulasan", plural: "Ulasan" },
  hooks: {
    afterChange: [revalidateSemua],
    afterDelete: [revalidateSemuaAfterDelete],
  },
  access: {
    read: ({ req }) => (req.user ? true : { status: { equals: "disetujui" } }),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "produkRef",
      type: "relationship",
      relationTo: "produk",
      required: true,
      label: "Materi yang diulas",
    },
    { name: "nama", type: "text", required: true, label: "Nama" },
    {
      name: "rating",
      type: "number",
      required: true,
      min: 1,
      max: 5,
      label: "Rating (1-5)",
      admin: { description: "1 = terendah, 5 = tertinggi." },
    },
    { name: "komentar", type: "textarea", label: "Komentar" },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "menunggu",
      label: "Status",
      options: [
        { label: "Menunggu Persetujuan", value: "menunggu" },
        { label: "Disetujui", value: "disetujui" },
        { label: "Ditolak", value: "ditolak" },
      ],
      admin: {
        position: "sidebar",
        description: "Cuma yang \"Disetujui\" tampil di halaman publik.",
      },
    },
    {
      name: "locale",
      type: "select",
      label: "Bahasa formulir",
      options: [
        { label: "Indonesia", value: "id" },
        { label: "English", value: "en" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};
