import type { TopikProduk } from "@/lib/produk";

/**
 * Ikon garis untuk 6 kartu topik di halaman Buku, Bahan Ajar & Modul.
 *
 * Alasan terpisah dari `src/components/ikon.tsx` sama seperti
 * `IkonKategoriProduk`: set ikon di sana terikat kontrak dengan `ikonOptions`
 * di `src/payload/blocks/shared.ts` (dipilih staf lewat dasbor), sedangkan
 * keenam ikon ini ditentukan kode berdasarkan `topik` dan tidak boleh ikut
 * muncul sebagai pilihan di dasbor.
 */
const jalur: Record<TopikProduk, React.ReactNode> = {
  geometri: (
    <>
      <path d="M3.5 20.5h8l-4-7-4 7z" />
      <path d="M13.5 11.5h7v7h-7z" />
      <circle cx="9.5" cy="6.5" r="3" />
    </>
  ),
  "bilangan-cacah": (
    <>
      <path d="M4 5.5h16M4 12h16M4 18.5h16" />
      <circle cx="8" cy="5.5" r="1.6" />
      <circle cx="14.5" cy="12" r="1.6" />
      <circle cx="11" cy="18.5" r="1.6" />
    </>
  ),
  pecahan: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5v8.5h8.5" />
    </>
  ),
  "bilangan-bulat": (
    <>
      <path d="M3 12h18" />
      <path d="M7 9.5v5M12 9.5v5M17 9.5v5" />
      <path d="M5 5.5h3M16 5.5h3M17.5 4v3" />
    </>
  ),
  statistika: (
    <>
      <path d="M4 20.5V3.5" />
      <path d="M4 20.5h17" />
      <path d="M8 17.5v-5M12.5 17.5v-9M17 17.5v-3" />
    </>
  ),
  pengukuran: (
    <>
      <path d="M2.5 9h19a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-19a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z" />
      <path d="M6 9v3M10 9v4M14 9v3M18 9v4" />
    </>
  ),
};

export function IkonTopikProduk({
  topik,
  className = "h-8 w-8",
}: {
  topik: TopikProduk;
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
      {jalur[topik]}
    </svg>
  );
}
