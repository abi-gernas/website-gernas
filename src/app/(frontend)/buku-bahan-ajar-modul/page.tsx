import type { Metadata } from "next";
import { ProdukListContent } from "@/components/pages/ProdukListContent";
import type { LibrarySearchParams } from "@/lib/library";

/** Versi Inggris ada di `en/buku-bahan-ajar-modul/page.tsx` — lihat catatan locale di `src/lib/i18n.ts`. */

export const metadata: Metadata = {
  title: "Buku, Bahan Ajar & Modul",
  description:
    "Kumpulan buku, modul dan bahan ajar berkualitas yang siap digunakan untuk mendukung pembelajaran di kelas.",
};

export default async function ProdukPage({
  searchParams,
}: {
  searchParams: Promise<LibrarySearchParams>;
}) {
  const params = await searchParams;
  return <ProdukListContent searchParams={params} locale="id" />;
}
