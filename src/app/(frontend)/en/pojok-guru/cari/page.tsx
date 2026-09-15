import type { Metadata } from "next";
import {
  PencarianGuruContent,
  pencarianGuruMetadata,
} from "@/components/pages/PencarianGuruContent";
import type { LibrarySearchParams } from "@/lib/library";

/** Versi Inggris hasil pencarian Pojok Guru — lihat `../../../pojok-guru/cari/page.tsx`. */

export const metadata: Metadata = pencarianGuruMetadata("en");

export default async function PencarianGuruPageEN({
  searchParams,
}: {
  searchParams: Promise<LibrarySearchParams>;
}) {
  const params = await searchParams;
  return <PencarianGuruContent searchParams={params} locale="en" />;
}
