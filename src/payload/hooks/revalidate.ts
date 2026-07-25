import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

/**
 * Segarkan halaman publik begitu staf menerbitkan perubahan.
 *
 * Halaman artikel di-render statis saat build (lihat output `next build`),
 * sehingga tanpa ini perubahan dari dasbor baru muncul setelah deploy ulang —
 * dan staf tidak benar-benar mandiri (KPI No.5).
 *
 * `next/cache` diimpor secara dinamis karena payload.config juga dimuat oleh
 * CLI (`payload migrate`, script seed) yang berjalan di luar runtime Next;
 * di sana modul itu tidak tersedia dan tidak diperlukan.
 */
async function revalidateArticlePaths(slug?: string | null) {
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/"); // blok "Kabar Terbaru" di beranda
    revalidatePath("/publikasi");
    if (slug) revalidatePath(`/berita/${slug}`);
  } catch {
    // Di luar runtime Next (CLI/seed) tidak ada yang perlu disegarkan.
  }
}

export const revalidateArticle: CollectionAfterChangeHook = async ({ doc, previousDoc }) => {
  await revalidateArticlePaths(doc?.slug);
  // Bila slug berubah, alamat lama juga perlu disegarkan agar tidak basi.
  if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
    await revalidateArticlePaths(previousDoc.slug);
  }
  return doc;
};

export const revalidateArticleAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidateArticlePaths(doc?.slug);
  return doc;
};
