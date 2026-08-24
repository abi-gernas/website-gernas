import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAlatPeragaBySlug } from "@/lib/alatPeraga";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { JENJANG_LABELS, MAPEL_LABELS } from "@/lib/library";
import { alatPeragaListPath, alatPeragaPath } from "@/lib/routes";
import { CtaBantuanBanner } from "@/components/library/CtaBantuanBanner";

const text = {
  id: { back: "← Kembali ke Alat Peraga", contents: "Isi Paket" },
  en: { back: "← Back to Teaching Aids", contents: "Package Contents" },
} satisfies Record<Locale, { back: string; contents: string }>;

export async function AlatPeragaDetailContent({
  slug,
  locale = DEFAULT_LOCALE,
}: {
  slug: string;
  locale?: Locale;
}) {
  const t = text[locale];
  const item = await getAlatPeragaBySlug(slug, locale);
  if (!item) notFound();

  const tags = [
    ...item.jenjang.map((j) => JENJANG_LABELS[j] ?? j),
    ...item.mapel.map((m) => MAPEL_LABELS[m] ?? m),
  ];

  return (
    <article>
      <div className="bg-surface">
        <div className="container-page max-w-3xl py-12">
          <Link href={alatPeragaListPath(locale)} className="text-sm font-semibold text-brand-red">
            {t.back}
          </Link>
          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-pill bg-brand-navy/10 px-2.5 py-0.5 text-xs font-semibold text-brand-navy"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="mt-4 text-2xl font-bold leading-tight text-brand-navy sm:text-3xl">
            {item.judul}
          </h1>
          {item.subjudul && <p className="mt-2 text-sm text-muted">{item.subjudul}</p>}
        </div>
      </div>

      {item.cover && (
        <div className="container-page max-w-3xl">
          <div className="relative -mt-2 aspect-[16/9] overflow-hidden rounded-card">
            <Image
              src={item.cover.url}
              alt={item.judul}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      <div className="container-page max-w-3xl space-y-8 py-10">
        {item.deskripsi && <p className="text-sm leading-relaxed text-body sm:text-base">{item.deskripsi}</p>}

        {item.isiPaket.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-brand-navy">{t.contents}</h2>
            <ul className="mt-3 space-y-2 text-sm text-body">
              {item.isiPaket.map((teks, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-semibold text-brand-red">•</span>
                  <span>{teks}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.galeriFoto.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {item.galeriFoto.map((foto, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-card">
                <Image
                  src={foto.url}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="container-page max-w-3xl pb-14">
        <CtaBantuanBanner locale={locale} />
      </div>
    </article>
  );
}

export async function alatPeragaMetadata(slug: string, locale: Locale = DEFAULT_LOCALE): Promise<Metadata> {
  const item = await getAlatPeragaBySlug(slug, locale);
  if (!item) return { title: locale === "en" ? "Teaching Aids" : "Alat Peraga" };

  const description = item.deskripsi ?? item.subjudul ?? undefined;

  return {
    title: item.judul,
    description,
    alternates: {
      canonical: alatPeragaPath(item.slug, locale),
      languages: { id: alatPeragaPath(item.slug), en: alatPeragaPath(item.slug, "en") },
    },
    openGraph: {
      title: item.judul,
      description,
      type: "website",
      locale: locale === "en" ? "en_US" : "id_ID",
      images: item.cover ? [{ url: item.cover.url }] : undefined,
    },
  };
}
