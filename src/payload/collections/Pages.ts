import type { CollectionConfig } from "payload";
import { pageBlocks } from "../blocks";
import { slugField } from "../fields/slug";
import { revalidatePage, revalidatePageAfterDelete } from "../hooks/revalidate";

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
    livePreview: {
      url: ({ data }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL ?? ""}/${data?.slug ?? ""}`,
    },
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
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Judul halaman",
    },
    ...slugField(),
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
};
