import type { Metadata } from "next";
import { AlatPeragaListContent } from "@/components/pages/AlatPeragaListContent";
import type { LibrarySearchParams } from "@/lib/library";

/** Versi Inggris ada di `en/alat-peraga/page.tsx` — lihat catatan locale di `src/lib/i18n.ts`. */

export const metadata: Metadata = {
  title: "Alat Peraga",
  description:
    "Koleksi alat peraga siap pakai untuk mendukung pembelajaran matematika dan membaca di kelas.",
};

export default async function AlatPeragaPage({
  searchParams,
}: {
  searchParams: Promise<LibrarySearchParams>;
}) {
  const params = await searchParams;
  return <AlatPeragaListContent searchParams={params} locale="id" />;
}
