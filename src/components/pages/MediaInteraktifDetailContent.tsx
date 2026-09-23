import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMediaInteraktifBySlug, getMediaInteraktifList } from "@/lib/mediaInteraktif";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { mediaInteraktifListPath, mediaInteraktifPath } from "@/lib/routes";
import { CtaBantuanBanner } from "@/components/library/CtaBantuanBanner";
import { Breadcrumb, labelKatalogGuru } from "@/components/library/Breadcrumb";
import { MediaInteraktifCard } from "@/components/library/MediaInteraktifCard";

const text = {
  id: {
    buka: "Buka Media Interaktif",
    catatan: "Media akan terbuka di tab baru.",
    lainnya: "Media Interaktif Lainnya",
  },
  en: {
    buka: "Open Interactive Media",
    catatan: "The media will open in a new tab.",
    lainnya: "More Interactive Media",
  },
} satisfies Record<Locale, Record<string, string>>;

/**
 * Halaman intro satu Media Interaktif — lapisan antara kartu katalog dan
 * tautan eksternalnya, meniru alur Video Pembelajaran (keputusan 23 Sep 2026):
 * pengunjung melihat sampul, tag, dan deskripsi dulu di situs ini, baru tombol
 * "Buka Media Interaktif" membawa ke `tautan` di tab baru.
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

  const lainnya = (await getMediaInteraktifList({ locale })).docs
    .filter((m) => m.id !== item.id)
    .slice(0, 4);

  return (
    <article>
      <div className="container-page max-w-5xl py-10">
        <Breadcrumb
          locale={locale}
          items={[
            {
              label: labelKatalogGuru.mediaInteraktif[locale],
              href: mediaInteraktifListPath(locale),
            },
            { label: item.judul },
          ]}
        />

        <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-start">
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface shadow-soft">
            {item.thumbnail && (
              <Image
                src={item.thumbnail.url}
                alt={item.judul}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </div>

          <div>
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
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

            {item.deskripsi && (
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-body sm:text-base">
                {item.deskripsi}
              </p>
            )}

            <a
              href={item.tautan}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-red mt-6"
            >
              {t.buka}
            </a>
            <p className="mt-2 text-xs text-muted">{t.catatan}</p>
          </div>
        </div>
      </div>

      {lainnya.length > 0 && (
        <div className="container-page max-w-5xl pb-4">
          <h2 className="mb-5 text-lg font-bold text-brand-navy">{t.lainnya}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {lainnya.map((m) => (
              <MediaInteraktifCard key={m.id} item={m} locale={locale} />
            ))}
          </div>
        </div>
      )}

      <div className="container-page max-w-5xl pb-14 pt-10">
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
  if (!item) return { title: labelKatalogGuru.mediaInteraktif[locale] };

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
      type: "website",
      locale: locale === "en" ? "en_US" : "id_ID",
      images: item.thumbnail ? [{ url: item.thumbnail.url }] : undefined,
    },
  };
}
