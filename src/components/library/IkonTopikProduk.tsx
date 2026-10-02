import type { IkonTopik } from "@/lib/produk";

/**
 * Ikon garis untuk kartu topik di halaman Buku, Bahan Ajar & Modul.
 *
 * Alasan terpisah dari `src/components/ikon.tsx` sama seperti
 * `IkonKategoriProduk`: set ikon di sana terikat kontrak dengan `ikonOptions`
 * di `src/payload/blocks/shared.ts` (dipilih staf lewat dasbor), sedangkan
 * ikon-ikon ini dipilih staf lewat field `ikon` di koleksi Topik Produk
 * (daftar pilihannya `IKON_TOPIK` di `TopikProduk.ts` — jaga agar sama) dan tidak boleh
 * ikut muncul sebagai pilihan di blok halaman.
 */
const jalur: Record<IkonTopik, React.ReactNode> = {
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
  buku: (
    <>
      <path d="M12 7.2S10 5 4 5v13c6 0 8 2 8 2s2-2 8-2V5c-6 0-8 2.2-8 2.2z" />
      <path d="M12 7.2V20" />
    </>
  ),
  huruf: (
    <>
      <path d="M2.5 19 7.5 5l5 14M4.2 14.5h6.6" />
      <path d="M15.5 12.5a3 3 0 1 1 0 4.5 3 3 0 0 1 0-4.5zM18.5 11v8" />
    </>
  ),
  lampu: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" />
    </>
  ),
  bintang: <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.9L12 3.5z" />,
};

export function IkonTopikProduk({
  ikon,
  className = "h-8 w-8",
}: {
  ikon: IkonTopik;
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
      {jalur[ikon] ?? jalur.bintang}
    </svg>
  );
}
