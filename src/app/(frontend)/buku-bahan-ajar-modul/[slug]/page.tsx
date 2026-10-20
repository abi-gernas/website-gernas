import type { Metadata } from "next";
import { ProdukDetailContent, produkMetadata } from "@/components/pages/ProdukDetailContent";

/** Versi Inggris ada di `en/buku-bahan-ajar-modul/[slug]/page.tsx` — lihat catatan locale di `src/lib/i18n.ts`. */

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
  return produkMetadata(slug, "id");
}

export default async function ProdukDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProdukDetailContent slug={slug} locale="id" />;
}
