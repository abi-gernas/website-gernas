import type { Metadata } from "next";
import {
  PencarianGuruContent,
  pencarianGuruMetadata,
} from "@/components/pages/PencarianGuruContent";
import type { LibrarySearchParams } from "@/lib/library";

/**
 * Hasil pencarian lintas 4 katalog Library. Versi Inggris ada di
 * `en/pojok-guru/cari/page.tsx`.
 *
 * Route kode ini lebih spesifik sehingga menang atas `[...slug]` untuk
 * `/pojok-guru/cari`; `/pojok-guru` sendiri tetap dokumen Halaman yang
 * dilayani `[...slug]`.
 */

export const metadata: Metadata = pencarianGuruMetadata("id");

export default async function PencarianGuruPage({
  searchParams,
}: {
  searchParams: Promise<LibrarySearchParams>;
}) {
  const params = await searchParams;
  return <PencarianGuruContent searchParams={params} locale="id" />;
}
