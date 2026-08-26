import type { Metadata } from "next";
import { VideoPembelajaranListContent } from "@/components/pages/VideoPembelajaranListContent";
import type { LibrarySearchParams } from "@/lib/library";

/** Versi Inggris dari halaman katalog Video Pembelajaran — lihat `../../video-pembelajaran/page.tsx`. */

export const metadata: Metadata = {
  title: "Learning Videos",
  description: "A collection of quality learning videos ready to support learning in the classroom.",
};

export default async function VideoPembelajaranPageEN({
  searchParams,
}: {
  searchParams: Promise<LibrarySearchParams>;
}) {
  const params = await searchParams;
  return <VideoPembelajaranListContent searchParams={params} locale="en" />;
}
