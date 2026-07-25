import type { CollectionConfig } from "payload";

/**
 * Staf pengelola konten. Auth bawaan Payload (email + password) sesuai
 * PRD Backoffice §6.1 / OI-004 — SSO/MFA belum diwajibkan di Fase 1.
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "name",
    group: "Pengaturan",
  },
  labels: {
    singular: "Pengguna",
    plural: "Pengguna",
  },
  access: {
    // Hanya staf yang sudah login yang dapat mengelola akun.
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nama",
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      label: "Peran",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      admin: {
        description:
          "Admin dapat mengelola pengguna lain. Editor hanya mengelola konten.",
      },
    },
  ],
};
