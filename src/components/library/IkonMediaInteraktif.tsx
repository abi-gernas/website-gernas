import type { ReactNode } from "react";

/**
 * Ikon 4 keunggulan + ilustrasi hero halaman Media Digital Interaktif.
 *
 * Sebelumnya keempat keunggulan itu memakai emoji (lihat riwayat 24 Agu di
 * `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md` §5) — diganti SVG garis supaya
 * bentuk & warnanya bisa dikontrol, sesuai mockup Figma yang baru ditinjau.
 * Ditaruh di file sendiri, bukan `src/components/ikon.tsx`: set ikon di sana
 * terikat kontrak `ikonOptions` (pilihan staf di dasbor), sedangkan keempat
 * ikon ini ditentukan kode — alasan yang sama dgn `IkonKategoriProduk.tsx`.
 */

export type FiturMedia = "interaktif" | "mudah" | "kurikulum" | "aman";

const paths: Record<FiturMedia, ReactNode> = {
  interaktif: (
    <>
      <path d="m9 9 5 12 1.8-5.2L21 14Z" />
      <path d="M7.2 2.2 8 5.1" />
      <path d="m5.1 8-2.9-.8" />
      <path d="M4.9 4.9 7 7" />
      <path d="m13.8 4.2-.8 2.9" />
    </>
  ),
  mudah: (
    <>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5A5.6 5.6 0 0 0 18 8a6 6 0 0 0-12 0c0 1 .2 2.2 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 21.5h4" />
    </>
  ),
  kurikulum: (
    <>
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </>
  ),
  aman: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.7 8.9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1 1 0 0 1 1.5 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
};

/** Tint lingkaran + warna garis tiap ikon, mengikuti urutan warna di mockup. */
const warna: Record<FiturMedia, string> = {
  interaktif: "bg-brand-blue/10 text-brand-blue",
  mudah: "bg-brand-red/10 text-brand-red",
  kurikulum: "bg-brand-yellow/20 text-brand-yellow-dark",
  aman: "bg-brand-navy/10 text-brand-navy",
};

export function IkonFiturMedia({ fitur }: { fitur: FiturMedia }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-12 w-12 items-center justify-center rounded-full ${warna[fitur]}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        {paths[fitur]}
      </svg>
    </span>
  );
}

/**
 * Ilustrasi hero. Digambar inline sbg **penampung sementara**: mockup memakai
 * ilustrasi 3D yang berkasnya belum diunggah ke koleksi Media (masalah yang
 * sama bikin hero Alat Peraga kosong, lihat §5 entri 24 Agu poin 4). Begitu
 * aset final ada, ganti komponen ini dgn `next/image`.
 */
export function IlustrasiMediaInteraktif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 260"
      role="presentation"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      {/* bayangan lembut */}
      <ellipse cx="168" cy="232" rx="118" ry="14" fill="#1B2A63" opacity="0.06" />

      {/* layar utama */}
      <rect x="56" y="58" width="196" height="140" rx="16" fill="#2F55D4" />
      <rect x="70" y="72" width="168" height="98" rx="10" fill="#5B7CF0" />
      <rect x="70" y="180" width="52" height="8" rx="4" fill="#8FA6F7" />
      <rect x="130" y="180" width="30" height="8" rx="4" fill="#8FA6F7" />

      {/* tombol putar */}
      <circle cx="154" cy="121" r="30" fill="#FFFFFF" opacity="0.92" />
      <path d="M146 110.5 168 121l-22 10.5z" fill="#B4181F" />

      {/* gelembung obrolan (kuning) */}
      <rect x="18" y="70" width="52" height="42" rx="12" fill="#F6C321" />
      <path d="M32 112h16l-8 12z" fill="#F6C321" />
      <rect x="28" y="82" width="32" height="5" rx="2.5" fill="#FFFFFF" opacity="0.85" />
      <rect x="28" y="94" width="20" height="5" rx="2.5" fill="#FFFFFF" opacity="0.85" />

      {/* kartu gambar (merah) */}
      <rect x="238" y="52" width="62" height="56" rx="12" fill="#B4181F" />
      <circle cx="256" cy="70" r="6" fill="#FFD9DB" />
      <path d="M246 96l14-16 12 14 6-6 12 8z" fill="#FFD9DB" />

      {/* pengeras suara */}
      <path d="M188 32 232 14v46l-44-16z" fill="#F6C321" />
      <rect x="168" y="32" width="22" height="20" rx="6" fill="#E0A800" />
      <path d="M236 26c6 4 6 14 0 18" stroke="#1B2A63" strokeWidth="3" strokeLinecap="round" />

      {/* kursor menunjuk */}
      <path
        d="M150 148c0-4 3-7 7-7s7 3 7 7v18c8 1 13 6 13 14v14a10 10 0 0 1-10 10h-24a10 10 0 0 1-10-10v-22c0-6 4-10 10-10h7z"
        fill="#FFD9B8"
        stroke="#1B2A63"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
