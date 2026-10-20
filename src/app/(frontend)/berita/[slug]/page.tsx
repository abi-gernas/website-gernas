import type { Metadata } from "next";
import { ArticleContent, articleMetadata } from "@/components/pages/ArticleContent";

/**
 * Versi Inggris ada di `en/berita/[slug]/page.tsx` sebagai route terpisah,
 * bukan segmen `[locale]` — lihat catatan locale di `src/lib/i18n.ts`.
 */

/**
 * Tidak ada halaman yang dirender saat build: tiap render menyeberang ke
 * database Supabase (Singapura) dari mesin build Vercel (AS), dan ratusan
 * halaman itu memakan ~4 menit. Dengan daftar kosong, halaman dirender saat
 * pertama dikunjungi lalu di-cache; hook revalidate tetap menyegarkannya.
 */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return articleMetadata(slug, "id");
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArticleContent slug={slug} locale="id" />;
}
