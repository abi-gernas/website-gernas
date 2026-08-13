import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";
import { terapkanReferensiLokal } from "../fields/localeReference";
import { slugField } from "../fields/slug";
import { revalidateArticle, revalidateArticleAfterDelete } from "../hooks/revalidate";
import { previewURL } from "../utils/preview";

/** Saat artikel baru dibuat tanpa penulis dipilih, pakai akun yang sedang login. */
const isiPenulisDefault: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  if (operation === "create" && !data.authorRef && !data.authorNama && req.user) {
    data.authorRef = { relationTo: "users", value: req.user.id };
  }
  return data;
};

/**
 * Artikel berita/publikasi — US-003: staf membuat & menerbitkan artikel
 * (judul, isi, gambar, kategori, tanggal) yang tampil di listing Publikasi.
 */
export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "_status"],
    group: "Konten",
    description:
      "Berita dan kabar terbaru. Tampil di halaman Publikasi dan pada blok “Berita Terbaru” di halaman mana pun yang memakainya.",
    livePreview: {
      url: ({ data }) => previewURL({ collection: "articles", slug: data?.slug }),
    },
    preview: (doc) => previewURL({ collection: "articles", slug: doc?.slug }),
  },
  labels: { singular: "Artikel", plural: "Artikel" },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeChange: [isiPenulisDefault],
    afterChange: [revalidateArticle],
    afterDelete: [revalidateArticleAfterDelete],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  /** Sama seperti koleksi Halaman: tabs harus di indeks 0, lihat Pages.ts. */
  fields: terapkanReferensiLokal([
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
              label: "Judul",
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              label: "Gambar sampul",
            },
            {
              name: "excerpt",
              type: "textarea",
              label: "Ringkasan",
              admin: {
                description:
                  "Cuplikan singkat di kartu berita. Bila kosong, diambil dari paragraf pertama.",
              },
            },
            {
              name: "content",
              type: "richText",
              required: true,
              label: "Isi artikel",
            },
          ],
        },
      ],
    },
    ...slugField(),
    {
      name: "publishedAt",
      type: "date",
      required: true,
      label: "Tanggal terbit",
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayOnly", displayFormat: "d MMMM yyyy" },
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      label: "Kategori",
      admin: { position: "sidebar" },
    },
    {
      name: "authorRef",
      type: "relationship",
      relationTo: ["users", "penggerak"],
      label: "Penulis (akun/penggerak)",
      admin: {
        position: "sidebar",
        description:
          "Kosongkan agar otomatis terisi akun yang membuat artikel ini. Bisa juga pilih penggerak sebagai penulis.",
      },
    },
    {
      name: "authorNama",
      type: "text",
      label: "Nama penulis (isi manual, opsional)",
      admin: {
        position: "sidebar",
        description: "Isi untuk menimpa nama penulis di atas dengan nama bebas.",
      },
    },
    {
      name: "editorRef",
      type: "relationship",
      relationTo: ["users", "penggerak"],
      label: "Editor (akun/penggerak)",
      admin: { position: "sidebar" },
    },
    {
      name: "editorNama",
      type: "text",
      label: "Nama editor (isi manual, opsional)",
      admin: {
        position: "sidebar",
        description: "Isi untuk menimpa nama editor di atas, atau isi langsung bila editor bukan akun/penggerak terdaftar.",
      },
    },
  ]),
};
