/**
 * Set ikon garis untuk blok Kartu Kegiatan.
 *
 * Sengaja berupa daftar tertutup, bukan unggahan gambar: ikon di kartu kegiatan
 * ukurannya kecil dan harus seragam tebal garisnya. Membiarkan staf mengunggah
 * PNG sendiri akan membuat satu ikon tampak lebih tebal/berbayang dari yang
 * lain, dan itu tidak bisa diperbaiki lewat CSS.
 *
 * Nilai `value` di sini WAJIB sama dengan `ikonOptions` di
 * `src/payload/blocks/shared.ts` — itulah yang dilihat staf di dasbor.
 */
export type NamaIkon =
  | "diskusi"
  | "komunitas"
  | "rumah"
  | "riset"
  | "ide"
  | "buku"
  | "penghargaan"
  | "daun";

/** Isi `<svg>` tiap ikon — dipisah dari pembungkusnya agar atributnya seragam. */
const jalur: Record<NamaIkon, React.ReactNode> = {
  diskusi: (
    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-2.8-.4L3 21l1.5-5.2A8.4 8.4 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z" />
  ),
  komunitas: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  rumah: (
    <>
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  riset: (
    <>
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
    </>
  ),
  ide: (
    <>
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2h5c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" />
      <path d="M9.5 18.5h5M10.5 21.5h3" />
    </>
  ),
  buku: (
    <>
      <path d="M12 6.5S10 4.5 4 4.5v13c6 0 8 2 8 2s2-2 8-2v-13c-6 0-8 2-8 2z" />
      <path d="M12 6.5v13" />
    </>
  ),
  penghargaan: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.2 13.4 6.5 21.5 12 18.5l5.5 3-1.7-8.1" />
    </>
  ),
  daun: (
    <>
      <path d="M4 20c0-8 5-14 16-15 0 10-6 15-13 15H4z" />
      <path d="M4 20c3-5 6-7 10-9" />
    </>
  ),
};

export const asNamaIkon = (v: unknown): NamaIkon =>
  typeof v === "string" && v in jalur ? (v as NamaIkon) : "diskusi";

export function Ikon({
  nama,
  className = "h-6 w-6",
}: {
  nama: NamaIkon;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {jalur[nama]}
    </svg>
  );
}
