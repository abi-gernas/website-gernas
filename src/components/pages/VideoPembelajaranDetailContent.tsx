import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getVideoPembelajaranBySlug,
  getVideoPembelajaranPilihan,
  videoPembelajaranSumberHref,
} from "@/lib/videoPembelajaran";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { JENJANG_LABELS, MAPEL_LABELS } from "@/lib/library";
import { videoPembelajaranListPath, videoPembelajaranPath } from "@/lib/routes";
import { CtaBantuanBanner } from "@/components/library/CtaBantuanBanner";
import { VideoPembelajaranCard } from "@/components/library/VideoPembelajaranCard";
import { VideoPembelajaranPlayer } from "@/components/library/VideoPembelajaranPlayer";

const text = {
  id: {
    back: "← Kembali ke Video Pembelajaran",
    durasi: "Durasi",
    sumber: "Buka di sumber aslinya",
    lainnya: "Video Lainnya",
  },
  en: {
    back: "← Back to Learning Videos",
    durasi: "Duration",
    sumber: "Open the original source",
    lainnya: "More Videos",
  },
} satisfies Record<Locale, Record<string, string>>;

/**
 * Halaman detail satu video. Dibuat setelah QA 26 Agu 2026 memutuskan tombol
 * "Tonton" harus tetap di situs ini dengan video tersemat, bukan mengarah
 * keluar ke YouTube (lihat §5 `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md`).
 */
export async function VideoPembelajaranDetailContent({
  slug,
  locale = DEFAULT_LOCALE,
}: {
  slug: string;
  locale?: Locale;
}) {
  const t = text[locale];
  const item = await getVideoPembelajaranBySlug(slug, locale);
  if (!item) notFound();

  const lainnya = (await getVideoPembelajaranPilihan(locale, 4))
    .filter((v) => v.id !== item.id)
    .slice(0, 3);

  const tags = [
    ...item.jenjang.map((j) => JENJANG_LABELS[j] ?? j),
    ...item.mapel.map((m) => MAPEL_LABELS[m] ?? m),
  ];
  const sumber = videoPembelajaranSumberHref(item);

  return (
    <article>
      <div className="container-page max-w-4xl py-10">
        <Link
          href={videoPembelajaranListPath(locale)}
          className="text-sm font-semibold text-brand-red"
        >
          {t.back}
        </Link>

        <div className="mt-6">
          <VideoPembelajaranPlayer item={item} locale={locale} />
        </div>

        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
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

        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted">
          {item.durasi && (
            <span>
              {t.durasi}: {item.durasi}
            </span>
          )}
          {sumber && (
            <a
              href={sumber}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-navy hover:text-brand-red"
            >
              {t.sumber}
            </a>
          )}
        </div>

        {item.deskripsi && (
          <p className="mt-6 text-sm leading-relaxed text-body sm:text-base">{item.deskripsi}</p>
        )}
      </div>

      {lainnya.length > 0 && (
        <div className="container-page max-w-4xl pb-4">
          <h2 className="mb-5 text-lg font-bold text-brand-navy">{t.lainnya}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lainnya.map((v) => (
              <VideoPembelajaranCard key={v.id} item={v} locale={locale} />
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

export async function videoPembelajaranMetadata(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Metadata> {
  const item = await getVideoPembelajaranBySlug(slug, locale);
  if (!item) return { title: locale === "en" ? "Learning Videos" : "Video Pembelajaran" };

  const description = item.deskripsi ?? undefined;

  return {
    title: item.judul,
    description,
    alternates: {
      canonical: videoPembelajaranPath(item.slug, locale),
      languages: {
        id: videoPembelajaranPath(item.slug),
        en: videoPembelajaranPath(item.slug, "en"),
      },
    },
    openGraph: {
      title: item.judul,
      description,
      type: "video.other",
      locale: locale === "en" ? "en_US" : "id_ID",
      images: item.thumbnail ? [{ url: item.thumbnail.url }] : undefined,
    },
  };
}
