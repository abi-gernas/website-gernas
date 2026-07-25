import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";

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
  },
  labels: { singular: "Artikel", plural: "Artikel" },
  versions: {
    drafts: true,
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
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Judul",
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
};
