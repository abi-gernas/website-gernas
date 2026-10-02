import { APIError, type CollectionBeforeDeleteHook } from "payload";

/**
 * Cegah penghapusan dokumen yang masih dipakai koleksi lain.
 *
 * Payload tidak punya "restrict on delete" untuk relationship: menghapus
 * Kategori/Topik yang masih dipakai Produk akan meninggalkan produk dengan
 * referensi menggantung, dan dasbor baru protes ("field wajib") saat staf
 * membuka produk itu. Lebih baik ditolak di muka dengan pesan yang jelas.
 */
export const lindungiHapus =
  (pemakai: { collection: "produk" | "topik-produk"; field: string; label: string }[]): CollectionBeforeDeleteHook =>
  async ({ req, id }) => {
    for (const { collection, field, label } of pemakai) {
      const { totalDocs } = await req.payload.count({
        collection,
        where: { [field]: { equals: id } },
        req,
      });
      if (totalDocs > 0) {
        throw new APIError(
          `Tidak bisa dihapus: masih dipakai ${totalDocs} ${label}. Pindahkan atau hapus dulu ${label} tersebut.`,
          400,
          undefined,
          true,
        );
      }
    }
  };
