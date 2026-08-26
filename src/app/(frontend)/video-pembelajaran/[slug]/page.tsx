import type { Metadata } from "next";
import { getVideoPembelajaranSlugs } from "@/lib/videoPembelajaran";
import {
  VideoPembelajaranDetailContent,
  videoPembelajaranMetadata,
} from "@/components/pages/VideoPembelajaranDetailContent";

/** Versi Inggris ada di `en/video-pembelajaran/[slug]/page.tsx` — lihat catatan locale di `src/lib/i18n.ts`. */

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
