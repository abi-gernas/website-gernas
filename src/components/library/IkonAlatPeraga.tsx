/**
 * Ikon 2 kartu kategori halaman Alat Peraga (Gernas Tastaka / Gernas Tastaba).
 *
 * Digambar inline sebagai SVG berwarna mengikuti mockup Figma (bangun ruang
 * untuk numerasi, tumpukan buku untuk literasi) — ilustrasi aslinya belum
 * diunggah ke koleksi Media, masalah yang sama membuat hero halaman ini
 * sempat kosong (lihat `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md` §5 entri
 * 24 Agu poin 4). Ganti dengan `next/image` begitu aset finalnya ada.
 *
 * Ditaruh di file sendiri, bukan `src/components/ikon.tsx`: set ikon di sana
 * terikat kontrak `ikonOptions` (pilihan staf di dasbor), sedangkan kedua
 * ikon ini ditentukan kode — alasan yang sama dengan `IkonKategoriProduk.tsx`
 * dan `IkonMediaInteraktif.tsx`.
 */

export type KategoriAlatPeraga = "tastaka" | "tastaba";

function IkonTastaka({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" role="presentation" aria-hidden="true" className={className} fill="none">
      {/* kubus */}
      <path d="M28 26.5 40 21l12 5.5V42l-12 5.5L28 42z" fill="#5B7CF0" />
      <path d="m28 26.5 12 5.5 12-5.5" stroke="#1B2A63" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M40 32v15.5" stroke="#1B2A63" strokeWidth="2.2" strokeLinejoin="round" />
      <path
        d="M28 26.5 40 21l12 5.5V42l-12 5.5L28 42z"
        stroke="#1B2A63"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* segitiga */}
      <path d="M22 14 34 36H10z" fill="#F6C321" stroke="#1B2A63" strokeWidth="2.2" strokeLinejoin="round" />
      {/* lingkaran */}
      <circle cx="18" cy="45" r="10" fill="#B4181F" stroke="#1B2A63" strokeWidth="2.2" />
    </svg>
  );
}

function IkonTastaba({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" role="presentation" aria-hidden="true" className={className} fill="none">
      {/* tiga tumpukan buku */}
      <rect x="8" y="42" width="48" height="12" rx="3" fill="#B4181F" stroke="#1B2A63" strokeWidth="2.2" />
      <rect x="12" y="30" width="40" height="12" rx="3" fill="#5B7CF0" stroke="#1B2A63" strokeWidth="2.2" />
      <rect x="10" y="18" width="44" height="12" rx="3" fill="#F6C321" stroke="#1B2A63" strokeWidth="2.2" />
      {/* pembatas halaman */}
      <path d="M20 18v12M20 30v12M20 42v12" stroke="#1B2A63" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function IkonAlatPeraga({
  kategori,
  className = "h-12 w-12",
}: {
  kategori: KategoriAlatPeraga;
  className?: string;
}) {
  return kategori === "tastaka" ? (
    <IkonTastaka className={className} />
  ) : (
    <IkonTastaba className={className} />
  );
}
