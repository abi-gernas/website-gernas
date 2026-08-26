import Image from "next/image";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import {
  LIBRARY_PAGE_SIZE,
  parseListParam,
  parsePageParam,
  parseQueryParam,
  type LibrarySearchParams,
} from "@/lib/library";
import { KATEGORI_PRODUK_LABELS, getProdukList, getProdukTerbaru, type KategoriProduk } from "@/lib/produk";
import { produkListPath } from "@/lib/routes";
import { LibrarySearchBar } from "@/components/library/LibrarySearchBar";
import { LibraryCategoryChips, type ChipWarna } from "@/components/library/LibraryCategoryChips";
import { LibraryPagination } from "@/components/library/LibraryPagination";
import { CtaBantuanBanner } from "@/components/library/CtaBantuanBanner";
import { IkonKategoriProduk } from "@/components/library/IkonKategoriProduk";
import { ProdukCard } from "@/components/library/ProdukCard";
import { ProdukTerbaru } from "@/components/library/ProdukTerbaru";

const text = {
  id: {
    title: "Buku, Bahan Ajar & Modul",
    description:
      "Kumpulan buku, modul dan bahan ajar berkualitas yang siap digunakan untuk mendukung pembelajaran di kelas.",
    searchPlaceholder: "Cari materi, topik, kelas, atau kata kunci...",
    categoryTitle: "Jelajahi Berdasarkan Kategori",
    listTitle: "Semua Buku, Bahan Ajar & Modul",
    empty: "Belum ada produk yang cocok dengan pencarian Anda.",
    showing: (start: number, end: number, total: number) =>
      `Menampilkan ${start}–${end} dari ${total} produk`,
  },
  en: {
    title: "Books, Teaching Materials & Modules",
    description:
      "A collection of quality books, modules, and teaching materials ready to support learning in the classroom.",
    searchPlaceholder: "Search materials, topics, grade, or keywords...",
    categoryTitle: "Browse by Category",
    listTitle: "All Books, Teaching Materials & Modules",
    empty: "No products matched your search yet.",
    showing: (start: number, end: number, total: number) =>
      `Showing ${start}–${end} of ${total} products`,
  },
} satisfies Record<Locale, unknown>;

/** Deskripsi + tint tiap kartu kategori, mengikuti mockup (urutan & warnanya). */
const kategoriKartu: {
  kategori: KategoriProduk;
  warna: ChipWarna;
  deskripsi: Record<Locale, string>;
}[] = [
  {
    kategori: "modul",
    warna: "biru",
    deskripsi: { id: "Pembelajaran siap pakai", en: "Ready-to-use lessons" },
  },
  {
    kategori: "buku",
    warna: "merah",
    deskripsi: { id: "Referensi dan panduan guru", en: "References and teacher guides" },
  },
  {
    kategori: "bahan-ajar",
    warna: "kuning",
    deskripsi: { id: "Materi ajar praktis dan kontekstual", en: "Practical, contextual materials" },
  },
  {
    kategori: "lks",
    warna: "langit",
    deskripsi: { id: "Lembar kerja siswa dan aktivitas", en: "Student worksheets and activities" },
  },
];

export async function ProdukListContent({
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
  const kategori = parseListParam(searchParams.kategori);
  const page = parsePageParam(searchParams.page);

  const [{ docs, totalDocs, totalPages, page: currentPage }, terbaru] = await Promise.all([
    getProdukList({ q, jenjang, mapel, kategori, page, locale }),
    getProdukTerbaru(locale),
  ]);

  const start = totalDocs === 0 ? 0 : (currentPage - 1) * LIBRARY_PAGE_SIZE + 1;
  const end = Math.min(currentPage * LIBRARY_PAGE_SIZE, totalDocs);
  const basePath = produkListPath(locale);

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

          {/* Gambar promo hero = sampul produk sematan, bukan aset terpisah — belum ada berkas khusus untuk ini di Media. */}
          {terbaru?.cover && (
            <div className="relative mx-auto aspect-square w-full max-w-sm lg:max-w-none">
              <Image
                src={terbaru.cover.url}
                alt={terbaru.judul}
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
        {terbaru && <ProdukTerbaru item={terbaru} locale={locale} />}

        <div>
          <h2 className="mb-5 text-lg font-bold text-brand-navy">{t.categoryTitle}</h2>
          <LibraryCategoryChips
            items={kategoriKartu.map((k) => ({
              label: KATEGORI_PRODUK_LABELS[k.kategori][locale],
              deskripsi: k.deskripsi[locale],
              ikon: <IkonKategoriProduk kategori={k.kategori} />,
              href: `${basePath}?kategori=${k.kategori}`,
              warna: k.warna,
            }))}
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
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {docs.map((item) => (
                <ProdukCard key={item.id} item={item} locale={locale} />
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
