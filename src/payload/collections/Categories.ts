import type { CollectionConfig } from "payload";
import { terapkanReferensiLokal } from "../fields/localeReference";
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
  fields: terapkanReferensiLokal([
    { name: "title", type: "text", required: true, localized: true, label: "Nama kategori" },
    ...slugField(),
  ]),
};
