import Link from "next/link";
import { getMediaInteraktifList, getPopularMediaInteraktifTags } from "@/lib/mediaInteraktif";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { parsePageParam, parseQueryParam, type LibrarySearchParams } from "@/lib/library";
import { mediaInteraktifListPath } from "@/lib/routes";
import { LibrarySearchBar } from "@/components/library/LibrarySearchBar";
import { LibraryPagination } from "@/components/library/LibraryPagination";
import { CtaBantuanBanner } from "@/components/library/CtaBantuanBanner";
import { MediaInteraktifCard } from "@/components/library/MediaInteraktifCard";
import {
  IkonFiturMedia,
  IlustrasiMediaInteraktif,
  type FiturMedia,
} from "@/components/library/IkonMediaInteraktif";

/**
 * Susunan halaman mengikuti mockup Figma yang ditinjau 26 Agu 2026: hero dua
 * kolom (teks + ilustrasi) dengan 4 keunggulan di bawahnya, lalu SATU panel
 * putih yang memuat pencarian sekaligus daftar medianya, ditutup banner CTA.
 */

const fiturStatis: { key: FiturMedia; id: string; en: string; idKet: string; enKet: string }[] = [
  {
    key: "interaktif",
    id: "Interaktif",
    en: "Interactive",
    idKet: "Melibatkan siswa secara aktif",
    enKet: "Keeps students actively involved",
  },
  {
    key: "mudah",
    id: "Mudah Digunakan",
    en: "Easy to Use",
    idKet: "Akses praktis di berbagai perangkat",
    enKet: "Works easily across devices",
  },
  {
    key: "kurikulum",
    id: "Sesuai Kurikulum",
    en: "Curriculum-Aligned",
    idKet: "Materi selaras dengan capaian pembelajaran",
    enKet: "Matched to learning outcomes",
  },
  {
    key: "aman",
    id: "Aman & Terpercaya",
    en: "Safe & Trusted",
    idKet: "Konten berkualitas dan terverifikasi",
    enKet: "Verified, quality-checked content",
  },
];

const text = {
  id: {
    title: "Media Digital Interaktif",
    description:
      "Kumpulan media pembelajaran interaktif yang dirancang untuk mendukung proses belajar mengajar menjadi lebih menarik, menyenangkan, dan mudah dipahami oleh siswa.",
    cariTitle: "Cari Kebutuhan Anda!",
    cariSubtitle: "Temukan sesuai kebutuhan anda dengan mudah.",
    searchPlaceholder: "Cari materi, topik, kelas, atau kata kunci...",
    populer: "Pencarian Populer",
    listTitle: "Media Interaktif",
    empty: "Belum ada media interaktif yang cocok dengan pencarian Anda.",
  },
  en: {
    title: "Interactive Digital Media",
    description:
      "A collection of interactive learning media designed to make teaching and learning more engaging, enjoyable, and easier for students to understand.",
    cariTitle: "Find What You Need!",
    cariSubtitle: "Find exactly what you are looking for, easily.",
    searchPlaceholder: "Search materials, topics, grade, or keywords...",
    populer: "Popular Searches",
    listTitle: "Interactive Media",
    empty: "No interactive media matched your search yet.",
  },
} satisfies Record<Locale, unknown>;

export async function MediaInteraktifListContent({
  searchParams,
  locale = DEFAULT_LOCALE,
}: {
  searchParams: LibrarySearchParams;
  locale?: Locale;
}) {
  const t = text[locale];
  const q = parseQueryParam(searchParams.q);
  const tag = parseQueryParam(searchParams.tag);
  const page = parsePageParam(searchParams.page);

  const [{ docs, totalPages, page: currentPage }, popularTags] = await Promise.all([
    getMediaInteraktifList({ q, tag, page, locale }),
    getPopularMediaInteraktifTags(locale),
  ]);

  const basePath = mediaInteraktifListPath(locale);

  return (
    <div className="bg-surface">
      <section className="container-page grid gap-10 py-14 sm:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <div>
          <h1 className="text-3xl font-bold leading-tight text-brand-navy sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-body sm:text-base">
            {t.description}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {fiturStatis.map((f) => (
              <div key={f.key} className="flex flex-col gap-2">
                <IkonFiturMedia fitur={f.key} />
                <span className="text-sm font-bold text-brand-navy">
                  {locale === "en" ? f.en : f.id}
                </span>
                <span className="text-xs leading-relaxed text-muted">
                  {locale === "en" ? f.enKet : f.idKet}
                </span>
              </div>
            ))}
          </div>
        </div>

        <IlustrasiMediaInteraktif className="mx-auto w-full max-w-md lg:max-w-none" />
      </section>

      <div className="container-page space-y-12 pb-14 sm:pb-20">
        <section className="rounded-card bg-white p-6 shadow-soft sm:p-9">
          <h2 className="text-xl font-bold text-brand-navy sm:text-2xl">{t.cariTitle}</h2>
          <p className="mt-1.5 text-sm text-muted">{t.cariSubtitle}</p>

          <div className="mt-6">
            <LibrarySearchBar
              defaultValue={q}
              placeholder={t.searchPlaceholder}
              locale={locale}
              variant="kotak"
            />
          </div>

          {popularTags.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted">{t.populer}:</span>
              {popularTags.map((label) => (
                <Link
                  key={label}
                  href={`${basePath}?tag=${encodeURIComponent(label)}`}
                  aria-current={tag === label ? "true" : undefined}
                  className={`rounded-pill px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    tag === label
                      ? "bg-brand-navy text-white"
                      : "bg-surface text-brand-navy hover:bg-brand-navy/10"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}

          <h2 className="mt-10 border-b border-brand-navy/10 pb-4 text-lg font-bold text-brand-navy sm:text-xl">
            {t.listTitle}
          </h2>

          {docs.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">{t.empty}</p>
          ) : (
            <div className="divide-y divide-brand-navy/10">
              {docs.map((item) => (
                <MediaInteraktifCard key={item.id} item={item} locale={locale} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 border-t border-brand-navy/10 pt-6">
              <LibraryPagination
                page={currentPage}
                totalPages={totalPages}
                searchParams={searchParams}
                locale={locale}
              />
            </div>
          )}
        </section>

        <CtaBantuanBanner locale={locale} />
      </div>
    </div>
  );
}
