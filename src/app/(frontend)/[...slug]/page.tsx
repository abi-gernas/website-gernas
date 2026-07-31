import type { Metadata } from "next";
import { getPageSlugs } from "@/lib/pages";
import { HOME_SLUG } from "@/lib/routes";
import { PageContent, pageMetadata } from "@/components/pages/PageContent";

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
 *
 * Versi Inggris ada di `en/[...slug]/page.tsx` sebagai route terpisah, bukan
 * segmen `[locale]` — lihat catatan di `src/lib/i18n.ts`.
 */

type RouteParams = { slug: string[] };

/**
 * Beranda dilayani `(frontend)/page.tsx` di "/". Bila slug-nya tidak dibuang
 * di sini, isi yang sama juga tayang di "/beranda" — URL duplikat yang saling
 * bersaing di hasil pencarian.
 */
export async function generateStaticParams() {
  const slugs = await getPageSlugs();
  return slugs
    .filter((slug) => slug !== HOME_SLUG)
    .map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata(slug.join("/"), "id");
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  return <PageContent slug={slug.join("/")} locale="id" />;
}
