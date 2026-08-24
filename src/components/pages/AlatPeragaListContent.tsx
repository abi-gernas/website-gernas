import { getAlatPeragaList } from "@/lib/alatPeraga";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import {
  LIBRARY_PAGE_SIZE,
  parseListParam,
  parsePageParam,
  parseQueryParam,
  type LibrarySearchParams,
} from "@/lib/library";
import { alatPeragaListPath } from "@/lib/routes";
import { LibrarySearchBar } from "@/components/library/LibrarySearchBar";
import { LibraryCategoryChips } from "@/components/library/LibraryCategoryChips";
import { LibraryPagination } from "@/components/library/LibraryPagination";
import { CtaBantuanBanner } from "@/components/library/CtaBantuanBanner";
import { AlatPeragaCard } from "@/components/library/AlatPeragaCard";

const text = {
  id: {
    eyebrow: "Library Materi Guru",
    title: "Alat Peraga",
    description:
      "Koleksi alat peraga siap pakai untuk mendukung pembelajaran matematika dan membaca di kelas.",
    searchPlaceholder: "Cari alat peraga...",
    categoryTitle: "Jelajahi Berdasarkan Kategori",
    matematika: "Gernas Tastaka",
    matematikaDeskripsi: "Alat peraga numerasi & matematika",
    membaca: "Gernas Tastaba",
    membacaDeskripsi: "Alat peraga membaca & literasi",
    empty: "Belum ada alat peraga yang cocok dengan pencarian Anda.",
    showing: (start: number, end: number, total: number) =>
      `Menampilkan ${start}–${end} dari ${total} produk`,
  },
  en: {
    eyebrow: "Teacher Materials Library",
    title: "Teaching Aids",
    description:
      "A collection of ready-to-use teaching aids to support math and reading instruction in the classroom.",
    searchPlaceholder: "Search teaching aids...",
    categoryTitle: "Browse by Category",
    matematika: "Gernas Tastaka",
    matematikaDeskripsi: "Numeracy & math teaching aids",
    membaca: "Gernas Tastaba",
    membacaDeskripsi: "Reading & literacy teaching aids",
    empty: "No teaching aids matched your search yet.",
    showing: (start: number, end: number, total: number) =>
      `Showing ${start}–${end} of ${total} products`,
  },
} satisfies Record<Locale, unknown>;

export async function AlatPeragaListContent({
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

  const { docs, totalDocs, totalPages, page: currentPage } = await getAlatPeragaList({
    q,
    jenjang,
    mapel,
    page,
    locale,
  });

  const start = totalDocs === 0 ? 0 : (currentPage - 1) * LIBRARY_PAGE_SIZE + 1;
  const end = Math.min(currentPage * LIBRARY_PAGE_SIZE, totalDocs);
  const basePath = alatPeragaListPath(locale);

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
          <h2 className="mb-5 text-lg font-bold text-brand-navy">{t.categoryTitle}</h2>
          <LibraryCategoryChips
            items={[
              {
                label: t.matematika,
                deskripsi: t.matematikaDeskripsi,
                href: `${basePath}?mapel=matematika`,
              },
              {
                label: t.membaca,
                deskripsi: t.membacaDeskripsi,
                href: `${basePath}?mapel=membaca`,
              },
            ]}
          />
        </div>

        <div>
          {docs.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">{t.empty}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {docs.map((item) => (
                <AlatPeragaCard key={item.id} item={item} locale={locale} />
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
