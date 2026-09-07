import "server-only";
import { cache } from "react";
import { payloadPromise } from "./payload";

/**
 * Ulasan/rating publik untuk satu `produk` — cuma yang `status: "disetujui"`
 * yang pernah sampai ke sini (koleksi `Ulasan` sendiri sudah menegakkan ini
 * lewat `access.read`, filter di `where` di bawah cuma lapisan kedua).
 */
export type UlasanView = {
  id: string;
  nama: string;
  rating: number;
  komentar: string | null;
  createdAt: string;
};

export type UlasanRingkasan = {
  docs: UlasanView[];
  rataRata: number | null;
  jumlah: number;
};

export const getUlasanByProduk = cache(async function getUlasanByProduk(
  produkId: string,
): Promise<UlasanRingkasan> {
  const payload = await payloadPromise;
  const res = await payload.find({
    collection: "ulasan",
    depth: 0,
    limit: 100,
    pagination: false,
    sort: "-createdAt",
    where: {
      produkRef: { equals: produkId },
      status: { equals: "disetujui" },
    },
  });

  const docs: UlasanView[] = res.docs.map((d) => ({
    id: String(d.id),
    nama: d.nama,
    rating: d.rating,
    komentar: d.komentar ?? null,
    createdAt: d.createdAt,
  }));

  const jumlah = docs.length;
  const rataRata = jumlah > 0 ? docs.reduce((total, d) => total + d.rating, 0) / jumlah : null;

  return { docs, rataRata, jumlah };
});
