import Link from "next/link";
import type { Metadata } from "next";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { parseQueryParam, type LibrarySearchParams } from "@/lib/library";
import { cariPerangkatGuru, getTagPopulerPojokGuru } from "@/lib/pencarianGuru";
import {
  alatPeragaListPath,
  mediaInteraktifListPath,
  pojokGuruCariPath,
  produkListPath,
  videoPembelajaranListPath,
} from "@/lib/routes";
import { AlatPeragaCard } from "@/components/library/AlatPeragaCard";
import { Breadcrumb, labelKatalogGuru } from "@/components/library/Breadcrumb";
import { CtaBantuanBanner } from "@/components/library/CtaBantuanBanner";
import { LibrarySearchBar } from "@/components/library/LibrarySearchBar";
import { MediaInteraktifCard } from "@/components/library/MediaInteraktifCard";
import { ProdukCard } from "@/components/library/ProdukCard";
import { VideoPembelajaranCard } from "@/components/library/VideoPembelajaranCard";

const text = {
  id: {
    judul: "Cari Perangkat Pembelajaran",
    judulHasil: (q: string) => `Hasil pencarian “${q}”`,
    remah: "Pencarian",
    deskripsi:
      "Cari sekaligus di buku & bahan ajar, alat peraga, video pembelajaran, dan media interaktif.",
    placeholder: "Cari materi, topik, kelas, atau kata kunci…",
    ringkasan: (total: number, katalog: number) =>
      `${total} materi ditemukan di ${katalog} katalog.`,
    lihatSemua: (n: number) => `Lihat semua ${n} hasil`,
    populer: "Pencarian Populer",
    loncat: "Loncat ke katalog",
    tanpaHasilDi: "Tidak ada hasil di",
    kosongJudul: (q: string) => `Belum ada materi yang cocok dengan “${q}”`,
    kosongSaran:
      "Coba kata kunci yang lebih umum atau periksa ejaannya. Anda juga bisa menjelajahi katalognya langsung:",
    jelajahi: "Jelajahi Katalog",
    metaJudul: "Cari Perangkat Pembelajaran — Pojok Guru",
  },
  en: {
    judul: "Search Teaching Resources",
    judulHasil: (q: string) => `Search results for “${q}”`,
    remah: "Search",
    deskripsi:
      "Search books & teaching materials, teaching aids, learning videos, and interactive media at once.",
    placeholder: "Search materials, topics, grades, or keywords…",
    ringkasan: (total: number, katalog: number) =>
      `${total} ${total === 1 ? "result" : "results"} found in ${katalog} ${katalog === 1 ? "catalog" : "catalogs"}.`,
    lihatSemua: (n: number) => `See all ${n} results`,
    populer: "Popular Searches",
    loncat: "Jump to catalog",
    tanpaHasilDi: "No results in",
    kosongJudul: (q: string) => `No materials match “${q}” yet`,
    kosongSaran:
      "Try a more general keyword or check the spelling. You can also browse the catalogs directly:",
    jelajahi: "Browse Catalogs",
    metaJudul: "Search Teaching Resources — Teacher's Corner",
  },
} satisfies Record<Locale, unknown>;

type Grup = {
  anchor: string;
  label: string;
  total: number;
  katalogHref: string;
  grid: string;
  kartu: React.ReactNode[];
};

/** Jumlah kartu per katalog — sebaris penuh sesuai grid katalog aslinya. */
const TAMPIL_4 = 4;
const TAMPIL_3 = 3;

function denganQ(href: string, q: string): string {
  return `${href}?q=${encodeURIComponent(q)}`;
}

/**
 * Halaman hasil pencarian Pojok Guru (`/pojok-guru/cari?q=`).
 *
 * Tiga keadaan: belum mengetik apa pun (ajakan + tag populer + katalog), ada
 * hasil (dikelompokkan per katalog, maks. satu baris kartu, sisanya lewat
 * "Lihat semua" ke katalognya dengan `q` yang sama), dan nihil (saran +
 * tautan katalog). Katalog tanpa hasil tidak dirender kosong — cukup disebut
 * dalam satu kalimat supaya pengunjung tahu katalog itu ikut dicari.
 */
export async function PencarianGuruContent({
  searchParams,
  locale = DEFAULT_LOCALE,
}: {
  searchParams: LibrarySearchParams;
  locale?: Locale;
}) {
  const t = text[locale];
  const q = parseQueryParam(searchParams.q);

  const [hasil, tagPopuler] = await Promise.all([
    q ? cariPerangkatGuru(q, locale) : Promise.resolve(null),
    getTagPopulerPojokGuru(locale),
  ]);

  const katalog = [
    { label: labelKatalogGuru.produk[locale], href: produkListPath(locale) },
    { label: labelKatalogGuru.alatPeraga[locale], href: alatPeragaListPath(locale) },
    { label: labelKatalogGuru.videoPembelajaran[locale], href: videoPembelajaranListPath(locale) },
    { label: labelKatalogGuru.mediaInteraktif[locale], href: mediaInteraktifListPath(locale) },
  ];

  const grup: Grup[] = hasil
    ? [
        {
          anchor: "hasil-buku",
          label: katalog[0].label,
          total: hasil.produk.totalDocs,
          katalogHref: katalog[0].href,
          grid: "sm:grid-cols-2 lg:grid-cols-4",
          kartu: hasil.produk.docs
            .slice(0, TAMPIL_4)
            .map((item) => <ProdukCard key={item.id} item={item} locale={locale} />),
        },
        {
          anchor: "hasil-alat-peraga",
          label: katalog[1].label,
          total: hasil.alatPeraga.totalDocs,
          katalogHref: katalog[1].href,
          grid: "sm:grid-cols-2 lg:grid-cols-3",
          kartu: hasil.alatPeraga.docs
            .slice(0, TAMPIL_3)
            .map((item) => <AlatPeragaCard key={item.id} item={item} locale={locale} />),
        },
        {
          anchor: "hasil-video",
          label: katalog[2].label,
          total: hasil.videoPembelajaran.totalDocs,
          katalogHref: katalog[2].href,
          grid: "sm:grid-cols-2 lg:grid-cols-3",
          kartu: hasil.videoPembelajaran.docs
            .slice(0, TAMPIL_3)
            .map((item) => <VideoPembelajaranCard key={item.id} item={item} locale={locale} />),
        },
        {
          anchor: "hasil-media-interaktif",
          label: katalog[3].label,
          total: hasil.mediaInteraktif.totalDocs,
          katalogHref: katalog[3].href,
          grid: "sm:grid-cols-2 lg:grid-cols-4",
          kartu: hasil.mediaInteraktif.docs
            .slice(0, TAMPIL_4)
            .map((item) => <MediaInteraktifCard key={item.id} item={item} locale={locale} />),
        },
      ]
    : [];

  const berisi = grup.filter((g) => g.total > 0);
  const kosong = grup.filter((g) => g.total === 0);

  return (
    <div>
      <section className="bg-surface">
        <div className="container-page py-12 sm:py-16">
          <Breadcrumb locale={locale} items={[{ label: t.remah }]} className="mb-5" />
          <h1 className="text-3xl font-bold leading-tight text-brand-navy sm:text-4xl">
            {q ? t.judulHasil(q) : t.judul}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-body sm:text-base">
            {hasil && hasil.total > 0 ? t.ringkasan(hasil.total, berisi.length) : t.deskripsi}
          </p>

          <div className="mt-7">
            <LibrarySearchBar
              defaultValue={q}
              placeholder={t.placeholder}
              locale={locale}
              variant="kotak"
              className="max-w-2xl"
            />
          </div>

          {tagPopuler.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted">{t.populer}:</span>
              {tagPopuler.map((tag) => {
                const aktif = tag.toLowerCase() === q.toLowerCase();
                return (
                  <Link
                    key={tag}
                    href={pojokGuruCariPath(locale, tag)}
                    aria-current={aktif ? "true" : undefined}
                    className={`inline-flex min-h-[32px] items-center rounded-pill px-3.5 text-xs font-semibold transition-colors ${
                      aktif
                        ? "bg-brand-navy text-white"
                        : "bg-white text-brand-navy shadow-soft hover:bg-brand-navy/10"
                    }`}
                  >
                    {tag}
                  </Link>
                );
              })}
            </div>
          )}

          {berisi.length > 1 && (
            <nav aria-label={t.loncat} className="mt-8 flex flex-wrap gap-2">
              {berisi.map((g) => (
                <a
                  key={g.anchor}
                  href={`#${g.anchor}`}
                  className="inline-flex min-h-[36px] items-center gap-2 rounded-lg border border-brand-navy/15 bg-white px-3 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-navy"
                >
                  {g.label}
                  <span className="rounded-pill bg-brand-navy/10 px-2 text-xs tabular-nums">
                    {g.total}
                  </span>
                </a>
              ))}
            </nav>
          )}
        </div>
      </section>

      <div className="container-page space-y-14 py-12 sm:py-16">
        {berisi.map((g) => (
          <section key={g.anchor} id={g.anchor} aria-labelledby={`${g.anchor}-judul`}>
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-brand-navy/10 pb-4">
              <h2 id={`${g.anchor}-judul`} className="text-lg font-bold text-brand-navy sm:text-xl">
                {g.label}{" "}
                <span className="font-semibold text-muted tabular-nums">({g.total})</span>
              </h2>
              {g.total > g.kartu.length && (
                <Link
                  href={denganQ(g.katalogHref, q)}
                  className="inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-red underline-offset-4 hover:underline"
                >
                  {t.lihatSemua(g.total)} →
                </Link>
              )}
            </div>
            <div className={`mt-6 grid gap-6 ${g.grid}`}>{g.kartu}</div>
          </section>
        ))}

        {berisi.length > 0 && kosong.length > 0 && (
          <p className="text-sm text-muted">
            {t.tanpaHasilDi}: {kosong.map((g) => g.label).join(", ")}.
          </p>
        )}

        {hasil && hasil.total === 0 && (
          <section className="rounded-card bg-white p-8 text-center shadow-soft sm:p-12">
            <h2 className="text-xl font-bold text-brand-navy sm:text-2xl">{t.kosongJudul(q)}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-body sm:text-base">{t.kosongSaran}</p>
          </section>
        )}

        {(!hasil || hasil.total === 0) && (
          <section aria-labelledby="jelajahi-katalog">
            <h2 id="jelajahi-katalog" className="text-lg font-bold text-brand-navy sm:text-xl">
              {t.jelajahi}
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {katalog.map((k) => (
                <li key={k.href}>
                  <Link
                    href={k.href}
                    className="flex min-h-[72px] h-full items-center justify-between gap-3 rounded-card bg-white p-5 text-sm font-bold text-brand-navy shadow-soft transition-shadow hover:shadow-card"
                  >
                    {k.label}
                    <span aria-hidden className="text-brand-red">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <CtaBantuanBanner locale={locale} />
      </div>
    </div>
  );
}

/**
 * Halaman hasil pencarian tidak diindeks: isinya turunan katalog yang sudah
 * punya alamat sendiri, dan tiap kata kunci akan jadi URL tipis yang saling
 * bersaing di hasil pencarian Google.
 */
export function pencarianGuruMetadata(locale: Locale = DEFAULT_LOCALE): Metadata {
  const t = text[locale];
  return {
    title: t.metaJudul,
    description: t.deskripsi,
    robots: { index: false, follow: true },
    alternates: {
      canonical: pojokGuruCariPath(locale),
      languages: { id: pojokGuruCariPath("id"), en: pojokGuruCariPath("en") },
    },
  };
}
