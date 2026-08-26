import type { KategoriProduk } from "@/lib/produk";

/**
 * Ikon garis untuk 4 kartu kategori di halaman Buku, Bahan Ajar & Modul.
 *
 * Terpisah dari `src/components/ikon.tsx`: set ikon di sana terikat kontrak
 * dengan `ikonOptions` di `src/payload/blocks/shared.ts` (dipilih staf lewat
 * dasbor), sedangkan keempat ikon ini ditentukan kode berdasarkan
 * `kategoriProduk` dan tidak boleh ikut muncul sebagai pilihan di dasbor.
 */
const jalur: Record<KategoriProduk, React.ReactNode> = {
  modul: (
    <>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H17a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5.5A1.5 1.5 0 0 1 4 17.5v-12z" />
      <path d="M4 16.5A1.5 1.5 0 0 1 5.5 15H18" />
      <path d="m8.5 8.5 2 2 3.5-3.5" />
    </>
  ),
  buku: (
    <>
      <path d="M12 7.2S10 5 4 5v13c6 0 8 2 8 2s2-2 8-2V5c-6 0-8 2.2-8 2.2z" />
      <path d="M12 7.2V20" />
    </>
  ),
  "bahan-ajar": (
    <>
      <path d="M6 3.5h7.5L18 8v12a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20V4a.5.5 0 0 1 .5-.5z" />
      <path d="M13.5 3.5V8H18" />
      <path d="M9 12h6M9 15.5h6" />
    </>
  ),
  lks: (
    <>
      <path d="M6 3.5h12a.5.5 0 0 1 .5.5v16a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5z" />
      <path d="m8.5 8.5 1.2 1.2 2.3-2.3M8.5 14l1.2 1.2 2.3-2.3" />
      <path d="M14.5 9h2M14.5 14.5h2" />
    </>
  ),
};

export function IkonKategoriProduk({
  kategori,
  className = "h-8 w-8",
}: {
  kategori: KategoriProduk;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {jalur[kategori]}
    </svg>
  );
}
