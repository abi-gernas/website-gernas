/**
 * Titipan kecil antara dua field di dasbor: kategori yang sedang dipilih pada
 * form Produk, supaya drawer "Topik baru" (form terpisah yang dibuka bawaan
 * Payload lewat tombol "+") bisa mengisi Kategori-nya sendiri.
 *
 * Drawer itu form tersendiri, jadi tidak bisa membaca field form Produk.
 * Disimpan di `window` (bukan variabel modul) agar tetap satu nilai walau
 * kedua komponen dimuat dalam chunk berbeda.
 */
type Titipan = { kategoriProduk?: number | string | null };

const ruang = (): Titipan => {
  const w = window as unknown as { __gernasTitipan?: Titipan };
  return (w.__gernasTitipan ??= {});
};

export const setKategoriProdukTerpilih = (id: number | string | null | undefined) => {
  ruang().kategoriProduk = id ?? null;
};

export const getKategoriProdukTerpilih = () => ruang().kategoriProduk ?? null;
