import type { CollectionConfig } from "payload";

/**
 * Data masuk dari formulir "Hubungi Kami" di situs publik.
 *
 * Publik boleh membuat (submit form), tapi hanya staf yang login yang boleh
 * membaca/mengubah/menghapus — ini bukan konten yang tampil di halaman jadi
 * tidak perlu hook revalidate.
 */
export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "subject", "createdAt"],
    group: "Pengaturan",
    description: "Pesan yang masuk lewat formulir Hubungi Kami di situs.",
  },
  labels: { singular: "Pesan Masuk", plural: "Pesan Masuk" },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text", required: true, label: "Nama" },
    { name: "email", type: "email", required: true, label: "Email" },
    { name: "phone", type: "text", label: "Telepon" },
    { name: "subject", type: "text", label: "Subjek" },
    { name: "message", type: "textarea", label: "Pesan" },
    {
      name: "locale",
      type: "select",
      label: "Bahasa formulir",
      options: [
        { label: "Indonesia", value: "id" },
        { label: "English", value: "en" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "status",
      type: "select",
      label: "Status",
      defaultValue: "baru",
      options: [
        { label: "Baru", value: "baru" },
        { label: "Sudah ditindaklanjuti", value: "ditindaklanjuti" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};
