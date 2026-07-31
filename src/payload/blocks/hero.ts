import type { Block } from "payload";
import { judulBaris } from "../fields/rowLabel";
import { ctaField } from "./shared";

/** Hero carousel beranda — komponen <HeroCarousel slides={…} /> */
export const HeroBlock: Block = {
  slug: "hero",
  labels: { singular: "Hero Beranda (bergambar bergantian)", plural: "Hero Beranda" },
  imageURL: "/blok/hero.svg",
  imageAltText: "Gambar besar sepenuh layar dengan slide yang bergantian",
  fields: [
    {
      name: "slides",
      type: "array",
      label: "Slide",
      minRows: 1,
      labels: { singular: "Slide", plural: "Slide" },
      admin: {
        components: judulBaris,
        description:
          "Setiap slide tampil bergantian otomatis. Untuk satu gambar diam, cukup isi satu slide.",
      },
      fields: [
        { name: "title", type: "text", required: true, localized: true, label: "Judul" },
        {
          name: "highlight",
          type: "text",
          localized: true,
          label: "Teks disorot (kuning)",
          admin: {
            description:
              "Bagian akhir judul yang diberi warna kuning, mis. “Bermakna dan Bernalar”. Ditempel setelah judul, jangan diketik ulang di kolom Judul.",
          },
        },
        { name: "description", type: "textarea", localized: true, label: "Deskripsi" },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
          label: "Gambar latar",
          admin: {
            description: "Gambar melintang beresolusi tinggi, minimal 1920 piksel.",
          },
        },
        ctaField(),
      ],
    },
  ],
};

/** Hero statis halaman dalam — komponen <PageHero /> */
export const PageHeroBlock: Block = {
  slug: "pageHero",
  labels: { singular: "Hero Halaman (judul di atas gambar)", plural: "Hero Halaman" },
  imageURL: "/blok/pageHero.svg",
  imageAltText: "Panel judul halaman di atas satu gambar latar",
  fields: [
    { name: "title", type: "text", required: true, localized: true, label: "Judul" },
    { name: "description", type: "textarea", localized: true, label: "Deskripsi" },
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
        { label: "Biru tua", value: "navy" },
        { label: "Gelap", value: "dark" },
      ],
      admin: {
        description:
          "Lapisan warna di atas gambar agar teks tetap terbaca. Pilih Gelap bila gambarnya terang.",
      },
    },
    {
      name: "garisBawah",
      type: "checkbox",
      label: "Garis kuning di bawah hero",
      defaultValue: false,
    },
  ],
};
