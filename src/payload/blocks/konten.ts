import type { Block } from "payload";
import { judulBaris } from "../fields/rowLabel";
import { ctaField, kolomField, statsArrayField, warnaOptions } from "./shared";

/** Blok teks bebas untuk isi halaman yang tidak berpola. */
export const RichTextBlock: Block = {
  slug: "richText",
  labels: { singular: "Teks Bebas", plural: "Teks Bebas" },
  imageURL: "/blok/richText.svg",
  imageAltText: "Satu blok tulisan biasa",
  fields: [
    { name: "heading", type: "text", label: "Judul bagian" },
    { name: "content", type: "richText", label: "Isi" },
    {
      name: "lebar",
      type: "select",
      label: "Lebar tulisan",
      defaultValue: "sedang",
      options: [
        { label: "Sedang — enak dibaca", value: "sedang" },
        { label: "Penuh", value: "penuh" },
      ],
    },
    {
      name: "rataTengah",
      type: "checkbox",
      label: "Rata tengah",
      defaultValue: false,
    },
  ],
};

/** Tiga kartu berwarna bertumpuk di atas hero beranda. */
export const ValueCardsBlock: Block = {
  slug: "valueCards",
  labels: { singular: "Kartu Nilai (3 warna)", plural: "Kartu Nilai" },
  imageURL: "/blok/valueCards.svg",
  imageAltText: "Tiga kartu berwarna berdampingan",
  fields: [
    {
      name: "tumpukDiAtasHero",
      type: "checkbox",
      label: "Tumpuk menaiki hero di atasnya",
      defaultValue: false,
      admin: {
        description:
          "Tampilan beranda: kartu naik menutupi bagian bawah hero. Hanya masuk akal bila blok ini tepat di bawah blok Hero.",
      },
    },
    {
      name: "cards",
      type: "array",
      label: "Kartu",
      minRows: 1,
      maxRows: 3,
      labels: { singular: "Kartu", plural: "Kartu" },
      admin: { components: judulBaris },
      fields: [
        { name: "title", type: "text", required: true, label: "Judul" },
        { name: "body", type: "textarea", required: true, label: "Isi" },
        {
          name: "tone",
          type: "select",
          required: true,
          defaultValue: "red",
          label: "Warna",
          options: [
            { label: "Merah", value: "red" },
            { label: "Biru tua", value: "navy" },
            { label: "Kuning", value: "yellow" },
          ],
        },
        ctaField(),
        {
          name: "links",
          type: "array",
          label: "Tautan tambahan",
          labels: { singular: "Tautan", plural: "Tautan" },
          admin: {
            components: judulBaris,
            description:
              "Dipakai bila kartu perlu beberapa tautan kecil alih-alih satu tombol.",
          },
          fields: [
            { name: "label", type: "text", label: "Teks" },
            { name: "href", type: "text", label: "Tautan" },
          ],
        },
      ],
    },
  ],
};

/** Baris angka statistik beranimasi. */
export const StatCounterBlock: Block = {
  slug: "statCounter",
  labels: { singular: "Baris Statistik", plural: "Baris Statistik" },
  imageURL: "/blok/statCounter.svg",
  imageAltText: "Deretan angka besar dengan keterangan di bawahnya",
  fields: [
    { name: "heading", type: "text", label: "Judul bagian" },
    statsArrayField(),
  ],
};

/** Banner ajakan bergambar. */
export const CTABannerBlock: Block = {
  slug: "ctaBanner",
  labels: { singular: "Banner Ajakan", plural: "Banner Ajakan" },
  imageURL: "/blok/ctaBanner.svg",
  imageAltText: "Panel lebar bergambar dengan judul dan satu tombol",
  fields: [
    { name: "title", type: "text", required: true, label: "Judul" },
    { name: "body", type: "textarea", label: "Isi" },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Gambar latar",
    },
    ctaField(),
  ],
};

/**
 * Linimasa tahun — bagian "Tumbuh Bersama Kami" di halaman Tentang.
 * Entri tampil berselang-seling kiri–kanan mengikuti urutannya.
 */
export const TimelineBlock: Block = {
  slug: "timeline",
  labels: { singular: "Linimasa (riwayat per tahun)", plural: "Linimasa" },
  imageURL: "/blok/timeline.svg",
  imageAltText: "Garis waktu menurun dengan tahun di kiri dan kanan",
  fields: [
    { name: "heading", type: "text", label: "Judul bagian" },
    {
      name: "entries",
      type: "array",
      label: "Entri",
      minRows: 1,
      labels: { singular: "Entri", plural: "Entri" },
      admin: {
        components: judulBaris,
        description:
          "Urutan di sini menentukan urutan dari atas ke bawah. Entri tampil berselang-seling kiri dan kanan secara otomatis.",
      },
      fields: [
        {
          name: "tahun",
          type: "text",
          required: true,
          label: "Tahun",
          admin: { description: "Mis. 2018" },
        },
        { name: "teks", type: "textarea", required: true, label: "Peristiwa" },
      ],
    },
  ],
};

/**
 * Kartu berisi serbaguna.
 *
 * Satu blok ini menggantikan tiga pola yang di situs lama ditulis terpisah:
 * kartu lembaga (PRPIC/BAJIK), kartu jenis kemitraan, dan kotak Visi–Misi.
 * Perbedaannya hanya warna, jumlah kolom, dan ada-tidaknya gambar — jadi
 * dijadikan satu blok agar staf tidak perlu menghafal tiga nama blok berbeda.
 */
export const FeatureCardsBlock: Block = {
  slug: "featureCards",
  labels: { singular: "Kartu Berisi", plural: "Kartu Berisi" },
  imageURL: "/blok/featureCards.svg",
  imageAltText: "Beberapa kartu berisi judul dan paragraf",
  fields: [
    { name: "heading", type: "text", label: "Judul bagian" },
    kolomField("2"),
    {
      name: "gambarSamping",
      type: "group",
      label: "Gambar besar di samping (opsional)",
      admin: {
        description:
          "Bila diisi, kartu-kartu bergeser ke kanan dan gambar ini mengisi kolom kiri. Dipakai halaman Mitra.",
      },
      fields: [
        {
          name: "gambar",
          type: "upload",
          relationTo: "media",
          label: "Gambar",
        },
        { name: "judul", type: "text", label: "Judul di atas gambar" },
        {
          name: "judulSorot",
          type: "text",
          label: "Bagian judul yang dikuningkan",
          admin: {
            description: "Ditempel di depan judul, mis. “Selalu Ada Ruang”.",
          },
        },
      ],
    },
    {
      name: "cards",
      type: "array",
      label: "Kartu",
      minRows: 1,
      labels: { singular: "Kartu", plural: "Kartu" },
      admin: { components: judulBaris },
      fields: [
        { name: "judul", type: "text", required: true, label: "Judul" },
        {
          name: "subjudul",
          type: "text",
          label: "Subjudul",
          admin: {
            description:
              "Baris kecil di bawah judul, mis. kepanjangan singkatan lembaga.",
          },
        },
        {
          name: "isi",
          type: "richText",
          label: "Isi",
          admin: {
            description:
              "Boleh memakai daftar bernomor — dipakai kotak Misi di halaman Tentang.",
          },
        },
        {
          name: "gambar",
          type: "upload",
          relationTo: "media",
          label: "Gambar kartu",
          admin: { description: "Opsional. Tampil di atas judul." },
        },
        {
          name: "warna",
          type: "select",
          label: "Warna kartu",
          defaultValue: "putih",
          options: warnaOptions,
        },
        ctaField(),
      ],
    },
  ],
};

/**
 * Kotak sorot berwarna.
 *
 * Menggantikan tiga kotak khusus di situs lama: "Program Intensif" (biru tua),
 * "Rangkaian produk pilihan" (kuning, dengan deretan gambar), dan blok penutup
 * berisi ajakan.
 */
export const CalloutBlock: Block = {
  slug: "callout",
  labels: { singular: "Kotak Sorot", plural: "Kotak Sorot" },
  imageURL: "/blok/callout.svg",
  imageAltText: "Satu kotak berwarna berisi judul, paragraf, dan tombol",
  fields: [
    { name: "judul", type: "text", required: true, label: "Judul" },
    { name: "isi", type: "textarea", label: "Isi" },
    {
      name: "warna",
      type: "select",
      label: "Warna kotak",
      defaultValue: "navy",
      options: warnaOptions,
    },
    {
      name: "rataTengah",
      type: "checkbox",
      label: "Rata tengah",
      defaultValue: false,
    },
    {
      name: "gambar",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      label: "Deretan gambar (opsional)",
      admin: {
        description:
          "Tampil sebagai kotak-kotak persegi di bawah teks. Dipakai bagian “Rangkaian produk pilihan”.",
      },
    },
    ctaField(),
    {
      name: "tautanTambahan",
      type: "array",
      label: "Tautan kecil di bawah (opsional)",
      labels: { singular: "Tautan", plural: "Tautan" },
      admin: {
        components: judulBaris,
        description:
          "Tampil sebagai pil putih berjajar, mis. “Shopee” dan “Tokopedia”.",
      },
      fields: [
        { name: "awalan", type: "text", label: "Teks pembuka", admin: { description: "Mis. “Temukan Kami:”. Cukup diisi pada tautan pertama." } },
        { name: "label", type: "text", required: true, label: "Teks" },
        { name: "href", type: "text", label: "Tautan" },
      ],
    },
  ],
};
