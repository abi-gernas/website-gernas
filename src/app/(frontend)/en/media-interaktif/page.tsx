import type { Metadata } from "next";
import { MediaInteraktifListContent } from "@/components/pages/MediaInteraktifListContent";
import type { LibrarySearchParams } from "@/lib/library";

/** Versi Inggris dari halaman katalog Media Digital Interaktif — lihat `../../media-interaktif/page.tsx`. */

export const metadata: Metadata = {
  title: "Interactive Digital Media",
  description:
    "A collection of interactive learning activities and media links to enrich your classroom.",
};

export default async function MediaInteraktifPageEN({
  searchParams,
}: {
  searchParams: Promise<LibrarySearchParams>;
}) {
  const params = await searchParams;
  return <MediaInteraktifListContent searchParams={params} locale="en" />;
}
