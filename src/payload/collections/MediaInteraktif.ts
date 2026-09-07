import type { CollectionConfig } from "payload";
import { terapkanReferensiLokal } from "../fields/localeReference";
import { judulBaris } from "../fields/rowLabel";
import { slugField } from "../fields/slug";
import { urutanField } from "../fields/urutan";
import { revalidateSemua, revalidateSemuaAfterDelete } from "../hooks/revalidate";

/**
 * Katalog Media Digital Interaktif — PRD Fase 2 v1.2 FR-108.
 *
 * Awalnya cuma metadata + tautan eksternal (tidak menyimpan berkas apa pun
 * di sisi kita). Sejak 7 Sep 2026 punya halaman detail sendiri
 * (`/media-interaktif/[slug]`) yang bisa menyematkan kontennya langsung lewat
 * `kontenHtml` — dipakai pertama kali untuk mengisi Repositori Mesin Virtual
 * Numerasi (prpic.id/vmnumerasi), lihat `scripts/seed-media-interaktif-vm.mts`.
 * `tautan` tetap wajib sebagai sumber asli/cadangan kalau `kontenHtml` kosong.
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
    description:
      "Katalog Media Digital Interaktif — aktivitas/media pembelajaran, disematkan lewat Konten HTML atau tautan eksternal.",
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
    ...slugField("judul"),
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
      name: "kontenHtml",
      type: "code",
      label: "Konten HTML (mesin virtual)",
      admin: {
        language: "html",
        description:
          "Kode HTML lengkap aktivitas/mesin virtualnya, disalin dari sumber aslinya — tampil tersemat (iframe) di halaman detail. Kosongkan untuk memakai tombol “Buka Link” ke tautan eksternal saja.",
      },
    },
    {
      name: "tautan",
      type: "text",
      required: true,
      label: "Tautan",
      admin: {
        description:
          "Alamat sumber asli. Dipakai sbg tombol “Buka Link” bila Konten HTML kosong, atau sbg tautan “Buka di sumber aslinya” di halaman detail bila Konten HTML terisi.",
      },
    },
    urutanField(),
  ]),
};
