import type { CollectionConfig, Payload } from "payload";
import { terapkanReferensiLokal } from "../fields/localeReference";
import { judulBaris } from "../fields/rowLabel";
import { slugField } from "../fields/slug";
import { urutanField } from "../fields/urutan";
import { revalidateSemua, revalidateSemuaAfterDelete } from "../hooks/revalidate";

/** Alat peraga cuma dipamerkan (tanpa harga/unduhan), jadi field jual-unduh disembunyikan di dasbor. */
const bukanAlatPeraga = (data: Partial<{ kategoriProduk: string }> | undefined) =>
  data?.kategoriProduk !== "alat-peraga";

/** Id dari nilai relationship, entah masih berupa id atau sudah terisi objeknya. */
const idRelasi = (v: unknown): number | string | undefined => {
  if (v && typeof v === "object" && "id" in v) return (v as { id: number | string }).id;
  return typeof v === "number" || typeof v === "string" ? v : undefined;
};

const alatPeraga = (data: Partial<{ kategoriProduk: string }> | undefined) =>
  data?.kategoriProduk === "alat-peraga";

/**
 * Katalog "Buku, Bahan Ajar & Modul" — PRD Fase 2 v1.2 FR-109/FR-110.
 *
 * `format` sengaja hasMany (bukan satu nilai tunggal): mockup memperlihatkan
 * satu produk bisa dicentang tersedia sbg "Versi Cetak" maupun "PDF & Panduan
 * Guru" sekaligus. Menyimpannya sbg satu harga+status per dokumen adalah
 * penyederhanaan sengaja — kalau nanti tiap format ternyata butuh harga
 * berbeda sendiri-sendiri, field ini perlu naik jadi array varian. Jangan
 * naikkan itu sebelum benar-benar dibutuhkan (checkout FR-110 sendiri masih
 * OI-105, belum diputuskan).
 *
 * `tautanDrive` menunggu OI-108 (OAuth Google Drive belum dibuat) — field
 * ini aman diisi manual (link folder/berkas "siapa saja yang punya tautan")
 * sebagai jalan pintas sementara sebelum integrasi OAuth resmi ada.
 *
 * Sejak 7 Sep 2026 isi koleksi ini tidak lagi diketik manual: 79 dokumen
 * pertamanya dihasilkan `npm run seed:produk-drive` dari folder Drive
 * "Konten" milik gernastastaka.online@gmail.com. `judul`, `slug`, `topik`,
 * `cover`, `tautanDrive`, dan `urutan` ditimpa ulang tiap kali skrip itu
 * jalan; field lain (jenjang, kategori, ringkasan, harga, dst.) aman disunting
 * lewat dasbor. Lihat docs/RENCANA-INTEGRASI-DRIVE.md.
 */
export const Produk: CollectionConfig = {
  slug: "produk",
  admin: {
    useAsTitle: "judul",
    defaultColumns: ["judul", "kategoriProduk", "status", "harga", "urutan"],
    group: "Data Situs",
    description:
      "Katalog Buku, Bahan Ajar & Modul, termasuk Alat Peraga (Jenis materi = Alat Peraga, tanpa unduhan). Materi gratis diunduh lewat tautan Google Drive (perlu form isi data pengunjung dulu — lihat koleksi Pesan Masuk); materi berbayar masih menunggu keputusan mekanisme pembayaran (lihat PRD Fase 2 v1.2, OI-105).",
  },
  labels: { singular: "Produk", plural: "Produk (Buku/Bahan Ajar/Modul/Alat Peraga)" },
  hooks: {
    afterChange: [revalidateSemua],
    afterDelete: [revalidateSemuaAfterDelete],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: terapkanReferensiLokal([
    {
      name: "judul",
      type: "text",
      required: true,
      localized: true,
      label: "Judul produk",
    },
    ...slugField("judul"),
    {
      name: "kategoriProduk",
      type: "select",
      required: true,
      label: "Jenis materi",
      defaultValue: "modul",
      options: [
        { label: "Modul", value: "modul" },
        { label: "Buku", value: "buku" },
        { label: "Bahan Ajar", value: "bahan-ajar" },
        { label: "LKS/Worksheet", value: "lks" },
        { label: "Alat Peraga", value: "alat-peraga" },
      ],
      admin: {
        position: "sidebar",
        description:
          "Bentuk materinya. Alat Peraga = benda fisik yang cuma dipamerkan: harga, format, dan tautan unduhan disembunyikan. Tidak dipakai kartu di halaman katalog — kartu itu memakai Kategori → Topik di bawah.",
      },
    },
    {
      name: "kategori",
      type: "relationship",
      relationTo: "kategori-produk",
      required: true,
      label: "Kategori",
      admin: {
        position: "sidebar",
        description:
          "Mis. Matematika atau Membaca. Tekan “+” di samping kolom ini untuk menambah kategori baru, atau ikon pensil pada kategori terpilih untuk mengubah nama/urutannya.",
      },
    },
    {
      name: "topik",
      type: "relationship",
      relationTo: "topik-produk",
      required: true,
      label: "Topik",
      // Hanya topik milik kategori terpilih yang ditawarkan.
      filterOptions: ({ siblingData }) => {
        const kategori = (siblingData as { kategori?: unknown } | undefined)?.kategori;
        const id = idRelasi(kategori);
        return id === undefined ? true : { kategori: { equals: id } };
      },
      validate: async (
        value: unknown,
        { siblingData, req }: { siblingData?: Record<string, unknown>; req: { payload: Payload } },
      ) => {
        const topikId = idRelasi(value);
        const kategoriId = idRelasi(siblingData?.kategori);
        if (topikId === undefined) return "Topik wajib dipilih.";
        if (kategoriId === undefined) return true; // kategori sendiri yang akan menolak
        const topik = await req.payload
          .findByID({ collection: "topik-produk", id: topikId, depth: 0, disableErrors: true })
          .catch(() => null);
        if (topik && idRelasi(topik.kategori) !== kategoriId) {
          return "Topik ini bukan milik kategori yang dipilih. Pilih topik lain atau ganti kategorinya.";
        }
        return true;
      },
      admin: {
        position: "sidebar",
        // Mengosongkan topik saat kategori diganti,
        // dan menitipkan kategori ke drawer topik baru — lihat TopikProdukField.tsx.
        components: { Field: "/payload/components/TopikProdukField#TopikProdukField" },
        description:
          "Menentukan kartu topik mana di halaman katalog yang memuat produk ini. Pilih Kategori dulu — daftar topik menyesuaikan. Tekan “+” di samping kolom ini untuk menambah topik baru (nama, ikon, warna kartu) di kategori yang sedang dipilih, atau pensil untuk mengubah topik terpilih.",
      },
    },
    {
      name: "jenjang",
      type: "select",
      required: true,
      hasMany: true,
      label: "Jenjang",
      options: [
        { label: "PAUD", value: "paud" },
        { label: "TK", value: "tk" },
        { label: "SD", value: "sd" },
        { label: "SMP", value: "smp" },
        { label: "SMA", value: "sma" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      label: "Gambar sampul",
      admin: { description: "Boleh dikosongkan dulu dan diisi menyusul." },
    },
    {
      name: "ringkasan",
      type: "textarea",
      localized: true,
      label: "Ringkasan singkat",
      admin: {
        description: "Tampil di kartu katalog dan sebagai deskripsi SEO bila belum diisi manual.",
      },
    },
    {
      name: "penulis",
      type: "text",
      label: "Disusun oleh",
      admin: {
        description:
          "Nama penulis/penyusun materi, kalau tercantum di berkasnya. Boleh kosong — sebagian terisi otomatis dari teks PDF (npm run backfill:penulis-drive), hasilnya dugaan dan aman dikoreksi manual kapan saja.",
      },
    },
    {
      name: "fiturUnggulan",
      type: "array",
      label: "Fitur unggulan",
      labels: { singular: "Fitur", plural: "Fitur" },
      admin: {
        components: judulBaris,
        description: "Poin bertanda bintang di halaman detail, mis. “40 kegiatan bertahap”.",
      },
      fields: [{ name: "teks", type: "text", required: true, localized: true, label: "Fitur" }],
    },
    {
      name: "format",
      type: "select",
      required: true,
      hasMany: true,
      defaultValue: ["pdf"],
      label: "Format tersedia",
      admin: { condition: bukanAlatPeraga },
      options: [
        { label: "PDF & Panduan Guru", value: "pdf" },
        { label: "Versi Cetak", value: "cetak" },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "gratis",
      label: "Status",
      options: [
        { label: "Gratis", value: "gratis" },
        { label: "Berbayar", value: "berbayar" },
      ],
      admin: { position: "sidebar", condition: bukanAlatPeraga },
    },
    {
      name: "harga",
      type: "number",
      label: "Harga (Rp)",
      min: 0,
      admin: {
        position: "sidebar",
        condition: (data, siblingData) => bukanAlatPeraga(data) && siblingData?.status === "berbayar",
        description: "Wajib diisi bila status Berbayar.",
      },
      validate: (value: number | null | undefined, { siblingData }: { siblingData?: Record<string, unknown> }) => {
        if (siblingData?.status === "berbayar" && !value) {
          return "Harga wajib diisi untuk produk berbayar.";
        }
        return true;
      },
    },
    {
      name: "tautanDrive",
      type: "text",
      label: "Tautan Google Drive",
      admin: {
        condition: bukanAlatPeraga,
        description:
          "Alamat berkas/folder Drive (akses “siapa saja yang punya tautan”) sampai OAuth resmi (OI-108) selesai dibuat. Untuk produk berbayar, ini bisa dikosongkan dan dikirim manual setelah pembayaran dikonfirmasi.",
      },
    },
    {
      name: "varian",
      type: "array",
      label: "Varian & harga",
      labels: { singular: "Varian", plural: "Varian" },
      admin: {
        condition: alatPeraga,
        components: judulBaris,
        description: "Khusus Alat Peraga: pilihan kemasan beserta harganya di marketplace, mis. “Plastik OPP Tanpa Donasi”.",
      },
      fields: [
        { name: "nama", type: "text", required: true, label: "Nama varian" },
        { name: "harga", type: "number", required: true, min: 0, label: "Harga (Rp)" },
      ],
    },
    {
      name: "tautanMarketplace",
      type: "array",
      label: "Tautan pembelian",
      labels: { singular: "Tautan", plural: "Tautan" },
      admin: {
        condition: (data) => alatPeraga(data) || data?.status === "berbayar",
        components: judulBaris,
        description:
          "Tautan produk di Shopee/Tokopedia (Alat Peraga & materi berbayar). Bila diisi, tombol beli mengarah ke sini. Isi hanya yang sudah ada.",
      },
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          label: "Marketplace",
          options: [
            { label: "Shopee", value: "shopee" },
            { label: "Tokopedia", value: "tokopedia" },
          ],
        },
        { name: "url", type: "text", required: true, label: "Tautan produk" },
      ],
    },
    urutanField(),
  ]),
};
