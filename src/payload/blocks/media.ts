import type { Block } from "payload";
import { judulBaris } from "../fields/rowLabel";
import { anchorField, ctaField, kolomField, statsArrayField } from "./shared";

/** Galeri foto susunan batu bata (masonry). */
export const GalleryBlock: Block = {
  slug: "gallery",
  labels: { singular: "Galeri Foto", plural: "Galeri Foto" },
  imageURL: "/blok/gallery.svg",
  imageAltText: "Susunan foto rapat dengan tinggi berbeda-beda",
  fields: [
    { name: "heading", type: "text", label: "Judul bagian" },
    {
      name: "images",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      required: true,
      label: "Foto",
      admin: {
        description:
          "Foto boleh beda ukuran — tingginya menyesuaikan sendiri. Seret untuk mengubah urutan.",
      },
    },
    kolomField("4"),
  ],
};

/** Kutipan tokoh yang bergantian. */
export const TestimonialsBlock: Block = {
  slug: "testimonials",
  labels: { singular: "Kata Mereka (kutipan)", plural: "Kata Mereka" },
  imageURL: "/blok/testimonials.svg",
  imageAltText: "Kutipan besar dengan foto dan nama narasumber",
  fields: [
    { name: "heading", type: "text", label: "Judul bagian" },
    {
      name: "items",
      type: "array",
      label: "Kutipan",
      minRows: 1,
      labels: { singular: "Kutipan", plural: "Kutipan" },
      admin: {
        components: judulBaris,
        description:
          "Warna latar tiap kutipan berganti kuning–biru–merah otomatis mengikuti urutan.",
      },
      fields: [
        { name: "kutipan", type: "textarea", required: true, label: "Kutipan" },
        { name: "nama", type: "text", required: true, label: "Nama" },
        {
          name: "peran",
          type: "text",
          label: "Jabatan / asal",
          admin: { description: "Mis. “Guru SDN 10 Lahat”." },
        },
        {
          name: "foto",
          type: "upload",
          relationTo: "media",
          label: "Foto",
        },
      ],
    },
  ],
};

/** Peta sebaran + angka statistik. */
export const IndonesiaMapBlock: Block = {
  slug: "indonesiaMap",
  labels: { singular: "Peta Indonesia + Statistik", plural: "Peta Indonesia" },
  imageURL: "/blok/indonesiaMap.svg",
  imageAltText: "Peta Indonesia dengan deretan angka di bawahnya",
  fields: [
    { name: "heading", type: "text", label: "Judul bagian" },
    {
      name: "tampilkanPeta",
      type: "checkbox",
      label: "Tampilkan peta",
      defaultValue: true,
      admin: {
        description:
          "Peta sebaran provinsi sudah tertanam di situs dan tidak disunting dari sini.",
      },
    },
    statsArrayField(),
  ],
};

/** Formulir hubungi kami. */
export const ContactFormBlock: Block = {
  slug: "contactForm",
  labels: { singular: "Formulir Kontak", plural: "Formulir Kontak" },
  imageURL: "/blok/contactForm.svg",
  imageAltText: "Formulir isian nama, surel, dan pesan",
  fields: [
    {
      name: "heading",
      type: "text",
      label: "Judul bagian",
      admin: {
        description:
          "Isian formulirnya tetap (nama, surel, pesan) dan tidak diubah dari sini.",
      },
    },
    anchorField("/mitra#hubungi"),
  ],
};

/**
 * Kartu ide pembelajaran — halaman Tumbuh Bersama.
 *
 * Sengaja dibiarkan kosong saat migrasi: isi di situs lama masih data contoh
 * (dua judul yang diulang empat kali), bukan konten sungguhan.
 */
export const IdeaCardsBlock: Block = {
  slug: "ideaCards",
  labels: { singular: "Kartu Ide Pembelajaran", plural: "Kartu Ide Pembelajaran" },
  imageURL: "/blok/ideaCards.svg",
  imageAltText: "Kartu tegak bergambar dengan label kelas dan topik",
  fields: [
    { name: "heading", type: "text", label: "Judul bagian" },
    {
      name: "items",
      type: "array",
      label: "Ide",
      labels: { singular: "Ide", plural: "Ide" },
      admin: { components: judulBaris },
      fields: [
        { name: "judul", type: "text", required: true, label: "Judul ide" },
        {
          name: "kelas",
          type: "text",
          label: "Label kelas",
          admin: { description: "Mis. “Kelas 1”. Tampil sebagai label kuning." },
        },
        {
          name: "topik",
          type: "text",
          label: "Label topik",
          admin: { description: "Mis. “Bilangan” atau “Fonik”. Tampil sebagai label merah." },
        },
        {
          name: "gambar",
          type: "upload",
          relationTo: "media",
          required: true,
          label: "Gambar",
        },
        { name: "href", type: "text", label: "Tautan (opsional)" },
      ],
    },
    kolomField("4"),
  ],
};

/**
 * Kampanye donasi dengan bilah kemajuan.
 *
 * Juga dibiarkan kosong saat migrasi — angka terkumpul di situs lama adalah
 * contoh desain, dan menayangkan angka donasi yang tidak nyata bukan hal yang
 * boleh diputuskan sepihak.
 */
export const DonationCampaignsBlock: Block = {
  slug: "donationCampaigns",
  labels: { singular: "Kampanye Donasi", plural: "Kampanye Donasi" },
  imageURL: "/blok/donationCampaigns.svg",
  imageAltText: "Kartu kampanye dengan bilah kemajuan dana",
  fields: [
    { name: "heading", type: "text", label: "Judul bagian" },
    {
      name: "items",
      type: "array",
      label: "Kampanye",
      labels: { singular: "Kampanye", plural: "Kampanye" },
      admin: { components: judulBaris },
      fields: [
        { name: "judul", type: "text", required: true, label: "Nama kampanye" },
        {
          name: "gambar",
          type: "upload",
          relationTo: "media",
          required: true,
          label: "Gambar",
        },
        {
          name: "terkumpul",
          type: "number",
          required: true,
          label: "Dana terkumpul (Rp)",
          admin: { description: "Angka saja, tanpa titik. Mis. 270000000" },
        },
        {
          name: "target",
          type: "number",
          required: true,
          label: "Target dana (Rp)",
          min: 1,
        },
        ctaField("cta", "Tombol donasi"),
      ],
    },
    kolomField("3"),
  ],
};

/** Pengantar donasi + pilihan nominal. */
export const DonationTiersBlock: Block = {
  slug: "donationTiers",
  labels: { singular: "Pilihan Nominal Donasi", plural: "Pilihan Nominal Donasi" },
  imageURL: "/blok/donationTiers.svg",
  imageAltText: "Teks pengantar di samping deretan tombol nominal",
  fields: [
    { name: "judul", type: "text", required: true, label: "Judul" },
    {
      name: "judulSorot",
      type: "text",
      label: "Bagian judul yang dimerahkan",
      admin: { description: "Ditempel di akhir judul, mis. “Bernalar”." },
    },
    { name: "isi", type: "textarea", label: "Paragraf pengantar" },
  ],
};
