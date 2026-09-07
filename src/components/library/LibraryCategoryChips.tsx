import Link from "next/link";
import type { ReactNode } from "react";

/** Tint latar kartu kategori. Nilai default `putih` = tampilan lama (Alat Peraga). */
export type ChipWarna = "putih" | "biru" | "merah" | "kuning" | "langit";

const warnaKartu: Record<ChipWarna, string> = {
  putih: "bg-white",
  biru: "bg-brand-blue/[0.07]",
  merah: "bg-brand-red/[0.06]",
  kuning: "bg-brand-yellow/[0.14]",
  langit: "bg-brand-navy/[0.06]",
};

const warnaIkon: Record<ChipWarna, string> = {
  putih: "text-brand-navy",
  biru: "text-brand-blue",
  merah: "text-brand-red",
  kuning: "text-brand-yellow-dark",
  langit: "text-brand-navy",
};

/** Warna judul + tombol panah pada varian `lebar` (mockup Alat Peraga). */
const warnaAksen: Record<ChipWarna, string> = {
  putih: "text-brand-navy",
  biru: "text-brand-blue",
  merah: "text-brand-red",
  kuning: "text-brand-yellow-dark",
  langit: "text-brand-navy",
};

export type LibraryCategoryChip = {
  label: string;
  deskripsi?: string;
  /** Emoji atau `<svg>` — lihat `IkonKategoriProduk.tsx` untuk set ikon garis. */
  ikon?: ReactNode;
  href: string;
  warna?: ChipWarna;
};

/**
 * Kartu kategori pintas ("Jelajahi Berdasarkan Kategori" di Alat Peraga,
 * 4 kartu Modul/Buku/Bahan Ajar/LKS di Buku-Bahan Ajar-Modul). Konten beda
 * per halaman, styling sama — lihat §2.3 rencana eksekusi.
 *
 * Dua tampilan:
 * - `ringkas` (bawaan) — ikon kiri + teks kanan, dipakai halaman
 *   Buku, Bahan Ajar & Modul.
 * - `lebar` — 2 kolom, kartu lebih lapang, judul ikut warna aksen kartu, dan
 *   ada tombol panah bundar di ujung kanan. Mengikuti mockup Figma halaman
 *   Alat Peraga (menutup temuan QA #3 halaman itu).
 *
 * `kolom` hanya berlaku untuk varian `ringkas`: halaman Buku memakai 3 kolom
 * sejak kartunya jadi 6 topik (4 kolom menyisakan baris kedua yang timpang).
 */
const kolomKelas: Record<3 | 4, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export function LibraryCategoryChips({
  items,
  variant = "ringkas",
  kolom = 4,
}: {
  items: LibraryCategoryChip[];
  variant?: "ringkas" | "lebar";
  kolom?: 3 | 4;
}) {
  if (items.length === 0) return null;

  const lebar = variant === "lebar";

  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${lebar ? "" : kolomKelas[kolom]}`}>
      {items.map((item) => {
        const warna = item.warna ?? "putih";
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex rounded-card shadow-soft transition-shadow hover:shadow-card ${
              warnaKartu[warna]
            } ${lebar ? "items-center gap-5 p-6" : "items-start gap-3.5 p-5"}`}
          >
            {item.ikon && (
              <span className={`shrink-0 ${warnaIkon[warna]}`} aria-hidden="true">
                {item.ikon}
              </span>
            )}
            <span className={`flex flex-col gap-1 ${lebar ? "flex-1" : ""}`}>
              <span
                className={`font-bold leading-snug ${
                  lebar ? warnaAksen[warna] : "text-brand-navy group-hover:text-brand-red"
                }`}
              >
                {item.label}
              </span>
              {item.deskripsi && (
                <span className="text-sm leading-snug text-muted">{item.deskripsi}</span>
              )}
            </span>
            {lebar && (
              <span
                aria-hidden="true"
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-current transition-transform group-hover:translate-x-0.5 ${warnaAksen[warna]}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
