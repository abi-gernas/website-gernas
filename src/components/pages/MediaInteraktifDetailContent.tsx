import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getMediaInteraktifBySlug,
  getMediaInteraktifPilihan,
} from "@/lib/mediaInteraktif";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { mediaInteraktifListPath, mediaInteraktifPath } from "@/lib/routes";
import { CtaBantuanBanner } from "@/components/library/CtaBantuanBanner";
import { MediaInteraktifCard } from "@/components/library/MediaInteraktifCard";
import { MediaInteraktifPlayer } from "@/components/library/MediaInteraktifPlayer";

const text = {
  id: {
    back: "← Kembali ke Media Interaktif",
    sumber: "Buka di sumber aslinya",
    lainnya: "Media Lainnya",
  },
  en: {
    back: "← Back to Interactive Media",
    sumber: "Open the original source",
    lainnya: "More Media",
  },
} satisfies Record<Locale, Record<string, string>>;

/**
 * Halaman detail satu Media Interaktif — mengikuti pola
 * `VideoPembelajaranDetailContent`: kontennya disematkan di situs ini lewat
 * `MediaInteraktifPlayer`, bukan cuma tautan keluar.
 */
export async function MediaInteraktifDetailContent({
  slug,
  locale = DEFAULT_LOCALE,
}: {
  slug: string;
  locale?: Locale;
}) {
  const t = text[locale];
  const item = await getMediaInteraktifBySlug(slug, locale);
  if (!item) notFound();

  const lainnya = (await getMediaInteraktifPilihan(locale, 4))
    .filter((m) => m.id !== item.id)
    .slice(0, 3);

  return (
    <article>
      <div className="container-page max-w-4xl py-10">
        <Link href={mediaInteraktifListPath(locale)} className="text-sm font-semibold text-brand-red">
          {t.back}
        </Link>

        <div className="mt-6">
          <MediaInteraktifPlayer item={item} locale={locale} />
        </div>

        {item.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-pill bg-brand-blue/[0.08] px-3 py-1 text-xs font-semibold text-brand-blue"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="mt-4 text-2xl font-bold leading-tight text-brand-navy sm:text-3xl">
          {item.judul}
        </h1>

        {item.kontenHtml && (
          <div className="mt-2">
            <a
              href={item.tautan}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-navy hover:text-brand-red"
            >
              {t.sumber}
            </a>
          </div>
        )}

        {item.deskripsi && (
          <p className="mt-6 text-sm leading-relaxed text-body sm:text-base">{item.deskripsi}</p>
        )}
      </div>

      {lainnya.length > 0 && (
        <div className="container-page max-w-4xl pb-4">
          <h2 className="mb-5 text-lg font-bold text-brand-navy">{t.lainnya}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lainnya.map((m) => (
              <MediaInteraktifCard key={m.id} item={m} locale={locale} />
            ))}
          </div>
        </div>
      )}

      <div className="container-page max-w-4xl pb-14 pt-10">
        <CtaBantuanBanner locale={locale} />
      </div>
    </article>
  );
}

export async function mediaInteraktifMetadata(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Metadata> {
  const item = await getMediaInteraktifBySlug(slug, locale);
  if (!item) {
    return { title: locale === "en" ? "Interactive Digital Media" : "Media Digital Interaktif" };
  }

  const description = item.deskripsi ?? undefined;

  return {
    title: item.judul,
    description,
    alternates: {
      canonical: mediaInteraktifPath(item.slug, locale),
      languages: {
        id: mediaInteraktifPath(item.slug),
        en: mediaInteraktifPath(item.slug, "en"),
      },
    },
    openGraph: {
      title: item.judul,
      description,
      images: item.thumbnail ? [{ url: item.thumbnail.url }] : undefined,
    },
  };
}
