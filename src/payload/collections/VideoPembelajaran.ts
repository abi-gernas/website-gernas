import type { CollectionConfig } from "payload";
import { terapkanReferensiLokal } from "../fields/localeReference";
import { slugField } from "../fields/slug";
import { urutanField } from "../fields/urutan";
import { revalidateSemua, revalidateSemuaAfterDelete } from "../hooks/revalidate";

/**
 * Katalog Video Pembelajaran — PRD Fase 2 v1.2 FR-107.
 *
 * Koleksi terpisah dari `Video` yang sudah ada: `Video` isinya rekaman
 * Bincang Gernas untuk beranda/Tumbuh Bersama, ini katalog video per
 * jenjang/mapel dengan filter & pencarian sendiri — tujuannya beda, jangan
 * digabung supaya keduanya tidak saling ganggu.
 *
 * `sumberTipe` sengaja mendukung dua opsi sekaligus karena OI-106 (YouTube
 * vs upload ke storage sendiri) belum diputuskan — staf bisa pilih per video
 * begitu keputusan itu turun, tanpa perlu migrasi skema lagi. Opsi "Unggah"
 * baru bisa dipakai setelah `mimeTypes` di koleksi Media ditambah `video/*`
 * (saat ini cuma `image/*` & `application/pdf`, lihat Media.ts).
 */
export const VideoPembelajaran: CollectionConfig = {
  slug: "video-pembelajaran",
  admin: {
    useAsTitle: "judul",
    defaultColumns: ["judul", "jenjang", "sumberTipe", "urutan"],
    group: "Data Situs",
    description: "Katalog Video Pembelajaran per jenjang/mapel. Berbeda dari koleksi Video (rekaman Bincang Gernas).",
  },
  labels: { singular: "Video Pembelajaran", plural: "Video Pembelajaran" },
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
      label: "Judul video",
    },
    ...slugField("judul"),
    {
      name: "deskripsi",
      type: "textarea",
      localized: true,
      label: "Deskripsi",
      admin: { description: "Tampil di halaman detail video, di bawah pemutar." },
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Gambar sampul",
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
      name: "sumberTipe",
      type: "select",
      required: true,
      defaultValue: "youtube",
      label: "Sumber video",
      options: [
        { label: "YouTube", value: "youtube" },
        { label: "Unggah berkas", value: "upload" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "tautanYoutube",
      type: "text",
      label: "Tautan YouTube",
      admin: {
        condition: (_data, siblingData) => siblingData?.sumberTipe === "youtube",
        description: "Mis. https://www.youtube.com/watch?v=…",
      },
    },
    {
      name: "berkasVideo",
      type: "upload",
      relationTo: "media",
      label: "Berkas video",
      admin: {
        condition: (_data, siblingData) => siblingData?.sumberTipe === "upload",
        description: "Belum bisa dipakai sampai koleksi Media menerima video/* — lihat catatan di atas berkas ini.",
      },
    },
    {
      name: "durasi",
      type: "text",
      label: "Durasi",
      admin: { position: "sidebar", description: "Mis. “12:30”, opsional." },
    },
    urutanField(),
  ]),
};
