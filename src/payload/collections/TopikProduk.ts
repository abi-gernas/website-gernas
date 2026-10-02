import type { CollectionConfig } from "payload";
import { terapkanReferensiLokal } from "../fields/localeReference";
import { slugField } from "../fields/slug";
import { urutanField } from "../fields/urutan";
import { lindungiHapus } from "../hooks/lindungiHapus";
import { revalidateSemua, revalidateSemuaAfterDelete } from "../hooks/revalidate";

/**
 * Tingkat bawah katalog: Jenis materi → Kategori (KategoriProduk) → **Topik**.
 * Tiap topik jadi satu kartu di bagian "Jelajahi Berdasarkan Kategori".
 *
 * Nilai `ikon` terikat kontrak dengan `src/components/library/IkonTopikProduk.tsx`
 * — tambah ikon baru di kedua tempat. Ikon sengaja berupa pilihan, bukan
 * unggahan: kartu memakai garis tipis `currentColor` agar ikut warna kartu.
 */
export const IKON_TOPIK = [
  { label: "Geometri (bangun datar)", value: "geometri" },
  { label: "Bilangan Cacah (garis angka)", value: "bilangan-cacah" },
  { label: "Pecahan (lingkaran terbagi)", value: "pecahan" },
  { label: "Bilangan Bulat (positif–negatif)", value: "bilangan-bulat" },
  { label: "Statistika (diagram batang)", value: "statistika" },
  { label: "Pengukuran (penggaris)", value: "pengukuran" },
  { label: "Buku (membaca)", value: "buku" },
  { label: "Huruf (Aa)", value: "huruf" },
  { label: "Lampu (ide)", value: "lampu" },
  { label: "Bintang (umum)", value: "bintang" },
] as const;

export const TopikProduk: CollectionConfig = {
  slug: "topik-produk",
  admin: {
    useAsTitle: "nama",
    defaultColumns: ["nama", "kategori", "urutan"],
    group: "Data Situs",
    // Tanpa menu sendiri — lihat catatan di KategoriProduk.ts.
    hidden: true,
    description:
      "Topik di dalam sebuah kategori, mis. Pecahan atau Geometri (di Matematika). Tiap topik tampil sebagai satu kartu di halaman Buku, Bahan Ajar & Modul.",
  },
  labels: { singular: "Topik Produk", plural: "Topik Produk" },
  hooks: {
    afterChange: [revalidateSemua],
    beforeDelete: [lindungiHapus([{ collection: "produk", field: "topik", label: "produk" }])],
    afterDelete: [revalidateSemuaAfterDelete],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: terapkanReferensiLokal([
    { name: "nama", type: "text", required: true, localized: true, label: "Nama topik" },
    ...slugField("nama"),
    {
      name: "kategori",
      type: "relationship",
      relationTo: "kategori-produk",
      required: true,
      label: "Kategori",
      admin: {
        position: "sidebar",
        // Terisi otomatis bila dibuka dari tombol "+" di form Produk — lihat KategoriTopikField.tsx.
        components: { Field: "/payload/components/KategoriTopikField#KategoriTopikField" },
      },
    },
    {
      name: "deskripsi",
      type: "text",
      localized: true,
      label: "Deskripsi singkat",
      admin: { description: "Satu baris di bawah nama topik pada kartu, mis. “Bangun datar, bangun ruang, dan sudut”." },
    },
    {
      name: "ikon",
      type: "select",
      required: true,
      defaultValue: "bintang",
      label: "Ikon kartu",
      options: [...IKON_TOPIK],
      admin: { position: "sidebar" },
    },
    {
      name: "warna",
      type: "select",
      required: true,
      defaultValue: "biru",
      label: "Warna kartu",
      options: [
        { label: "Biru", value: "biru" },
        { label: "Merah", value: "merah" },
        { label: "Kuning", value: "kuning" },
        { label: "Abu kebiruan", value: "langit" },
      ],
      admin: { position: "sidebar" },
    },
    urutanField(),
  ]),
};
