import { getVideoPembelajaranList } from "@/lib/videoPembelajaran";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { LIBRARY_PAGE_SIZE, parseListParam, parsePageParam, parseQueryParam, type LibrarySearchParams } from "@/lib/library";
import { LibrarySearchBar } from "@/components/library/LibrarySearchBar";
import { LibraryPagination } from "@/components/library/LibraryPagination";
import { CtaBantuanBanner } from "@/components/library/CtaBantuanBanner";
import { VideoPembelajaranCard } from "@/components/library/VideoPembelajaranCard";

const text = {
  id: {
    eyebrow: "Library Materi Guru",
    title: "Video Pembelajaran",
    description: "Kumpulan video pembelajaran per jenjang dan mapel untuk mendukung kegiatan belajar mengajar.",
    searchPlaceholder: "Cari video pembelajaran...",
    empty: "Belum ada video yang cocok dengan pencarian Anda.",
    showing: (start: number, end: number, total: number) => `Menampilkan ${start}–${end} dari ${total} video`,
  },
  en: {
    eyebrow: "Teacher Materials Library",
    title: "Learning Videos",
    description: "A collection of learning videos by grade level and subject to support your teaching.",
    searchPlaceholder: "Search learning videos...",
    empty: "No videos matched your search yet.",
    showing: (start: number, end: number, total: number) => `Showing ${start}–${end} of ${total} videos`,
  },
} satisfies Record<Locale, unknown>;

export async function VideoPembelajaranListContent({
  searchParams,
  locale = DEFAULT_LOCALE,
}: {
  searchParams: LibrarySearchParams;
  locale?: Locale;
}) {
  const t = text[locale];
  const q = parseQueryParam(searchParams.q);
  const jenjang = parseListParam(searchParams.jenjang);
  const mapel = parseListParam(searchParams.mapel);
  const page = parsePageParam(searchParams.page);

  const { docs, totalDocs, totalPages, page: currentPage } = await getVideoPembelajaranList({
    q,
    jenjang,
    mapel,
    page,
    locale,
  });

  const start = totalDocs === 0 ? 0 : (currentPage - 1) * LIBRARY_PAGE_SIZE + 1;
  const end = Math.min(currentPage * LIBRARY_PAGE_SIZE, totalDocs);

  return (
    <div>
      <section className="bg-surface">
        <div className="container-page flex flex-col items-center gap-6 py-14 text-center sm:py-20">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1 className="text-2xl font-bold text-brand-navy sm:text-4xl">{t.title}</h1>
          <p className="max-w-2xl text-sm text-muted sm:text-base">{t.description}</p>
          <LibrarySearchBar defaultValue={q} placeholder={t.searchPlaceholder} locale={locale} />
        </div>
      </section>

      <div className="container-page space-y-12 py-14 sm:py-20">
        <div>
          {docs.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">{t.empty}</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {docs.map((item) => (
                <VideoPembelajaranCard key={item.id} item={item} locale={locale} />
              ))}
            </div>
          )}

          {totalDocs > 0 && (
            <div className="mt-8 flex flex-col items-center gap-4">
              <p className="text-sm text-muted">{t.showing(start, end, totalDocs)}</p>
              <LibraryPagination page={currentPage} totalPages={totalPages} searchParams={searchParams} locale={locale} />
            </div>
          )}
        </div>

        <CtaBantuanBanner locale={locale} />
      </div>
    </div>
  );
}
