import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { pagePath } from "../../lib/routes";

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

/**
 * Segarkan halaman dari koleksi Halaman (route catch-all `[...slug]`).
 *
 * Halaman itu di-render statis lewat `generateStaticParams`, jadi tanpa hook
 * ini perubahan staf baru tampil setelah deploy ulang — persoalan yang sama
 * dengan artikel.
 */
async function revalidatePagePath(slug?: string | null) {
  if (!slug) return;
  try {
    const { revalidatePath } = await import("next/cache");
    // `pagePath` memetakan slug beranda ke "/" — menyegarkan "/beranda" tidak
    // akan menyentuh halaman yang benar-benar dilayani.
    revalidatePath(pagePath(slug));
  } catch {
    // Di luar runtime Next (CLI/seed) tidak ada yang perlu disegarkan.
  }
}

export const revalidatePage: CollectionAfterChangeHook = async ({ doc, previousDoc }) => {
  await revalidatePagePath(doc?.slug);
  if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
    await revalidatePagePath(previousDoc.slug);
  }
  return doc;
};

export const revalidatePageAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidatePagePath(doc?.slug);
  return doc;
};

/**
 * Segarkan seluruh halaman publik.
 *
 * Dipakai koleksi data berulang (Penggerak, Mitra, Video, Modul Pelatihan):
 * satu dokumen di sana bisa muncul di banyak halaman sekaligus — logo mitra
 * tampil di beranda dan di halaman Mitra — dan tidak ada cara murah untuk
 * mengetahui halaman mana saja yang memakainya. Menyegarkan semuanya jauh
 * lebih sederhana daripada melacak ketergantungan, dan situs ini cukup kecil
 * sehingga biayanya tidak terasa.
 */
async function revalidateSeluruhSitus() {
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/", "layout");
  } catch {
    // Di luar runtime Next (CLI/seed) tidak ada yang perlu disegarkan.
  }
}

export const revalidateSemua: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidateSeluruhSitus();
  return doc;
};

export const revalidateSemuaAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidateSeluruhSitus();
  return doc;
};
