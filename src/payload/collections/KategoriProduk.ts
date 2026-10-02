import type { CollectionConfig } from "payload";
import { terapkanReferensiLokal } from "../fields/localeReference";
import { slugField } from "../fields/slug";
import { urutanField } from "../fields/urutan";
import { lindungiHapus } from "../hooks/lindungiHapus";
import { revalidateSemua, revalidateSemuaAfterDelete } from "../hooks/revalidate";

/**
 * Tingkat tengah katalog "Buku, Bahan Ajar & Modul":
 * Jenis materi (Produk.kategoriProduk) → **Kategori** → Topik (TopikProduk).
 *
 * Dulunya field `mapel` bertipe select dengan dua opsi tetap (Matematika,
 * Membaca) — menambah satu saja butuh ubah kode + migrasi. Sekarang jadi
 * koleksi supaya staf bisa menambah/mengurutkan sendiri dari dasbor.
 *
 * Koleksi Video Pembelajaran masih memakai select `mapel` lamanya; tidak ikut
 * diubah karena bukan bagian katalog ini.
 */
export const KategoriProduk: CollectionConfig = {
  slug: "kategori-produk",
  admin: {
    useAsTitle: "nama",
    defaultColumns: ["nama", "slug", "urutan"],
    group: "Data Situs",
    // Tanpa menu sendiri: staf menambah/mengubahnya lewat tombol "+" / pensil di
    // field Kategori pada form Produk (drawer), bukan dari daftar terpisah.
    hidden: true,
    description:
      "Kategori utama katalog Buku, Bahan Ajar & Modul, mis. Matematika atau Membaca. Tiap kategori punya Topik sendiri.",
  },
  labels: { singular: "Kategori Produk", plural: "Kategori Produk" },
  hooks: {
    afterChange: [revalidateSemua],
    beforeDelete: [
      lindungiHapus([
        { collection: "topik-produk", field: "kategori", label: "topik" },
        { collection: "produk", field: "kategori", label: "produk" },
      ]),
    ],
    afterDelete: [revalidateSemuaAfterDelete],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: terapkanReferensiLokal([
    { name: "nama", type: "text", required: true, localized: true, label: "Nama kategori" },
    ...slugField("nama"),
    urutanField(),
  ]),
};
