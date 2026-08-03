"use client";

import { usePathname } from "next/navigation";
import { StatusHalaman } from "@/components/StatusHalaman";
import { splitLocalePath } from "@/lib/i18n";

/**
 * Halaman 404 untuk seluruh route front-end.
 *
 * Dibuat client component semata-mata agar bahasanya bisa mengikuti alamat
 * yang dibuka: `not-found.tsx` tidak menerima params, sehingga `/en/…` hanya
 * bisa dikenali dari pathname di sisi klien.
 *
 * Halaman yang ada di CMS tapi masih draf TIDAK berakhir di sini — lihat
 * `PageContent`, yang menampilkan "Segera Hadir" untuk kasus itu.
 */
export default function NotFound() {
  const pathname = usePathname();
  const { locale } = splitLocalePath(pathname ?? "/");

  return <StatusHalaman varian="tidakDitemukan" locale={locale} />;
}
