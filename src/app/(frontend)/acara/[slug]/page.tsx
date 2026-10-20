import type { Metadata } from "next";
import { AcaraDetailContent, acaraMetadata } from "@/components/pages/AcaraDetailContent";

/** Versi Inggris ada di `en/acara/[slug]/page.tsx` — lihat catatan locale di `src/lib/i18n.ts`. */

/**
 * Dirender ulang tiap 5 menit selain saat staf menyimpan dari dasbor: status
 * Selesai/Akan Datang bergantung pada tanggal hari ini.
 */
export const revalidate = 300;

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
  return acaraMetadata(slug, "id");
}

export default async function AcaraDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <AcaraDetailContent slug={slug} locale="id" />;
}
