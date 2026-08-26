import type { Metadata } from "next";
import { getProdukSlugs } from "@/lib/produk";
import { ProdukDetailContent, produkMetadata } from "@/components/pages/ProdukDetailContent";

/** Versi Inggris dari halaman detail produk — lihat `../../../buku-bahan-ajar-modul/[slug]/page.tsx`. */

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
