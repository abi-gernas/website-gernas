import type { CollectionConfig } from "payload";

/**
 * Pendataan pengunjung yang membuka materi gratis di Library (PRD Fase 2 v1.2
 * FR-104), diisi oleh server action `bukaMateri()`. Dulu satu koleksi dengan
 * pesan Hubungi Kami (`leads`), dipisah 19 Nov 2026 atas masukan staf yang
 * kesulitan membedakan keduanya.
 *
 * `create` ditutup untuk publik: satu-satunya penulis adalah server action
 * lewat Local API (yang melewati access control), jadi REST
 * `/api/unduhan-materi` tidak perlu terbuka.
 *
 * CATATAN KEPATUHAN (belum ada tindak lanjut, carry-over dari keputusan
 * 25 Jul 2026 & PRD Fase 2 v1.2 OI-107): `asalInstansi` dan `kontak` adalah
 * data pribadi guru. Kebijakan retensi, siapa yang boleh lihat/ekspor, dan
 * dasar hukum pengumpulannya masih belum diputuskan.
 */
export const UnduhanMateri: CollectionConfig = {
  slug: "unduhan-materi",
  admin: {
    useAsTitle: "nama",
    defaultColumns: ["nama", "asalInstansi", "produkRef", "kontak", "createdAt"],
    group: "Data Situs",
    description: "Data pengunjung yang mengisi formulir sebelum mengunduh materi gratis di Library.",
  },
  labels: { singular: "Unduhan Materi", plural: "Unduhan Materi" },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "nama", type: "text", required: true, label: "Nama" },
    { name: "asalInstansi", type: "text", required: true, label: "Asal instansi/sekolah/daerah" },
    {
      name: "produkRef",
      type: "relationship",
      relationTo: "produk",
      label: "Materi yang diunduh",
    },
    {
      name: "kontak",
      type: "text",
      label: "Kontak (email/telepon)",
      admin: { description: "Opsional di formulir, disimpan apa adanya seperti yang diketik pengunjung." },
    },
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
  ],
};
