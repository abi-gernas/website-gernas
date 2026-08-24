import type { Metadata } from "next";
import { AlatPeragaListContent } from "@/components/pages/AlatPeragaListContent";
import type { LibrarySearchParams } from "@/lib/library";

/** Versi Inggris dari halaman katalog Alat Peraga — lihat `../../alat-peraga/page.tsx`. */

export const metadata: Metadata = {
  title: "Teaching Aids",
  description:
    "A collection of ready-to-use teaching aids to support math and reading instruction in the classroom.",
};

export default async function AlatPeragaPageEN({
  searchParams,
}: {
  searchParams: Promise<LibrarySearchParams>;
}) {
  const params = await searchParams;
  return <AlatPeragaListContent searchParams={params} locale="en" />;
}
