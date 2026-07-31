import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RenderBlocks } from "@/components/RenderBlocks";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { PreviewBadge } from "@/components/PreviewBadge";
import { getPageBySlug } from "@/lib/pages";
import { HOME_SLUG, pagePath } from "@/lib/routes";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

/**
 * Isi halaman catch-all, dipakai bersama oleh `[...slug]/page.tsx` (id) dan
 * `en/[...slug]/page.tsx` (en) — lihat catatan locale di kedua berkas itu.
 */
export async function PageContent({
  slug,
  locale = DEFAULT_LOCALE,
}: {
  slug: string;
  locale?: Locale;
}) {
  if (slug === HOME_SLUG) notFound(); // lihat catatan di generateStaticParams

  const { isEnabled: draft } = await draftMode();
  const page = await getPageBySlug(slug, draft, locale);
  if (!page) notFound();

  return (
    <>
      {draft && (
        <>
          <LivePreviewListener />
          <PreviewBadge />
        </>
      )}
      <RenderBlocks blocks={page.layout} locale={locale} />
    </>
  );
}

export async function pageMetadata(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode();
  const page = await getPageBySlug(slug, draft, locale);
  if (!page) return {};

  const title = page.meta?.title || page.title;
  const description = page.meta?.description || undefined;
  const ogImage =
    page.meta?.image && typeof page.meta.image === "object"
      ? page.meta.image.url
      : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: pagePath(page.slug, locale),
      languages: { id: pagePath(page.slug), en: pagePath(page.slug, "en") },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "en" ? "en_US" : "id_ID",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}
