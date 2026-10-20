import type { Metadata } from "next";
import { getVideoPembelajaranSlugs } from "@/lib/videoPembelajaran";
import {
  VideoPembelajaranDetailContent,
  videoPembelajaranMetadata,
} from "@/components/pages/VideoPembelajaranDetailContent";

/** Versi Inggris dari halaman detail Video Pembelajaran — lihat `../../../video-pembelajaran/[slug]/page.tsx`. */

/**
 * Dirender ulang tiap 5 menit selain saat staf menyimpan dari dasbor: video yang
 * ditambah lewat skrip/seed tidak memicu `revalidatePath` (lihat hooks/revalidate.ts),
 * sehingga "Video Lainnya" yang acak pun akan membeku sampai deploy berikutnya.
 */
export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getVideoPembelajaranSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return videoPembelajaranMetadata(slug, "en");
}

export default async function VideoPembelajaranDetailPageEN({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <VideoPembelajaranDetailContent slug={slug} locale="en" />;
}
