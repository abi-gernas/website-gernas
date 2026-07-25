import type { CollectionConfig } from "payload";

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
    // Ukuran turunan agar halaman tetap ringan (paritas next/image).
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768, height: 512, position: "centre" },
      { name: "hero", width: 1920, height: 1080, position: "centre" },
    ],
    mimeTypes: ["image/*", "application/pdf"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Teks alternatif (alt)",
      admin: {
        description:
          "Deskripsi singkat gambar untuk pembaca layar & SEO. Kosongkan bila gambar murni dekoratif.",
      },
    },
    {
      name: "caption",
      type: "text",
      label: "Keterangan",
    },
  ],
};
