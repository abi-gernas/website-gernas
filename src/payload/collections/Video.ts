import type { CollectionConfig } from "payload";
import { urutanField } from "../fields/urutan";
import { revalidateSemua, revalidateSemuaAfterDelete } from "../hooks/revalidate";

/**
 * Video pembelajaran & rekaman Bincang Gernas.
 *
 * Muncul di beranda (tiga terbaru) dan di halaman Tumbuh Bersama (semuanya),
 * karena itu dikelola terpisah dari susunan halaman.
 */
export const Video: CollectionConfig = {
  slug: "video",
  admin: {
    useAsTitle: "judul",
    defaultColumns: ["judul", "urutan", "updatedAt"],
    group: "Data Situs",
    description:
      "Daftar video. Dipakai blok “Daftar Video”; blok itu bisa dibatasi jumlahnya, mis. hanya 3 teratas di beranda.",
  },
  labels: { singular: "Video", plural: "Video" },
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
  fields: [
    {
      name: "judul",
      type: "text",
      required: true,
      localized: true,
      label: "Judul video",
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Gambar sampul",
      admin: {
        description:
          "Gambar yang tampil sebelum video diklik. Sebaiknya melintang (16:9).",
      },
    },
    {
      name: "tautan",
      type: "text",
      label: "Tautan video",
      admin: {
        description:
          "Alamat lengkap video, mis. https://www.youtube.com/watch?v=… . Bila kosong, sampulnya tetap tampil tetapi tidak bisa diklik.",
      },
    },
    urutanField(),
  ],
};
