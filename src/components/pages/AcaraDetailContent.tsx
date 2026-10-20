import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAcaraBySlug, mediaURL } from "@/lib/datasitus";
import { DEFAULT_LOCALE, dateLocaleTag, localizedPath, uiText, type Locale } from "@/lib/i18n";
import {
  ZONA,
  akhirHari,
  labelFormat,
  labelKategori,
  warnaBawaan,
  warnaKategori,
} from "@/lib/acara";
import { acaraPath, jadwalAcaraPath } from "@/lib/routes";
import { Breadcrumb } from "@/components/library/Breadcrumb";
import { CtaBantuanBanner } from "@/components/library/CtaBantuanBanner";
import { TombolDaftar } from "@/components/JadwalAcara";

const text = {
  id: { jadwal: "Jadwal Acara", tanggal: "Tanggal", waktu: "Waktu", pelaksanaan: "Pelaksanaan", lokasi: "Lokasi" },
  en: { jadwal: "Events", tanggal: "Date", waktu: "Time", pelaksanaan: "Format", lokasi: "Location" },
} satisfies Record<Locale, Record<string, string>>;

/** Pecah teks deskripsi menjadi paragraf — pemisahnya satu baris kosong. */
function paragraf(isi: string | null | undefined): string[] {
  return (isi ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Halaman detail satu acara — tujuan kartu di "Jadwal Acara" dan "Acara
 * Terdekat". Status Selesai/Akan Datang dihitung saat halaman dirender; rute
 * ini dirender ulang berkala (`revalidate`), jadi paling lama beberapa menit
 * setelah tengah malam WIB statusnya ikut berganti.
 */
export async function AcaraDetailContent({
  slug,
  locale = DEFAULT_LOCALE,
}: {
  slug: string;
  locale?: Locale;
}) {
  const t = text[locale];
  const u = uiText[locale];
  const acara = await getAcaraBySlug(slug, locale);
  if (!acara) notFound();

  const poster = mediaURL(acara.poster);
  const warna = warnaKategori[acara.kategori] ?? warnaBawaan;
  const selesai = akhirHari(acara.tanggal) < Date.now();
  const tanggal = new Intl.DateTimeFormat(dateLocaleTag(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ZONA,
  }).format(new Date(acara.tanggal));
  const tautanDaftar = acara.tautanDaftar?.trim()
    ? localizedPath(acara.tautanDaftar.trim(), locale)
    : undefined;
  const bisaDaftar = Boolean(tautanDaftar) && !selesai;
  const teks = paragraf(acara.deskripsi);

  const rincian: [string, string][] = [
    [t.tanggal, tanggal],
    ...(acara.waktu ? ([[t.waktu, acara.waktu]] as [string, string][]) : []),
    [t.pelaksanaan, labelFormat[locale][acara.format] ?? acara.format],
    ...(acara.lokasi ? ([[t.lokasi, acara.lokasi]] as [string, string][]) : []),
  ];

  return (
    <article>
      <div className="container-page max-w-5xl py-10">
        <Breadcrumb
          locale={locale}
          items={[{ label: t.jadwal, href: jadwalAcaraPath(locale) }, { label: acara.judul }]}
        />

        <div
          className={`mt-8 grid gap-8 lg:gap-12 ${
            poster ? "lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]" : ""
          }`}
        >
          {poster && (
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-card bg-surface shadow-soft lg:mx-0">
              <Image
                src={poster}
                alt={acara.judul}
                fill
                priority
                sizes="(min-width: 1024px) 22rem, 384px"
                className="object-cover"
              />
            </div>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-pill px-3 py-1 text-xs font-semibold ${warna.pil}`}>
                {labelKategori[locale][acara.kategori] ?? acara.kategori}
              </span>
              <span className={`text-xs font-semibold ${selesai ? "text-muted" : "text-brand-red"}`}>
                {selesai ? u.eventDone : u.eventUpcoming}
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-bold leading-tight text-brand-navy [text-wrap:balance] sm:text-3xl">
              {acara.judul}
            </h1>

            <dl className="mt-6 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[auto_minmax(0,1fr)]">
              {rincian.map(([label, nilai]) => (
                <div key={label} className="contents">
                  <dt className="font-semibold text-brand-navy">{label}</dt>
                  <dd className="text-body">{nilai}</dd>
                </div>
              ))}
            </dl>

            {teks.length > 0 && (
              <div className="mt-8 space-y-4 text-sm leading-relaxed text-body sm:text-base">
                {teks.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {bisaDaftar && tautanDaftar && <TombolDaftar href={tautanDaftar} label={u.eventRegister} />}
              <Link
                href={jadwalAcaraPath(locale)}
                className="text-sm font-semibold text-brand-navy hover:text-brand-red"
              >
                {u.eventShowMore}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page max-w-5xl pb-14">
        <CtaBantuanBanner locale={locale} />
      </div>
    </article>
  );
}

export async function acaraMetadata(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Metadata> {
  const acara = await getAcaraBySlug(slug, locale);
  if (!acara) return { title: locale === "en" ? "Events" : "Jadwal Acara" };

  const description = paragraf(acara.deskripsi)[0]?.slice(0, 200);
  const poster = mediaURL(acara.poster);

  return {
    title: acara.judul,
    description,
    alternates: {
      canonical: acaraPath(acara.slug, locale),
      languages: { id: acaraPath(acara.slug), en: acaraPath(acara.slug, "en") },
    },
    openGraph: {
      title: acara.judul,
      description,
      type: "website",
      locale: locale === "en" ? "en_US" : "id_ID",
      images: poster ? [{ url: poster }] : undefined,
    },
  };
}
