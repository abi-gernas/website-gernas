import type { Block, Field } from "payload";

/**
 * Payload Blocks — memetakan 1:1 komponen Design System v2.0 di src/components.
 * Field di sini sengaja mengikuti bentuk props komponen yang sudah ada agar
 * <RenderBlocks> bisa meneruskannya tanpa transformasi berarti.
 *
 * CATATAN (OI-007): struktur props final belum disepakati di sesi teknis
 * Design System v2.0 Bagian 2. Blok di bawah adalah turunan langsung dari
 * implementasi front-end Sprint 1 — perlu ditinjau saat OI-007 ditutup.
 */

/** CTA dipakai berulang di beberapa blok (Hero, ValueCards, CTABanner). */
const ctaField = (name = "cta", label = "Tombol CTA"): Field => ({
  name,
  type: "group",
  label,
  fields: [
    { name: "label", type: "text", label: "Teks tombol" },
    {
      name: "href",
      type: "text",
      label: "Tautan",
      admin: { description: "Contoh: /tumbuh-bersama atau https://…" },
    },
  ],
});

/** Hero carousel beranda — komponen <Hero slides={…} /> */
export const HeroBlock: Block = {
  slug: "hero",
  labels: { singular: "Hero (Beranda)", plural: "Hero (Beranda)" },
  imageAltText: "Hero bergambar dengan slide bergantian",
  fields: [
    {
      name: "slides",
      type: "array",
      label: "Slide",
      minRows: 1,
      labels: { singular: "Slide", plural: "Slide" },
      fields: [
        { name: "title", type: "text", required: true, label: "Judul" },
        {
          name: "highlight",
          type: "text",
          label: "Teks disorot (kuning)",
          admin: {
            description:
              "Bagian akhir judul yang diberi warna kuning, mis. “Bermakna dan Bernalar”.",
          },
        },
        { name: "description", type: "textarea", label: "Deskripsi" },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
          label: "Gambar latar",
        },
        ctaField(),
      ],
    },
  ],
};

/** Hero statis halaman dalam — komponen <PageHero /> */
export const PageHeroBlock: Block = {
  slug: "pageHero",
  labels: { singular: "Hero Halaman", plural: "Hero Halaman" },
  fields: [
    { name: "title", type: "text", required: true, label: "Judul" },
    { name: "description", type: "textarea", label: "Deskripsi" },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Gambar latar",
    },
    {
      name: "tint",
      type: "select",
      defaultValue: "navy",
      label: "Warna overlay",
      options: [
        { label: "Navy", value: "navy" },
        { label: "Gelap", value: "dark" },
      ],
    },
  ],
};

/** Baris angka statistik beranimasi — komponen <StatCounterRow stats={…} /> */
export const StatCounterBlock: Block = {
  slug: "statCounter",
  labels: { singular: "Baris Statistik", plural: "Baris Statistik" },
  fields: [
    {
      name: "stats",
      type: "array",
      label: "Statistik",
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: "value",
          type: "number",
          required: true,
          label: "Angka",
          admin: { description: "Angka saja, tanpa titik/koma. Mis. 1250" },
        },
        {
          name: "suffix",
          type: "text",
          label: "Akhiran",
          admin: { description: "Mis. “+” atau “ribu”" },
        },
        { name: "label", type: "text", required: true, label: "Keterangan" },
      ],
    },
  ],
};

/** Tiga kartu berwarna — komponen <ValueCards cards={…} /> */
export const ValueCardsBlock: Block = {
  slug: "valueCards",
  labels: { singular: "Kartu Nilai", plural: "Kartu Nilai" },
  fields: [
    {
      name: "cards",
      type: "array",
      label: "Kartu",
      minRows: 1,
      maxRows: 3,
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
            { label: "Biru", value: "navy" },
            { label: "Kuning", value: "yellow" },
          ],
        },
        ctaField(),
        {
          name: "links",
          type: "array",
          label: "Tautan tambahan",
          fields: [
            { name: "label", type: "text", label: "Teks" },
            { name: "href", type: "text", label: "Tautan" },
          ],
        },
      ],
    },
  ],
};

/** Banner ajakan — komponen <CTABanner /> */
export const CTABannerBlock: Block = {
  slug: "ctaBanner",
  labels: { singular: "Banner CTA", plural: "Banner CTA" },
  fields: [
    { name: "title", type: "text", required: true, label: "Judul" },
    { name: "body", type: "textarea", label: "Isi" },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Gambar latar",
    },
    ctaField("cta", "Tombol"),
  ],
};

/** Daftar berita terbaru — komponen <NewsCard /> dalam grid */
export const LatestNewsBlock: Block = {
  slug: "latestNews",
  labels: { singular: "Berita Terbaru", plural: "Berita Terbaru" },
  fields: [
    { name: "heading", type: "text", label: "Judul bagian" },
    {
      name: "limit",
      type: "number",
      defaultValue: 3,
      label: "Jumlah artikel",
      min: 1,
      max: 12,
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      label: "Batasi ke kategori",
      admin: { description: "Kosongkan untuk menampilkan semua kategori." },
    },
  ],
};

/** Blok teks bebas (rich text) untuk isi halaman yang tidak berpola. */
export const RichTextBlock: Block = {
  slug: "richText",
  labels: { singular: "Teks", plural: "Teks" },
  fields: [
    { name: "heading", type: "text", label: "Judul bagian" },
    { name: "content", type: "richText", label: "Isi" },
  ],
};

/** Semua blok yang tersedia untuk field `layout` di koleksi Pages. */
export const pageBlocks: Block[] = [
  HeroBlock,
  PageHeroBlock,
  StatCounterBlock,
  ValueCardsBlock,
  CTABannerBlock,
  LatestNewsBlock,
  RichTextBlock,
];
