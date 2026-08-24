import type { CollectionConfig } from "payload";

/**
 * Data masuk dari formulir "Hubungi Kami" **dan** formulir gated-download
 * materi gratis di Library (PRD Fase 2 v1.2 FR-104) — disatukan di sini,
 * bukan koleksi baru, supaya staf cukup buka satu tempat untuk semua data
 * pengunjung yang masuk.
 *
 * Publik boleh membuat (submit form), tapi hanya staf yang login yang boleh
 * membaca/mengubah/menghapus — ini bukan konten yang tampil di halaman jadi
 * tidak perlu hook revalidate.
 *
 * CATATAN KEPATUHAN (belum ada tindak lanjut — carry-over dari keputusan
 * 25 Jul 2026 & PRD Fase 2 v1.2 OI-107): `asalInstansi` berisi data pribadi
 * guru. Kebijakan retensi, siapa yang boleh lihat/ekspor, dan dasar hukum
 * pengumpulannya masih belum diputuskan — item adendum SPK, jangan dianggap
 * selesai cuma karena field-nya sudah ada.
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
    {
      name: "jenis",
      type: "select",
      required: true,
      defaultValue: "kontak",
      label: "Jenis",
      options: [
        { label: "Hubungi Kami", value: "kontak" },
        { label: "Unduhan Materi", value: "unduhan-materi" },
      ],
      admin: {
        position: "sidebar",
        description: "Menentukan formulir asal: Hubungi Kami atau gated-download Library.",
      },
    },
    { name: "name", type: "text", required: true, label: "Nama" },
    { name: "email", type: "email", required: true, label: "Email" },
    { name: "phone", type: "text", label: "Telepon" },
    {
      name: "asalInstansi",
      type: "text",
      label: "Asal instansi/sekolah/daerah",
      admin: {
        condition: (_data, siblingData) => siblingData?.jenis === "unduhan-materi",
      },
    },
    {
      name: "produkRef",
      type: "relationship",
      relationTo: "produk",
      label: "Materi yang diunduh",
      admin: {
        condition: (_data, siblingData) => siblingData?.jenis === "unduhan-materi",
      },
    },
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
