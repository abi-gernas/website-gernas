import type { CollectionConfig } from "payload";
import { terapkanReferensiLokal } from "../fields/localeReference";
import { revalidateSemua, revalidateSemuaAfterDelete } from "../hooks/revalidate";

/**
 * Jadwal acara — webinar, pelatihan, dan workshop yang terbuka (atau tertutup)
 * untuk publik.
 *
 * Dikelola sebagai koleksi, bukan array di dalam blok, karena daftarnya terus
 * bertambah tiap bulan (termasuk arsip poster acara terdahulu) dan staf perlu
 * menambah satu acara tanpa membuka susunan halaman Belajar Bersama.
 *
 * Aturan tombol "Daftar": tampil hanya bila `tautanDaftar` diisi DAN acaranya
 * belum lewat. Tautan kosong berarti acara eksklusif (peserta undangan), jadi
 * kartu tampil tanpa tombol.
 */
export const Acara: CollectionConfig = {
  slug: "acara",
  admin: {
    useAsTitle: "judul",
    defaultColumns: ["judul", "kategori", "tanggal", "tautanDaftar"],
    group: "Data Situs",
    description:
      "Jadwal acara untuk blok “Jadwal Acara”. Acara yang akan datang tampil lebih dulu, lalu acara yang sudah selesai. Kosongkan Tautan pendaftaran bila acaranya eksklusif.",
  },
  labels: { singular: "Acara", plural: "Jadwal Acara" },
  defaultSort: "-tanggal",
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
      label: "Judul acara",
    },
    {
      name: "kategori",
      type: "select",
      required: true,
      defaultValue: "webinar",
      label: "Kategori",
      options: [
        { label: "Webinar", value: "webinar" },
        { label: "Pelatihan", value: "pelatihan" },
        { label: "Workshop", value: "workshop" },
        { label: "Klub Buku", value: "klubBuku" },
        { label: "Seminar / Diskusi Riset", value: "seminar" },
      ],
    },
    {
      name: "poster",
      type: "upload",
      relationTo: "media",
      label: "Poster (opsional)",
      admin: {
        description:
          "Bila diisi, kartu tampil sebagai poster. Bila kosong, kartu tampil sebagai kotak berwarna sesuai kategori. Poster sebaiknya tegak (4:5).",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "tanggal",
          type: "date",
          required: true,
          label: "Tanggal",
          admin: {
            width: "50%",
            date: { pickerAppearance: "dayOnly", displayFormat: "d MMMM yyyy" },
          },
        },
        {
          name: "waktu",
          type: "text",
          label: "Waktu",
          admin: {
            width: "50%",
            description: "Mis. 19.00 - 21.00 WIB. Boleh dikosongkan.",
          },
        },
      ],
    },
    {
      name: "format",
      type: "select",
      required: true,
      defaultValue: "online",
      label: "Pelaksanaan",
      options: [
        { label: "Online", value: "online" },
        { label: "Offline (tatap muka)", value: "offline" },
        { label: "Hybrid", value: "hybrid" },
      ],
    },
    {
      name: "lokasi",
      type: "text",
      label: "Lokasi (opsional)",
      admin: {
        description:
          "Untuk acara tatap muka/hybrid, mis. “Kantor Indorelawan, Jakarta”. Cukup nama tempat + kota.",
      },
    },
    {
      name: "tautanDaftar",
      type: "text",
      label: "Tautan pendaftaran",
      admin: {
        description:
          "Alamat Google Form (https://forms.gle/…) atau formulir situs sendiri (/…). KOSONGKAN bila acara eksklusif — tombol “Daftar” tidak akan muncul. Tombol juga otomatis hilang setelah tanggal acara lewat.",
      },
    },
  ]),
};
