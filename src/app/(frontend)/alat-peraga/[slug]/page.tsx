import type { Metadata } from "next";
import { getAlatPeragaSlugs } from "@/lib/alatPeraga";
import { AlatPeragaDetailContent, alatPeragaMetadata } from "@/components/pages/AlatPeragaDetailContent";

/** Versi Inggris ada di `en/alat-peraga/[slug]/page.tsx` — lihat catatan locale di `src/lib/i18n.ts`. */

export async function generateStaticParams() {
  const slugs = await getAlatPeragaSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return alatPeragaMetadata(slug, "id");
}

export default async function AlatPeragaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <AlatPeragaDetailContent slug={slug} locale="id" />;
}
