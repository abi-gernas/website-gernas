import type { CollectionConfig } from "payload";
import { terapkanReferensiLokal } from "../fields/localeReference";
import { judulBaris } from "../fields/rowLabel";
import { urutanField } from "../fields/urutan";
import { revalidateSemua, revalidateSemuaAfterDelete } from "../hooks/revalidate";

/**
 * Modul program pelatihan — halaman Belajar Bersama.
 *
 * Tiap modul tampil dua kali di halaman yang sama: sebagai kartu ringkas di
 * bagian "Topik Pelatihan" dan sebagai kartu rincian di bagian "Rincian
 * Modul". Menyimpannya sekali di sini mencegah kedua bagian itu berbeda isi.
 *
 * Warna kartu sengaja tidak dijadikan field: urutannya bergantian
 * merah–biru–kuning mengikuti posisi, jadi staf tidak perlu memikirkannya dan
 * pola warnanya tidak bisa rusak.
 */
export const ModulPelatihan: CollectionConfig = {
  slug: "modul-pelatihan",
  admin: {
    useAsTitle: "judul",
    defaultColumns: ["judul", "program", "nomor", "urutan"],
    group: "Data Situs",
    description:
      "Modul pelatihan matematika & membaca. Dipakai blok “Modul Pelatihan” di halaman Belajar Bersama.",
  },
  labels: { singular: "Modul Pelatihan", plural: "Modul Pelatihan" },
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
      label: "Judul modul",
      admin: {
        description: "Mis. “Bilangan” atau “Prinsip-Prinsip Dasar Mengajar”.",
      },
    },
    {
      name: "program",
      type: "select",
      required: true,
      label: "Program",
      defaultValue: "matematika",
      options: [
        { label: "Pelatihan Matematika", value: "matematika" },
        { label: "Pelatihan Membaca", value: "membaca" },
      ],
      admin: {
        position: "sidebar",
        description: "Menentukan bagian mana di halaman yang memuat modul ini.",
      },
    },
    {
      name: "nomor",
      type: "number",
      required: true,
      label: "Nomor pelatihan",
      defaultValue: 1,
      admin: {
        description: "Angka yang tampil sebagai “Pelatihan 1”, “Pelatihan 2”, dan seterusnya.",
      },
    },
    {
      name: "tujuan",
      type: "array",
      label: "Tujuan pembelajaran",
      labels: { singular: "Tujuan", plural: "Tujuan" },
      admin: {
        components: judulBaris,
        description:
          "Poin-poin yang tampil pada kartu rincian modul. Satu baris per tujuan.",
      },
      fields: [
        {
          name: "teks",
          type: "textarea",
          required: true,
          localized: true,
          label: "Tujuan",
        },
      ],
    },
    urutanField(),
  ]),
};
