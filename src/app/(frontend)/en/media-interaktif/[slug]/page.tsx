import type { Metadata } from "next";
import { getMediaInteraktifSlugs } from "@/lib/mediaInteraktif";
import {
  MediaInteraktifDetailContent,
  mediaInteraktifMetadata,
} from "@/components/pages/MediaInteraktifDetailContent";

/** Versi Inggris dari halaman detail Media Interaktif — lihat `../../../media-interaktif/[slug]/page.tsx`. */

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
  return mediaInteraktifMetadata(slug, "en");
}

export default async function MediaInteraktifDetailPageEN({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <MediaInteraktifDetailContent slug={slug} locale="en" />;
}
