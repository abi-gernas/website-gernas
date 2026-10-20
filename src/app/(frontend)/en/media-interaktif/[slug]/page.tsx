import type { Metadata } from "next";
import {
  MediaInteraktifDetailContent,
  mediaInteraktifMetadata,
} from "@/components/pages/MediaInteraktifDetailContent";

/** Versi Inggris dari halaman intro Media Interaktif — lihat `../../../media-interaktif/[slug]/page.tsx`. */

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
