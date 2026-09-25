import Image from "next/image";
import Link from "next/link";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import {
  LIBRARY_PAGE_SIZE,
  parseListParam,
  parsePageParam,
  parseQueryParam,
  withParam,
  type LibrarySearchParams,
} from "@/lib/library";
import { KATEGORI_PRODUK_LABELS, TOPIK_PRODUK_LABELS, getProdukList, getProdukTerbaru, type TopikProduk } from "@/lib/produk";
import { produkListPath } from "@/lib/routes";
import { LibrarySearchBar } from "@/components/library/LibrarySearchBar";
import { LibraryCategoryChips, type ChipWarna } from "@/components/library/LibraryCategoryChips";
import { LibraryPagination } from "@/components/library/LibraryPagination";
import { CtaBantuanBanner } from "@/components/library/CtaBantuanBanner";
import { IkonKategoriProduk } from "@/components/library/IkonKategoriProduk";
import { IkonTopikProduk } from "@/components/library/IkonTopikProduk";
import { ProdukCard } from "@/components/library/ProdukCard";
import { ProdukTerbaru } from "@/components/library/ProdukTerbaru";
import { Breadcrumb, labelKatalogGuru } from "@/components/library/Breadcrumb";

const text = {
  id: {
    title: "Buku, Bahan Ajar & Modul",
    description:
      "Kumpulan buku, modul dan bahan ajar berkualitas yang siap digunakan untuk mendukung pembelajaran di kelas.",
    searchPlaceholder: "Cari materi, topik, kelas, atau kata kunci...",
    categoryTitle: "Jelajahi Berdasarkan Kategori",
    listTitle: "Semua Buku, Bahan Ajar & Modul",
    empty: "Belum ada produk yang cocok dengan pencarian Anda.",
    semua: "Semua",
    gratis: "Gratis",
    berbayar: "Berbayar",
    hapusFilter: "Hapus filter",
    filterAktif: "Filter",
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
    semua: "All",
    gratis: "Free",
    berbayar: "Paid",
    hapusFilter: "Clear filter",
    filterAktif: "Filter",
    showing: (start: number, end: number, total: number) =>
      `Showing ${start}–${end} of ${total} products`,
  },
} satisfies Record<Locale, unknown>;

/**
 * Deskripsi + tint tiap kartu topik.
 *
 * Urutan & isinya mengikuti folder di Google Drive "Konten" yang jadi sumber
 * materinya (lihat `scripts/fetch-drive-konten.mts`), bukan lagi keempat
 * kartu jenis materi Modul/Buku/Bahan Ajar/LKS di mockup awal: seluruh materi
 * yang sudah ada berjenis sama, jadi kartu jenis tidak memisahkan apa pun.
 * Warnanya bergilir merah–biru–kuning seperti kartu Modul Pelatihan.
 */
const topikKartu: {
  topik: TopikProduk;
  warna: ChipWarna;
  deskripsi: Record<Locale, string>;
}[] = [
  {
    topik: "geometri",
    warna: "biru",
    deskripsi: { id: "Bangun datar, bangun ruang, dan sudut", en: "Shapes, solids, and angles" },
  },
  {
    topik: "bilangan-cacah",
    warna: "merah",
    deskripsi: { id: "Nilai tempat sampai perkalian & pembagian", en: "Place value to multiplication & division" },
  },
  {
    topik: "pecahan",
    warna: "kuning",
    deskripsi: { id: "Pecahan senilai, desimal, dan persen", en: "Equivalent fractions, decimals, and percent" },
  },
  {
    topik: "bilangan-bulat",
    warna: "langit",
    deskripsi: { id: "Bilangan negatif dan operasinya", en: "Negative numbers and their operations" },
  },
  {
    topik: "statistika",
    warna: "biru",
    deskripsi: { id: "Penyajian data, mean, median, modus", en: "Data displays, mean, median, mode" },
  },
  {
    topik: "pengukuran",
    warna: "merah",
    deskripsi: { id: "Keliling, luas, volume, dan waktu", en: "Perimeter, area, volume, and time" },
  },
];

/**
 * Kartu ke-7 setelah topik: alat peraga bukan topik melainkan Jenis materi
 * (`kategoriProduk`), sejak halaman Alat Peraga digabung ke sini (22 Sep 2026).
 */
const alatPeragaKartu: { warna: ChipWarna; deskripsi: Record<Locale, string> } = {
  warna: "kuning",
  deskripsi: { id: "Alat bantu konsep untuk dipakai di kelas", en: "Hands-on aids for classroom use" },
};

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
  const topik = parseListParam(searchParams.topik);
  const page = parsePageParam(searchParams.page);
  const statusParam = parseQueryParam(searchParams.status);
  const status = statusParam === "gratis" || statusParam === "berbayar" ? statusParam : undefined;

  const [{ docs, totalDocs, totalPages, page: currentPage }, terbaru] = await Promise.all([
    getProdukList({ q, jenjang, mapel, kategori, topik, status, page, locale }),
    getProdukTerbaru(locale),
  ]);

  const start = totalDocs === 0 ? 0 : (currentPage - 1) * LIBRARY_PAGE_SIZE + 1;
  const end = Math.min(currentPage * LIBRARY_PAGE_SIZE, totalDocs);
  const basePath = produkListPath(locale);
  // Link filter mempertahankan parameter lain (q, status, …) dan membuang `page`.
  // Klik kartu yang sedang aktif = melepas filternya.
  const hrefFilter = (o: Record<string, string | undefined>) =>
    `${basePath}${withParam(searchParams, { page: undefined, ...o })}`;
  const namaFilterAktif =
    topik.length > 0
      ? TOPIK_PRODUK_LABELS[topik[0] as TopikProduk]?.[locale]
      : kategori.includes("alat-peraga")
        ? KATEGORI_PRODUK_LABELS["alat-peraga"][locale]
        : undefined;

  return (
    <div>
      <section className="bg-surface">
        <div className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div>
            <Breadcrumb
              locale={locale}
              items={[{ label: labelKatalogGuru.produk[locale] }]}
              className="mb-5"
            />
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
            items={[
              ...topikKartu.map((k) => ({
                label: TOPIK_PRODUK_LABELS[k.topik][locale],
                deskripsi: k.deskripsi[locale],
                ikon: <IkonTopikProduk topik={k.topik} />,
                href: hrefFilter({ kategori: undefined, topik: topik[0] === k.topik ? undefined : k.topik }),
                aktif: topik[0] === k.topik,
                warna: k.warna,
              })),
              {
                label: KATEGORI_PRODUK_LABELS["alat-peraga"][locale],
                deskripsi: alatPeragaKartu.deskripsi[locale],
                ikon: <IkonKategoriProduk kategori="alat-peraga" />,
                href: hrefFilter({
                  topik: undefined,
                  kategori: kategori.includes("alat-peraga") ? undefined : "alat-peraga",
                }),
                aktif: kategori.includes("alat-peraga"),
                warna: alatPeragaKartu.warna,
              },
            ]}
          />
        </div>

        <div>
          <h2 className="text-lg font-bold text-brand-navy">{t.listTitle}</h2>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {(
              [
                [undefined, t.semua],
                ["gratis", t.gratis],
                ["berbayar", t.berbayar],
              ] as const
            ).map(([nilai, label]) => (
              <Link
                key={label}
                href={hrefFilter({ status: nilai })}
                scroll={false}
                aria-current={status === nilai ? "true" : undefined}
                className={`rounded-pill px-4 py-1.5 text-sm font-semibold transition-colors ${
                  status === nilai
                    ? "bg-brand-navy text-white"
                    : "bg-brand-navy/5 text-brand-navy hover:bg-brand-navy/10"
                }`}
              >
                {label}
              </Link>
            ))}
            {namaFilterAktif && (
              <span className="ml-1 inline-flex items-center gap-2 rounded-pill bg-brand-yellow/20 px-3 py-1.5 text-sm font-semibold text-brand-navy">
                {t.filterAktif}: {namaFilterAktif}
                <Link
                  href={hrefFilter({ topik: undefined, kategori: undefined })}
                  scroll={false}
                  aria-label={t.hapusFilter}
                  className="text-base leading-none hover:text-brand-red"
                >
                  ×
                </Link>
              </span>
            )}
          </div>
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
