import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "title",
    group: "Konten",
  },
  labels: { singular: "Kategori", plural: "Kategori" },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    { name: "title", type: "text", required: true, label: "Nama kategori" },
    ...slugField(),
  ],
};
