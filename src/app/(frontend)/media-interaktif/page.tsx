import type { Metadata } from "next";
import { MediaInteraktifListContent } from "@/components/pages/MediaInteraktifListContent";
import type { LibrarySearchParams } from "@/lib/library";

/** Versi Inggris ada di `en/media-interaktif/page.tsx` — lihat catatan locale di `src/lib/i18n.ts`. */

export const metadata: Metadata = {
  title: "Media Digital Interaktif",
  description:
    "Kumpulan tautan aktivitas dan media pembelajaran interaktif untuk memperkaya kelas Anda.",
};

export default async function MediaInteraktifPage({
  searchParams,
}: {
  searchParams: Promise<LibrarySearchParams>;
}) {
  const params = await searchParams;
  return <MediaInteraktifListContent searchParams={params} locale="id" />;
}
