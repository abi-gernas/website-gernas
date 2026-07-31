import Image from "next/image";
import Link from "next/link";
import type { ArticleView } from "@/lib/content";
import { DEFAULT_LOCALE, dateLocaleTag, localizedPath, uiText, type Locale } from "@/lib/i18n";

function formatDate(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(dateLocaleTag(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function NewsCard({
  article,
  locale = DEFAULT_LOCALE,
}: {
  article: ArticleView;
  locale?: Locale;
}) {
  const href = localizedPath(`/berita/${article.slug}`, locale);
  const text = uiText[locale];

  return (
    <article className="group flex flex-col overflow-hidden rounded-card bg-white shadow-soft transition-shadow hover:shadow-card">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden">
        {article.image && (
          <Image
            src={article.image.url}
            alt={article.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <time className="text-xs text-muted">{formatDate(article.date, locale)}</time>
        <h3 className="mt-2 line-clamp-2 text-base font-bold text-brand-navy">
          <Link href={href} className="hover:text-brand-red">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{article.excerpt}</p>
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-red"
        >
          {text.readMore} →
        </Link>
      </div>
    </article>
  );
}
