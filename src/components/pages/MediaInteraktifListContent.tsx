import Link from "next/link";
import { getMediaInteraktifList, getPopularMediaInteraktifTags } from "@/lib/mediaInteraktif";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { LIBRARY_PAGE_SIZE, parsePageParam, parseQueryParam, type LibrarySearchParams } from "@/lib/library";
import { mediaInteraktifListPath } from "@/lib/routes";
import { LibrarySearchBar } from "@/components/library/LibrarySearchBar";
import { LibraryPagination } from "@/components/library/LibraryPagination";
import { CtaBantuanBanner } from "@/components/library/CtaBantuanBanner";
import { MediaInteraktifCard } from "@/components/library/MediaInteraktifCard";

const fiturStatis = [
  { ikon: "🕹️", id: "Interaktif", en: "Interactive" },
  { ikon: "✅", id: "Mudah Digunakan", en: "Easy to Use" },
  { ikon: "📚", id: "Sesuai Kurikulum", en: "Curriculum-Aligned" },
  { ikon: "🔒", id: "Aman & Terpercaya", en: "Safe & Trusted" },
];

const text = {
  id: {
    eyebrow: "Library Materi Guru",
    title: "Media Digital Interaktif",
    description:
      "Kumpulan tautan aktivitas dan media pembelajaran interaktif untuk memperkaya kelas Anda.",
    searchPlaceholder: "Cari media interaktif...",
    populer: "Pencarian Populer",
    empty: "Belum ada media interaktif yang cocok dengan pencarian Anda.",
    showing: (start: number, end: number, total: number) =>
      `Menampilkan ${start}–${end} dari ${total} media`,
  },
  en: {
    eyebrow: "Teacher Materials Library",
    title: "Interactive Digital Media",
    description:
      "A collection of interactive learning activities and media links to enrich your classroom.",
    searchPlaceholder: "Search interactive media...",
    populer: "Popular Searches",
    empty: "No interactive media matched your search yet.",
    showing: (start: number, end: number, total: number) =>
      `Showing ${start}–${end} of ${total} media`,
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

  const [{ docs, totalDocs, totalPages, page: currentPage }, popularTags] = await Promise.all([
    getMediaInteraktifList({ q, tag, page, locale }),
    getPopularMediaInteraktifTags(locale),
  ]);

  const start = totalDocs === 0 ? 0 : (currentPage - 1) * LIBRARY_PAGE_SIZE + 1;
  const end = Math.min(currentPage * LIBRARY_PAGE_SIZE, totalDocs);
  const basePath = mediaInteraktifListPath(locale);

  return (
    <div>
      <section className="bg-surface">
        <div className="container-page flex flex-col items-center gap-6 py-14 text-center sm:py-20">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1 className="text-2xl font-bold text-brand-navy sm:text-4xl">{t.title}</h1>
          <p className="max-w-2xl text-sm text-muted sm:text-base">{t.description}</p>

          <div className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {fiturStatis.map((f) => (
              <div key={f.id} className="flex flex-col items-center gap-1.5 text-center">
                <span className="text-3xl" aria-hidden="true">
                  {f.ikon}
                </span>
                <span className="text-xs font-semibold text-brand-navy">
                  {locale === "en" ? f.en : f.id}
                </span>
              </div>
            ))}
          </div>

          <LibrarySearchBar defaultValue={q} placeholder={t.searchPlaceholder} locale={locale} />

          {popularTags.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold text-muted">{t.populer}:</span>
              {popularTags.map((label) => (
                <Link
                  key={label}
                  href={`${basePath}?tag=${encodeURIComponent(label)}`}
                  aria-current={tag === label ? "true" : undefined}
                  className={`rounded-pill px-3 py-1 text-xs font-semibold ${
                    tag === label
                      ? "bg-brand-red text-white"
                      : "bg-white text-brand-navy hover:bg-brand-navy/5"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="container-page space-y-12 py-14 sm:py-20">
        <div>
          {docs.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">{t.empty}</p>
          ) : (
            <div className="flex flex-col gap-4">
              {docs.map((item) => (
                <MediaInteraktifCard key={item.id} item={item} locale={locale} />
              ))}
            </div>
          )}

          {totalDocs > 0 && (
            <div className="mt-8 flex flex-col items-center gap-4">
              <p className="text-sm text-muted">{t.showing(start, end, totalDocs)}</p>
              <LibraryPagination
                page={currentPage}
                totalPages={totalPages}
                searchParams={searchParams}
                locale={locale}
              />
            </div>
          )}
        </div>

        <CtaBantuanBanner locale={locale} />
      </div>
    </div>
  );
}
