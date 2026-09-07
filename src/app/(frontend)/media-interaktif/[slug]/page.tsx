import type { Metadata } from "next";
import { getMediaInteraktifSlugs } from "@/lib/mediaInteraktif";
import {
  MediaInteraktifDetailContent,
  mediaInteraktifMetadata,
} from "@/components/pages/MediaInteraktifDetailContent";

/** Versi Inggris ada di `en/media-interaktif/[slug]/page.tsx` — lihat catatan locale di `src/lib/i18n.ts`. */

export async function generateStaticParams() {
  const slugs = await getMediaInteraktifSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return mediaInteraktifMetadata(slug, "id");
}

export default async function MediaInteraktifDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <MediaInteraktifDetailContent slug={slug} locale="id" />;
}
