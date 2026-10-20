import type { Metadata } from "next";
import { ProdukDetailContent, produkMetadata } from "@/components/pages/ProdukDetailContent";

/** Versi Inggris dari halaman detail produk — lihat `../../../buku-bahan-ajar-modul/[slug]/page.tsx`. */

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
  return produkMetadata(slug, "en");
}

export default async function ProdukDetailPageEN({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProdukDetailContent slug={slug} locale="en" />;
}
