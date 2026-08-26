import Image from "next/image";
import { getAlatPeragaList, getAlatPeragaSematan } from "@/lib/alatPeraga";
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
import { IkonAlatPeraga } from "@/components/library/IkonAlatPeraga";
import { AlatPeragaCard } from "@/components/library/AlatPeragaCard";

const text = {
  id: {
    title: "Alat Peraga",
    description:
      "Kumpulan alat peraga berkualitas yang siap digunakan untuk mendukung pembelajaran di kelas.",
    searchPlaceholder: "Cari materi, topik, kelas, atau kata kunci...",
    categoryTitle: "Jelajahi Berdasarkan Kategori",
    listTitle: "Semua Alat Peraga",
    matematika: "Gernas Tastaka",
    matematikaDeskripsi: "Alat peraga numerasi & matematika",
    membaca: "Gernas Tastaba",
    membacaDeskripsi: "Alat peraga membaca & literasi",
    empty: "Belum ada alat peraga yang cocok dengan pencarian Anda.",
    showing: (start: number, end: number, total: number) =>
      `Menampilkan ${start}–${end} dari ${total} produk`,
  },
  en: {
    title: "Teaching Aids",
    description:
      "A collection of quality teaching aids ready to support learning in the classroom.",
    searchPlaceholder: "Search materials, topics, grade, or keywords...",
    categoryTitle: "Browse by Category",
    listTitle: "All Teaching Aids",
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

  const [{ docs, totalDocs, totalPages, page: currentPage }, sematan] = await Promise.all([
    getAlatPeragaList({ q, jenjang, mapel, page, locale }),
    getAlatPeragaSematan(locale),
  ]);

  const start = totalDocs === 0 ? 0 : (currentPage - 1) * LIBRARY_PAGE_SIZE + 1;
  const end = Math.min(currentPage * LIBRARY_PAGE_SIZE, totalDocs);
  const basePath = alatPeragaListPath(locale);

  return (
    <div>
      <section className="bg-surface">
        <div className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div>
            <h1 className="text-3xl font-bold leading-tight text-brand-navy sm:text-4xl">
              {t.title}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-body sm:text-base">
              {t.description}
            </p>
            <div className="mt-7">
              <LibrarySearchBar
                defaultValue={q}
                placeholder={t.searchPlaceholder}
                locale={locale}
                variant="kotak"
              />
            </div>
          </div>

          {/* Gambar promo hero = sampul alat peraga sematan, bukan aset terpisah — belum ada berkas khusus untuk ini di Media. */}
          {sematan?.cover && (
            <div className="relative mx-auto aspect-square w-full max-w-sm lg:max-w-none">
              <Image
                src={sematan.cover.url}
                alt={sematan.judul}
                fill
                sizes="(min-width: 1024px) 40vw, 384px"
                className="object-contain"
                priority
              />
            </div>
          )}
        </div>
      </section>

      <div className="container-page space-y-14 py-14 sm:py-20">
        <div>
          <h2 className="mb-5 text-lg font-bold text-brand-navy">{t.categoryTitle}</h2>
          <LibraryCategoryChips
            variant="lebar"
            items={[
              {
                label: t.matematika,
                deskripsi: t.matematikaDeskripsi,
                ikon: <IkonAlatPeraga kategori="tastaka" />,
                href: `${basePath}?mapel=matematika`,
                warna: "biru",
              },
              {
                label: t.membaca,
                deskripsi: t.membacaDeskripsi,
                ikon: <IkonAlatPeraga kategori="tastaba" />,
                href: `${basePath}?mapel=membaca`,
                warna: "merah",
              },
            ]}
          />
        </div>

        <div>
          <h2 className="text-lg font-bold text-brand-navy">{t.listTitle}</h2>
          {totalDocs > 0 && (
            <p className="mt-1 text-sm text-muted">{t.showing(start, end, totalDocs)}</p>
          )}

          {docs.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">{t.empty}</p>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {docs.map((item) => (
                <AlatPeragaCard key={item.id} item={item} locale={locale} />
              ))}
            </div>
          )}

          {totalDocs > 0 && (
            <div className="mt-10">
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
