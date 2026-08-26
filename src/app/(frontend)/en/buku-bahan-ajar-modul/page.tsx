import type { Metadata } from "next";
import { ProdukListContent } from "@/components/pages/ProdukListContent";
import type { LibrarySearchParams } from "@/lib/library";

/** Versi Inggris dari halaman katalog Buku, Bahan Ajar & Modul — lihat `../../buku-bahan-ajar-modul/page.tsx`. */

export const metadata: Metadata = {
  title: "Books, Teaching Materials & Modules",
  description:
    "A collection of quality books, modules, and teaching materials ready to support learning in the classroom.",
};

export default async function ProdukPageEN({
  searchParams,
}: {
  searchParams: Promise<LibrarySearchParams>;
}) {
  const params = await searchParams;
  return <ProdukListContent searchParams={params} locale="en" />;
}
