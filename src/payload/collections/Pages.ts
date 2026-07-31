import type { CollectionConfig } from "payload";
import { pageBlocks } from "../blocks";
import { slugField } from "../fields/slug";
import { revalidatePage, revalidatePageAfterDelete } from "../hooks/revalidate";
import { previewURL } from "../utils/preview";

/**
 * Halaman publik yang disusun staf dari Blocks — inti dari US-002:
 * "menyusun/menyunting halaman memakai Blocks tanpa menulis kode".
 */
export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    group: "Konten",
    description:
      "Halaman situs yang disusun dari blok. Seret blok untuk mengubah urutannya, lalu pakai Pratinjau untuk melihat hasilnya sebelum diterbitkan.",
    // Jendela pratinjau berdampingan yang ikut berubah tiap kali disimpan.
    livePreview: {
      url: ({ data }) => previewURL({ collection: "pages", slug: data?.slug }),
    },
    // Tombol "Pratinjau" — membuka halaman draf di tab baru, ukuran penuh.
    preview: (doc) => previewURL({ collection: "pages", slug: doc?.slug }),
  },
  labels: { singular: "Halaman", plural: "Halaman" },
  versions: {
    drafts: true, // staf bisa menyimpan draf sebelum menerbitkan
  },
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidatePageAfterDelete],
  },
  access: {
    // Publik hanya melihat yang sudah terbit; staf melihat semuanya.
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  /**
   * Tab wajib menjadi field pertama: plugin SEO menambahkan tab "SEO" di
   * belakang tabs yang sudah ada bila menemukannya di indeks 0, dan membuat
   * tab "Content" berbahasa Inggris sendiri bila tidak. Field bilah sisi
   * (slug) sengaja dibiarkan di luar tab agar tetap tampil di semua tab.
   */
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Konten",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              localized: true,
              label: "Judul halaman",
            },
            {
              name: "layout",
              type: "blocks",
              label: "Susunan halaman",
              // Tanpa ini tombolnya berbunyi "Tambah Layout" (memakai nama field).
              labels: { singular: "Blok", plural: "Blok" },
              blocks: pageBlocks,
              admin: {
                description:
                  "Tambahkan blok sesuai urutan tampilan dari atas ke bawah. Seret untuk mengubah urutan.",
              },
            },
          ],
        },
      ],
    },
    ...slugField(),
  ],
};
