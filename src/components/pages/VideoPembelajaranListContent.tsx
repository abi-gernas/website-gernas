import Image from "next/image";
import { getVideoPembelajaranList, getVideoPembelajaranPilihan } from "@/lib/videoPembelajaran";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import {
  LIBRARY_PAGE_SIZE,
  parseListParam,
  parsePageParam,
  parseQueryParam,
  type LibrarySearchParams,
} from "@/lib/library";
import { LibrarySearchBar } from "@/components/library/LibrarySearchBar";
import { LibraryPagination } from "@/components/library/LibraryPagination";
import { CtaBantuanBanner } from "@/components/library/CtaBantuanBanner";
import { VideoPembelajaranCard } from "@/components/library/VideoPembelajaranCard";
import { VideoPilihanCarousel } from "@/components/library/VideoPilihanCarousel";

const text = {
  id: {
    title: "Video Pembelajaran",
    description:
      "Kumpulan video pembelajaran berkualitas yang siap digunakan untuk mendukung pembelajaran di kelas.",
    searchPlaceholder: "Cari materi, topik, kelas, atau kata kunci...",
    pilihanTitle: "Video Pilihan",
    listTitle: "Semua Video",
    empty: "Belum ada video yang cocok dengan pencarian Anda.",
    showing: (start: number, end: number, total: number) =>
      `Menampilkan ${start}–${end} dari ${total} video`,
  },
  en: {
    title: "Learning Videos",
    description:
      "A collection of quality learning videos ready to support learning in the classroom.",
    searchPlaceholder: "Search materials, topics, grade, or keywords...",
    pilihanTitle: "Featured Videos",
    listTitle: "All Videos",
    empty: "No videos matched your search yet.",
    showing: (start: number, end: number, total: number) =>
      `Showing ${start}–${end} of ${total} videos`,
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

  const [{ docs, totalDocs, totalPages, page: currentPage }, pilihan] = await Promise.all([
    getVideoPembelajaranList({ q, jenjang, mapel, page, locale }),
    getVideoPembelajaranPilihan(locale),
  ]);

  const start = totalDocs === 0 ? 0 : (currentPage - 1) * LIBRARY_PAGE_SIZE + 1;
  const end = Math.min(currentPage * LIBRARY_PAGE_SIZE, totalDocs);
  const promo = pilihan[0];

  return (
    <div>
      <section className="border-b border-black/[0.07]">
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

          {/* Gambar promo hero = thumbnail video sematan, bukan aset terpisah —
              pola yang sama dengan halaman Alat Peraga & Buku, belum ada berkas
              promo khusus di koleksi Media. */}
          {promo?.thumbnail && (
            <div className="relative mx-auto aspect-video w-full max-w-sm overflow-hidden rounded-card lg:max-w-none">
              <Image
                src={promo.thumbnail.url}
                alt={promo.judul}
                fill
                sizes="(min-width: 1024px) 40vw, 384px"
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </section>

      {pilihan.length > 0 && (
        <section className="border-b border-black/[0.07]">
          <div className="container-page py-12">
            <h2 className="mb-5 text-lg font-bold text-brand-navy">{t.pilihanTitle}</h2>
            <VideoPilihanCarousel items={pilihan} locale={locale} />
          </div>
        </section>
      )}

      <div className="container-page space-y-14 py-14 sm:py-20">
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
                <VideoPembelajaranCard key={item.id} item={item} locale={locale} />
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
