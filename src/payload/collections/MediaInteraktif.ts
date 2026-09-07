import type { CollectionConfig } from "payload";
import { terapkanReferensiLokal } from "../fields/localeReference";
import { judulBaris } from "../fields/rowLabel";
import { slugField } from "../fields/slug";
import { urutanField } from "../fields/urutan";
import { revalidateSemua, revalidateSemuaAfterDelete } from "../hooks/revalidate";

/**
 * Katalog Media Digital Interaktif — PRD Fase 2 v1.2 FR-108.
 *
 * Cuma metadata + tautan eksternal — kartunya di `/media-interaktif` langsung
 * membuka `tautan` di tab baru, tidak ada halaman detail di situs ini.
 *
 * `kontenHtml` (kode HTML lengkap mesin virtual/aktivitasnya, disalin dari
 * sumber asli) disiapkan utk penyematan langsung, diisi pertama kali oleh
 * `scripts/seed-media-interaktif-vm.mts` (Repositori Mesin Virtual Numerasi,
 * prpic.id/vmnumerasi) — tapi belum dipakai front-end mana pun (7 Sep 2026:
 * diputuskan halaman detail belum perlu dulu). Field & datanya sengaja
 * dibiarkan tersimpan utk dipakai kalau/ketika halaman detailnya dibangun.
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
          "Kode HTML lengkap aktivitas/mesin virtualnya, disalin dari sumber aslinya. Belum dipakai di halaman publik mana pun — disimpan utk dipakai nanti bila halaman detailnya dibangun.",
      },
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
