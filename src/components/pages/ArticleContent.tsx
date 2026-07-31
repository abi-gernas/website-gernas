import Image from "next/image";
import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { NewsCard } from "@/components/NewsCard";
import { ArticleBody } from "@/components/ArticleBody";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { PreviewBadge } from "@/components/PreviewBadge";
import { getArticleBySlug, getArticles } from "@/lib/content";
import { articlePath, pagePath } from "@/lib/routes";
import { DEFAULT_LOCALE, dateLocaleTag, uiText, type Locale } from "@/lib/i18n";

function formatDate(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(dateLocaleTag(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Isi halaman artikel, dipakai bersama oleh `berita/[slug]/page.tsx` (id) dan
 * `en/berita/[slug]/page.tsx` (en) — lihat catatan locale di kedua berkas itu.
 */
export async function ArticleContent({
  slug,
  locale = DEFAULT_LOCALE,
}: {
  slug: string;
  locale?: Locale;
}) {
  const text = uiText[locale];
  const { isEnabled: draft } = await draftMode();
  const article = await getArticleBySlug(slug, draft, locale);
  if (!article) notFound();

  const related = (await getArticles(4, undefined, locale))
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <article>
      {draft && (
        <>
          <LivePreviewListener />
          <PreviewBadge />
        </>
      )}

      {/* Header */}
      <div className="bg-surface">
        <div className="container-page max-w-3xl py-12">
          <Link href={pagePath("publikasi", locale)} className="text-sm font-semibold text-brand-red">
            ← {text.backToPublications}
          </Link>
          {article.category && (
            <span className="mt-6 inline-block rounded-pill bg-brand-red/10 px-3 py-1 text-xs font-semibold text-brand-red">
              {article.category}
            </span>
          )}
          <h1 className="mt-4 text-2xl font-bold leading-tight text-brand-navy sm:text-3xl">
            {article.title}
          </h1>
          <time className="mt-3 block text-sm text-muted">
            {formatDate(article.date, locale)}
          </time>
        </div>
      </div>

      {article.image && (
        <div className="container-page max-w-3xl">
          <div className="relative -mt-2 aspect-[16/9] overflow-hidden rounded-card">
            <Image
              src={article.image.url}
              alt={article.title}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Isi */}
      <div className="container-page max-w-3xl py-10">
        <ArticleBody content={article.content} />
      </div>

      {/* Terkait */}
      {related.length > 0 && (
        <Section title={text.moreNews} className="bg-surface">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <NewsCard key={a.id} article={a} locale={locale} />
            ))}
          </div>
        </Section>
      )}
    </article>
  );
}

export async function articleMetadata(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode();
  const article = await getArticleBySlug(slug, draft, locale);
  if (!article) return { title: uiText[locale].latestNews };

  const title = article.seo.title || article.title;
  const description = article.seo.description || article.excerpt || undefined;
  const ogImage = article.seo.image ?? article.image;

  return {
    title,
    description,
    alternates: {
      canonical: articlePath(article.slug, locale),
      languages: { id: articlePath(article.slug), en: articlePath(article.slug, "en") },
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.date,
      locale: locale === "en" ? "en_US" : "id_ID",
      images: ogImage ? [{ url: ogImage.url }] : undefined,
    },
  };
}
