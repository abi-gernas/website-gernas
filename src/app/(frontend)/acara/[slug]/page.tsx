import type { Metadata } from "next";
import { getAcaraSlugs } from "@/lib/datasitus";
import { AcaraDetailContent, acaraMetadata } from "@/components/pages/AcaraDetailContent";

/** Versi Inggris ada di `en/acara/[slug]/page.tsx` — lihat catatan locale di `src/lib/i18n.ts`. */

/**
 * Dirender ulang tiap 5 menit selain saat staf menyimpan dari dasbor: status
 * Selesai/Akan Datang bergantung pada tanggal hari ini.
 */
export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAcaraSlugs();
  return slugs.map((slug) => ({ slug }));
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
