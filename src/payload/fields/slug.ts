import type { Field } from "payload";

/** Ubah judul menjadi slug URL yang aman. */
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Field slug dengan pengisian otomatis dari field sumber (default: title).
 * Staf tetap bisa menimpanya secara manual — penting untuk menjaga URL lama
 * tetap sama demi paritas SEO (FR-007).
 */
export const slugField = (sourceField = "title"): Field[] => [
  {
    name: "slug",
    type: "text",
    required: true,
    unique: true,
    index: true,
    label: "Slug URL",
    admin: {
      position: "sidebar",
      description:
        "Bagian akhir alamat halaman. Dibuat otomatis dari judul — ubah hanya bila perlu menyamakan dengan URL lama.",
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (typeof value === "string" && value.length > 0) {
            return slugify(value);
          }
          const source = data?.[sourceField];
          return typeof source === "string" ? slugify(source) : value;
        },
      ],
    },
  },
];
