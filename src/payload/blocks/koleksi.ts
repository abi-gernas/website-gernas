import type { Block } from "payload";
import { judulBaris } from "../fields/rowLabel";
import { anchorField, ctaField, kolomField, warnaOptions } from "./shared";

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

/** Jadwal acara (poster / kartu kategori) dari koleksi Jadwal Acara. */
export const JadwalAcaraBlock: Block = {
  slug: "jadwalAcara",
  labels: { singular: "Jadwal Acara (dari Data Situs)", plural: "Jadwal Acara" },
  imageURL: "/blok/latestNews.svg",
  imageAltText: "Grid kartu acara berposter dengan tombol daftar",
  fields: [
    {
      name: "heading",
      type: "text",
      localized: true,
      label: "Judul bagian",
      admin: {
        description:
          "Acara diambil dari Data Situs → Jadwal Acara: yang akan datang tampil lebih dulu (terdekat di depan), lalu yang sudah selesai (terbaru di depan).",
      },
    },
    {
      name: "deskripsi",
      type: "text",
      localized: true,
      label: "Kalimat di bawah judul",
    },
    {
      name: "tampilan",
      type: "select",
      label: "Tampilan",
      defaultValue: "grid",
      options: [
        { label: "Grid — kartu berposter, tombol “Lihat Semua” di bawah", value: "grid" },
        { label: "Geser — satu baris kartu ringkas tanpa poster", value: "geser" },
      ],
      admin: {
        description:
          "“Geser” dipakai Pojok Guru: judul rata kiri dengan tautan “Lihat semua” di kanan, kartu digeser ke samping.",
      },
    },
    {
      name: "batasAwal",
      type: "number",
      label: "Jumlah awal yang tampil",
      min: 1,
      defaultValue: 6,
      admin: {
        description:
          "Grid: sisanya disembunyikan di balik tombol “Lihat Semua”. Geser: jumlah kartu di baris. Kosongkan untuk menampilkan semua.",
      },
    },
    {
      name: "sembunyikanSelesai",
      type: "checkbox",
      label: "Sembunyikan acara yang sudah selesai",
      defaultValue: false,
      admin: {
        description:
          "Bila dicentang dan tidak ada acara yang akan datang, seluruh bagian ini hilang. Tanpa centang, acara selesai terbaru mengisi sisa tempat.",
      },
    },
    ctaField("tautanLihatSemua", "Tautan “Lihat semua” (tampilan Geser)"),
    anchorField("/belajar-bersama#jadwal-acara"),
  ],
};

/**
 * Satu produk Buku/Bahan Ajar/Modul disorot besar, plus panel alasan umum di
 * sampingnya ("Mengapa Guru Memilih…"). Poin alasannya sengaja diisi di blok,
 * bukan diambil dari `fiturUnggulan` produk — keputusan §4.5.0 rencana eksekusi.
 */
export const ProdukSorotanBlock: Block = {
  slug: "produkSorotan",
  labels: { singular: "Produk Sorotan (dari Buku & Bahan Ajar)", plural: "Produk Sorotan" },
  imageURL: "/blok/produkSorotan.svg",
  imageAltText: "Kartu produk bersampul dengan panel daftar alasan di sampingnya",
  fields: [
    {
      name: "heading",
      type: "text",
      localized: true,
      label: "Judul bagian",
      admin: { description: "Kosongkan untuk memakai “Produk Terbaru”." },
    },
    {
      name: "produk",
      type: "relationship",
      relationTo: "produk",
      label: "Produk",
      admin: {
        description:
          "Kosongkan untuk memakai produk dengan Urutan terkecil — sama dengan “Produk Terbaru” di halaman katalog Buku, Bahan Ajar & Modul.",
      },
    },
    {
      name: "subjudul",
      type: "text",
      localized: true,
      label: "Kalimat sorotan",
      admin: {
        description:
          "Opsional, tampil besar di bawah judul produk (mis. “Membaca menjadi jauh lebih bermakna”). Kalimat ini melekat di blok, bukan di produk — perbarui bila produk yang disorot berganti.",
      },
    },
    {
      name: "alasan",
      type: "group",
      label: "Panel alasan di samping",
      fields: [
        { name: "judul", type: "text", localized: true, label: "Judul panel" },
        {
          name: "poin",
          type: "array",
          label: "Poin",
          maxRows: 6,
          labels: { singular: "Poin", plural: "Poin" },
          admin: {
            components: judulBaris,
            description: "Hapus semua poin untuk menyembunyikan panel ini.",
          },
          fields: [{ name: "teks", type: "text", required: true, localized: true, label: "Isi poin" }],
        },
      ],
    },
  ],
};

/** Pilihan katalog Library. Nilainya WAJIB sama dengan `KatalogGuru` di `src/lib/perangkatGuru.ts`. */
const katalogGuruOptions = [
  { label: "Buku, Bahan Ajar & Modul", value: "produk" },
  { label: "Alat Peraga", value: "alatPeraga" },
  { label: "Video Pembelajaran", value: "videoPembelajaran" },
  { label: "Media Digital Interaktif", value: "mediaInteraktif" },
];

/**
 * Empat kartu katalog Library + panel biru berisi angka jumlah materi dan
 * ajakan "Belum menemukan…". Satu blok, bukan Kartu Berisi + Baris Statistik +
 * Banner Ajakan, karena ketiganya harus membentuk satu tata letak berdampingan.
 *
 * Angka statistik dihitung dari koleksi saat halaman dibuka, bukan diketik
 * staf — keputusan 16 Sep 2026: tampilkan jumlah materi yang benar-benar ada.
 */
export const PerangkatGuruBlock: Block = {
  slug: "perangkatGuru",
  labels: { singular: "Perangkat Guru (4 katalog + panel angka)", plural: "Perangkat Guru" },
  imageURL: "/blok/perangkatGuru.svg",
  imageAltText: "Empat kartu katalog 2×2 dengan panel biru berisi angka dan tombol di sampingnya",
  fields: [
    { name: "judul", type: "text", localized: true, label: "Judul bagian" },
    { name: "subjudul", type: "text", localized: true, label: "Kalimat di bawah judul" },
    {
      name: "kartu",
      type: "array",
      label: "Kartu katalog",
      maxRows: 4,
      labels: { singular: "Kartu", plural: "Kartu" },
      admin: {
        components: judulBaris,
        description: "Seluruh kartu menjadi tautan ke halaman katalog yang dipilih.",
      },
      fields: [
        {
          name: "katalog",
          type: "select",
          required: true,
          label: "Katalog",
          defaultValue: "produk",
          options: katalogGuruOptions,
        },
        {
          name: "judul",
          type: "text",
          localized: true,
          label: "Judul kartu",
          admin: { description: "Kosongkan untuk memakai nama katalog." },
        },
        { name: "deskripsi", type: "textarea", localized: true, label: "Deskripsi singkat" },
        {
          name: "warna",
          type: "select",
          label: "Warna aksen",
          defaultValue: "abu",
          options: warnaOptions,
          admin: { description: "Menentukan titik warna di depan judul dan latar muda kartu." },
        },
        {
          name: "gambar",
          type: "upload",
          relationTo: "media",
          label: "Gambar",
          admin: {
            description:
              "Kosongkan untuk memakai sampul materi pertama katalog ini (Urutan terkecil) — ikut berganti bila urutan materi diubah.",
          },
        },
      ],
    },
    {
      name: "panel",
      type: "group",
      label: "Panel biru di samping",
      admin: { description: "Kosongkan angka dan judul untuk menyembunyikan panel." },
      fields: [
        {
          name: "statistik",
          type: "array",
          label: "Angka",
          maxRows: 4,
          labels: { singular: "Angka", plural: "Angka" },
          admin: { components: judulBaris },
          fields: [
            {
              name: "sumber",
              type: "select",
              required: true,
              label: "Sumber angka",
              defaultValue: "produk",
              options: [
                ...katalogGuruOptions.map((o) => ({ ...o, label: `Jumlah ${o.label}` })),
                { label: "Jumlah semua materi (4 katalog)", value: "semua" },
                { label: "Diketik manual", value: "manual" },
              ],
              admin: {
                description: "Jumlah katalog dihitung otomatis dari isi koleksinya setiap halaman dibuka.",
              },
            },
            {
              name: "angka",
              type: "number",
              label: "Angka",
              admin: {
                condition: (_, baris) => baris?.sumber === "manual",
                description: "Angka saja, tanpa titik/koma. Mis. 1000",
              },
            },
            {
              name: "akhiran",
              type: "text",
              localized: true,
              label: "Akhiran",
              admin: { description: "Mis. “+”. Boleh dikosongkan." },
            },
            {
              name: "label",
              type: "text",
              localized: true,
              label: "Keterangan",
              admin: {
                description: "Kosongkan untuk memakai nama katalog. Wajib bila angka diketik manual.",
              },
            },
          ],
        },
        { name: "judul", type: "text", localized: true, label: "Judul ajakan" },
        { name: "isi", type: "textarea", localized: true, label: "Isi ajakan" },
        {
          name: "gambar",
          type: "upload",
          relationTo: "media",
          label: "Ilustrasi",
          admin: { description: "Kosongkan untuk memakai ilustrasi CS bawaan." },
        },
        ctaField("cta", "Tombol"),
      ],
    },
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
