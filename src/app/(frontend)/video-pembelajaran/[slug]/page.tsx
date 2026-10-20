import type { Metadata } from "next";
import { getVideoPembelajaranSlugs } from "@/lib/videoPembelajaran";
import {
  VideoPembelajaranDetailContent,
  videoPembelajaranMetadata,
} from "@/components/pages/VideoPembelajaranDetailContent";

/** Versi Inggris ada di `en/video-pembelajaran/[slug]/page.tsx` — lihat catatan locale di `src/lib/i18n.ts`. */

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
  return videoPembelajaranMetadata(slug, "id");
}

export default async function VideoPembelajaranDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <VideoPembelajaranDetailContent slug={slug} locale="id" />;
}
