import type { CollectionConfig } from "payload";
import { judulBaris } from "../fields/rowLabel";
import { urutanField } from "../fields/urutan";
import { revalidateSemua, revalidateSemuaAfterDelete } from "../hooks/revalidate";

/**
 * Orang-orang di balik gerakan — bagian "Penggerak" di halaman Tentang.
 *
 * Dipisah dari blok halaman karena satu orang bisa muncul di lebih dari satu
 * tempat dan datanya berubah sendiri (orang bergabung, jabatan berganti),
 * terlepas dari susunan halaman mana pun.
 */
export const Penggerak: CollectionConfig = {
  slug: "penggerak",
  admin: {
    useAsTitle: "nama",
    defaultColumns: ["nama", "urutan", "updatedAt"],
    group: "Data Situs",
    description:
      "Daftar penggerak yang tampil pada blok “Penggerak”. Menambah orang di sini otomatis menambahkannya di halaman yang memakai blok itu.",
  },
  labels: { singular: "Penggerak", plural: "Penggerak" },
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
      label: "Nama",
    },
    {
      name: "foto",
      type: "upload",
      relationTo: "media",
      label: "Foto",
      admin: {
        description:
          "Sebaiknya foto potret persegi. Bila kosong, kotak abu-abu yang tampil.",
      },
    },
    {
      name: "peran",
      type: "array",
      label: "Peran",
      labels: { singular: "Peran", plural: "Peran" },
      admin: {
        components: judulBaris,
        description:
          "Satu baris per jabatan. Semuanya tampil dipisah tanda titik tengah, mis. “Trainer Gernas Tastaka · Peneliti PRPIC”.",
      },
      fields: [
        {
          name: "nama",
          type: "text",
          required: true,
          localized: true,
          label: "Nama peran",
        },
      ],
    },
    urutanField(),
  ],
};
