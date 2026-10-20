import type { Metadata } from "next";
import { ArticleContent, articleMetadata } from "@/components/pages/ArticleContent";

/** Versi Inggris dari halaman artikel — lihat catatan locale di `../../[slug]/page.tsx`. */

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
