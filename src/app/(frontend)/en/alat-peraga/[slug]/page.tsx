import type { Metadata } from "next";
import { getAlatPeragaSlugs } from "@/lib/alatPeraga";
import { AlatPeragaDetailContent, alatPeragaMetadata } from "@/components/pages/AlatPeragaDetailContent";

/** Versi Inggris dari halaman detail Alat Peraga — lihat `../../[slug]/page.tsx`. */

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
  return alatPeragaMetadata(slug, "en");
}

export default async function AlatPeragaDetailPageEN({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <AlatPeragaDetailContent slug={slug} locale="en" />;
}
