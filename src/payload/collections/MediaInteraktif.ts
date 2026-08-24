import type { CollectionConfig } from "payload";
import { terapkanReferensiLokal } from "../fields/localeReference";
import { judulBaris } from "../fields/rowLabel";
import { urutanField } from "../fields/urutan";
import { revalidateSemua, revalidateSemuaAfterDelete } from "../hooks/revalidate";

/**
 * Katalog Media Digital Interaktif — PRD Fase 2 v1.2 FR-108.
 *
 * Paling ringan dari 4 koleksi Library: cuma metadata + tautan eksternal
 * (dunia Roblox, halaman HTML mandiri, dst). Tidak menyimpan berkas apa pun
 * di sisi kita, dan tidak bergantung ke OAuth Drive maupun keputusan
 * checkout — aman dikerjakan lebih dulu (lihat rekomendasi rilis PRD §8).
 *
 * `tags` dibuat bebas (array teks), bukan select tetap: tag di mockup
 * mencampur jenjang, mapel, dan jenis aktivitas sekaligus ("Numerasi", "SD",
 * "Interaktif") — memaksanya ke satu taksonomi tetap bakal janggal.
 */
export const MediaInteraktif: CollectionConfig = {
  slug: "media-interaktif",
  admin: {
    useAsTitle: "judul",
    defaultColumns: ["judul", "urutan"],
    group: "Data Situs",
    description: "Katalog Media Digital Interaktif — daftar tautan aktivitas/media pembelajaran eksternal.",
  },
  labels: { singular: "Media Interaktif", plural: "Media Interaktif" },
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
      label: "Judul",
    },
    {
      name: "deskripsi",
      type: "textarea",
      localized: true,
      label: "Deskripsi",
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Gambar sampul",
    },
    {
      name: "tags",
      type: "array",
      label: "Tag",
      labels: { singular: "Tag", plural: "Tag" },
      admin: { components: judulBaris },
      fields: [{ name: "label", type: "text", required: true, localized: true, label: "Tag" }],
    },
    {
      name: "tautan",
      type: "text",
      required: true,
      label: "Tautan",
      admin: { description: "Alamat lengkap tujuan tombol “Buka Link”." },
    },
    urutanField(),
  ]),
};
