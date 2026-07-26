import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RenderBlocks } from "@/components/RenderBlocks";
import { getPageBySlug, getPageSlugs } from "@/lib/pages";

/**
 * Halaman publik yang disusun staf dari Blocks (US-002).
 *
 * Route ini sengaja catch-all agar setiap halaman baru yang diterbitkan staf
 * langsung punya alamat, tanpa developer menambah folder. Halaman dengan file
 * sendiri (mis. /mitra, /publikasi, /berita/[slug]) tetap menang karena Next
 * mendahulukan route yang lebih spesifik daripada catch-all.
 *
 * Slug bersarang belum didukung: `slugField` membuang garis miring, sehingga
 * URL dua segmen tidak akan cocok dan berakhir 404 — bukan halaman kosong.
 */

type RouteParams = { slug: string[] };

export async function generateStaticParams() {
  const slugs = await getPageSlugs();
  return slugs.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug.join("/"));
  if (!page) return {};

  // Panel SEO (@payloadcms/plugin-seo) diutamakan; bila staf belum mengisinya,
  // judul halaman dipakai sebagai cadangan — pola yang sama dengan berita.
  const title = page.meta?.title || page.title;
  const description = page.meta?.description || undefined;
  const ogImage =
    page.meta?.image && typeof page.meta.image === "object"
      ? page.meta.image.url
      : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug.join("/"));
  if (!page) notFound();

  return <RenderBlocks blocks={page.layout} />;
}
