import type { CollectionConfig } from "payload";
import { terapkanReferensiLokal } from "../fields/localeReference";

/** Konversi WebP dipakai untuk berkas induk maupun tiap ukuran turunan. */
const webp = { format: "webp" as const, options: { quality: 82 } };

/**
 * Pustaka media. Menampung 111 aset hasil migrasi WordPress (public/media)
 * plus unggahan baru dari staf.
 */
export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Konten",
  },
  labels: {
    singular: "Media",
    plural: "Media",
  },
  access: {
    read: () => true, // aset publik
  },
  upload: {
    /**
     * Semua gambar dikonversi ke WebP. Sumber migrasi WordPress didominasi PNG
     * (71 berkas / 24 MB) yang boros untuk foto — WebP memangkasnya drastis dan
     * mempercepat waktu muat halaman. PDF tidak tersentuh (bukan gambar).
     */
    formatOptions: webp,
    /**
     * Ukuran turunan agar halaman tetap ringan (paritas next/image).
     * `formatOptions` harus diulang per ukuran — pengaturan di tingkat upload
     * tidak menurun ke sini, sehingga tanpa ini turunannya tetap PNG/JPG.
     */
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre", formatOptions: webp },
      { name: "card", width: 768, height: 512, position: "centre", formatOptions: webp },
      { name: "hero", width: 1920, height: 1080, position: "centre", formatOptions: webp },
    ],
    mimeTypes: ["image/*", "application/pdf"],
  },
  fields: terapkanReferensiLokal([
    {
      name: "alt",
      type: "text",
      localized: true,
      label: "Teks alternatif (alt)",
      admin: {
        description:
          "Deskripsi singkat gambar untuk pembaca layar & SEO. Kosongkan bila gambar murni dekoratif.",
      },
    },
    {
      name: "caption",
      type: "text",
      localized: true,
      label: "Keterangan",
    },
    {
      name: "legacyPath",
      type: "text",
      unique: true,
      index: true,
      label: "Path asal (migrasi)",
      admin: {
        readOnly: true,
        position: "sidebar",
        description:
          "Lokasi berkas ini di situs WordPress lama. Dipakai untuk memetakan gambar ke artikel saat migrasi, dan sebagai penanda agar impor tidak terduplikasi. Kosong untuk unggahan baru.",
      },
    },
  ]),
};
