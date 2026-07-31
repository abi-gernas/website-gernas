import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RenderBlocks } from "@/components/RenderBlocks";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { PreviewBadge } from "@/components/PreviewBadge";
import { getPageBySlug } from "@/lib/pages";
import { HOME_SLUG } from "@/lib/routes";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

/**
 * Isi beranda, dipakai bersama oleh `app/(frontend)/page.tsx` (id, tanpa
 * prefix) dan `app/(frontend)/en/page.tsx` (en) — lihat catatan di kedua
 * berkas itu soal kenapa keduanya perlu route terpisah.
 */
export async function HomeContent({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const { isEnabled: draft } = await draftMode();
  const page = await getPageBySlug(HOME_SLUG, draft, locale);
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

export async function homeMetadata(locale: Locale = DEFAULT_LOCALE): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode();
  const page = await getPageBySlug(HOME_SLUG, draft, locale);
  if (!page) return {};

  const title = page.meta?.title || undefined;
  const description = page.meta?.description || undefined;
  const ogImage =
    page.meta?.image && typeof page.meta.image === "object"
      ? page.meta.image.url
      : undefined;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical: locale === DEFAULT_LOCALE ? "/" : `/${locale}`,
      languages: { id: "/", en: "/en" },
    },
    openGraph: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      type: "website",
      locale: locale === "en" ? "en_US" : "id_ID",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}
