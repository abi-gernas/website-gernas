import type { Block } from "payload";
import { anchorField, ctaField, kolomField } from "./shared";

/**
 * Blok yang isinya diambil dari koleksi "Data Situs", bukan diketik ulang di
 * dalam blok.
 *
 * Konsekuensi yang perlu dipahami staf: menambah orang di koleksi Penggerak
 * langsung menambahkannya di setiap halaman yang memakai blok Penggerak.
 * Karena itu blok-blok ini sengaja hanya punya sedikit field — isinya diatur
 * dari menu koleksinya, bukan dari sini.
 */

/** Daftar berita terbaru dari koleksi Artikel. */
export const LatestNewsBlock: Block = {
  slug: "latestNews",
  labels: { singular: "Berita Terbaru (dari Artikel)", plural: "Berita Terbaru" },
  imageURL: "/blok/latestNews.svg",
  imageAltText: "Grid kartu berita bergambar",
  fields: [
    { name: "heading", type: "text", localized: true, label: "Judul bagian" },
    {
      name: "limit",
      type: "number",
      defaultValue: 3,
      label: "Jumlah artikel",
      min: 1,
      max: 12,
      admin: { description: "Artikel terbaru diambil lebih dulu." },
    },
    kolomField("3"),
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      label: "Batasi ke kategori",
      admin: { description: "Kosongkan untuk menampilkan semua kategori." },
    },
    ctaField("cta", "Tombol di bawah daftar"),
    anchorField("/#kabar-terbaru"),
  ],
};

/** Grid foto penggerak dari koleksi Penggerak. */
export const TeamGridBlock: Block = {
  slug: "teamGrid",
  labels: { singular: "Penggerak (dari Data Situs)", plural: "Penggerak" },
  imageURL: "/blok/teamGrid.svg",
  imageAltText: "Grid foto orang dengan nama dan peran di bawahnya",
  fields: [
    {
      name: "heading",
      type: "text",
      localized: true,
      label: "Judul bagian",
      admin: {
        description:
          "Blok ini menampilkan seluruh isi Data Situs → Penggerak, urut menurut “Urutan tampil”. Untuk menambah atau menghapus orang, sunting koleksinya — bukan blok ini.",
      },
    },
    {
      name: "batasAwal",
      type: "number",
      label: "Jumlah awal yang tampil",
      min: 1,
      defaultValue: 10,
      admin: {
        description:
          "Sisanya disembunyikan di balik tombol “Lihat Semua” supaya grid tidak kepanjangan saat daftar penggerak terus bertambah. Kosongkan untuk menampilkan semua sekaligus.",
      },
    },
    anchorField("/tentang-gernas-tastaka#penggerak"),
  ],
};

/** Logo mitra dari koleksi Mitra. */
export const PartnerLogosBlock: Block = {
  slug: "partnerLogos",
  labels: { singular: "Logo Mitra (dari Data Situs)", plural: "Logo Mitra" },
  imageURL: "/blok/partnerLogos.svg",
  imageAltText: "Deretan logo mitra",
  fields: [
    {
      name: "heading",
      type: "text",
      localized: true,
      label: "Judul bagian",
      admin: {
        description:
          "Logo diambil dari Data Situs → Mitra. Tambah atau ganti logo di koleksi itu, bukan di sini.",
      },
    },
    {
      name: "tampilan",
      type: "select",
      required: true,
      label: "Tampilan",
      defaultValue: "berkelompok",
      options: [
        {
          label: "Berkelompok menurut jenis mitra",
          value: "berkelompok",
        },
        {
          label: "Barisan berjalan (hanya mitra pilihan beranda)",
          value: "barisan",
        },
      ],
      admin: {
        description:
          "“Berkelompok” menampilkan semua mitra di bawah judul kelompoknya masing-masing. “Barisan berjalan” hanya menampilkan mitra yang dicentang “Tampilkan di beranda”.",
      },
    },
    ctaField("cta", "Tombol di bawah logo"),
  ],
};

/** Daftar video dari koleksi Video. */
export const VideoGridBlock: Block = {
  slug: "videoGrid",
  labels: { singular: "Daftar Video (dari Data Situs)", plural: "Daftar Video" },
  imageURL: "/blok/videoGrid.svg",
  imageAltText: "Grid sampul video dengan tombol putar",
  fields: [
    {
      name: "heading",
      type: "text",
      localized: true,
      label: "Judul bagian",
      admin: {
        description:
          "Video diambil dari Data Situs → Video, urut menurut “Urutan tampil”.",
      },
    },
    {
      name: "limit",
      type: "number",
      label: "Jumlah video",
      min: 1,
      max: 24,
      admin: {
        description: "Kosongkan untuk menampilkan semua video.",
      },
    },
    kolomField("3"),
  ],
};

/** Modul pelatihan dari koleksi Modul Pelatihan. */
export const TrainingModulesBlock: Block = {
  slug: "trainingModules",
  labels: {
    singular: "Modul Pelatihan (dari Data Situs)",
    plural: "Modul Pelatihan",
  },
  imageURL: "/blok/trainingModules.svg",
  imageAltText: "Kartu-kartu modul pelatihan bernomor",
  fields: [
    {
      name: "heading",
      type: "text",
      localized: true,
      label: "Judul bagian",
      admin: {
        description:
          "Modul diambil dari Data Situs → Modul Pelatihan. Warna kartu berganti merah–biru–kuning otomatis mengikuti urutan.",
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
    },
    {
      name: "tampilan",
      type: "select",
      required: true,
      label: "Tampilan",
      defaultValue: "topik",
      options: [
        { label: "Ringkas — kartu berwarna, klik untuk melihat tujuan", value: "topik" },
        { label: "Rincian — daftar modul yang bisa dibuka-tutup", value: "rincian" },
      ],
      admin: {
        description:
          "“Ringkas” sudah memuat tujuan pembelajaran: kartunya tertutup dan terbuka saat diklik, jadi satu blok ini cukup untuk bagian Topik Pelatihan. “Rincian” adalah tampilan lama berupa daftar putih — pakai hanya bila memang ingin dua bagian terpisah.",
      },
    },
    {
      name: "sidebar",
      type: "group",
      label: "Kotak pengantar di samping (opsional)",
      admin: {
        description:
          "Hanya tampil pada tampilan Ringkas. Kosongkan judul untuk menyembunyikannya.",
      },
      fields: [
        { name: "teks", type: "textarea", localized: true, label: "Teks pengantar" },
        { name: "ajakan", type: "text", localized: true, label: "Kalimat ajakan", admin: { description: "Mis. “Tertarik untuk belajar?”" } },
        ctaField("cta", "Tombol"),
      ],
    },
  ],
};
