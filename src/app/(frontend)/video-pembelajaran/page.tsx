import type { Metadata } from "next";
import { VideoPembelajaranListContent } from "@/components/pages/VideoPembelajaranListContent";
import type { LibrarySearchParams } from "@/lib/library";

/** Versi Inggris ada di `en/video-pembelajaran/page.tsx` — lihat catatan locale di `src/lib/i18n.ts`. */

export const metadata: Metadata = {
  title: "Video Pembelajaran",
  description: "Kumpulan video pembelajaran berkualitas yang siap digunakan untuk mendukung pembelajaran di kelas.",
};

export default async function VideoPembelajaranPage({
  searchParams,
}: {
  searchParams: Promise<LibrarySearchParams>;
}) {
  const params = await searchParams;
  return <VideoPembelajaranListContent searchParams={params} locale="id" />;
}
