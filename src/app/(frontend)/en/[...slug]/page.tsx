import type { Metadata } from "next";
import { getPageSlugs } from "@/lib/pages";
import { HOME_SLUG } from "@/lib/routes";
import { PageContent, pageMetadata } from "@/components/pages/PageContent";

type RouteParams = { slug: string[] };

/** Versi Inggris dari halaman catch-all — lihat catatan locale di `../../[...slug]/page.tsx`. */
export async function generateStaticParams() {
  const slugs = await getPageSlugs("en");
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
  return pageMetadata(slug.join("/"), "en");
}

export default async function DynamicPageEN({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  return <PageContent slug={slug.join("/")} locale="en" />;
}
