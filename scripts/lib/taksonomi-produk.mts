/**
 * Cari id Kategori/Topik Produk menurut slug-nya, untuk skrip seed.
 *
 * Sejak Kategori & Topik jadi koleksi (bukan select), `produk.kategori` dan
 * `produk.topik` berisi id relasi. Skrip tidak membuat taksonominya: kalau slug
 * tidak ada, berhenti dengan pesan jelas — taksonomi dikelola staf lewat dasbor.
 */
import type { Payload } from "payload";

async function idMenurutSlug(
  payload: Payload,
  collection: "kategori-produk" | "topik-produk",
  slug: string,
): Promise<number> {
  const res = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0 });
  const doc = res.docs[0];
  if (!doc) {
    console.error(`Slug "${slug}" tidak ada di koleksi ${collection}. Tambahkan dulu lewat dasbor.`);
    process.exit(1);
  }
  return doc.id as number;
}

export const idKategori = (payload: Payload, slug: string) => idMenurutSlug(payload, "kategori-produk", slug);
export const idTopik = (payload: Payload, slug: string) => idMenurutSlug(payload, "topik-produk", slug);
