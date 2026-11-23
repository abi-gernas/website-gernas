import type { CollectionConfig } from "payload";
import { terapkanReferensiLokal } from "../fields/localeReference";
import { judulBaris } from "../fields/rowLabel";
import { slugField } from "../fields/slug";
import { urutanField } from "../fields/urutan";
import { revalidateSemua, revalidateSemuaAfterDelete } from "../hooks/revalidate";

/**
 * Katalog Media Digital Interaktif — PRD Fase 2 v1.2 FR-108.
 *
 * Metadata + tautan eksternal. Kartunya di `/media-interaktif` masuk dulu ke
 * halaman intro `/media-interaktif/[slug]` (sejak 23 Sep 2026, meniru alur
 * Video Pembelajaran), baru tombol di sana membuka `tautan` di tab baru.
 *
 * `kontenHtml` (kode HTML lengkap mesin virtual/aktivitasnya) dimainkan di
 * halaman main `/media-interaktif/[slug]/main` yang dibuka tombol di halaman
 * intro, di tab baru (sejak 23 Nov 2026).
 * Diisi pertama kali oleh `scripts/seed-media-interaktif-vm.mts` (Repositori
 * Mesin Virtual Numerasi, prpic.id/vmnumerasi). Karena itu `tautan` tidak
 * lagi wajib: media yang cuma punya kode HTML tidak butuh alamat luar.
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
          "Satu file HTML utuh (<!DOCTYPE html> … </html>) dengan CSS di dalam <style> dan JavaScript di dalam <script>. Dimainkan di halaman tersendiri yang terbuka di tab baru dari tombol di halaman detail. Jangan tempel file .js atau .css saja; gambar/pustaka luar harus memakai alamat lengkap https://.",
        // Kotak pilih/tarik file .html di atas editor — lihat KontenHtmlField.tsx.
        components: { Field: "/payload/components/KontenHtmlField#KontenHtmlField" },
      },
      validate: (value: string | null | undefined) =>
        !value?.trim() ||
        /<html[\s>]/i.test(value) ||
        "Ini belum satu file HTML utuh (tidak ada tag <html>). Tempel atau pilih file .html lengkapnya, bukan file .js/.css saja.",
    },
    {
      name: "tautan",
      type: "text",
      label: "Tautan",
      admin: {
        description:
          "Opsional. Alamat web lengkap yang diawali https://, dibuka di tab baru. Kosongkan bila media cukup dimainkan lewat Konten HTML. Ini bukan teks tombol.",
      },
      validate: (value: string | null | undefined) =>
        !value || /^https?:\/\//i.test(value) || "Isi dengan alamat lengkap yang diawali https://, atau kosongkan.",
    },
    urutanField(),
  ]),
};
