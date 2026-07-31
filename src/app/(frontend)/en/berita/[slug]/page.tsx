import type { Metadata } from "next";
import { getArticleSlugs } from "@/lib/content";
import { ArticleContent, articleMetadata } from "@/components/pages/ArticleContent";

/** Versi Inggris dari halaman artikel — lihat catatan locale di `../../[slug]/page.tsx`. */

export async function generateStaticParams() {
  const slugs = await getArticleSlugs("en");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return articleMetadata(slug, "en");
}

export default async function ArticlePageEN({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArticleContent slug={slug} locale="en" />;
}
