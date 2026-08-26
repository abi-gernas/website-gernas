import type { Metadata } from "next";
import { getProdukSlugs } from "@/lib/produk";
import { ProdukDetailContent, produkMetadata } from "@/components/pages/ProdukDetailContent";

/** Versi Inggris ada di `en/buku-bahan-ajar-modul/[slug]/page.tsx` — lihat catatan locale di `src/lib/i18n.ts`. */

export async function generateStaticParams() {
  const slugs = await getProdukSlugs();
  return slugs.map((slug) => ({ slug }));
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
