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
 * Tata letaknya mendatar (ikon kiri, teks kanan) mengikuti mockup Buku/Bahan
 * Ajar/Modul; kartu tanpa ikon (Alat Peraga) tampil sebagai teks saja.
 */
export function LibraryCategoryChips({ items }: { items: LibraryCategoryChip[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const warna = item.warna ?? "putih";
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-start gap-3.5 rounded-card p-5 shadow-soft transition-shadow hover:shadow-card ${warnaKartu[warna]}`}
          >
            {item.ikon && (
              <span className={`shrink-0 ${warnaIkon[warna]}`} aria-hidden="true">
                {item.ikon}
              </span>
            )}
            <span className="flex flex-col gap-1">
              <span className="font-bold leading-snug text-brand-navy group-hover:text-brand-red">
                {item.label}
              </span>
              {item.deskripsi && (
                <span className="text-sm leading-snug text-muted">{item.deskripsi}</span>
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
