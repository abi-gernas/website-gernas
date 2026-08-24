import type { CollectionConfig } from "payload";
import { terapkanReferensiLokal } from "../fields/localeReference";
import { judulBaris } from "../fields/rowLabel";
import { slugField } from "../fields/slug";
import { urutanField } from "../fields/urutan";
import { revalidateSemua, revalidateSemuaAfterDelete } from "../hooks/revalidate";

/**
 * Katalog "Buku, Bahan Ajar & Modul" — PRD Fase 2 v1.2 FR-109/FR-110.
 *
 * `format` sengaja hasMany (bukan satu nilai tunggal): mockup memperlihatkan
 * satu produk bisa dicentang tersedia sbg "Versi Cetak" maupun "PDF & Panduan
 * Guru" sekaligus. Menyimpannya sbg satu harga+status per dokumen adalah
 * penyederhanaan sengaja — kalau nanti tiap format ternyata butuh harga
 * berbeda sendiri-sendiri, field ini perlu naik jadi array varian. Jangan
 * naikkan itu sebelum benar-benar dibutuhkan (checkout FR-110 sendiri masih
 * OI-105, belum diputuskan).
 *
 * `tautanDrive` menunggu OI-108 (OAuth Google Drive belum dibuat) — field
 * ini aman diisi manual (link folder/berkas "siapa saja yang punya tautan")
 * sebagai jalan pintas sementara sebelum integrasi OAuth resmi ada.
 */
export const Produk: CollectionConfig = {
  slug: "produk",
  admin: {
    useAsTitle: "judul",
    defaultColumns: ["judul", "kategoriProduk", "status", "harga", "urutan"],
    group: "Data Situs",
    description:
      "Katalog Buku, Bahan Ajar & Modul. Materi gratis diunduh lewat tautan Google Drive (perlu form isi data pengunjung dulu — lihat koleksi Pesan Masuk); materi berbayar masih menunggu keputusan mekanisme pembayaran (lihat PRD Fase 2 v1.2, OI-105).",
  },
  labels: { singular: "Produk", plural: "Produk (Buku/Bahan Ajar/Modul)" },
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
      name: "kategoriProduk",
      type: "select",
      required: true,
      label: "Kategori",
      defaultValue: "modul",
      options: [
        { label: "Modul", value: "modul" },
        { label: "Buku", value: "buku" },
        { label: "Bahan Ajar", value: "bahan-ajar" },
        { label: "LKS/Worksheet", value: "lks" },
      ],
      admin: {
        position: "sidebar",
        description: "Menentukan kartu kategori mana di halaman katalog yang memuat produk ini.",
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
      admin: {
        position: "sidebar",
        description: "Sama seperti field Program di Modul Pelatihan — tambah opsi di sini bila nanti ada mapel baru.",
      },
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Gambar sampul",
    },
    {
      name: "ringkasan",
      type: "textarea",
      localized: true,
      label: "Ringkasan singkat",
      admin: {
        description: "Tampil di kartu katalog dan sebagai deskripsi SEO bila belum diisi manual.",
      },
    },
    {
      name: "fiturUnggulan",
      type: "array",
      label: "Fitur unggulan",
      labels: { singular: "Fitur", plural: "Fitur" },
      admin: {
        components: judulBaris,
        description: "Poin bertanda bintang di halaman detail, mis. “40 kegiatan bertahap”.",
      },
      fields: [{ name: "teks", type: "text", required: true, localized: true, label: "Fitur" }],
    },
    {
      name: "format",
      type: "select",
      required: true,
      hasMany: true,
      defaultValue: ["pdf"],
      label: "Format tersedia",
      options: [
        { label: "PDF & Panduan Guru", value: "pdf" },
        { label: "Versi Cetak", value: "cetak" },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "gratis",
      label: "Status",
      options: [
        { label: "Gratis", value: "gratis" },
        { label: "Berbayar", value: "berbayar" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "harga",
      type: "number",
      label: "Harga (Rp)",
      min: 0,
      admin: {
        position: "sidebar",
        condition: (_data, siblingData) => siblingData?.status === "berbayar",
        description: "Wajib diisi bila status Berbayar.",
      },
      validate: (value: number | null | undefined, { siblingData }: { siblingData?: Record<string, unknown> }) => {
        if (siblingData?.status === "berbayar" && !value) {
          return "Harga wajib diisi untuk produk berbayar.";
        }
        return true;
      },
    },
    {
      name: "tautanDrive",
      type: "text",
      label: "Tautan Google Drive",
      admin: {
        description:
          "Alamat berkas/folder Drive (akses “siapa saja yang punya tautan”) sampai OAuth resmi (OI-108) selesai dibuat. Untuk produk berbayar, ini bisa dikosongkan dan dikirim manual setelah pembayaran dikonfirmasi.",
      },
    },
    urutanField(),
  ]),
};
